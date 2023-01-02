module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        timestamps: true
    }

    const LabMethod = sequelize.define("lab_method", attributes, options);

    LabMethod.associate = function (models) {
        LabMethod.hasOne(models.lab_analysis, {
            foreignKey: 'labMethodId', targetKey: 'id'
        });
        LabMethod.hasOne(models.lab_analysis_variable_value, {
            foreignKey: 'mtdoId', targetKey: 'id'
        });
    };

    return LabMethod;
};