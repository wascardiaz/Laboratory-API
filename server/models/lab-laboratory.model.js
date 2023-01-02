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

    const LabLaboratory = sequelize.define("lab_laboratory", attributes, options);

    LabLaboratory.associate = function (models) {
        LabLaboratory.hasOne(models.lab_analysis, {
            foreignKey: 'labId', targetKey: 'id'
        });
    };

    return LabLaboratory;
};