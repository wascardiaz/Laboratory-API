const db = require("../models");
const RawMaterialOrder = db.raw_material_order;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new RawMaterialOrder
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a RawMaterialOrder
    const raw_material_order = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save RawMaterialOrder in the database
    RawMaterialOrder.create(raw_material_order)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the RawMaterialOrder."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const raw_material_order = await RawMaterialOrder.findAll({ where: condition });
    res.status(200).json(raw_material_order);
};

// Find a single RawMaterialOrder with an id
exports.findOne = async (req, res) => {
    const raw_material_order = await RawMaterialOrder.findByPk(req.params.id);

    if (!raw_material_order)
        res.status(404).json({ message: 'RawMaterialOrder not found' });

    res.status(200).json(raw_material_order);// basicDetails(raw_material_order);
};

// Update a RawMaterialOrder by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const raw_material_order = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    RawMaterialOrder.update(raw_material_order, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RawMaterialOrder was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update RawMaterialOrder with id=${id}. Maybe RawMaterialOrder was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating RawMaterialOrder with id=" + id
            });
        });
};

// Delete a RawMaterialOrder with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    RawMaterialOrder.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "RawMaterialOrder was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete RawMaterialOrder with id=${id}. Maybe RawMaterialOrder was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete RawMaterialOrder with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    RawMaterialOrder.destroy({
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
    // const raw_material_order = await RawMaterialOrder.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const raw_material_order = await RawMaterialOrder.findByPk(id, { include: db.role });
    if (!raw_material_order) res.status(404).json({ message: 'RawMaterialOrder not found' });
    return raw_material_order;
}

function basicDetails(raw_material_order) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = raw_material_order;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published RawMaterialOrder
exports.findAllActive = (req, res) => {
    RawMaterialOrder.findAll({ where: { status: true } })
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