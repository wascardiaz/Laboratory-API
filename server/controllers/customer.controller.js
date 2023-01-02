const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Create a Customer
    const customer = req.body;
    customer.status = req.body.status ? '1' : '0';

    // Save Customer in the database
    Customer.create(customer).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Ocurrió algún error al crear el Cliente."
        });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const options = req.query;
    var condition = options.search ? { cust_descripcion: { [Op.like]: `%${options.search}%` } } : null;

    let customers = null;

    if (options.size) {
        customers = await Customer.findAndCountAll({
            where: condition,
            order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) * options.size : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Clientes.' })
        });
    }
    else {
        customers = await Customer.findAll({ where: condition, order: [['id', 'DESC']] }).then(data => {
            return { count: data.lengtg, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Clientes.' })
        });
    }

    res.status(200).json(customers);
};

// Find a single Customer with an id
exports.findOne = async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer)
        res.status(404).json({ message: 'Cliente no encontrado' });

    res.status(200).json(customer);// basicDetails(customer);
};

// Update a Customer by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer)
        return res.status(404).json({ message: 'Cliente no encontrado' });

    // Validar si el RNC esta registrado
    if (params.cust_rnc && customer.cust_rnc !== params.cust_rnc && await Customer.findOne({ where: { cust_rnc: params.cust_rnc } })) {
        return res.status(400).json({ message: 'El RNC "' + params.cust_rnc + '" ya está siendo utilizado' });
    }

    // params.status = req.body.status ? '1' : '0';
    params.updated = new Date(Date.now());

    // Object.assign(customer, params)

    Customer.update(params, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "El cliente fue actualizado con éxito."
            });
        } else {
            res.send({
                message: `No se puede actualizar el Cliente con id = ${id}. ¡Tal vez no se encontró al cliente o el cuerpo de solicitud está vacío!`
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Error al actualizar el Cliente con id = " + id
        });
    });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Customer.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "El cliente fue eliminado con éxito!"
            });
        } else {
            res.send({
                message: `No se pudo eliminar el cliente con id=${id}. ¡Tal vez no se encontró al cliente!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error al eliminar el cliente con id=" + id
        });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Customer.destroy({
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

// find all published Customer
exports.findAllActive = (req, res) => {
    Customer.findAll({ where: { status: true } })
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