const db = require("../models");
const CivilState = db.person_civil_state;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new CivilState
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a CivilState
    const civilState = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save CivilState in the database
    CivilState.create(profession)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the CivilState."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const professions = await CivilState.findAll({ where: condition });
    res.status(200).json(professions);
};

// Find a single CivilState with an id
exports.findOne = async (req, res) => {
    const profession = await CivilState.findByPk(req.params.id);

    if (!profession)
        res.status(404).json({ message: 'CivilState not found' });

    res.status(200).json(profession);// basicDetails(profession);
};

// Update a CivilState by the id in the request
exports.update = async (req, res) => {
    const profession = await getCivilState(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && profession.name !== params.name && await CivilState.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'CivilStatename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && profession.email !== params.email && await CivilState.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to profession and save
    Object.assign(profession, params);
    profession.updated = Date.now();
    await profession.save();

    res.send({
        message: "CivilState was updated successfully."
    });

    /* CivilState.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "CivilState was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update CivilState with id=${id}. Maybe CivilState was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating CivilState with id=" + id
        });
      }); */
};

// Delete a CivilState with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    CivilState.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "CivilState was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete CivilState with id=${id}. Maybe CivilState was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete CivilState with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    CivilState.destroy({
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

async function getCivilState(id) {
    // const profession = await CivilState.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const profession = await CivilState.findByPk(id, { include: db.role });
    if (!profession) res.status(404).json({ message: 'CivilState not found' });
    return profession;
}

function basicDetails(profession) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = profession;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published CivilState
exports.findAllActive = (req, res) => {
    CivilState.findAll({ where: { status: true } })
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