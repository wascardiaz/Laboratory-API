const db = require("../models");
const Supplier = db.supplier;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Supplier
exports.create = async (req, res) => {
    // Create a Supplier
    const params = req.body;

    // Validar si el RNC esta registrado
    if (params.rnc && await Supplier.findOne({ where: { rnc: params.rnc } })) {
        return res.status(400).json({ message: 'El RNC "' + params.rnc + '" ya está siendo utilizado' });
    }

    // Validar si la Cedula esta registrado
    if (params.cedula && await Supplier.findOne({ where: { cedula: params.cedula } })) {
        return res.status(400).json({ message: 'La cédula "' + params.cedula + '" ya está siendo utilizada' });
    }

    if (params.created)
        delete params.created;
    params.status = req.body.status ? '1' : '0';

    // Save Supplier in the database
    Supplier.create(params).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Ocurrió algún error al crear el suplidor."
        });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const options = req.query;
    var condition = options.search ? { razon_social: { [Op.like]: `%${options.search}%` } } : null;

    let suppliers = null;

    if (options.size) {
        suppliers = await Supplier.findAndCountAll({
            where: condition,
            order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Clientes.' })
        });
    }
    else {
        suppliers = await Supplier.findAll({ where: condition, order: [['id', 'DESC']] }).then(data => {
            console.log(data)
            return { count: data.lengtg, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Clientes.' })
        });
    }

    res.status(200).json(suppliers);
};

// Find a single Supplier with an id
exports.findOne = async (req, res) => {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier)
        res.status(404).json({ message: 'suplidor no encontrado' });

    res.status(200).json(supplier);// basicDetails(supplier);
};

// Update a Supplier by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier)
        return res.status(404).json({ message: 'Cliente no encontrado' });

    // Validar si el RNC esta registrado
    if (params.rnc && supplier.rnc !== params.rnc && await Supplier.findOne({ where: { rnc: params.rnc } })) {
        return res.status(400).json({ message: 'El RNC "' + params.rnc + '" ya está siendo utilizado' });
    }

    // Validar si la Cedula esta registrado
    if (params.cedula && supplier.cedula !== params.cedula && await Supplier.findOne({ where: { cedula: params.cedula } })) {
        return res.status(400).json({ message: 'La cédula "' + params.cedula + '" ya está siendo utilizada' });
    }

    params.status = req.body.status ? '1' : '0';
    params.updated = new Date(Date.now());

    Object.assign(supplier, params)

    Supplier.update(supplier, {
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

// Delete a Supplier with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Supplier.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "El suplidor fue eliminado con éxito!"
            });
        } else {
            res.send({
                message: `No se pudo eliminar el suplidor con id=${id}. ¡Tal vez no se encontró al suplidor!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error al eliminar el suplidor con id=" + id
        });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Supplier.destroy({
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

// find all published Supplier
exports.findAllActive = (req, res) => {
    Supplier.findAll({ where: { status: true } }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving properties."
        });
    });
};