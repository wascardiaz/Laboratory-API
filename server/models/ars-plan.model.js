module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING(64), allowNull: false },
        percent: { type: Sequelize.FLOAT },
        userId: { type: Sequelize.INTEGER},
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }
    }
    const options = {
        timestamps: false
    }

    const SeguPlan = sequelize.define("ars_plan", attributes, options);

    SeguPlan.associate = function (models) {
        /* SeguPlan.hasMany(models.hos_patient_seguros, {
            foreignKey: 'seguPlanId', targetKey: 'id'
        }); */
        SeguPlan.belongsTo(models.ars, {
            foreignKey: 'arsId', targetKey: 'id'
        });
    };

    return SeguPlan;
};