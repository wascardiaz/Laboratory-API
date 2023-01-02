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

    const LabSubGroupAnalisis = sequelize.define("lab_analysis_sub_group", attributes, options);

    LabSubGroupAnalisis.associate = function (models) {
        LabSubGroupAnalisis.hasOne(models.lab_analysis, {
            foreignKey: 'analysisSubGroupId', targetKey: 'id'
        });
    };

    return LabSubGroupAnalisis;
};