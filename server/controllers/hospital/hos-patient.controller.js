const db = require("../../models");
const Patient = db.hos_patient;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Create and Save a new Patient
exports.create = async (req, res) => {
    const bodyParams = req.body;
    let person = bodyParams.person;

    // Si la persona existe
    if (person.id > 0) {
        // Actualizamos ambos.
        person = await db.person.findOne({ where: { id: person.id } })
        Object.assign(person, bodyParams.person);
        await person.save().catch(r => { return res.status(400).json({ message: 'Error Actualizando datos personales' }) });
    }
    // De lo contrario creamos la persona y el paciente.
    else {
        person = await db.person.create(bodyParams.person).catch(r => { return res.status(400).json({ message: 'Error Creando datos personales' }) });;
    }

    const patientUser = await verifyAndCreateUser(person, bodyParams);

    // Verificamos a ver si existe el Paciente
    let patient = await db.hos_patient.findOne({ where: { personId: person.id } });
    // Si existe lo actualizamos, si no, lo creamos
    if (patient) {
        Object.assign(patient, bodyParams);
        patient.patientType = patient.patientType ? '1' : '0';
        patient.fallecido = patient.fallecido ? '1' : '0';
        patient.vip = patient.vip ? '1' : '0';
        patient.no_grato = patient.no_grato ? '1' : '0';
        patient.status = patient.status ? '1' : '0';
        patient.updated = new Date(Date.now());
        patient.web_usuario = patientUser.user.username;
        patient.web_clave = patientUser.hash;
        // patient.created = new Date(Date.now());
        // console.log('Actualizando Paciente....', patient.dataValues);
        await patient.save().catch(r => { return res.status(400).json({ message: 'Error Actualizando Paciente' }) });;
        await db.hos_patient_to_ars.destroy({ where: { patientId: patient.id } });
        if (bodyParams.seguros)
            bodyParams.seguros.forEach(async element => {
                element.patientId = patient.id;
                delete element.created;
                await db.hos_patient_to_ars.create(element).catch(r => { return res.status(400).json({ message: 'Error Creando Seguros' }) });
            });
    }
    else {
        delete bodyParams.created;
        bodyParams.personId = person.id;
        bodyParams.patientType = bodyParams.patientType ? '1' : '0';
        bodyParams.fallecido = bodyParams.fallecido ? '1' : '0';
        bodyParams.vip = bodyParams.vip ? '1' : '0';
        bodyParams.no_grato = bodyParams.no_grato ? '1' : '0';
        bodyParams.status = bodyParams.status ? '1' : '0';
        patient = await db.hos_patient.create(bodyParams).catch(e => console.log(e)).catch(r => {
            return res.status(400).json({ message: 'Error Creando Paciente' })
        });

        // await db.patient_seguros.destroy({ where: { patientId: patient.id } });
        if (bodyParams.seguros) {
            bodyParams.seguros.forEach(async element => {
                element.patientId = patient.id;
                delete element.created;
                await db.hos_patient_to_ars.create(element).catch(r => {
                    return res.status(400).json({ message: 'Error Creando Seguros' })
                });;
            });
        }
    }

    return res.status(200).json(patient);

    // Validate request
    // if (!req.body.name) {
    //     res.status(400).send({
    //         message: "Content can not be empty!"
    //     });
    //     return;
    // }

    // Create a Patient
    // const patient = {
    //     id: req.body.id,
    //     username: req.body.username,
    //     email: req.body.email,
    //     role: req.body.role,
    //     userGroup: req.body.userGroup,
    //     securityQuestion: req.body.securityQuestion,
    //     securityAnswer: req.body.securityAnswer,
    //     person: req.body.person,
    //     acceptTerms: req.body.acceptTerms,
    //     verificationToken: req.body.verificationToken,
    //     verified: req.body.verified,
    //     resetToken: req.body.resetToken,
    //     resetTokenExpires: req.body.resetTokenExpires,
    //     image: req.body.image,
    //     passwordReset: req.body.passwordReset,
    //     created: req.body.created,
    //     updated: req.body.updated,
    //     isVerified: req.body.isVerified,
    //     userId: parseInt(req.body.userId, 10),

    //     // password: bcrypt.hashSync(req.body.password, 10),
    //     status: req.body.status ? '1' : '0'
    // };
    // // Save Patient in the database
    // Patient.create(patient).then(data => {
    //     res.send(data);
    // }).catch(err => {
    //     res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while creating the Patient."
    //     });
    // });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const options = req.query;
    var condition = options.search ? {
        [Op.or]: [
            { firstName: { [Op.like]: `%${options.search}%` } },
            { lastName: { [Op.like]: `%${options.search}%` } },
            { document: { [Op.like]: `%${options.search}%` } }
        ],
        // required: true
    } : null;

    let patients = null;

    if (options.size) {
        patients = await Patient.findAndCountAll({
            // where: condition,
            include: [
                {
                    model: db.person, as: 'person',
                    where: condition,
                    include: { all: true, nested: true }
                }
            ],
            order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) * options.size : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Paciente.' })
        });
    }
    else {
        patients = await Patient.findAll({ where: condition, include: [{ model: db.person, as: 'person' }], order: [['id', 'DESC']] }).then(data => {
            return { count: data.lengtg, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Paciente.' })
        });
    }

    res.status(200).json(patients);
};

// Find a single Patient with an id
exports.findOne = async (req, res) => {
    const patient = await Patient.findByPk(req.params.id, { include: [{ model: db.person, as: 'person' }] });

    if (!patient)
        res.status(404).json({ message: 'No se encontro el Paciente' });

    res.status(200).json(patient);
};

exports.findByPersonId = async (req, res) => {
    const personId = req.params.personId;
    const patient = await Patient.findOne({ where: { personId: { [Op.like]: personId } }, include: { model: db.person, as: 'person' } });

    // if (!patient)
    //     res.status(404).json({ message: 'No se encontro el Paciente' });

    res.status(200).json(patient);
}

// Update a Patient by the id in the request
exports.update = async (req, res) => {
    const patient = await Patient.findByPk(req.params.id, { include: { model: db.person, as: 'person' } });

    if (!patient) res.status(404).json({ message: 'No se encontro el Paciente' });

    const params = req.body;

    // copy params to patient and save
    Object.assign(patient, params);
    patient.updated = Date.now();

    const patientUser = await verifyAndCreateUser(patient.person, params);

    patient.web_usuario = patientUser.user.username;
    patient.web_clave = patientUser.hash;

    await patient.save();

    res.send({ message: "El paciente se actualizo con exito." });

    /* Patient.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Patient was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Patient with id=" + id
        });
      }); */
};

// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Patient.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Patient was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Patient with id=${id}. Maybe Patient was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Patient with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Patient.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Properties were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all properties."
            });
        });
};

function randomString() {
    return crypto.randomBytes(6).toString('hex');
}

async function getNewUserName(person) {
    let newUserName = null;
    do {
        newUserName = `${(person.firstName).split(' ')[0].slice(0, 1)}${(person.lastName).split(' ')[0]}${Math.floor(Math.random() * 10)}`;
    } while (await db.user.findOne({ where: { username: newUserName } }));

    return newUserName;
}

async function verifyAndCreateUser(person, params) {
    // Verificamos si la persona no tiene usuario
    const user = await db.user.findOne({ where: { personId: person.id } })

    if (user) return { user, hash: null };

    // Verficamos si el correo electronico no esta registrado
    if (params.person.email && await db.user.findOne({ where: { emailId: params.person.email } })) {
        // throw 'Nombre de usuario "' + params.username + '" ya está elegido';
        delete params.person.email;
    }

    // Colocamos rol de usuario
    const userRole = await db.role.findOne({ where: { name: 'User' } });

    // Establecemos el grupo en pacientes
    const userGroup = await db.user_group.findOne({ where: { name: 'Pacientes' } });

    // bodyParams.web_clave = bcrypt.hashSync(randomString().toLowerCase(), 10);
    const hash = randomString();
    // bodyParams.web_clave = hash(randomString().toLowerCase());
    // console.log('Creando nuevo Paciente....', bodyParams.patient);

    const patientUser = {
        username: await getNewUserName(person),
        emailId: params?.person?.email ? params?.person?.email : null,
        passwordHash: await bcrypt.hash(hash, 10),
        personId: person.id,
        roleId: userRole ? userRole.id : 0,
        userGroupId: userGroup ? userGroup.id : 0,
        // verificationToken: randomTokenString(),
        acceptTerms: '1',
        verified: new Date(Date.now())
    }

    return {
        user: await db.user.create(patientUser).catch(e => {
            throw { message: 'Error Creando el Usuario' };
        }), hash: hash
    }
}

// find all published Patient
exports.findAllActive = (req, res) => {
    Patient.findAll({ where: { status: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving properties."
            });
        });
};