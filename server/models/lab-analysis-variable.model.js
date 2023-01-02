module.exports = (sequelize, Sequelize) => {
    const attributes = {
        secuencia: { type: Sequelize.INTEGER },
        Vble_ID: { type: Sequelize.STRING },
        Anali_Secuencia: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        type: { type: Sequelize.STRING(1) },
        Anali_VNormales: { type: Sequelize.STRING },
        send: { type: Sequelize.BOOLEAN },
        interface: { type: Sequelize.STRING },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const LabAnalysisVariable = sequelize.define("lab_analysis_variable", attributes, options);

    LabAnalysisVariable.associate = function (models) {
        LabAnalysisVariable.belongsTo(models.lab_analysis, {
            foreignKey: 'analyId', targetKey: 'id'
        });

        LabAnalysisVariable.belongsTo(models.lab_analysis_variable_type, {
            foreignKey: 'typeCode', targetKey: 'code'
        });

        LabAnalysisVariable.belongsTo(models.lab_unit, {
            foreignKey: 'unitId', targetKey: 'id'
        });

        LabAnalysisVariable.hasMany(models.lab_analysis_variable_value, {
            foreignKey: 'vbleId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE'
        });
    };

    return LabAnalysisVariable;
};