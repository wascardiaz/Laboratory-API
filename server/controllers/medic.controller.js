const db = require("../models");
const Medico = db.medic;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new Medico
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Medico
    const medico = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save Medico in the database
    Medico.create(medico)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Medico."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const options = req.query;
    var condition = options.search ? {
        [Op.or]: [
            { firstName: { [Op.like]: `%${options.search}%` } },
            { lastName: { [Op.like]: `%${options.search}%` } },
            { document: { [Op.like]: `%${options.search}%` } }
        ],
        // required: true
    } : null;

    let medics = null;

    if (options.size) {
        medics = await Medico.findAndCountAll({
            // where: condition,
            include: [
                {
                    model: db.person, as: 'person',
                    where: condition,
                    include: { all: true, nested: true }
                }
            ],
            order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
            offset: options.page ? parseInt(options.page) : 1,
            limit: options.size ? parseInt(options.size) : 5
        }).then(data => {
            return { count: data.count, records: data.rows }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Médicos.' })
        });
    }
    else {
        medics = await Medico.findAll({ where: condition, include: [{ model: db.person, as: 'person' }], order: [['id', 'DESC']] }).then(data => {
            return { count: data.lengtg, records: data }
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ message: err.message || 'Ocurrió algún error al buscar los Médicos.' })
        });
    }

    res.status(200).json(medics);
};

// Find a single Medico with an id
exports.findOne = async (req, res) => {
    const medico = await Medico.findByPk(req.params.id, { include: db.person });

    if (!medico)
        res.status(404).json({ message: 'Medico not found' });

    res.status(200).json(medico);// basicDetails(medico);
};

// Update a Medico by the id in the request
exports.update = async (req, res) => {
    const medico = await getMedico(req.params.id);
    if (medico && medico.person) {
        const params = req.body;
        const person = medico.person;
        Object.assign(person, params.person);
        await person.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) })
        Object.assign(medico, params);
        medico.updated = Date.now();
        medico.status = medico.status ? '1' : '0';
        await medico.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
        res.status(200).json({ message: 'Médico actualizado satisfactoriamente.' });
    }
    else
        res.status(400).json({ message: 'Error en el servidor.' })
};

// Delete a Medico with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Medico.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Medico was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Medico with id=${id}. Maybe Medico was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Medico with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    Medico.destroy({
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

async function getMedico(id) {
    // const medico = await Medico.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    return await Medico.findByPk(id, { include: db.person })
        .then(m => { return m; })
        .catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
}

function basicDetails(medico) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = medico;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published Medico
exports.findAllActive = (req, res) => {
    Medico.findAll({ where: { status: true } })
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