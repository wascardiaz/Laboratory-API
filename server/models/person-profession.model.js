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

    const PersonProfession = sequelize.define("person_profession", attributes, options);

    PersonProfession.associate = function (models) {
        PersonProfession.hasMany(models.person, {
            foreignKey: 'professionId', targetKey: 'id'
        });
    };

    return PersonProfession;
};