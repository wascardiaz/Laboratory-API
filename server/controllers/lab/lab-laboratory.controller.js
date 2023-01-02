const db = require("../../models");
const LabLaboratory = db.lab_laboratory;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabLaboratory
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabLaboratory
    const labLaboratory = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabLaboratory in the database
    LabLaboratory.create(labLaboratory)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabLaboratory."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labLaboratorys = await LabLaboratory.findAll({ where: condition });
    res.status(200).json(labLaboratorys);
};

// Find a single LabLaboratory with an id
exports.findOne = async (req, res) => {
    const labLaboratory = await LabLaboratory.findByPk(req.params.id);

    if (!labLaboratory)
        res.status(404).json({ message: 'Laboratory not found' });

    res.status(200).json(labLaboratory);// basicDetails(labLaboratory);
};

// Update a LabLaboratory by the id in the request
exports.update = async (req, res) => {
    const labLaboratory = await getLabLaboratory(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labLaboratory.name !== params.name && await LabLaboratory.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabLaboratoryname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labLaboratory.email !== params.email && await LabLaboratory.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labLaboratory and save
    Object.assign(labLaboratory, params);
    labLaboratory.updated = Date.now();
    await labLaboratory.save();

    res.send({
        message: "LabLaboratory was updated successfully."
    });

    /* LabLaboratory.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabLaboratory was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabLaboratory with id=${id}. Maybe LabLaboratory was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabLaboratory with id=" + id
        });
      }); */
};

// Delete a LabLaboratory with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabLaboratory.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabLaboratory was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabLaboratory with id=${id}. Maybe LabLaboratory was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabLaboratory with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabLaboratory.destroy({
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

async function getLabLaboratory(id) {
    // const labLaboratory = await LabLaboratory.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labLaboratory = await LabLaboratory.findByPk(id, { include: db.role });
    if (!labLaboratory) res.status(404).json({ message: 'LabLaboratory not found' });
    return labLaboratory;
}

function basicDetails(labLaboratory) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labLaboratory;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabLaboratory
exports.findAllActive = (req, res) => {
    LabLaboratory.findAll({ where: { status: true } })
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