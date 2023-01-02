const db = require("../../models");
const LabMethod = db.lab_method;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabMethod
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabMethod
    const method = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabMethod in the database
    LabMethod.create(method)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabMethod."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const methods = await LabMethod.findAll({ where: condition });
    res.status(200).json(methods);
};

// Find a single LabMethod with an id
exports.findOne = async (req, res) => {
    const labMethod = await LabMethod.findByPk(req.params.id);

    if (!labMethod)
        res.status(404).json({ message: 'Laboratory Method not found' });

    res.status(200).json(labMethod);// basicDetails(labMethod);
};

// Update a LabMethod by the id in the request
exports.update = async (req, res) => {
    const method = await getMethod(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && method.name !== params.name && await LabMethod.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'Methodname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && method.email !== params.email && await LabMethod.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to method and save
    Object.assign(method, params);
    method.updated = Date.now();
    await method.save();

    res.send({
        message: "LabMethod was updated successfully."
    });

    /* LabMethod.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabMethod was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabMethod with id=${id}. Maybe LabMethod was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabMethod with id=" + id
        });
      }); */
};

// Delete a LabMethod with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabMethod.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabMethod was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabMethod with id=${id}. Maybe LabMethod was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabMethod with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabMethod.destroy({
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

async function getMethod(id) {
    // const method = await LabMethod.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const method = await LabMethod.findByPk(id, { include: db.role });
    if (!method) res.status(404).json({ message: 'LabMethod not found' });
    return method;
}

function basicDetails(method) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = method;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabMethod
exports.findAllActive = (req, res) => {
    LabMethod.findAll({ where: { status: true } })
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