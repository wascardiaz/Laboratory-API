module.exports = (sequelize, Sequelize) => {
    const attributes = {
        code: { type: Sequelize.STRING(1), allowNull: false, unique: true },
        description: { type: Sequelize.STRING(64), allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        timestamps: true
    }

    const LabAnalyVarType = sequelize.define("lab_analysis_variable_type", attributes, options);

    /* LabAnalyVarType.associate = function (models) {
        LabAnalyVarType.hasOne(models.lab_analysis_variable, {
            foreignKey: { name: 'typeCode', type: Sequelize.UUID }, targetKey: 'code'
        });
    }; */

    return LabAnalyVarType;
};