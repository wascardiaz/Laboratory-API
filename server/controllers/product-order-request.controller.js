const db = require("../models");
const ProductOrderRequest = db.product_order_request;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new ProductOrderRequest
exports.create = (req, res) => {
    // Validate request
    if (!req.body.productId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a ProductOrderRequest
    const product_order_request = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        pricePerUnit: req.body.pricePerUnit,
        qualityCheck: req.body.qualityCheck,
        deliveryDate: req.body.deliveryDate,
        expiryDate: req.body.expiryDate,
        manufactureDate: req.body.manufactureDate,
        distributorId: req.body.distributorId,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save ProductOrderRequest in the database
    ProductOrderRequest.create(product_order_request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ProductOrderRequest."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const product_order_request = await ProductOrderRequest.findAll({ where: condition });
    res.status(200).json(product_order_request);
};

// Find a single ProductOrderRequest with an id
exports.findOne = async (req, res) => {
    const product_order_request = await ProductOrderRequest.findByPk(req.params.id);

    if (!product_order_request)
        res.status(404).json({ message: 'ProductOrderRequest not found' });

    res.status(200).json(product_order_request);// basicDetails(product_order_request);
};

// Update a ProductOrderRequest by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const product_order_request = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        pricePerUnit: req.body.pricePerUnit,
        qualityCheck: req.body.qualityCheck,
        deliveryDate: req.body.deliveryDate,
        expiryDate: req.body.expiryDate,
        manufactureDate: req.body.manufactureDate,
        distributorId: req.body.distributorId,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    ProductOrderRequest.update(product_order_request, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductOrderRequest was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ProductOrderRequest with id=${id}. Maybe ProductOrderRequest was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating ProductOrderRequest with id=" + id
            });
        });
};

// Delete a ProductOrderRequest with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    ProductOrderRequest.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductOrderRequest was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete ProductOrderRequest with id=${id}. Maybe ProductOrderRequest was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ProductOrderRequest with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    ProductOrderRequest.destroy({
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
    // const product_order_request = await ProductOrderRequest.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const product_order_request = await ProductOrderRequest.findByPk(id, { include: db.role });
    if (!product_order_request) res.status(404).json({ message: 'ProductOrderRequest not found' });
    return product_order_request;
}

function basicDetails(product_order_request) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = product_order_request;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published ProductOrderRequest
exports.findAllActive = (req, res) => {
    ProductOrderRequest.findAll({ where: { status: true } })
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