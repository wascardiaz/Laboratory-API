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

    const LabSampleContainer = sequelize.define("lab_sample_container", attributes, options);

    LabSampleContainer.associate = function (models) {
        LabSampleContainer.hasOne(models.lab_analysis, {
            foreignKey: 'sampleContainerId', targetKey: 'id'
        });
    };

    return LabSampleContainer;
};