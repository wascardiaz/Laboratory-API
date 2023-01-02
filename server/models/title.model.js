module.exports = (sequelize, Sequelize) => {
    const attributes = {
        title: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '0' }
    }
    const options = {
        timestamps: true
    }

    const Title = sequelize.define("title", attributes, options);

    Title.associate = function (models) {
        Title.hasMany(models.person, {
            foreignKey: 'titleId', targetKey: 'id'
        });
    };

    return Title;
};