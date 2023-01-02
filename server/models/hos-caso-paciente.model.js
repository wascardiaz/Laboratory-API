module.exports = (sequelize, Sequelize) => {
    const attributes = {
        recordId: { type: Sequelize.INTEGER },
        ingreso: { type: Sequelize.STRING },
        facturado: { type: Sequelize.BOOLEAN },
        factNo: { type: Sequelize.STRING },
        hora: { type: Sequelize.TIME },
        habiId: { type: Sequelize.INTEGER },
        typeId: { type: Sequelize.INTEGER },
        asegurado: { type: Sequelize.BOOLEAN },
        mdcoReportId: { type: Sequelize.INTEGER },
        poliza: { type: Sequelize.STRING },
        autorizacion: { type: Sequelize.STRING },
        autor_por: { type: Sequelize.STRING },
        diagPresuntivo: { type: Sequelize.STRING },
        diagDefinitivo: { type: Sequelize.STRING },
        clteGrupo: { type: Sequelize.STRING },
        clteId: { type: Sequelize.INTEGER },
        statusId: { type: Sequelize.INTEGER },
        autoDescto: { type: Sequelize.BOOLEAN },
        autoBalance: { type: Sequelize.BOOLEAN },
        userDate: { type: Sequelize.DATE },
        userDateChange: { type: Sequelize.DATE },
        updated: { type: Sequelize.DATE },
        postEstatus: { type: Sequelize.BOOLEAN },
        mdcoEspecialistaId: { type: Sequelize.INTEGER },
        histNumero: { type: Sequelize.STRING },
        mdcoDescription: { type: Sequelize.STRING },
        alta: { type: Sequelize.BOOLEAN },
        viaId: { type: Sequelize.INTEGER },
        docTypeId: { type: Sequelize.INTEGER },
        diagId: { type: Sequelize.INTEGER },
        turno: { type: Sequelize.STRING },
        documento: { type: Sequelize.STRING },
        altaStatus: { type: Sequelize.STRING },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        userId: { type: Sequelize.INTEGER, allowNull: false },
        // status: { type: Sequelize.BOOLEAN, defaultValue: '0' },
        orderStatus: { type: Sequelize.STRING, defaultValue: 'Processing' },
    }
    const options = {
        timestamps: false
    }

    const HosCasoPatient = sequelize.define("hos_case_patient", attributes, options);

    HosCasoPatient.associate = function (models) {

        HosCasoPatient.belongsTo(models.hos_patient, {
            foreignKey: 'patientId', targetKey: 'id', as: 'patient'
        });

        HosCasoPatient.belongsTo(models.customer, {
            foreignKey: 'customerId', targetKey: 'id',
        });

        HosCasoPatient.belongsTo(models.hos_case_origin, {
            foreignKey: 'origenId', targetKey: 'id', as: 'origin'
        });

        HosCasoPatient.belongsTo(models.medic, {
            foreignKey: 'mdcoId', targetKey: 'id', as: 'medic'
        });

        HosCasoPatient.belongsTo(models.hos_patient_type, {
            foreignKey: 'groupId', targetKey: 'id', as: 'patientType'
        });

        HosCasoPatient.belongsTo(models.ars, {
            foreignKey: 'arsId', targetKey: 'id', as: 'ars'
        });

        HosCasoPatient.belongsTo(models.ars_plan, {
            foreignKey: 'arsPlanId', targetKey: 'id', as: 'arsPlan'
        });

        HosCasoPatient.hasMany(models.hos_cargos_patient, {
            foreignKey: 'caseId', targetKey: 'id', as: 'cargos'
        });
    };

    return HosCasoPatient;
};