const db = require("../../models");
const LabSampleReceptionDetail = db.lab_sample_reception_details;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabSampleReceptionDetail
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a LabSampleReceptionDetail
    const labSampleReceptionDetail = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save LabSampleReceptionDetail in the database
    LabSampleReceptionDetail.create(labSampleReceptionDetail)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the LabSampleReceptionDetail."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const recpId = req.query.recpId;
    const caseId = req.query.caseId;
    const sampleTypeId = req.query.stId;
    const analysisGroupId = req.query.sgId;
    const groupBy = req.query.groupBy;
    var condition = null;
    if (caseId && recpId && groupBy && groupBy === 'sampleType') {
        condition = { caseId: caseId, recpId: recpId };
        const labSampleReceptionDetails = await LabSampleReceptionDetail.findAll({
            where: condition,
            attributes: ['recpId', 'caseId', 'sampleTypeId'],
            group: ['sampleTypeId', 'recpId', 'caseId']
        }).catch(e => console.log(e));
        return res.status(200).json(labSampleReceptionDetails)
    }
    else if (caseId && recpId && groupBy && groupBy === 'analysisGroup') {
        condition = { caseId: caseId, recpId: recpId };
        const labSampleReceptionDetails = await LabSampleReceptionDetail.findAll({
            where: condition,
            attributes: ['recpId', 'caseId', 'analysisGroupId'],
            group: ['analysisGroupId', 'recpId', 'caseId']
        }).catch(e => console.log(e));
        return res.status(200).json(labSampleReceptionDetails)
    }
    else if (caseId && recpId && sampleTypeId) {
        condition = { caseId: caseId, recpId: recpId, sampleTypeId: sampleTypeId };
        const labSampleReceptionDetails = await LabSampleReceptionDetail.findAll({ where: condition }).catch(e => console.log(e));
        return res.status(200).json(labSampleReceptionDetails)
    }
    else if (caseId && recpId && analysisGroupId) {
        condition = { caseId: caseId, recpId: recpId, analysisGroupId: analysisGroupId };
        const labSampleReceptionDetails = await LabSampleReceptionDetail.findAll({ where: condition }).catch(e => console.log(e));
        return res.status(200).json(labSampleReceptionDetails)
    }
    else {
        const labSampleReceptionDetails = await LabSampleReceptionDetail.findAll({ where: condition }).catch(e => console.log(e));
        res.status(200).json(labSampleReceptionDetails);
    }
};

// Find a single LabSampleReceptionDetail with an id
exports.findOne = async (req, res) => {
    // labSampleReceptionDetails can get their own account and admins can get any account
    if (Number(req.params.id) !== req.labSampleReceptionDetail.id && req.labSampleReceptionDetail.role !== Role.Admin) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    const labSampleReceptionDetail = await getLabSampleReceptionDetail(req.params.id);
    res.status(200).json(labSampleReceptionDetail);// basicDetails(labSampleReceptionDetail);
};

// Update a LabSampleReceptionDetail by the id in the request
exports.update = async (req, res) => {
    const labSampleReceptionDetail = await getLabSampleReceptionDetail(req.params.id);
    const params = req.body;

    // validate (if email was changed)
    if (params.name && labSampleReceptionDetail.name !== params.name && await LabSampleReceptionDetail.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabSampleReceptionDetailname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labSampleReceptionDetail.email !== params.email && await LabSampleReceptionDetail.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labSampleReceptionDetail and save
    Object.assign(labSampleReceptionDetail, params);
    labSampleReceptionDetail.updated = Date.now();
    await labSampleReceptionDetail.save();

    res.send({
        message: "LabSampleReceptionDetail was updated successfully."
    });

    /* LabSampleReceptionDetail.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabSampleReceptionDetail was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabSampleReceptionDetail with id=${id}. Maybe LabSampleReceptionDetail was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabSampleReceptionDetail with id=" + id
        });
      }); */
};

// Delete a LabSampleReceptionDetail with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabSampleReceptionDetail.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabSampleReceptionDetail was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabSampleReceptionDetail with id=${id}. Maybe LabSampleReceptionDetail was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabSampleReceptionDetail with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabSampleReceptionDetail.destroy({
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

async function getLabSampleReceptionDetail(id) {
    // const labSampleReceptionDetail = await LabSampleReceptionDetail.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labSampleReceptionDetail = await LabSampleReceptionDetail.findByPk(id, { include: db.role });
    if (!labSampleReceptionDetail) res.status(404).json({ message: 'LabSampleReceptionDetail not found' });
    return labSampleReceptionDetail;
}

function basicDetails(labSampleReceptionDetail) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labSampleReceptionDetail;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabSampleReceptionDetail
exports.findAllActive = (req, res) => {
    LabSampleReceptionDetail.findAll({ where: { status: true } })
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