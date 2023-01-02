const db = require("../../models");
const LabUnit = db.lab_unit;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabUnit
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabUnit
    const labUnid = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabUnit in the database
    LabUnit.create(labUnid)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabUnit."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labUnit = await LabUnit.findAll({ where: condition });
    res.status(200).json(labUnit);
};

// Find a single LabUnit with an id
exports.findOne = async (req, res) => {
    const labUnid = await LabUnit.findByPk(req.params.id);

    if (!labUnid)
        res.status(404).json({ message: 'LabUnit not found' });

    res.status(200).json(labUnid);// basicDetails(labUnid);
};

// Update a LabUnit by the id in the request
exports.update = async (req, res) => {
    const labUnid = await getLabUnid(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labUnid.name !== params.name && await LabUnit.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabUnidname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labUnid.email !== params.email && await LabUnit.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labUnid and save
    Object.assign(labUnid, params);
    labUnid.updated = Date.now();
    await labUnid.save();

    res.send({
        message: "LabUnit was updated successfully."
    });

    /* LabUnit.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabUnit was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabUnit with id=${id}. Maybe LabUnit was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabUnit with id=" + id
        });
      }); */
};

// Delete a LabUnit with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabUnit.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabUnit was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabUnit with id=${id}. Maybe LabUnit was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabUnit with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabUnit.destroy({
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

// find all published LabUnit
exports.findAllActive = (req, res) => {
    LabUnit.findAll({ where: { status: true } })
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