module.exports = (sequelize, Sequelize) => {
    const attributes = {
        quantity: { type: Sequelize.FLOAT },
        pricePerUnit: { type: Sequelize.DECIMAL(15,2) },
        qualityCheck: { type: Sequelize.BOOLEAN },
        orderStatus: { type: Sequelize.STRING },
        deliveryDate: { type: Sequelize.DATE },
        manufactureDate: { type: Sequelize.DATE },
        expiryDate: { type: Sequelize.DATE },
        orderedOn: { type: Sequelize.DATE },
        productName: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        distributorName: { type: Sequelize.STRING },
        measurementUnit: { type: Sequelize.FLOAT },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
    }
    const options = {
        timestamps: false
    }

    const ProductOrder = sequelize.define("product_order", attributes, options);

    ProductOrder.associate = function (models) {
        ProductOrder.belongsTo(models.product, {
            foreignKey: 'productId', targetKey: 'id'
        });
        ProductOrder.belongsTo(models.warehouse, {
            foreignKey: 'warehouseId', targetKey: 'id'
        });
        ProductOrder.belongsTo(models.distributor, {
            foreignKey: 'distributorId', targetKey: 'id'
        });
    };

    return ProductOrder;
};