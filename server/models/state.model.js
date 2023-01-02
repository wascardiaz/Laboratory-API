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

    const Country = sequelize.define("state", attributes, options);

    Country.associate = function (models) {
        // Country.hasOne(models.hos_patient, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        Country.hasMany(models.state, {
            foreignKey: 'stateId', targetKey: 'id'
        });
        Country.belongsTo(models.country, {
            foreignKey: 'countryId', targetKey: 'id'
        });
        // Country.belongsTo(models.civil_state, {
        //     foreignKey: 'civilStateId', targetKey: 'id'
        // });        
        // Country.belongsTo(models.person, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Country.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Country;
};