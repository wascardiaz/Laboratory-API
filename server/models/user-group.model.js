module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        /* permission: {
            type: Sequelize.TEXT,
            allowNull: false
        } */
    }
    const options = {
        timestamps: false
    }

    const UserGroup = sequelize.define("user_group", attributes, options);

    UserGroup.associate = function (models) {    
        UserGroup.hasOne(models.user, {
            foreignKey: 'userGroupId', targetKey: 'id'
        });
    };

    return UserGroup;
};