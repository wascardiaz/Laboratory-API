const db = require("../models");
const Person = db.person;

// Create and Save a new Person
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Person
    const person = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save Person in the database
    Person.create(person)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Person."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const documentTypeId = parseInt(req.query.documentTypeId, 10);
    const document = req.query.document;
    const condition = document ? { documentTypeId: documentTypeId ? documentTypeId : null, document: document ? document : null } : null;

    const person = await Person.findAll({
        where: condition,
        include: { all: true, nested: true }
    });
    res.status(200).json(person);
};

// Find a single Person with an id
exports.findOne = async (req, res) => {
    const person = await Person.findByPk(req.params.id,
        {
            include: { all: true, nested: true }
        });

    if (!person)
        return res.status(404).json({ message: 'Persona no encontrada' });

    res.status(200).json(person);
};

// Update a Person by the id in the request
exports.update = async (req, res) => {
    const params = req.body;

    const person = await Person.findByPk(req.params.id);
    if (!person) res.status(404).json({ message: 'Persona no encontrada' });

    // validate (if email was changed)
    if (params.email && person.email !== params.email && await Person.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'El email "' + params.email + '" ya está registrado' });
    }

    params.updated = new Date(Date.now());

    // copy params to person and save
    Object.assign(person, params);
    person.updated = Date.now();
    await person.save();

    res.send({
        message: "La persona se actualizó con éxito."
    });

    /* Person.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "La persona se actualizó con éxito."
          });
        } else {
          res.send({
            message: `Cannot update Person with id=${id}. Maybe Person was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Person with id=" + id
        });
      }); */
};

// Delete a Person with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Person.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Person was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Person with id=${id}. Maybe Person was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Person with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Person.destroy({
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

// find all published Person
exports.findAllActive = (req, res) => {
    Person.findAll({ where: { status: true } })
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