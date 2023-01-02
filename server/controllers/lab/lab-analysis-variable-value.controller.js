const db = require("../../models");
const LabAnalysisVariableValue = db.lab_analysis_variable_value;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabAnalysisVariableValue
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabAnalysisVariableValue
    const labAnalysisVariableValue = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabAnalysisVariableValue in the database
    LabAnalysisVariableValue.create(labAnalysisVariableValue)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabAnalysisVariableValue."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const vbleId = req.query.vbleId;
    var condition = vbleId ? { vbleId: { [Op.eq]: `${vbleId}` } } : null;

    const labAnalysisVariableValues = await LabAnalysisVariableValue.findAll({ where: condition });
    res.status(200).json(labAnalysisVariableValues);
};

// Find a single LabAnalysisVariableValue with an id
exports.findOne = async (req, res) => {
    // labAnalysisVariableValues can get their own account and admins can get any account
    if (Number(req.params.id) !== req.labAnalysisVariableValue.id && req.labAnalysisVariableValue.role !== Role.Admin) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    const labAnalysisVariableValue = await getLabAnalysisVariableValue(req.params.id);
    res.status(200).json(labAnalysisVariableValue);// basicDetails(labAnalysisVariableValue);
};

// Update a LabAnalysisVariableValue by the id in the request
exports.update = async (req, res) => {
    const labAnalysisVariableValue = await getLabAnalysisVariableValue(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labAnalysisVariableValue.name !== params.name && await LabAnalysisVariableValue.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabAnalysisVariableValuename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labAnalysisVariableValue.email !== params.email && await LabAnalysisVariableValue.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labAnalysisVariableValue and save
    Object.assign(labAnalysisVariableValue, params);
    labAnalysisVariableValue.updated = Date.now();
    await labAnalysisVariableValue.save();

    res.send({
        message: "LabAnalysisVariableValue was updated successfully."
    });

    /* LabAnalysisVariableValue.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabAnalysisVariableValue was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabAnalysisVariableValue with id=${id}. Maybe LabAnalysisVariableValue was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabAnalysisVariableValue with id=" + id
        });
      }); */
};

// Delete a LabAnalysisVariableValue with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabAnalysisVariableValue.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabAnalysisVariableValue was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabAnalysisVariableValue with id=${id}. Maybe LabAnalysisVariableValue was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabAnalysisVariableValue with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabAnalysisVariableValue.destroy({
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

async function getLabAnalysisVariableValue(id) {
    // const labAnalysisVariableValue = await LabAnalysisVariableValue.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labAnalysisVariableValue = await LabAnalysisVariableValue.findByPk(id, { include: db.role });
    if (!labAnalysisVariableValue) res.status(404).json({ message: 'LabAnalysisVariableValue not found' });
    return labAnalysisVariableValue;
}

function basicDetails(labAnalysisVariableValue) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labAnalysisVariableValue;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabAnalysisVariableValue
exports.findAllActive = (req, res) => {
    LabAnalysisVariableValue.findAll({ where: { status: true } })
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