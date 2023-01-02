const db = require("../models");
const Test = db.test;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Test
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Test
    const test = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save Test in the database
    Test.create(test)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Test."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const test = await Test.findAll({ where: condition, include: db.test_group });
    res.status(200).json(test);
};

// Find a single Test with an id
exports.findOne = async (req, res) => {
    const test = await Test.findByPk(req.params.id, { include: db.test_group });

    if (!test)
        res.status(404).json({ message: 'Test not found' });

    res.status(200).json(test);// basicDetails(test);
};

// Update a Test by the id in the request
exports.update = async (req, res) => {
    const test = await getTest(req.params.id);
    const params = req.body;

    // validate (if email was changed)
    if (params.name && test.name !== params.name && await Test.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'Testname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && test.email !== params.email && await Test.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to test and save
    Object.assign(test, params);
    test.updated = Date.now();
    await test.save();

    res.send({
        message: "Test was updated successfully."
    });

    /* Test.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Test was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Test with id=${id}. Maybe Test was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Test with id=" + id
        });
      }); */
};

// Delete a Test with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Test.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Test was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Test with id=${id}. Maybe Test was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Test with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Test.destroy({
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

async function getTest(id) {
    // const test = await Test.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const test = await Test.findByPk(id, { include: db.role });
    if (!test) res.status(404).json({ message: 'Test not found' });
    return test;
}

function basicDetails(test) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = test;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Test
exports.findAllActive = (req, res) => {
    Test.findAll({ where: { status: true } })
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