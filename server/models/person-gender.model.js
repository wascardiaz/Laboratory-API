module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' }
    }
    const options = {
        timestamps: true
    }

    const Sex = sequelize.define("person_gender", attributes, options);

    Sex.associate = function (models) {
        Sex.hasMany(models.person, {
            foreignKey: 'genderId', targetKey: 'id'
        });
    };

    return Sex;
};