module.exports = (sequelize, Sequelize) => {
    const attributes = {
        description: { type: Sequelize.STRING },
        abbreviation: { type: Sequelize.STRING },
        sex: { type: Sequelize.STRING(1) },
        condition: { type: Sequelize.STRING },
        day: { type: Sequelize.STRING },
        days: { type: Sequelize.STRING },
        webResult: { type: Sequelize.BOOLEAN },
        normalValue: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        status: { type: Sequelize.BOOLEAN },
    }
    const options = {
        freezeTableName: true,
        timestamps: false
    }

    const LabAnalysis = sequelize.define("lab_analysis", attributes, options);

    LabAnalysis.associate = function (models) {
        LabAnalysis.belongsTo(models.test, {
            foreignKey: 'testId', targetKey: 'id', as: 'test'
        });

        LabAnalysis.belongsTo(models.lab_sample_type, {
            foreignKey: 'sampleTypeId', targetKey: 'id', as: 'sampleType'
        });

        LabAnalysis.belongsTo(models.lab_analysis_group, {
            foreignKey: 'analysisGroupId', targetKey: 'id', as: 'group'
        });

        LabAnalysis.belongsTo(models.lab_analysis_sub_group, {
            foreignKey: 'analysisSubGroupId', targetKey: 'id', as: 'subGroup'
        });

        LabAnalysis.belongsTo(models.lab_laboratory, {
            foreignKey: 'labId', targetKey: 'id', as: 'laboratory'
        });

        LabAnalysis.belongsTo(models.lab_method, {
            foreignKey: 'labMethodId', targetKey: 'id', as: 'method'
        });

        LabAnalysis.belongsTo(models.lab_sample_container, {
            foreignKey: 'sampleContainerId', targetKey: 'id', as: 'container'
        });

        LabAnalysis.belongsTo(models.lab_equipment, {
            foreignKey: 'labEquipmentId', targetKey: 'id', as: 'equipmentInterface'
        });

        LabAnalysis.hasMany(models.lab_analysis_variable, {
            foreignKey: 'analyId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'RESTRICT', as: 'variables'
        });
    };

    return LabAnalysis;
};