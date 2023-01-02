const db = require("../models");
const Gender = db.person_gender;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Gender
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Gender
    const gender = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save Gender in the database
    Gender.create(gender)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Gender."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const gender = await Gender.findAll({ where: condition });
    res.status(200).json(gender);
};

// Find a single Gender with an id
exports.findOne = async (req, res) => {
    const gender = await Gender.findByPk(req.params.id);

    if (!gender)
        res.status(404).json({ message: 'Gender not found' });

    res.status(200).json(gender);// basicDetails(gender);
};

// Update a Gender by the id in the request
exports.update = async (req, res) => {
    const gender = await getPersonSex(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && gender.name !== params.name && await Gender.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'PersonSexname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && gender.email !== params.email && await Gender.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to gender and save
    Object.assign(gender, params);
    gender.updated = Date.now();
    await gender.save();

    res.send({
        message: "Gender was updated successfully."
    });

    /* Gender.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Gender was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Gender with id=${id}. Maybe Gender was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Gender with id=" + id
        });
      }); */
};

// Delete a Gender with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Gender.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Gender was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Gender with id=${id}. Maybe Gender was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Gender with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Gender.destroy({
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

async function getPersonSex(id) {
    // const gender = await Gender.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const gender = await Gender.findByPk(id, { include: db.role });
    if (!gender) res.status(404).json({ message: 'Gender not found' });
    return gender;
}

function basicDetails(gender) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = gender;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Gender
exports.findAllActive = (req, res) => {
    Gender.findAll({ where: { status: true } })
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