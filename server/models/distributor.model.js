module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        location: { type: Sequelize.STRING },
        phoneNo: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Supplier = sequelize.define("distributor", attributes, options);

    Supplier.associate = function (models) {        
        // Supplier.belongsTo(models.person, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Supplier.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Supplier;
};