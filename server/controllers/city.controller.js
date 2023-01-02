const db = require("../models");
const City = db.city;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new City
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a City
    const city = {
        name: req.body.name,
        email: req.body.email,
        user_group_id: parseInt(req.body.userGroupId, 10),
        password: bcrypt.hashSync(req.body.password, 10),
        status: req.body.status ? '1' : '0'
    };
    // Save City in the database
    City.create(city)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the City."
            });
        });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {

    const drs = [
        { personId: 0, specialtyId: 20, exequatur: '519-01' },
        { personId: 0, specialtyId: 12, exequatur: '365-02' },
        { personId: 0, specialtyId: 1, exequatur: '' },
        { personId: 0, specialtyId: 1, exequatur: '' },
        { personId: 0, specialtyId: 1, exequatur: '' },
        { personId: 0, specialtyId: 2, exequatur: '20-89' },
        { personId: 0, specialtyId: 2, exequatur: '' },
        { personId: 0, specialtyId: 2, exequatur: '573-05' },
        { personId: 0, specialtyId: 6, exequatur: '' },
        { personId: 0, specialtyId: 91, exequatur: '291-11' },
        { personId: 0, specialtyId: 91, exequatur: '16514' },
        { personId: 0, specialtyId: 90, exequatur: '185-92' },
        { personId: 0, specialtyId: 6, exequatur: '' },
        { personId: 0, specialtyId: 7, exequatur: '' },
        { personId: 0, specialtyId: 8, exequatur: '248000' },
        { personId: 0, specialtyId: 75, exequatur: '101-02' },
        { personId: 0, specialtyId: 18, exequatur: '' },
        { personId: 0, specialtyId: 18, exequatur: '686-03' },
        { personId: 0, specialtyId: 75, exequatur: '172-01' },
        { personId: 0, specialtyId: 75, exequatur: '2721-85' },
        { personId: 0, specialtyId: 75, exequatur: '101-95' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '3238' },
        { personId: 0, specialtyId: 75, exequatur: '3488' },
        { personId: 0, specialtyId: 75, exequatur: '3624' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '362-00' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 12, exequatur: '' },
        { personId: 0, specialtyId: 14, exequatur: '' },
        { personId: 0, specialtyId: 27, exequatur: '' },
        { personId: 0, specialtyId: 27, exequatur: '' },
        { personId: 0, specialtyId: 13, exequatur: '' },
        { personId: 0, specialtyId: 13, exequatur: '410-02' },
        { personId: 0, specialtyId: 76, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '898-00' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 20, exequatur: '' },
        { personId: 0, specialtyId: 20, exequatur: '345-93' },
        { personId: 0, specialtyId: 78, exequatur: '41002' },
        { personId: 0, specialtyId: 80, exequatur: '' },
        { personId: 0, specialtyId: 24, exequatur: '' },
        { personId: 0, specialtyId: 24, exequatur: '' },
        { personId: 0, specialtyId: 24, exequatur: '' },
        { personId: 0, specialtyId: 24, exequatur: '' },
        { personId: 0, specialtyId: 80, exequatur: '6058' },
        { personId: 0, specialtyId: 80, exequatur: '' },
        { personId: 0, specialtyId: 5, exequatur: '375-04' },
        { personId: 0, specialtyId: 81, exequatur: '435-07' },
        { personId: 0, specialtyId: 23, exequatur: '' },
        { personId: 0, specialtyId: 23, exequatur: '' },
        { personId: 0, specialtyId: 30, exequatur: '' },
        { personId: 0, specialtyId: 24, exequatur: '383-91' },
        { personId: 0, specialtyId: 20, exequatur: '376-96' },
        { personId: 0, specialtyId: 75, exequatur: '573-05' },
        { personId: 0, specialtyId: 88, exequatur: '' },
        { personId: 0, specialtyId: 25, exequatur: '' },
        { personId: 0, specialtyId: 10, exequatur: '' },
        { personId: 0, specialtyId: 72, exequatur: '300-13' },
        { personId: 0, specialtyId: 11, exequatur: '366-16' },
        { personId: 0, specialtyId: 11, exequatur: '' },
        { personId: 0, specialtyId: 11, exequatur: '284333' },
        { personId: 0, specialtyId: 11, exequatur: '300-13' },
        { personId: 0, specialtyId: 11, exequatur: '165-15' },
        { personId: 0, specialtyId: 11, exequatur: '481-14' },
        { personId: 0, specialtyId: 11, exequatur: '7714' },
        { personId: 0, specialtyId: 11, exequatur: '24316' },
        { personId: 0, specialtyId: 11, exequatur: '355-14' },
        { personId: 0, specialtyId: 11, exequatur: '283-18' },
        { personId: 0, specialtyId: 27, exequatur: '366-16' },
        { personId: 0, specialtyId: 11, exequatur: '208-13' },
        { personId: 0, specialtyId: 11, exequatur: '700-20' },
        { personId: 0, specialtyId: 11, exequatur: '207-17' },
        { personId: 0, specialtyId: 20, exequatur: '18-159' },
        { personId: 0, specialtyId: 20, exequatur: '391-16' },
        { personId: 0, specialtyId: 20, exequatur: '' },
        { personId: 0, specialtyId: 11, exequatur: '249-18' },
        { personId: 0, specialtyId: 75, exequatur: '7107' },
        { personId: 0, specialtyId: 11, exequatur: '473-10' },
        { personId: 0, specialtyId: 20, exequatur: '8464' },
        { personId: 0, specialtyId: 25, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 22, exequatur: '234699' },
        { personId: 0, specialtyId: 5, exequatur: '573-05' },
        { personId: 0, specialtyId: 11, exequatur: '694-10' },
        { personId: 0, specialtyId: 25, exequatur: '' },
        { personId: 0, specialtyId: 13, exequatur: '' },
        { personId: 0, specialtyId: 25, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '276' },
        { personId: 0, specialtyId: 3, exequatur: '654-86' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '316-88' },
        { personId: 0, specialtyId: 19, exequatur: '421-11' },
        { personId: 0, specialtyId: 20, exequatur: '1319-17' },
        { personId: 0, specialtyId: 3, exequatur: '421-11' },
        { personId: 0, specialtyId: 1, exequatur: '542-12' },
        { personId: 0, specialtyId: 1, exequatur: '319-17' },
        { personId: 0, specialtyId: 1, exequatur: '35-15' },
        { personId: 0, specialtyId: 1, exequatur: '432-12' },
        { personId: 0, specialtyId: 1, exequatur: '99-20' },
        { personId: 0, specialtyId: 1, exequatur: '208-13' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 13, exequatur: '' },
        { personId: 0, specialtyId: 85, exequatur: '' },
        { personId: 0, specialtyId: 10, exequatur: '602-06' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 13, exequatur: '' },
        { personId: 0, specialtyId: 3, exequatur: '324-05' },
        { personId: 0, specialtyId: 11, exequatur: '15960' },
        { personId: 0, specialtyId: 3, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '23-14' },
        { personId: 0, specialtyId: 75, exequatur: '200-87' },
        { personId: 0, specialtyId: 19, exequatur: '' },
        { personId: 0, specialtyId: 11, exequatur: '283714' },
        { personId: 0, specialtyId: 11, exequatur: '3550' },
        { personId: 0, specialtyId: 11, exequatur: '3696' },
        { personId: 0, specialtyId: 87, exequatur: '248-00' },
        { personId: 0, specialtyId: 89, exequatur: '318-12' },
        { personId: 0, specialtyId: 19, exequatur: '602-06' },
        { personId: 0, specialtyId: 11, exequatur: '2918' },
        { personId: 0, specialtyId: 75, exequatur: '49-10' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '' },
        { personId: 0, specialtyId: 75, exequatur: '327-78' },
        { personId: 0, specialtyId: 5, exequatur: '' },
        { personId: 0, specialtyId: 19, exequatur: '' },
    ];

    /* drs.forEach((element, index) => {
        element.personId = index + 1;
        const md = new City();
        Object.assign(md, element);
        console.log(md.dataValues);
        City.create(element);
    }); */

    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const city = await City.findAll({ where: condition, include: [db.city_specialty, db.person] });
    res.status(200).json(city);
};

// Find a single City with an id
exports.findOne = async (req, res) => {
    const city = await City.findByPk(req.params.id, { include: db.person });

    if (!city)
        res.status(404).json({ message: 'City not found' });

    res.status(200).json(city);// basicDetails(city);
};

// Update a City by the id in the request
exports.update = async (req, res) => {
    const city = await getCity(req.params.id);
    if (city && city.person) {
        const params = req.body;
        const person = city.person;
        Object.assign(person, params.person);
        await person.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) })
        Object.assign(city, params);
        city.updated = Date.now();
        city.status = city.status ? '1' : '0';
        await city.save().catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
        res.status(200).json({ message: 'Médico actualizado satisfactoriamente.' });
    }
    else
        res.status(400).json({ message: 'Error en el servidor.' })
};

// Delete a City with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    City.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "City was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete City with id=${id}. Maybe City was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete City with id=" + id
            });
        });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    City.destroy({
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

async function getCity(id) {
    // const city = await City.scope('withHash').findOne({ where: { name: params.name }, include: Role });

    return await City.findByPk(id, { include: db.person })
        .then(m => { return m; })
        .catch(e => { console.log(e); return res.status(400).json({ message: e.message }) });
}

function basicDetails(city) {
    const { id, firstName, lastName, name, email, role, roleId, created, updated, isVerified } = city;
    return { id, firstName, lastName, name, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
    // return await bcrypt.hashSync(req.body.password, 10);
    return await bcrypt.hash(password, 10);
}

// find all published City
exports.findAllActive = (req, res) => {
    City.findAll({ where: { status: true } })
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