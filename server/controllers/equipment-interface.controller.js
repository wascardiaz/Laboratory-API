const db = require("../models");
const EquipmentInterface = db.equipment_interface;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

// Create and Save a new EquipmentInterface
exports.create = (req, res) => {
    // Create a EquipmentInterface
    const equipmentInterface = req.body;
    equipmentInterface.status = equipmentInterface.status ? '1' : '0';
    // Save EquipmentInterface in the database
    EquipmentInterface.create(equipmentInterface).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the EquipmentInterface."
        });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
    const equitmentsInterface = [
      { description: 'Sysmex KX-21', comunication: 1, portCom: 'COM4', baudrate: 9600, byteSize: 8, parity: 'None', dtr: 'S', rts: 'S', stopBits: 1, qrydsr: '', trazarCom: 'S', trazarPort: 'S', handshake: 'None', hostSocket: 0, hostIp: '', hostIpPort: '', inputFolder: '', outputFolder: '', domain: '', username: '', password: '', validation: 'S', userId: 1, status: '1' },
      { description: 'Sysmex XP-300', comunication: 1, portCom: 'COM4', baudrate: 9600, byteSize: 8, parity: 'None', dtr: 'S', rts: 'S', stopBits: 1, qrydsr: '', trazarCom: 'S', trazarPort: 'S', handshake: 'None', hostSocket: 0, hostIp: '190. 0 .10 .101', hostIpPort: '5088', inputFolder: 'F:\Download\LaboratorioDocumentacion\A25\Lab_A25\Export', outputFolder: 'F:\Download\LaboratorioDocumentacion\A25\Lab_A25\Import', domain: '', username: '', password: '', validation: 'S', userId: 1, status: '1' },
      { description: 'Sysmex XN-350', comunication: 2, portCom: '', baudrate: 0, byteSize: 0, parity: ' ', dtr: '', rts: '', stopBits: 0, qrydsr: '', trazarCom: '', trazarPort: '', handshake: 'None', hostSocket: 1, hostIp: '192.168.1.20', hostIpPort: '8080', inputFolder: '', outputFolder: '', domain: '', username: '', password: '', validation: '', userId: 1, status: '1' },
      { description: 'Vidas', comunication: 1, portCom: 'COM4', baudrate: 9600, byteSize: 8, parity: 'None', dtr: '', rts: '', stopBits: 1, qrydsr: '', trazarCom: 'S', trazarPort: 'S', handshake: 'None', hostSocket: 0, hostIp: '', hostIpPort: '', inputFolder: '', outputFolder: '', domain: '', username: '', password: '', validation: 'S', userId: 1, status: '1' },
      { description: 'Mini Vidas', comunication: 1, portCom: 'COM3', baudrate: 9600, byteSize: 8, parity: 'None', dtr: '', rts: '', stopBits: 1, qrydsr: '', trazarCom: 'N', trazarPort: 'S', handshake: 'None', hostSocket: 0, hostIp: '', hostIpPort: '', inputFolder: '', outputFolder: '', domain: '', username: '', password: '', validation: 'S', userId: 1, status: '1' },
      { description: 'Vitros 350', comunication: 1, portCom: 'COM3', baudrate: 9600, byteSize: 8, parity: 'None', dtr: '', rts: '', stopBits: 1, qrydsr: '', trazarCom: 'S', trazarPort: 'S', handshake: 'None', hostSocket: 0, hostIp: '', hostIpPort: '', inputFolder: '', outputFolder: '', domain: '', username: '', password: '', validation: 'S', userId: 1, status: '1' },
      { description: 'Biosystem A15 - A25', comunication: 4, portCom: '', baudrate: 0, byteSize: 0, parity: '0', dtr: '', rts: '', stopBits: 0, qrydsr: '', trazarCom: '', trazarPort: '', handshake: 'None', hostSocket: 0, hostIp: '', hostIpPort: '', inputFolder: 'F:\Download\LaboratorioDocumentacion\A25\Lab_A25\Import', outputFolder: 'F:\Download\LaboratorioDocumentacion\A25\Lab_A25\Import', domain: '', username: '', password: '', validation: '', userId: 1, status: '1' },];
  
    equitmentsInterface.forEach(async element => await db.equipment_interface.bulkCreate(element).then(e => console.log(e)).catch(err => console.log(err)));
  
    const description = req.query.description;
    var condition = description ? { description: { [Op.like]: `%${description}%` } } : null;

    const equipmentInterface = await EquipmentInterface.findAll({ where: condition });
    res.status(200).json(equipmentInterface);
};

// Find a single EquipmentInterface with an id
exports.findOne = async (req, res) => {
    const equipmentInterface = await EquipmentInterface.findByPk(req.params.id);

    if (!equipmentInterface)
        res.status(404).json({ message: 'EquipmentInterface not found' });

    res.status(200).json(equipmentInterface);// basicDetails(equipmentInterface);
};

// Update a EquipmentInterface by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const equipmentInterface = req.body;
    equipmentInterface.updated = new Date(Date.now());

    EquipmentInterface.update(equipmentInterface, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "EquipmentInterface was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update EquipmentInterface with id=${id}. Maybe EquipmentInterface was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Error updating EquipmentInterface with id=" + id
        });
    });
};

// Delete a EquipmentInterface with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    EquipmentInterface.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "EquipmentInterface was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete EquipmentInterface with id=${id}. Maybe EquipmentInterface was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete EquipmentInterface with id=" + id
        });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
    EquipmentInterface.destroy({
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

// find all published EquipmentInterface
exports.findAllActive = (req, res) => {
    EquipmentInterface.findAll({ where: { status: true } })
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