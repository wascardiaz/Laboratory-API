const db = require("../../models");
const HosPatientType = db.hos_patient_type;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new HosPatientType
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a HosPatientType
    const hosPatientType = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save HosPatientType in the database
    HosPatientType.create(patientType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the HosPatientType."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const patientType = await HosPatientType.findAll({ where: condition });
    res.status(200).json(patientType);
};

// Find a single HosPatientType with an id
exports.findOne = async (req, res) => {
    const patientType = await HosPatientType.findByPk(req.params.id);

    if (!patientType)
        res.status(404).json({ message: 'HosPatientType not found' });

    res.status(200).json(patientType);// basicDetails(patientType);
};

// Update a HosPatientType by the id in the request
exports.update = async (req, res) => {
    const patientType = await getHosPatientType(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && patientType.name !== params.name && await HosPatientType.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'HosPatientTypename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && patientType.email !== params.email && await HosPatientType.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to patientType and save
    Object.assign(patientType, params);
    patientType.updated = Date.now();
    await patientType.save();

    res.send({
        message: "HosPatientType was updated successfully."
    });

    /* HosPatientType.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "HosPatientType was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update HosPatientType with id=${id}. Maybe HosPatientType was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating HosPatientType with id=" + id
        });
      }); */
};

// Delete a HosPatientType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    HosPatientType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "HosPatientType was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete HosPatientType with id=${id}. Maybe HosPatientType was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete HosPatientType with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    HosPatientType.destroy({
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

async function getHosPatientType(id) {
    // const patientType = await HosPatientType.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const patientType = await HosPatientType.findByPk(id, { include: db.role });
    if (!patientType) res.status(404).json({ message: 'HosPatientType not found' });
    return patientType;
}

function basicDetails(patientType) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = patientType;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published HosPatientType
exports.findAllActive = (req, res) => {
    HosPatientType.findAll({ where: { status: true } })
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