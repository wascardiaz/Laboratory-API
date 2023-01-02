const db = require("../models");
const SeguroCobertura = db.ars_cobertura;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new SeguroCobertura
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a SeguroCobertura
    const seguCobertura = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save SeguroCobertura in the database
    SeguroCobertura.create(seguCobertura)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the SeguroCobertura."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const seguId = req.query.seguId;
    var condition = seguId ? { seguId: { [Op.like]: `%${seguId}%` } } : null;

    const seguCobertura = await SeguroCobertura.findAll({ where: condition, include: { model: db.test, include: db.test_group } });
    res.status(200).json(seguCobertura);
};

// Find a single SeguroCobertura with an id
exports.findOne = async (req, res) => {
    const seguCobertura = await SeguroCobertura.findByPk(req.params.id);

    if (!seguCobertura)
        res.status(404).json({ message: 'SeguroCobertura not found' });

    res.status(200).json(seguCobertura);// basicDetails(seguCobertura);
};

// Update a SeguroCobertura by the id in the request
exports.update = async (req, res) => {
    const seguCobertura = await getSeguroPlan(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && seguCobertura.name !== params.name && await SeguroCobertura.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'SeguroPlanname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && seguCobertura.email !== params.email && await SeguroCobertura.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to seguCobertura and save
    Object.assign(seguCobertura, params);
    seguCobertura.updated = Date.now();
    await seguCobertura.save();

    res.send({
        message: "SeguroCobertura was updated successfully."
    });

    /* SeguroCobertura.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "SeguroCobertura was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update SeguroCobertura with id=${id}. Maybe SeguroCobertura was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating SeguroCobertura with id=" + id
        });
      }); */
};

// Delete a SeguroCobertura with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    SeguroCobertura.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "SeguroCobertura was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete SeguroCobertura with id=${id}. Maybe SeguroCobertura was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete SeguroCobertura with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    SeguroCobertura.destroy({
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

async function getSeguroPlan(id) {
    // const seguCobertura = await SeguroCobertura.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const seguCobertura = await SeguroCobertura.findByPk(id, { include: db.role });
    if (!seguCobertura) res.status(404).json({ message: 'SeguroCobertura not found' });
    return seguCobertura;
}

function basicDetails(seguCobertura) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = seguCobertura;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published SeguroCobertura
exports.findAllActive = (req, res) => {
    SeguroCobertura.findAll({ where: { status: true } })
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