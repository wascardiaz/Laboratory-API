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

    const HosOrigin = sequelize.define("hos_case_origin", attributes, options);

    HosOrigin.associate = function (models) {
        HosOrigin.hasOne(models.hos_case_patient, {
            foreignKey: 'origenId', targetKey: 'id'
        });
    };

    return HosOrigin;
};