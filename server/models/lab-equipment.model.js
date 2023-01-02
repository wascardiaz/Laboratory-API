module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING(64), allowNull: false },
        comunication: { type: Sequelize.STRING, allowNull: false },
        comPort: { type: Sequelize.INTEGER, allowNull: false },
        baudRate: { type: Sequelize.STRING, allowNull: false },
        byteSize: { type: Sequelize.INTEGER, allowNull: false },
        parity: { type: Sequelize.STRING, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        timestamps: true
    }

    const LabEquipment = sequelize.define("lab_equipment", attributes, options);

    LabEquipment.associate = function (models) {
        LabEquipment.hasOne(models.lab_analysis, {
            foreignKey: 'labEquipmentId', targetKey: 'id'
        });
    };

    return LabEquipment;
};