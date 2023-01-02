const db = require("../../models");
const LabSampleReception = db.lab_sample_reception;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabSampleReception
exports.create = async (req, res) => {
    // Create a LabSampleReception
    const labSampleReception = req.body;
    delete labSampleReception.created;
    delete labSampleReception.status;
    // Save LabSampleReception in the database
    await LabSampleReception.create(labSampleReception).then(data => {
        if (data) {
            labSampleReception.details.forEach(async (sDetail, index) => {
                sDetail.recpId = data.id;
                sDetail.groupId = sDetail.analysisGroupId;
                sDetail.detailId = index + 1;
                await db.lab_sample_reception_details.create(sDetail).then(async () => {
                    const carg = await db.hos_cargos_patient.findOne({ where: { caseId: labSampleReception.caseId, secuencia: sDetail.cargSecuenciaId } });
                    if (carg) {
                        carg.recpId = data.id;
                        await carg.save().catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            });
        }
    })
        .then(data => res.send(data))
        .catch(err => {
            res.status(400).send({
                message:
                    err.message || "Some error occurred while creating the LabSampleReception."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const caseId = req.query.caseId;
    var condition = caseId ? { caseId: caseId } : null;

    const labSampleReceptions = await LabSampleReception.findAll({
        where: condition,
        include: {
            model: db.lab_sample_reception_details,
            include: {
                model: db.lab_analysis,
                include: {
                    model: db.lab_analysis_variable, as:'variables',
                    include: db.lab_analysis_variable_value
                }
            }
        },
        order: [['id', 'DESC']]
    });
    res.status(200).json(labSampleReceptions);
};

// Find a single LabSampleReception with an id
exports.findOne = async (req, res) => {
    const labSampleReception = await LabSampleReception.findByPk(req.params.id, { include: db.lab_sample_reception_details });
    if (!labSampleReception) {
        res.status(400).json({ message: 'No se encontro la muetra.' });
        return;
    }
    return res.status(200).json(labSampleReception);// basicDetails(labSampleReception);
};

// Update a LabSampleReception by the id in the request
exports.update = async (req, res) => {
    const labSampleReception = await getLabSampleReception(req.params.id);
    const params = req.body;

    // validate (if email was changed)
    if (params.name && labSampleReception.name !== params.name && await LabSampleReception.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabSampleReceptionname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labSampleReception.email !== params.email && await LabSampleReception.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labSampleReception and save
    Object.assign(labSampleReception, params);
    labSampleReception.updated = Date.now();
    await labSampleReception.save();

    res.send({
        message: "LabSampleReception was updated successfully."
    });

    /* LabSampleReception.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabSampleReception was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabSampleReception with id=${id}. Maybe LabSampleReception was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabSampleReception with id=" + id
        });
      }); */
};

// Delete a LabSampleReception with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabSampleReception.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabSampleReception was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabSampleReception with id=${id}. Maybe LabSampleReception was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabSampleReception with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabSampleReception.destroy({
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

async function getLabSampleReception(id) {
    // const labSampleReception = await LabSampleReception.scope('withHash').findOne({ where: { name: params.name }, include: Role });


    return labSampleReception;
}

function basicDetails(labSampleReception) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labSampleReception;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabSampleReception
exports.findAllActive = (req, res) => {
    LabSampleReception.findAll({ where: { status: true } })
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