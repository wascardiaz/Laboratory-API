module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        code: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Country = sequelize.define("city", attributes, options);

    Country.associate = function (models) {
        Country.belongsTo(models.state, {
            foreignKey: 'stateId', targetKey: 'id'
        });
    };

    return Country;
};