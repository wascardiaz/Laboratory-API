module.exports = (sequelize, Sequelize) => {
    const attributes = {
        caseId: { type: Sequelize.INTEGER },
        // groupId: { type: Sequelize.INTEGER },
        mdcoId: { type: Sequelize.INTEGER },
        // testId: { type: Sequelize.INTEGER },
        recpDate: { type: Sequelize.DATE },
        recpTime: { type: Sequelize.TIME },
        recpNote: { type: Sequelize.STRING },
        caseCondictions: { type: Sequelize.STRING },
        resuEntrega: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER },
        userIdUpdated: { type: Sequelize.INTEGER },
        userIdValidate: { type: Sequelize.INTEGER },
        userUpdatedDate: { type: Sequelize.DATE },
        userValidateDate: { type: Sequelize.DATE },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        status: { type: Sequelize.BOOLEAN }
    }
    const options = {
        timestamps: false
    }

    const LabSampleReception = sequelize.define("lab_sample_reception", attributes, options);

    LabSampleReception.associate = function (models) {
        LabSampleReception.hasMany(models.lab_sample_reception_details, {
            foreignKey: 'recpId', targetKey: 'id'
        });
    };

    return LabSampleReception;
};