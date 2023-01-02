module.exports = (sequelize, Sequelize) => {
    const attributes = {
        name: { type: Sequelize.STRING },
        rnc: { type: Sequelize.STRING },
        telephone: { type: Sequelize.STRING },
        address: { type: Sequelize.STRING },
        fax: { type: Sequelize.STRING },
        phoneAutorization: { type: Sequelize.STRING },
        url: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        abbreviature: { type: Sequelize.STRING },
        ncfTypeId: { type: Sequelize.INTEGER },
        ncLote: { type: Sequelize.STRING },
        contact: { type: Sequelize.STRING },
        contractStart: { type: Sequelize.DATE },
        contractEnd: { type: Sequelize.DATE },
        cuteDate: { type: Sequelize.DATE },
        margen_medicamento: { type: Sequelize.FLOAT },
        margen_material: { type: Sequelize.FLOAT },
        codigo_prestador: { type: Sequelize.STRING },
        cuentaId: { type: Sequelize.INTEGER },
        invouceNote: { type: Sequelize.STRING },
        comment: { type: Sequelize.STRING },
        cobertura_emergencia: { type: Sequelize.FLOAT },
        solicita_info: { type: Sequelize.BOOLEAN },
        status: { type: Sequelize.BOOLEAN },
        userId: { type: Sequelize.INTEGER },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }
    }
    const options = {
        timestamps: false
    }

    const Seguro = sequelize.define("ars", attributes, options);

    Seguro.associate = function (models) {
        // associations can be defined here
        Seguro.hasMany(models.hos_patient_to_ars, {
            foreignKey: 'arsId', targetKey: 'id'
        });
        Seguro.hasMany(models.ars_plan, {
            foreignKey: 'arsId', targetKey: 'id'
        });
        Seguro.hasMany(models.ars_coberture, {
            foreignKey: 'arsId', targetKey: 'id'
        });
    };

    return Seguro;
};