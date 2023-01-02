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

    const CicilState = sequelize.define("person_civil_state", attributes, options);

    CicilState.associate = function (models) {
        CicilState.hasMany(models.person, {
            foreignKey: 'civilStateId', targetKey: 'id'
        });
    };

    return CicilState;
};