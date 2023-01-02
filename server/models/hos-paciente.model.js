module.exports = (sequelize, Sequelize) => {
    const attributes = {
        medicoId: { type: Sequelize.INTEGER },
        sangreId: { type: Sequelize.INTEGER },
        fallecido: { type: Sequelize.BOOLEAN, defaultValue: '0' },
        motivo_fellecio: { type: Sequelize.STRING },
        fecha_fellecido: { type: Sequelize.DATE },
        observacion: { type: Sequelize.STRING },
        peso: { type: Sequelize.FLOAT },
        patientTypeId: { type: Sequelize.INTEGER },
        nss: { type: Sequelize.STRING },
        antecedentes_familiares: { type: Sequelize.STRING },
        web_usuario: { type: Sequelize.STRING },
        web_clave: { type: Sequelize.STRING },
        vip: { type: Sequelize.BOOLEAN },
        vip_mensaje: { type: Sequelize.STRING },
        no_grato: { type: Sequelize.BOOLEAN },
        nograto_mensaje: { type: Sequelize.STRING },
        tarjeta: { type: Sequelize.STRING },
        gestion_cobro: { type: Sequelize.STRING },
        userId: { type: Sequelize.INTEGER, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
        created: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE }
    }
    const options = {
        timestamps: false
    }

    const HostPatient = sequelize.define("hos_patient", attributes, options);

    HostPatient.associate = function (models) {
        HostPatient.hasMany(models.hos_case_patient, {
            foreignKey: 'patientId', targetKey: 'id'
        });
        HostPatient.hasMany(models.hos_patient_to_ars, {
            foreignKey: 'patientId', targetKey: 'id', as: 'arses'
        });
        HostPatient.belongsTo(models.person, {
            foreignKey: 'personId', targetKey: 'id'
        });
        HostPatient.belongsTo(models.hos_patient_type, {
            foreignKey: 'patientTypeId', targetKey: 'id', as:'patientType'
        });
        /* HostPatient.belongsToMany(models.seguro, {
            through: "patient_seguros",
            foreignKey: "patientId",
            otherKey: "seguId"
        }); */
    };

    return HostPatient;
};