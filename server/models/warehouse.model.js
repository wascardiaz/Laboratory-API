module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Warehouse = sequelize.define("warehouse", attributes, options);

    Warehouse.associate = function (models) {
        // Warehouse.belongsTo(models.person, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Warehouse.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Warehouse;
};