const db = require("../models");
const RawMaterial = db.raw_material;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new RawMaterial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a RawMaterial
    const raw_material = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save RawMaterial in the database
    RawMaterial.create(raw_material)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the RawMaterial."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const raw_material = await RawMaterial.findAll({ where: condition });
    res.status(200).json(raw_material);
};

// Find a single RawMaterial with an id
exports.findOne = async (req, res) => {
    const raw_material = await RawMaterial.findByPk(req.params.id);

    if (!raw_material)
        res.status(404).json({ message: 'RawMaterial not found' });

    res.status(200).json(raw_material);// basicDetails(raw_material);
};

// Update a RawMaterial by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const raw_material = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    RawMaterial.update(raw_material, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RawMaterial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update RawMaterial with id=${id}. Maybe RawMaterial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating RawMaterial with id=" + id
            });
        });
};

// Delete a RawMaterial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    RawMaterial.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RawMaterial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete RawMaterial with id=${id}. Maybe RawMaterial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete RawMaterial with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    RawMaterial.destroy({
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

async function getPerson(id) {
    // const raw_material = await RawMaterial.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const raw_material = await RawMaterial.findByPk(id, { include: db.role });
    if (!raw_material) res.status(404).json({ message: 'RawMaterial not found' });
    return raw_material;
}

function basicDetails(raw_material) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = raw_material;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published RawMaterial
exports.findAllActive = (req, res) => {
    RawMaterial.findAll({ where: { status: true } })
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