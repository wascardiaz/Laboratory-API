const db = require("../models");
const Employee = db.employee;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Employee
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Employee
    const employee = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save Employee in the database
    Employee.create(employee)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Employee."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const options = req.query;
    var condition = options.search ? {
        [Op.or]: [
            { firstName: { [Op.like]: `%${options.search}%` } },
            { lastName: { [Op.like]: `%${options.search}%` } },
            { document: { [Op.like]: `%${options.search}%` } }
        ],
        // required: true
    } : null;

    let employies = null;

    if (options.size) {
        employies = await Employee.findAndCountAll({
            // where: condition,
            include: [
                {
                    model: db.person, as: 'person',
                    where: condition,
                    include: { all: true, nested: true }
                }
            ],
            order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Empleados.' })
        });
    }
    else {
        employies = await Employee.findAll({ where: condition, include: [{ model: db.person, as: 'person' }], order: [['id', 'DESC']] }).then(data => {
            return { count: data.lengtg, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Empleados.' })
        });
    }

    res.status(200).json(employies);
};

// Find a single Employee with an id
exports.findOne = async (req, res) => {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee)
        res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(employee);// basicDetails(employee);
};

// Update a Employee by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const employee = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    Employee.update(employee, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Employee with id=" + id
            });
        });
};

// Delete a Employee with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Employee.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Employee with id=${id}. Maybe Employee was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Employee with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Employee.destroy({
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
    // const employee = await Employee.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const employee = await Employee.findByPk(id, { include: db.role });
    if (!employee) res.status(404).json({ message: 'Employee not found' });
    return employee;
}

function basicDetails(employee) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = employee;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Employee
exports.findAllActive = (req, res) => {
    Employee.findAll({ where: { status: true } })
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