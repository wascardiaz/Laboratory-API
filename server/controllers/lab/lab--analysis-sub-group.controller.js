const db = require("../../models");
const LabSubGroupAnalysis = db.lab_analysis_sub_group;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");

// Create and Save a new LabSubGroupAnalysis
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabSubGroupAnalysis
    const labSubGroupAnalysis = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabSubGroupAnalysis in the database
    LabSubGroupAnalysis.create(labSubGroupAnalysis)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabSubGroupAnalysis."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    const labSubGroupAnalysiss = await LabSubGroupAnalysis.findAll({ where: condition });
    res.status(200).json(labSubGroupAnalysiss);
};

// Find a single LabSubGroupAnalysis with an id
exports.findOne = async (req, res) => {    
    const labSubGroupAnalysis = await LabSubGroupAnalysis.findByPk(req.params.id);

    if (!labSubGroupAnalysis)
        res.status(404).json({ message: 'LabSubGroupAnalysis not found' });

    res.status(200).json(labSubGroupAnalysis);// basicDetails(labSubGroupAnalysis);
};

// Update a LabSubGroupAnalysis by the id in the request
exports.update = async (req, res) => {
    const labSubGroupAnalysis = await getLabSubGroupAnalysis(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labSubGroupAnalysis.name !== params.name && await LabSubGroupAnalysis.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabSubGroupAnalysisname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labSubGroupAnalysis.email !== params.email && await LabSubGroupAnalysis.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labSubGroupAnalysis and save
    Object.assign(labSubGroupAnalysis, params);
    labSubGroupAnalysis.updated = Date.now();
    await labSubGroupAnalysis.save();

    res.send({
        message: "LabSubGroupAnalysis was updated successfully."
    });

    /* LabSubGroupAnalysis.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabSubGroupAnalysis was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabSubGroupAnalysis with id=${id}. Maybe LabSubGroupAnalysis was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabSubGroupAnalysis with id=" + id
        });
      }); */
};

// Delete a LabSubGroupAnalysis with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabSubGroupAnalysis.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabSubGroupAnalysis was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabSubGroupAnalysis with id=${id}. Maybe LabSubGroupAnalysis was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabSubGroupAnalysis with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabSubGroupAnalysis.destroy({
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

async function getLabSubGroupAnalysis(id) {
    // const labSubGroupAnalysis = await LabSubGroupAnalysis.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labSubGroupAnalysis = await LabSubGroupAnalysis.findByPk(id, { include: db.role });
    if (!labSubGroupAnalysis) res.status(404).json({ message: 'LabSubGroupAnalysis not found' });
    return labSubGroupAnalysis;
}

function basicDetails(labSubGroupAnalysis) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labSubGroupAnalysis;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabSubGroupAnalysis
exports.findAllActive = (req, res) => {
    LabSubGroupAnalysis.findAll({ where: { status: true } })
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