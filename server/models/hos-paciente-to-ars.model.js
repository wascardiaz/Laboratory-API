module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        poliza: { type: Sequelize.STRING },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }
    }
    const options = {
        timestamps: false
    }

    const HosPatientSeg = sequelize.define("hos_patient_to_ars", attributes, options);

    HosPatientSeg.associate = function (models) {
        HosPatientSeg.belongsTo(models.hos_patient, {
            foreignKey: 'patientId', targetKey: 'id'
        });
        HosPatientSeg.belongsTo(models.ars, {
            foreignKey: 'arsId', targetKey: 'id'
        });
        HosPatientSeg.belongsTo(models.ars_plan, {
            foreignKey: 'arsPlanId', targetKey: 'id'
        });
    };

    return HosPatientSeg;
};