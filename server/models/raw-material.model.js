module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        quantityAvailable: { type: Sequelize.FLOAT },
        quantityUnit: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const RawMaterial = sequelize.define("raw_material", attributes, options);

    RawMaterial.associate = function (models) {
        RawMaterial.belongsTo(models.warehouse, {
            foreignKey: 'warehouseId', targetKey: 'id'
        });
        // RawMaterial.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return RawMaterial;
};