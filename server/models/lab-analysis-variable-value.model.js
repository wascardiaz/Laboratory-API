module.exports = (sequelize, Sequelize) => {
    const attributes = {
        Vble_Secuencia: { type: Sequelize.INTEGER },
        sex: { type: Sequelize.STRING },
        from: { type: Sequelize.FLOAT },
        to: { type: Sequelize.FLOAT },
        min: { type: Sequelize.FLOAT },
        max: { type: Sequelize.FLOAT },
        value: { type: Sequelize.STRING },
        text: { type: Sequelize.TEXT },
        alarmMin: { type: Sequelize.FLOAT },
        alarmMax: { type: Sequelize.FLOAT },
        default: { type: Sequelize.STRING },
    }
    const options = {
        paranoid: false,
        timestamps: false
    }

    const LabAnalysisVariableValue = sequelize.define("lab_analysis_variable_value", attributes, options);

    LabAnalysisVariableValue.associate = function (models) {
        LabAnalysisVariableValue.belongsTo(models.lab_analysis_variable, {
            foreignKey: 'vbleId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE'
        });
        
        LabAnalysisVariableValue.belongsTo(models.lab_method, {
            foreignKey: 'mtdoId', targetKey: 'id'
        });
    };

    // LabAnalysisVariableValue.removeAttribute('id');

    return LabAnalysisVariableValue;
};