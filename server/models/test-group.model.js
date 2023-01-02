module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        timestamps: false
    }

    const TestGroup = sequelize.define("test_group", attributes, options);

    TestGroup.associate = function (models) {
        TestGroup.hasOne(models.test, {
            foreignKey: 'groupId', targetKey: 'id'
        });
    };

    return TestGroup;
};