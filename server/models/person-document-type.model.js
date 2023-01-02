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

    const DocumentType = sequelize.define("person_document_type", attributes, options);

    DocumentType.associate = function (models) {
        DocumentType.hasMany(models.person, {
            foreignKey: 'documentTypeId', targetKey: 'id'
        });
    };

    return DocumentType;
};