const db = require("../models");
const SeguroPlan = db.ars_plan;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new SeguroPlan
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a SeguroPlan
    const seguroPlan = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save SeguroPlan in the database
    SeguroPlan.create(seguroPlan)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the SeguroPlan."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const seguId = req.query.seguId;
    var condition = seguId ? { seguId: seguId } : null;

    const seguroPlan = await SeguroPlan.findAll({ where: condition });
    res.status(200).json(seguroPlan);
};

// Find a single SeguroPlan with an id
exports.findOne = async (req, res) => {
    const seguroPlan = await SeguroPlan.findByPk(req.params.id);

    if (!seguroPlan)
        res.status(404).json({ message: 'SeguroPlan not found' });

    res.status(200).json(seguroPlan);// basicDetails(seguroPlan);
};

// Update a SeguroPlan by the id in the request
exports.update = async (req, res) => {
    const seguroPlan = await getSeguroPlan(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && seguroPlan.name !== params.name && await SeguroPlan.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'SeguroPlanname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && seguroPlan.email !== params.email && await SeguroPlan.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to seguroPlan and save
    Object.assign(seguroPlan, params);
    seguroPlan.updated = Date.now();
    await seguroPlan.save();

    res.send({
        message: "SeguroPlan was updated successfully."
    });

    /* SeguroPlan.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "SeguroPlan was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update SeguroPlan with id=${id}. Maybe SeguroPlan was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating SeguroPlan with id=" + id
        });
      }); */
};

// Delete a SeguroPlan with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    SeguroPlan.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "SeguroPlan was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete SeguroPlan with id=${id}. Maybe SeguroPlan was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete SeguroPlan with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    SeguroPlan.destroy({
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

async function getSeguroPlan(id) {
    // const seguroPlan = await SeguroPlan.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const seguroPlan = await SeguroPlan.findByPk(id, { include: db.role });
    if (!seguroPlan) res.status(404).json({ message: 'SeguroPlan not found' });
    return seguroPlan;
}

function basicDetails(seguroPlan) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = seguroPlan;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published SeguroPlan
exports.findAllActive = (req, res) => {
    SeguroPlan.findAll({ where: { status: true } })
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