const db = require("../models");
const Distributor = db.distributor;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Distributor
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Distributor
    const distributor = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0'
    };
    // Save Distributor in the database
    Distributor.create(distributor)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Distributor."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const distributor = await Distributor.findAll({ where: condition });
    res.status(200).json(distributor);
};

// Find a single Distributor with an id
exports.findOne = async (req, res) => {
    const distributor = await Distributor.findByPk(req.params.id);

    if (!distributor)
        res.status(404).json({ message: 'Distributor not found' });

    res.status(200).json(distributor);// basicDetails(distributor);
};

// Update a Distributor by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const distributor = {
        name: req.body.name,
        location: req.body.location,
        phoneNo: req.body.phoneNo,
        userId: req.body.userId,
        status: req.body.status ? '1' : '0',
        updated: new Date(Date.now())
    };

    Distributor.update(distributor, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Distributor was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Distributor with id=${id}. Maybe Distributor was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Distributor with id=" + id
            });
        });
};

// Delete a Distributor with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Distributor.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Distributor was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Distributor with id=${id}. Maybe Distributor was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Distributor with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Distributor.destroy({
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
    // const distributor = await Distributor.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const distributor = await Distributor.findByPk(id, { include: db.role });
    if (!distributor) res.status(404).json({ message: 'Distributor not found' });
    return distributor;
}

function basicDetails(distributor) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = distributor;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Distributor
exports.findAllActive = (req, res) => {
    Distributor.findAll({ where: { status: true } })
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