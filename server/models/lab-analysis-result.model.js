module.exports = (sequelize, Sequelize) => {
    const attributes = {
        recpId: { type: Sequelize.INTEGER, allowNull: false },
        analyId: { type: Sequelize.INTEGER, allowNull: false },
        vbleId: { type: Sequelize.INTEGER, allowNull: false },
        casoId: { type: Sequelize.INTEGER, allowNull: false },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        result: { type: Sequelize.STRING, allowNull: false },
        validated: { type: Sequelize.BOOLEAN, defaultValue: '0' },
        comment: { type: Sequelize.STRING },
        mtdoId: { type: Sequelize.INTEGER },
        vbleFrom: { type: Sequelize.FLOAT },
        vbleTo: { type: Sequelize.FLOAT },
        vbleMin: { type: Sequelize.FLOAT },
        vbleMax: { type: Sequelize.FLOAT },
        vbleValue: { type: Sequelize.STRING },
        vbleSex: { type: Sequelize.STRING(1) },
        userId: { type: Sequelize.INTEGER, allowNull: false },
        repeated: { type: Sequelize.BOOLEAN, defaultValue: '0' },
        updated: { type: Sequelize.DATE },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' },
    }
    const options = {
        timestamps: false
    }

    const LabAnalysisResult = sequelize.define("lab_analysis_result", attributes, options);

    LabAnalysisResult.removeAttribute('id');

    /* LabAnalysisResult.associate = function (models) {
        LabAnalysisResult.hasOne(models.user, {
            foreignKey: 'lab-unidId', targetKey: 'id'
        });
    }; */

    return LabAnalysisResult;
};