const db = require("../../models");
const HosPatientSeguro = db.hos_patient_seguros;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new HosPatientSeguro
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a HosPatientSeguro
    const hosPatientSeguro = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save HosPatientSeguro in the database
    HosPatientSeguro.create(hosPatientSeguro)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the HosPatientSeguro."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const patientId = req.query.patientId;
    var condition = patientId ? { patientId: { [Op.like]: patientId } } : null;
    let patient = await HosPatientSeguro.findAll({ where: condition });

    if (patient) return res.status(200).json(patient);

    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const hosPatientSeguro = await HosPatientSeguro.findAll({ where: condition });
    res.status(200).json(hosPatientSeguro);
};

// Find a single HosPatientSeguro with an id
exports.findOne = async (req, res) => {
    const hosPatientSeguro = await HosPatientSeguro.findByPk(req.params.id);

    if (!hosPatientSeguro)
        res.status(404).json({ message: 'HosPatientSeguro not found' });

    res.status(200).json(hosPatientSeguro);// basicDetails(hosPatientSeguro);
};

// Update a HosPatientSeguro by the id in the request
exports.update = async (req, res) => {
    const hosPatientSeguro = await getHosPatientSeguro(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && hosPatientSeguro.name !== params.name && await HosPatientSeguro.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'HosPatientSeguroname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && hosPatientSeguro.email !== params.email && await HosPatientSeguro.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to hosPatientSeguro and save
    Object.assign(hosPatientSeguro, params);
    hosPatientSeguro.updated = Date.now();
    await hosPatientSeguro.save();

    res.send({
        message: "HosPatientSeguro was updated successfully."
    });

    /* HosPatientSeguro.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "HosPatientSeguro was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update HosPatientSeguro with id=${id}. Maybe HosPatientSeguro was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating HosPatientSeguro with id=" + id
        });
      }); */
};

// Delete a HosPatientSeguro with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    HosPatientSeguro.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "HosPatientSeguro was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete HosPatientSeguro with id=${id}. Maybe HosPatientSeguro was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete HosPatientSeguro with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    HosPatientSeguro.destroy({
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

async function getHosPatientSeguro(id) {
    // const hosPatientSeguro = await HosPatientSeguro.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const hosPatientSeguro = await HosPatientSeguro.findByPk(id, { include: db.role });
    if (!hosPatientSeguro) res.status(404).json({ message: 'HosPatientSeguro not found' });
    return hosPatientSeguro;
}

function basicDetails(hosPatientSeguro) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = hosPatientSeguro;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published HosPatientSeguro
exports.findAllActive = (req, res) => {
    HosPatientSeguro.findAll({ where: { status: true } })
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