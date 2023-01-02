module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' }
    }
    const options = {
        timestamps: true
    }

    const MedicoSpecialty = sequelize.define("medic_specialty", attributes, options);

    MedicoSpecialty.associate = function (models) {
        MedicoSpecialty.hasOne(models.medic, {
            foreignKey: 'specialtyId', targetKey: 'id'
        });
    };

    return MedicoSpecialty;
};