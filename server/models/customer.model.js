module.exports = (sequelize, Sequelize) => {
    const attributes = {
        cust_descripcion: { type: Sequelize.STRING },
        nucf_grupo: { type: Sequelize.STRING },
        nucf_lote: { type: Sequelize.STRING },
        cust_contacto: { type: Sequelize.STRING },
        cust_website: { type: Sequelize.STRING },
        cust_api_url: { type: Sequelize.STRING },
        cust_email: { type: Sequelize.STRING },
        cust_documtos: { type: Sequelize.STRING },
        cust_autorizacion: { type: Sequelize.STRING },
        cust_envios: { type: Sequelize.STRING },
        cust_formato: { type: Sequelize.STRING },
        cust_medcmtos: { type: Sequelize.STRING },
        cust_cirugia: { type: Sequelize.STRING },
        cust_direccion: { type: Sequelize.STRING },
        cust_lug_tipo: { type: Sequelize.STRING },
        cust_lug_nombre: { type: Sequelize.STRING },
        cust_lug_numero: { type: Sequelize.STRING },
        cust_lug_apto: { type: Sequelize.STRING },
        sect_codigo: { type: Sequelize.STRING },
        ciud_codigo: { type: Sequelize.STRING },
        cust_telefono: { type: Sequelize.STRING },
        cust_fax: { type: Sequelize.STRING },
        cust_celular: { type: Sequelize.STRING },
        cust_beeper: { type: Sequelize.STRING },
        cust_contrato: { type: Sequelize.STRING },
        cust_limite: { type: Sequelize.STRING },
        cust_ini_contrato: { type: Sequelize.STRING },
        cust_fin_contrato: { type: Sequelize.STRING },
        cust_fecha_corte: { type: Sequelize.STRING },
        cust_porc_descto: { type: Sequelize.STRING },
        pago_codigo: { type: Sequelize.STRING },
        cust_rnc: { type: Sequelize.STRING },
        ctas_numero: { type: Sequelize.STRING },
        grup_codigo: { type: Sequelize.STRING },
        cust_comentario: { type: Sequelize.STRING },
        cust_estatus: { type: Sequelize.STRING },
        cust_referencia: { type: Sequelize.STRING },
        naci_codigo: { type: Sequelize.STRING },
        cust_web_site: { type: Sequelize.STRING },
        cust_local: { type: Sequelize.STRING },
        ctas_debito: { type: Sequelize.STRING },
        ctas_credito: { type: Sequelize.STRING },
        ctas_itbis: { type: Sequelize.STRING },
        ctas_descto: { type: Sequelize.STRING },
        ctas_retencion: { type: Sequelize.STRING },
        cust_tipo: { type: Sequelize.STRING },
        cust_movil: { type: Sequelize.STRING },
        cust_oficina: { type: Sequelize.STRING },
        cust_limite_credito: { type: Sequelize.STRING },
        cust_descto_pago: { type: Sequelize.STRING },
        ctas_isr: { type: Sequelize.STRING },
        cust_categoria: { type: Sequelize.STRING },
        cust_grupo: { type: Sequelize.STRING },
        cust_descto: { type: Sequelize.STRING },
        mone_codigo: { type: Sequelize.STRING },
        cust_apertura: { type: Sequelize.STRING },
        nucf_prefijo: { type: Sequelize.STRING },
        dgii_tipo: { type: Sequelize.STRING },
        inve_grupo: { type: Sequelize.STRING },
        porc_itbis: { type: Sequelize.STRING },
        porc_retencion: { type: Sequelize.STRING },
        dgii_costo: { type: Sequelize.STRING },
        clas_codigo: { type: Sequelize.STRING },
        dpto_codigo: { type: Sequelize.STRING },        
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Customer = sequelize.define("customer", attributes, options);

    Customer.associate = function (models) {
        // Customer.belongsTo(models.person, {
        //     foreignKey: 'personId', targetKey: 'id'
        // });
        // Customer.belongsTo(models.medico_specialty, {
        //     foreignKey: 'specialtyId', targetKey: 'id'
        // });
    };

    return Customer;
};