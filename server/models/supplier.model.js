module.exports = (sequelize, Sequelize) => {
    const attributes = {
        rnc: { type: Sequelize.STRING },
        cedula: { type: Sequelize.STRING },
        razon_social: { type: Sequelize.STRING },
        nombre_comercial: { type: Sequelize.STRING },
        contacto: { type: Sequelize.STRING },
        web_site: { type: Sequelize.STRING },
        api_url: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        local: { type: Sequelize.STRING },
        tipo: { type: Sequelize.STRING },
        mercado: { type: Sequelize.STRING },
        // address: { type: Sequelize.STRING },
        direccion: { type: Sequelize.STRING },
        sector: { type: Sequelize.STRING },
        ciudad: { type: Sequelize.STRING },
        lugar_tipo: { type: Sequelize.STRING },
        lug_nombre: { type: Sequelize.STRING },
        lug_numero: { type: Sequelize.STRING },
        lug_apto: { type: Sequelize.STRING },
        sect_codigo: { type: Sequelize.STRING },
        ciud_codigo: { type: Sequelize.STRING },
        zona_codigo: { type: Sequelize.STRING },
        oficina: { type: Sequelize.STRING },
        telefono: { type: Sequelize.STRING },
        fax: { type: Sequelize.STRING },
        movil: { type: Sequelize.STRING },
        limite_credito: { type: Sequelize.STRING },
        fecha_corte: { type: Sequelize.STRING },
        descto_pago: { type: Sequelize.STRING },
        pago_codigo: { type: Sequelize.STRING },
        // cuenta: { type: Sequelize.STRING },
        grup_codigo: { type: Sequelize.STRING },
        comentario: { type: Sequelize.STRING },
        categoria: { type: Sequelize.STRING },
        grupo: { type: Sequelize.STRING },
        itbis: { type: Sequelize.STRING },
        descto: { type: Sequelize.STRING },
        mone_codigo: { type: Sequelize.STRING },
        apertura: { type: Sequelize.STRING },
        limite: { type: Sequelize.STRING },
        nucf_grupo: { type: Sequelize.STRING },
        nucf_prefijo: { type: Sequelize.STRING },
        dgii_tipo: { type: Sequelize.STRING },
        inve_grupo: { type: Sequelize.STRING },
        porc_itbis: { type: Sequelize.STRING },
        porc_retencion: { type: Sequelize.STRING },
        dgii_costo: { type: Sequelize.STRING },
        clas_codigo: { type: Sequelize.STRING },
        dpto_codigo: { type: Sequelize.STRING },
        tipodoc: { type: Sequelize.STRING },
        porc_isr: { type: Sequelize.STRING },
        bcos_cuenta: { type: Sequelize.STRING },
        bcos_codigo: { type: Sequelize.STRING },
        plan_codigo: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Supplier = sequelize.define("supplier", attributes, options);

    Supplier.associate = function (models) {
        // Supplier.belongsTo(models.person, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Supplier.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Supplier;
};