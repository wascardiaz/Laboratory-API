module.exports = (sequelize, Sequelize) => {
    const attributes = {
        seguCode: { type: Sequelize.STRING(32) },
        cupsCode: { type: Sequelize.STRING(32) },
        simonCode: { type: Sequelize.STRING(32) },
        price: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
        userId: { type: Sequelize.INTEGER, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }
    }
    const options = {
        timestamps: false
    }

    const SeguPlan = sequelize.define("ars_coberture", attributes, options);

    SeguPlan.associate = function (models) {
        SeguPlan.belongsTo(models.test, {
            foreignKey: 'testId', targetKey: 'id'
        });
        SeguPlan.belongsTo(models.ars, {
            foreignKey: 'arsId', targetKey: 'id'
        });
        /* SeguPlan.belongsTo(models.hos_patient_seguros, {
            foreignKey: 'seguPlanId', targetKey: 'id'
        }); */
    };

    return SeguPlan;
};