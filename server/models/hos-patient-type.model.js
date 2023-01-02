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

    const HosPatientType = sequelize.define("hos_patient_type", attributes, options);

    HosPatientType.associate = function (models) {
        HosPatientType.hasOne(models.hos_patient, {
            foreignKey: 'patientTypeId', targetKey: 'id'
        });
    };

    return HosPatientType;
};