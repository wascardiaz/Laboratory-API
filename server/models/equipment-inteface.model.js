module.exports = (sequelize, Sequelize) => {
    const attributes = {
        description: { type: Sequelize.STRING },
        comunication: { type: Sequelize.INTEGER },
        portCom: { type: Sequelize.INTEGER },
        baudrate: { type: Sequelize.INTEGER },
        byteSize: { type: Sequelize.INTEGER },
        parity: { type: Sequelize.STRING },
        dtr: { type: Sequelize.STRING },
        rts: { type: Sequelize.STRING },
        stopBits: { type: Sequelize.INTEGER },
        qrydsr: { type: Sequelize.STRING },
        trazarCom: { type: Sequelize.STRING },
        trazarPort: { type: Sequelize.STRING },
        handshake: { type: Sequelize.STRING },
        hostSocket: { type: Sequelize.STRING },
        hostIp: { type: Sequelize.STRING },
        hostIpPort: { type: Sequelize.INTEGER },
        inputFolder: { type: Sequelize.STRING },
        outputFolder: { type: Sequelize.STRING },
        domain: { type: Sequelize.STRING },
        username: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        validation: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const EquipmentInterface = sequelize.define("equipment_interface", attributes, options);

    EquipmentInterface.associate = function (models) {
        // EquipmentInterface.hasMany(models.address, {
        //     foreignKey: 'EquipmentInterfaceId', targetKey: 'id'
        // });
    };

    return EquipmentInterface;
};