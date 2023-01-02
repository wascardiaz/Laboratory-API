const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Product
    const product = {
        name: req.body.name,
        description: req.body.description,
        quantityAvailable: req.body.quantityAvailable,
        quantityUnit: req.body.quantityUnit,
        warehouseId: req.body.warehouse.id,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save Product in the database
    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Product."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const product = await Product.findAll({ where: condition });
    res.status(200).json(product);
};

// Find a single Product with an id
exports.findOne = async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product)
        res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);// basicDetails(product);
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const product = {
        name: req.body.name,
        description: req.body.description,
        quantityAvailable: req.body.quantityAvailable,
        quantityUnit: req.body.quantityUnit,
        warehouseId: req.body.warehouse.id,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    Product.update(product, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Product with id=" + id
            });
        });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Product.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Product with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Product.destroy({
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
    // const product = await Product.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const product = await Product.findByPk(id, { include: db.role });
    if (!product) res.status(404).json({ message: 'Product not found' });
    return product;
}

function basicDetails(product) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = product;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Product
exports.findAllActive = (req, res) => {
    Product.findAll({ where: { status: true } })
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