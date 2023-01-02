module.exports = (sequelize, Sequelize) => {
    const attributes = {
        ncfGroupId: { type: Sequelize.INTEGER },
        groupId: { type: Sequelize.INTEGER },
        level: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING },
        exequatur: { type: Sequelize.STRING },
        ctasNum: { type: Sequelize.STRING },
        ctasRetention: { type: Sequelize.STRING },
        comment: { type: Sequelize.STRING },
        ncfPrefix: { type: Sequelize.STRING },
        rnc: { type: Sequelize.STRING },
        inteCode: { type: Sequelize.STRING },
        pagoCode: { type: Sequelize.STRING },
        prefix: { type: Sequelize.STRING },
        area: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Medico = sequelize.define("medic", attributes, options);

    Medico.associate = function (models) {
        // Medico.hasOne(models.hos_patient, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Medico.hasMany(models.address, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Medico.belongsTo(models.sex, {
        //     foreignKey: 'sexId', targetKey: 'id'
        // });
        // Medico.belongsTo(models.civil_state, {
        //     foreignKey: 'civilStateId', targetKey: 'id'
        // });        
        Medico.belongsTo(models.person, {
            foreignKey: 'personId', targetKey: 'id'
        });
        Medico.belongsTo(models.medic_specialty, {
            foreignKey: 'specialtyId', targetKey: 'id'
        });
    };

    return Medico;
};