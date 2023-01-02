const db = require("../models");
const PersonDocumentType = db.person_document_type;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new PersonDocumentType
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a PersonDocumentType
    const personDocumentType = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save PersonDocumentType in the database
    PersonDocumentType.create(personDocumentType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the PersonDocumentType."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const personDocumentTypes = await PersonDocumentType.findAll({ where: condition });
    res.status(200).json(personDocumentTypes);
};

// Find a single PersonDocumentType with an id
exports.findOne = async (req, res) => {
    const personDocumentType = await PersonDocumentType.findByPk(req.params.id);

    if (!personDocumentType)
        res.status(404).json({ message: 'PersonDocumentType not found' });

    res.status(200).json(personDocumentType);// basicDetails(personDocumentType);
};

// Update a PersonDocumentType by the id in the request
exports.update = async (req, res) => {
    const personDocumentType = await getPersonDocumentType(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && personDocumentType.name !== params.name && await PersonDocumentType.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'PersonDocumentTypename "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && personDocumentType.email !== params.email && await PersonDocumentType.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to personDocumentType and save
    Object.assign(personDocumentType, params);
    personDocumentType.updated = Date.now();
    await personDocumentType.save();

    res.send({
        message: "PersonDocumentType was updated successfully."
    });

    /* PersonDocumentType.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "PersonDocumentType was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update PersonDocumentType with id=${id}. Maybe PersonDocumentType was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating PersonDocumentType with id=" + id
        });
      }); */
};

// Delete a PersonDocumentType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    PersonDocumentType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "PersonDocumentType was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete PersonDocumentType with id=${id}. Maybe PersonDocumentType was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete PersonDocumentType with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    PersonDocumentType.destroy({
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

async function getPersonDocumentType(id) {
    // const personDocumentType = await PersonDocumentType.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const personDocumentType = await PersonDocumentType.findByPk(id, { include: db.role });
    if (!personDocumentType) res.status(404).json({ message: 'PersonDocumentType not found' });
    return personDocumentType;
}

function basicDetails(personDocumentType) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = personDocumentType;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published PersonDocumentType
exports.findAllActive = (req, res) => {
    PersonDocumentType.findAll({ where: { status: true } })
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