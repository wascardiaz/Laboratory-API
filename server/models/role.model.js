module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        name: {
            type: Sequelize.STRING
        },
        permission: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    }, {
        tableName: 'roles'
    });

    Role.associate = function (models) {
        // associations can be defined here
        /* Role.belongsToMany(models.user, {
            through: "user_roles",
            foreignKey: "userId",
            otherKey: "roleId"
        }); */
        Role.hasMany(models.user, {
            foreignKey: 'roleId', targetKey: 'id'
        });
    };

    return Role;
};