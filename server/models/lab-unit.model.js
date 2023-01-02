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

    const LabUnid = sequelize.define("lab_unit", attributes, options);

    LabUnid.associate = function (models) {
        LabUnid.hasOne(models.lab_analysis_variable, {
            foreignKey: 'unitId', targetKey: 'id'
        });
    };

    return LabUnid;
};