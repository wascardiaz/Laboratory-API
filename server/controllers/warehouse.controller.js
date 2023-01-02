const db = require("../models");
const Warehouse = db.warehouse;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Warehouse
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Warehouse
    const warehouse = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save Warehouse in the database
    Warehouse.create(warehouse)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Warehouse."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const warehouse = await Warehouse.findAll({ where: condition });
    res.status(200).json(warehouse);
};

// Find a single Warehouse with an id
exports.findOne = async (req, res) => {
    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse)
        res.status(404).json({ message: 'Warehouse not found' });

    res.status(200).json(warehouse);// basicDetails(warehouse);
};

// Update a Warehouse by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const warehouse = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    Warehouse.update(warehouse, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Warehouse was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Warehouse with id=${id}. Maybe Warehouse was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Warehouse with id=" + id
            });
        });
};

// Delete a Warehouse with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Warehouse.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Warehouse was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Warehouse with id=${id}. Maybe Warehouse was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Warehouse with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Warehouse.destroy({
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
    // const warehouse = await Warehouse.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const warehouse = await Warehouse.findByPk(id, { include: db.role });
    if (!warehouse) res.status(404).json({ message: 'Warehouse not found' });
    return warehouse;
}

function basicDetails(warehouse) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = warehouse;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Warehouse
exports.findAllActive = (req, res) => {
    Warehouse.findAll({ where: { status: true } })
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