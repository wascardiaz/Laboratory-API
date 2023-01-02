module.exports = (sequelize, Sequelize) => {
    const attributes = {
        recpId: { type: Sequelize.INTEGER },
        detailId: { type: Sequelize.INTEGER },
        analyId: { type: Sequelize.INTEGER },
        analysisGroupId: { type: Sequelize.INTEGER },
        caseId: { type: Sequelize.INTEGER },
        cargId: { type: Sequelize.INTEGER },
        resuId: { type: Sequelize.INTEGER },
        sampleTypeId: { type: Sequelize.INTEGER },
        //groupId?: {type:Sequelize.STRING},
        //testId?: {type:Sequelize.STRING},
        casoCondiciones: { type: Sequelize.STRING },
        sampleLote: { type: Sequelize.INTEGER },
        sampleCondiciones: { type: Sequelize.STRING },
        sampleTemperatura: { type: Sequelize.STRING },
        samplePrioridad: { type: Sequelize.DATE },
        samplePeriodo: { type: Sequelize.DATE },
        sampleRecord: { type: Sequelize.DATE },
        sampleRecogida: { type: Sequelize.DATE },
        sampleProceso: { type: Sequelize.DATE },
        sampleEnvasada: { type: Sequelize.DATE },
        sampleCaduce: { type: Sequelize.DATE },
        resuEntrega: { type: Sequelize.DATE },
        sampleHora: { type: Sequelize.TIME },
        sampleEstatus: { type: Sequelize.INTEGER },
        sampleDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        sampleUpdated: { type: Sequelize.DATE },
    }
    const options = {
        timestamps: false
    }

    const LabSampleReceptionDetails = sequelize.define("lab_sample_reception_details", attributes, options);

    LabSampleReceptionDetails.associate = function (models) {
        LabSampleReceptionDetails.belongsTo(models.lab_sample_reception, {
            foreignKey: 'recpId', targetKey: 'id'
        });
        LabSampleReceptionDetails.belongsTo(models.lab_analysis, {
            foreignKey: 'analyId', targetKey: 'id'
        });
        // LabSampleReceptionDetails.belongsTo(models.lab_group_analysis, {
        //     foreignKey: 'analysisGroupId', targetKey: 'id'
        // });
    };

    return LabSampleReceptionDetails;
};