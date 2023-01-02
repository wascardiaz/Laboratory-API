module.exports = (sequelize, Sequelize) => {
    const attributes = {
        quantity: { type: Sequelize.INTEGER },
        pricePerUnit: { type: Sequelize.DECIMAL(15,2) },
        qualityCheck: { type: Sequelize.BOOLEAN },
        deliveryDate: { type: Sequelize.DATE },
        expiryDate: { type: Sequelize.DATE },
        manufactureDate: { type: Sequelize.DATE },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
    }
    const options = {
        timestamps: false
    }

    const ProductOrderRequest = sequelize.define("product_order_request", attributes, options);

    ProductOrderRequest.associate = function (models) {
        ProductOrderRequest.belongsTo(models.distributor, {
            foreignKey: 'distributorId', targetKey: 'id'
        });
        // ProductOrderRequest.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return ProductOrderRequest;
};