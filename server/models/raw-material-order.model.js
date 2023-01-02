module.exports = (sequelize, Sequelize) => {
    const attributes = {
        quantity: { type: Sequelize.INTEGER },
        pricePerUnit: { type: Sequelize.DECIMAL(15, 2) },
        qualityCheck: { type: Sequelize.BOOLEAN },
        orderStatus: { type: Sequelize.STRING },
        deliveryDate: { type: Sequelize.DATE },
        expiryDate: { type: Sequelize.DATE },
        orderedOn: { type: Sequelize.DATE },
        materialName: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        supplierName: { type: Sequelize.STRING },
        measurementUnit: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const RawMaterialOrder = sequelize.define("raw_material_order", attributes, options);

    RawMaterialOrder.associate = function (models) {
        RawMaterialOrder.belongsTo(models.warehouse, {
            foreignKey: 'warehouseId', targetKey: 'id'
        });
        RawMaterialOrder.belongsTo(models.supplier, {
            foreignKey: 'supplierId', targetKey: 'id'
        });
    };

    return RawMaterialOrder;
};