const db = require("../../models");
const LabAnalysisVariable = db.lab_analysis_variable;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabAnalysisVariable
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabAnalysisVariable
    const labAnalysisVariable = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabAnalysisVariable in the database
    LabAnalysisVariable.create(labAnalysisVariable)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabAnalysisVariable."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const analyId = req.query.analyId;
    var condition = analyId ? { analyId: analyId } : null;

    const labAnalysisVariables = await LabAnalysisVariable.findAll({ where: condition, include:db.lab_analysis_variable_value });
    res.status(200).json(labAnalysisVariables);
};

// Find a single LabAnalysisVariable with an id
exports.findOne = async (req, res) => {
    // labAnalysisVariables can get their own account and admins can get any account
    if (Number(req.params.id) !== req.labAnalysisVariable.id && req.labAnalysisVariable.role !== Role.Admin) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    const labAnalysisVariable = await getLabAnalysisVariable(req.params.id);
    res.status(200).json(labAnalysisVariable);// basicDetails(labAnalysisVariable);
};

// Update a LabAnalysisVariable by the id in the request
exports.update = async (req, res) => {
    const labAnalysisVariable = await getLabAnalysisVariable(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labAnalysisVariable.name !== params.name && await LabAnalysisVariable.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabAnalysisVariablename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labAnalysisVariable.email !== params.email && await LabAnalysisVariable.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labAnalysisVariable and save
    Object.assign(labAnalysisVariable, params);
    labAnalysisVariable.updated = Date.now();
    await labAnalysisVariable.save();

    res.send({
        message: "LabAnalysisVariable was updated successfully."
    });

    /* LabAnalysisVariable.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabAnalysisVariable was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabAnalysisVariable with id=${id}. Maybe LabAnalysisVariable was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabAnalysisVariable with id=" + id
        });
      }); */
};

// Delete a LabAnalysisVariable with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabAnalysisVariable.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabAnalysisVariable was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabAnalysisVariable with id=${id}. Maybe LabAnalysisVariable was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabAnalysisVariable with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabAnalysisVariable.destroy({
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

async function getLabAnalysisVariable(id) {
    // const labAnalysisVariable = await LabAnalysisVariable.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labAnalysisVariable = await LabAnalysisVariable.findByPk(id, { include: db.role });
    if (!labAnalysisVariable) res.status(404).json({ message: 'LabAnalysisVariable not found' });
    return labAnalysisVariable;
}

function basicDetails(labAnalysisVariable) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labAnalysisVariable;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabAnalysisVariable
exports.findAllActive = (req, res) => {
    LabAnalysisVariable.findAll({ where: { status: true } })
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