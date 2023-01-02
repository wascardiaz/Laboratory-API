const db = require("../../models");
const LabAnalysisResult = db.lab_analysis_result;
const Op = db.Sequelize.Op;
const Role = require('../../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new LabAnalysisResult
exports.create = (req, res) => {
    // Create a LabAnalysisResult
    const results = req.body;
    if (!results.analiticsGroups || results.analiticsGroups.length <= 0) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    let savedResults = [];

    results.analiticsGroups.forEach(group => {
        if (group.analiticas && group.analiticas.length > 0) {
            group.analiticas.forEach(analy => {
                if (analy.variables && analy.variables.length > 0) {
                    analy.variables.forEach(async vble => {
                        let vbleDetails = {
                            mtdoId: null,
                            vbleFrom: null,
                            vbleTo: null,
                            vbleMin: null,
                            vbleMax: null,
                            vbleValue: null,
                            vbleSex: null,
                        }
                        if (vble.valores && vble.valores.length > 0) {
                            vble.valores.forEach(valor => {
                                if (vble.typeCode === 'L') {
                                    if (valor.value.toLowerCase() === vble.result.toLowerCase()) {
                                        vbleDetails = {
                                            mtdoId: valor.mtdoId,
                                            vbleFrom: valor.from,
                                            vbleTo: valor.to,
                                            vbleMin: valor.min,
                                            vbleMax: valor.max,
                                            vbleValue: valor.value,
                                            vbleSex: valor.sex
                                        }
                                    }
                                } else if (vble.typeCode === 'N') {
                                    if (parseInt(vble.result, 10) >= valor.min && parseInt(vble.result, 10) <= valor.max) {
                                        vbleDetails = {
                                            mtdoId: valor.mtdoId,
                                            vbleFrom: valor.from,
                                            vbleTo: valor.to,
                                            vbleMin: valor.min,
                                            vbleMax: valor.max,
                                            vbleValue: valor.value,
                                            vbleSex: valor.sex
                                        }
                                    }
                                }
                            });
                        }
                        const labAnalysisResult = {
                            recpId: results.id,
                            analyId: analy.id,
                            vbleId: vble.id,
                            casoId: results.caseId,
                            // created: results.created,
                            result: vble.result,
                            validated: vble.resu_validado ? '1' : '0',
                            comment: vble.resu_comentario,
                            ...vbleDetails,
                            userId: results.userId,
                            status: '1'//results.status ? '1' : '0'
                        };

                        await LabAnalysisResult.destroy({ where: { recpId: results.id, casoId: results.caseId } });

                        // Save LabAnalysisResult in the database
                        await LabAnalysisResult.create(labAnalysisResult).then(async data => {
                            savedResults.push(data) /*  res.send(data); */
                            // const carg = await db.hos_cargos_patient.findOne({ where: { caseId: labSampleReception.caseId, secuencia: sDetail.cargSecuenciaId } });
                            // if (carg) {
                            //     carg.recpId = data.id;
                            //     await carg.save().catch(e => console.log(e));
                            // }
                        }).catch(err => {
                            console.log(err);
                            return res.status(500).json({ message: err.message || "Some error occurred while creating the LabAnalysisResult." });
                        });
                    });
                }
            });
        }
    });

    res.status(200).json(savedResults);
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const qryParams = req.query;

    if (!qryParams || !qryParams.caseId && !qryParams.recpId && !qryParams.analyId)
        return res.status(400).json({ message: 'Parametros requerido.' });

    var condition = qryParams ? { casoId: qryParams.caseId, recpId: qryParams.recpId, analyId: qryParams.analyId } : null;

    const labAnalysisResults = await LabAnalysisResult.findAll({ where: condition});
    res.status(200).json(labAnalysisResults);
};

// Find a single LabAnalysisResult with an id
exports.findOne = async (req, res) => {
    // labAnalysisResults can get their own account and admins can get any account
    if (Number(req.params.id) !== req.labAnalysisResult.id && req.labAnalysisResult.role !== Role.Admin) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    const labAnalysisResult = await getLabAnalysisResult(req.params.id);
    res.status(200).json(labAnalysisResult);// basicDetails(labAnalysisResult);
};

// Update a LabAnalysisResult by the id in the request
exports.update = async (req, res) => {
    const labAnalysisResult = await getLabAnalysisResult(req.params.id);
    const params = req.body;
    console.log(params);

    // validate (if email was changed)
    if (params.name && labAnalysisResult.name !== params.name && await LabAnalysisResult.findOne({ where: { name: params.name } })) {
        res.status(400).json({ message: 'LabAnalysisResultname "' + params.name + '" is already taken' });
    }

    // validate (if email was changed)
    if (params.email && labAnalysisResult.email !== params.email && await LabAnalysisResult.findOne({ where: { email: params.email } })) {
        res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await hash(params.password);
    }

    // copy params to labAnalysisResult and save
    Object.assign(labAnalysisResult, params);
    labAnalysisResult.updated = Date.now();
    await labAnalysisResult.save();

    res.send({
        message: "LabAnalysisResult was updated successfully."
    });

    /* LabAnalysisResult.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "LabAnalysisResult was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update LabAnalysisResult with id=${id}. Maybe LabAnalysisResult was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating LabAnalysisResult with id=" + id
        });
      }); */
};

// Delete a LabAnalysisResult with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    LabAnalysisResult.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "LabAnalysisResult was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete LabAnalysisResult with id=${id}. Maybe LabAnalysisResult was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete LabAnalysisResult with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    LabAnalysisResult.destroy({
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

async function getLabAnalysisResult(id) {
    // const labAnalysisResult = await LabAnalysisResult.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    const labAnalysisResult = await LabAnalysisResult.findByPk(id, { include: db.role });
    if (!labAnalysisResult) res.status(404).json({ message: 'LabAnalysisResult not found' });
    return labAnalysisResult;
}

function basicDetails(labAnalysisResult) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = labAnalysisResult;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published LabAnalysisResult
exports.findAllActive = (req, res) => {
    LabAnalysisResult.findAll({ where: { status: true } })
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