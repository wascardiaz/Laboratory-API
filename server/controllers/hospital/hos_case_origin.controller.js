const db = require("../../models");
const HosCaseOrigin = db.hos_case_origin;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new HosCaseOrigin
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a HosCaseOrigin
    const hosCaseOrigin = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save HosCaseOrigin in the database
    HosCaseOrigin.create(hosCaseOrigin)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the HosCaseOrigin."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const hosCaseOrigins = await HosCaseOrigin.findAll({ where: condition });
    res.status(200).json(hosCaseOrigins);
};

// Find a single HosCaseOrigin with an id
exports.findOne = async (req, res) => {    
    const hosCaseOrigin = await HosCaseOrigin.findByPk(req.params.id);

    if (!hosCaseOrigin)
        res.status(404).json({ message: 'HosCaseOrigin not found' });

    res.status(200).json(hosCaseOrigin);// basicDetails(hosCaseOrigin);
};

// Update a HosCaseOrigin by the id in the request
exports.update = async (req, res) => {
    const hosCaseOrigin = await getHosCaseOrigin(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && hosCaseOrigin.name !== params.name && await HosCaseOrigin.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'HosCaseOriginname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && hosCaseOrigin.email !== params.email && await HosCaseOrigin.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to hosCaseOrigin and save
    Object.assign(hosCaseOrigin, params);
    hosCaseOrigin.updated = Date.now();
    await hosCaseOrigin.save();

    res.send({
        message: "HosCaseOrigin was updated successfully."
    });

    /* HosCaseOrigin.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "HosCaseOrigin was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update HosCaseOrigin with id=${id}. Maybe HosCaseOrigin was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating HosCaseOrigin with id=" + id
        });
      }); */
};

// Delete a HosCaseOrigin with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    HosCaseOrigin.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "HosCaseOrigin was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete HosCaseOrigin with id=${id}. Maybe HosCaseOrigin was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete HosCaseOrigin with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    HosCaseOrigin.destroy({
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

async function getHosCaseOrigin(id) {
    // const hosCaseOrigin = await HosCaseOrigin.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const hosCaseOrigin = await HosCaseOrigin.findByPk(id, { include: db.role });
    if (!hosCaseOrigin) res.status(404).json({ message: 'HosCaseOrigin not found' });
    return hosCaseOrigin;
}

function basicDetails(hosCaseOrigin) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = hosCaseOrigin;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published HosCaseOrigin
exports.findAllActive = (req, res) => {
    HosCaseOrigin.findAll({ where: { status: true } })
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