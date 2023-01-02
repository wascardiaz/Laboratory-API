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

    const LabSampleType = sequelize.define("lab_sample_type", attributes, options);

    LabSampleType.associate = function (models) {
        LabSampleType.hasOne(models.lab_analysis, {
            foreignKey: 'sampleTypeId', targetKey: 'id'
        });
    };

    return LabSampleType;
};