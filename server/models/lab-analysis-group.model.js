module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        freezeTableName: true,
        timestamps: true
    }

    const LabGroupAnalisis = sequelize.define("lab_analysis_group", attributes, options);

    LabGroupAnalisis.associate = function (models) {
        LabGroupAnalisis.hasOne(models.lab_analysis, {
            foreignKey: 'analysisGroupId', targetKey: 'id'
        });
    };

    return LabGroupAnalisis;
};