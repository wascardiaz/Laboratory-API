const db = require("../models");
const Seguro = db.ars;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Seguro
exports.create = (req, res) => {
    // Create a Seguro
    const seguro = {
        name: req.body.name,
        rnc: req.body.rnc,
        telephone: req.body.telephone,
        address: req.body.address,
        fax: req.body.fax,
        phoneAutorization: req.body.phoneAutorization,
        url: req.body.url,
        email: req.body.email,
        abbreviature: req.body.abbreviature,
        ncfTypeId: req.body.ncfTypeId,
        ncLote: req.body.ncLote,
        contact: req.body.contact,
        contractStart: req.body.contractStart,
        contractEnd: req.body.contractEnd,
        cuteDate: req.body.cuteDate,
        margen_medicamento: req.body.margen_medicamento,
        margen_material: req.body.margen_material,
        codigo_prestador: req.body.codigo_prestador,
        cuentaId: req.body.cuentaId,
        invouceNote: req.body.invouceNote,
        comment: req.body.comment,
        cobertura_emergencia: req.body.cobertura_emergencia,
        solicita_info: req.body.solicita_info,
        status: req.body.status ? '1' : '0',
        userId: parseInt(req.body.userId, 10),
        // created: req.body.created,
        // updated: req.body.updated,

    };
    // Save Seguro in the database
    Seguro.create(seguro).then(s => {
        if (params.seguro_plans.length) {
            params.seguro_plans.forEach(async plan => {
                plan.seguId = s.id;
                plan.status = plan.status ? '1' : '0';
                delete plan.created;
                // plan.created = new Date(Date.now());
                plan.updated = new Date(Date.now());
                await db.seguro_plan.create(plan).catch(e => console.log(e))
            });
        }
        if (params.seguro_coberturas.length) {
            params.seguro_coberturas.forEach(async cobertura => {
                cobertura.seguId = s.id;
                cobertura.status = cobertura.status ? '1' : '0';
                delete cobertura.created;
                cobertura.updated = new Date(Date.now());
                await db.seguro_cobertura.create(cobertura).catch(e => console.log(e));
            });
        }
        res.status(200).json(s);
        return;
    }).catch(err => console.log(err));
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const seguro = await Seguro.findAll({ where: condition, include: db.seguro_group });
    res.status(200).json(seguro);
};

// Find a single Seguro with an id
exports.findOne = async (req, res) => {
    const seguro = await Seguro.findByPk(req.params.id, { include: [db.seguro_plan, db.seguro_cobertura] }).catch(e => console.log(e));

    if (!seguro)
        res.status(400).json({ message: 'Seguro no encontrado.' });

    res.status(200).json(seguro);// basicDetails(seguro);
};

// Update a Seguro by the id in the request
exports.update = async (req, res) => {
    const seguro = await Seguro.findByPk(req.params.id);

    if (!seguro) return res.status(400).json({ message: 'Seguro no encontrado.' });

    const params = req.body;

    Object.assign(seguro, params);
    seguro.updated = Date.now();
    await seguro.save().then(s => {
        db.seguro_plan.destroy({ where: { seguId: req.params.id } })
        if (params.seguro_plans.length) {
            params.seguro_plans.forEach(async plan => {
                plan.seguId = s.id;
                plan.status = plan.status ? '1' : '0';
                delete plan.created;
                // plan.created = new Date(Date.now());
                plan.updated = new Date(Date.now());
                await db.seguro_plan.create(plan).catch(e => console.log(e))
            });
        }
        db.seguro_cobertura.destroy({ where: { seguId: req.params.id } })
        if (params.seguro_coberturas.length) {
            params.seguro_coberturas.forEach(async cobertura => {
                cobertura.seguId = s.id;
                cobertura.status = cobertura.status ? '1' : '0';
                delete cobertura.created;
                cobertura.updated = new Date(Date.now());
                await db.seguro_cobertura.create(cobertura).catch(e => console.log(e));
            });
        }
    }).catch(err => console.log(err));

    return res.status(200).json({ message: 'Seguro was updated successfully.' });
};

// Delete a Seguro with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Seguro.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Seguro was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Seguro with id=${id}. Maybe Seguro was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Seguro with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Seguro.destroy({
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

function basicDetails(seguro) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = seguro;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Seguro
exports.findAllActive = (req, res) => {
    Seguro.findAll({ where: { status: true } })
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