const db = require("../../models");
const LabGroupAnalysis = db.lab_analysis_group;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabGroupAnalysis
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabGroupAnalysis
    const labGroupAnalysis = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabGroupAnalysis in the database
    LabGroupAnalysis.create(labGroupAnalysis)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabGroupAnalysis."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labGroupAnalysiss = await LabGroupAnalysis.findAll({ where: condition, order: [['name', 'asc']] });
    res.status(200).json(labGroupAnalysiss);
};

// Find a single LabGroupAnalysis with an id
exports.findOne = async (req, res) => {
    const labGroupAnalysis = await LabGroupAnalysis.findByPk(req.params.id);

    if (!labGroupAnalysis)
        res.status(404).json({ message: 'LabGroupAnalysis not found' });

    res.status(200).json(labGroupAnalysis);// basicDetails(labGroupAnalysis);
};

// Update a LabGroupAnalysis by the id in the request
exports.update = async (req, res) => {
    const labGroupAnalysis = await getLabGroupAnalysis(req.params.id);
    const params = req.body;

    // validate (if email was changed)
    if (params.name && labGroupAnalysis.name !== params.name && await LabGroupAnalysis.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabGroupAnalysisname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labGroupAnalysis.email !== params.email && await LabGroupAnalysis.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labGroupAnalysis and save
    Object.assign(labGroupAnalysis, params);
    labGroupAnalysis.updated = Date.now();
    await labGroupAnalysis.save();

    res.send({
        message: "LabGroupAnalysis was updated successfully."
    });

    /* LabGroupAnalysis.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabGroupAnalysis was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabGroupAnalysis with id=${id}. Maybe LabGroupAnalysis was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabGroupAnalysis with id=" + id
        });
      }); */
};

// Delete a LabGroupAnalysis with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabGroupAnalysis.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabGroupAnalysis was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabGroupAnalysis with id=${id}. Maybe LabGroupAnalysis was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabGroupAnalysis with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabGroupAnalysis.destroy({
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

async function getLabGroupAnalysis(id) {
    // const labGroupAnalysis = await LabGroupAnalysis.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labGroupAnalysis = await LabGroupAnalysis.findByPk(id, { include: db.role });
    if (!labGroupAnalysis) res.status(404).json({ message: 'LabGroupAnalysis not found' });
    return labGroupAnalysis;
}

function basicDetails(labGroupAnalysis) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labGroupAnalysis;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabGroupAnalysis
exports.findAllActive = (req, res) => {
    LabGroupAnalysis.findAll({ where: { status: true } })
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