const db = require("../../models");
const LabAnalyVarType = db.lab_analysis_variable_type;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabAnalyVarType
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabAnalyVarType
    const labAnalyVarType = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabAnalyVarType in the database
    LabAnalyVarType.create(labAnalyVarType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabAnalyVarType."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labAnalyVarTypes = await LabAnalyVarType.findAll({ where: condition });
    res.status(200).json(labAnalyVarTypes);
};

// Find a single LabAnalyVarType with an id
exports.findOne = async (req, res) => {
    const labAnalyVarType = await LabAnalyVarType.findByPk(req.params.id);

    if (!labAnalyVarType)
        res.status(404).json({ message: 'LabAnalyVarType not found' });

    res.status(200).json(labAnalyVarType);// basicDetails(labAnalyVarType);
};

// Update a LabAnalyVarType by the id in the request
exports.update = async (req, res) => {
    const labAnalyVarType = await getLabAnalyVarType(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labAnalyVarType.name !== params.name && await LabAnalyVarType.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabAnalyVarTypename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labAnalyVarType.email !== params.email && await LabAnalyVarType.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labAnalyVarType and save
    Object.assign(labAnalyVarType, params);
    labAnalyVarType.updated = Date.now();
    await labAnalyVarType.save();

    res.send({
        message: "LabAnalyVarType was updated successfully."
    });

    /* LabAnalyVarType.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabAnalyVarType was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabAnalyVarType with id=${id}. Maybe LabAnalyVarType was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabAnalyVarType with id=" + id
        });
      }); */
};

// Delete a LabAnalyVarType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabAnalyVarType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabAnalyVarType was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabAnalyVarType with id=${id}. Maybe LabAnalyVarType was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabAnalyVarType with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabAnalyVarType.destroy({
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

// find all published LabAnalyVarType
exports.findAllActive = (req, res) => {
    LabAnalyVarType.findAll({ where: { status: true } })
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