const db = require("../models");
const TestGroup = db.test_group;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new TestGroup
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a TestGroup
    const testGroup = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save TestGroup in the database
    TestGroup.create(testGroup)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the TestGroup."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const testGroups = await TestGroup.findAll({ where: condition });
    res.status(200).json(testGroups);
};

// Find a single TestGroup with an id
exports.findOne = async (req, res) => {
    const testGroup = await TestGroup.findByPk(req.params.id);

    if (!testGroup)
        res.status(404).json({ message: 'Grupo o Servicio no encontrado.' });

    res.status(200).json(testGroup);// basicDetails(testGroup);
};

// Update a TestGroup by the id in the request
exports.update = async (req, res) => {
    const testGroup = await getTestGroup(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && testGroup.name !== params.name && await TestGroup.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'TestGroupname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && testGroup.email !== params.email && await TestGroup.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to testGroup and save
    Object.assign(testGroup, params);
    testGroup.updated = Date.now();
    await testGroup.save();

    res.send({
        message: "TestGroup was updated successfully."
    });

    /* TestGroup.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "TestGroup was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update TestGroup with id=${id}. Maybe TestGroup was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating TestGroup with id=" + id
        });
      }); */
};

// Delete a TestGroup with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    TestGroup.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "TestGroup was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete TestGroup with id=${id}. Maybe TestGroup was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete TestGroup with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    TestGroup.destroy({
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

async function getTestGroup(id) {
    // const testGroup = await TestGroup.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const testGroup = await TestGroup.findByPk(id, { include: db.role });
    if (!testGroup) res.status(404).json({ message: 'TestGroup not found' });
    return testGroup;
}

function basicDetails(testGroup) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = testGroup;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published TestGroup
exports.findAllActive = (req, res) => {
    TestGroup.findAll({ where: { status: true } })
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