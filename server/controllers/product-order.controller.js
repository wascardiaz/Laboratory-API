const db = require("../models");
const ProductOrder = db.product_order;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new ProductOrder
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a ProductOrder
    const product_order = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save ProductOrder in the database
    ProductOrder.create(product_order)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ProductOrder."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const product_order = await ProductOrder.findAll({ where: condition });
    res.status(200).json(product_order);
};

// Find a single ProductOrder with an id
exports.findOne = async (req, res) => {
    const product_order = await ProductOrder.findByPk(req.params.id);

    if (!product_order)
        res.status(404).json({ message: 'ProductOrder not found' });

    res.status(200).json(product_order);// basicDetails(product_order);
};

// Update a ProductOrder by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const product_order = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    ProductOrder.update(product_order, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductOrder was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ProductOrder with id=${id}. Maybe ProductOrder was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating ProductOrder with id=" + id
            });
        });
};

// Delete a ProductOrder with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    ProductOrder.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductOrder was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete ProductOrder with id=${id}. Maybe ProductOrder was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ProductOrder with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    ProductOrder.destroy({
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
    // const product_order = await ProductOrder.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const product_order = await ProductOrder.findByPk(id, { include: db.role });
    if (!product_order) res.status(404).json({ message: 'ProductOrder not found' });
    return product_order;
}

function basicDetails(product_order) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = product_order;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published ProductOrder
exports.findAllActive = (req, res) => {
    ProductOrder.findAll({ where: { status: true } })
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