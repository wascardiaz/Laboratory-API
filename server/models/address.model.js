module.exports = (sequelize, Sequelize) => {
    const attributes = {
        city: { type: Sequelize.STRING },
        state: { type: Sequelize.STRING },
        area: { type: Sequelize.STRING },
        pincode: { type: Sequelize.STRING },
        // status: { type: Sequelize.BOOLEAN, defaultValue: '1' }
    }
    const options = {
        timestamps: false
    }

    const Address = sequelize.define("address", attributes, options);

    Address.associate = function (models) {
        Address.belongsTo(models.person, {
            foreignKey: 'personId', targetKey: 'id'
        });
    };

    return Address;
};