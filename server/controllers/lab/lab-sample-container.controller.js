const db = require("../../models");
const LabSampleContainer = db.lab_sample_container;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabSampleContainer
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabSampleContainer
    const labSampleContainer = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabSampleContainer in the database
    LabSampleContainer.create(labSampleContainer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabSampleContainer."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labSampleContainers = await LabSampleContainer.findAll({ where: condition });
    res.status(200).json(labSampleContainers);
};

// Find a single LabSampleContainer with an id
exports.findOne = async (req, res) => {
    // labSampleContainers can get their own account and admins can get any account
    if (Number(req.params.id) !== req.labSampleContainer.id && req.labSampleContainer.role !== Role.Admin) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    const labSampleContainer = await getLabSampleContainer(req.params.id);
    res.status(200).json(labSampleContainer);// basicDetails(labSampleContainer);
};

// Update a LabSampleContainer by the id in the request
exports.update = async (req, res) => {
    const labSampleContainer = await getLabSampleContainer(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labSampleContainer.name !== params.name && await LabSampleContainer.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabSampleContainername "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labSampleContainer.email !== params.email && await LabSampleContainer.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labSampleContainer and save
    Object.assign(labSampleContainer, params);
    labSampleContainer.updated = Date.now();
    await labSampleContainer.save();

    res.send({
        message: "LabSampleContainer was updated successfully."
    });

    /* LabSampleContainer.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabSampleContainer was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabSampleContainer with id=${id}. Maybe LabSampleContainer was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabSampleContainer with id=" + id
        });
      }); */
};

// Delete a LabSampleContainer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabSampleContainer.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabSampleContainer was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabSampleContainer with id=${id}. Maybe LabSampleContainer was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabSampleContainer with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabSampleContainer.destroy({
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

async function getLabSampleContainer(id) {
    // const labSampleContainer = await LabSampleContainer.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labSampleContainer = await LabSampleContainer.findByPk(id, { include: db.role });
    if (!labSampleContainer) res.status(404).json({ message: 'LabSampleContainer not found' });
    return labSampleContainer;
}

function basicDetails(labSampleContainer) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labSampleContainer;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabSampleContainer
exports.findAllActive = (req, res) => {
    LabSampleContainer.findAll({ where: { status: true } })
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