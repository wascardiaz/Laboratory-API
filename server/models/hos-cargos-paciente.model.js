module.exports = (sequelize, Sequelize) => {
    const attributes = {
        secuencia: { type: Sequelize.INTEGER },
        groupId: { type: Sequelize.INTEGER },
        testId: { type: Sequelize.INTEGER },
        description: { type: Sequelize.STRING },
        qty: { type: Sequelize.INTEGER },
        cost: { type: Sequelize.DECIMAL(15, 2) },
        percent: { type: Sequelize.FLOAT },
        acuerdo: { type: Sequelize.DECIMAL(15, 2) },
        descto: { type: Sequelize.DECIMAL(15, 2) },
        coberture: { type: Sequelize.DECIMAL(15, 2) },
        diference: { type: Sequelize.DECIMAL(15, 2) },
        ajuste: { type: Sequelize.DECIMAL(15, 2) },
        total: { type: Sequelize.DECIMAL(15, 2) },
        reqId: { type: Sequelize.INTEGER },
        referencia: { type: Sequelize.INTEGER },
        mdcoId: { type: Sequelize.INTEGER },
        mdcoValue: { type: Sequelize.STRING },
        recpId: { type: Sequelize.INTEGER },
        resuId: { type: Sequelize.INTEGER },
        diagId: { type: Sequelize.INTEGER },
        userId: { type: Sequelize.INTEGER, allowNull: false },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }        
    }
    const options = {
        timestamps: false
    }

    const HosCargosPaciente = sequelize.define("hos_cargos_patient", attributes, options);

    HosCargosPaciente.associate = function (models) {
        HosCargosPaciente.belongsTo(models.hos_case_patient, {
            foreignKey: 'caseId', targetKey: 'id'
        });
    };

    return HosCargosPaciente;
};