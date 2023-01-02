module.exports = (sequelize, Sequelize) => {
    const attributes = {
        /* company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }, */
        name: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
    const options = {
        timestamps: false
    }

    const Company = sequelize.define("company", attributes, options);
    
    Company.associate = function (models) {    
        /* Company.hasMany(models.setting, {
            foreignKey: 'companyId', targetKey: 'id'
        }); */
    };

    return Company;
};