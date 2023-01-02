module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        quantityAvailable: { type: Sequelize.FLOAT },
        quantityUnit: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Product = sequelize.define("product", attributes, options);

    Product.associate = function (models) {
        Product.belongsTo(models.warehouse, {
            foreignKey: 'warehouseId', targetKey: 'id'
        });
        // Product.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Product;
};