const db = require("../../models");
const LabSampleType = db.lab_sample_type;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabSampleType
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabSampleType
    const labSampleType = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabSampleType in the database
    LabSampleType.create(labSampleType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabSampleType."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labUnids = await LabSampleType.findAll({ where: condition });
    res.status(200).json(labUnids);
};

// Find a single LabSampleType with an id
exports.findOne = async (req, res) => {
    const id = req.params.id? req.params.id : null;
    if(!id) return res.status(400).json({message: 'No se ha especificado un ID para el tipo de muestra.'})
    const labSampleType = await LabSampleType.findByPk(req.params.id);
    if (!labSampleType) {
        res.status(400).json({ message: 'No se encontro el tipo de muestra.' });
        return;
    }
    res.status(200).json(labSampleType);// basicDetails(labSampleType);
};

// Update a LabSampleType by the id in the request
exports.update = async (req, res) => {
    const labSampleType = await LabSampleType.findByPk(req.params.id);
    if (!labSampleType) {
        res.status(404).json({ message: 'No se encontro el tipo de muestra.' });
        return;
    }
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labSampleType.name !== params.name && await LabSampleType.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabSampleTypename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labSampleType.email !== params.email && await LabSampleType.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labSampleType and save
    Object.assign(labSampleType, params);
    labSampleType.updated = Date.now();
    await labSampleType.save();

    res.send({
        message: "LabSampleType was updated successfully."
    });

    /* LabSampleType.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabSampleType was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabSampleType with id=${id}. Maybe LabSampleType was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabSampleType with id=" + id
        });
      }); */
};

// Delete a LabSampleType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabSampleType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabSampleType was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabSampleType with id=${id}. Maybe LabSampleType was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabSampleType with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabSampleType.destroy({
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

function basicDetails(labSampleType) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labSampleType;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabSampleType
exports.findAllActive = (req, res) => {
    LabSampleType.findAll({ where: { status: true } })
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