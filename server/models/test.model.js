module.exports = (sequelize, Sequelize) => {
    const attributes = {
        description: { type: Sequelize.STRING },
        level: { type: Sequelize.STRING },
        modifier: { type: Sequelize.BOOLEAN },
        price: { type: Sequelize.DECIMAL(11,2) },
        discont: { type: Sequelize.DECIMAL(11,2) },
        status: { type: Sequelize.BOOLEAN },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        cupsCode: { type: Sequelize.STRING },
        Cie9_Code: { type: Sequelize.STRING },
        Cie10_Code: { type: Sequelize.STRING },
    }
    const options = {
        timestamps: false
    }

    const Test = sequelize.define("test", attributes, options);

    Test.associate = function (models) {        
        Test.belongsTo(models.test_group, {
            foreignKey: 'groupId', targetKey: 'id'
        });
        Test.belongsTo(models.user, {
            foreignKey: 'userId', targetKey: 'id'
        });

        Test.hasOne(models.lab_analysis, {
            foreignKey: 'testId', targetKey: 'id'
        });
    };

    return Test;
};