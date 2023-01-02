module.exports = (sequelize, Sequelize) => {
    const attributes = {
        firstName: { type: Sequelize.STRING(64) },
        lastName: { type: Sequelize.STRING(64) },
        fullName: {
            type: Sequelize.VIRTUAL,
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(value) {
                throw new Error('Do not try to set the `fullName` value!');
            }
        },
        nickname: { type: Sequelize.STRING },
        document: { type: Sequelize.STRING },
        phoneNo: { type: Sequelize.STRING },
        // title: Title,
        // sexoId: { type: Sequelize.INTEGER },
        // estadoCivilId: { type: Sequelize.INTEGER },
        // razaId: { type: Sequelize.INTEGER },
        // paisId: { type: Sequelize.INTEGER },
        // profesionId: { type: Sequelize.INTEGER },
        // addressId: { type: Sequelize.INTEGER },
        dateOfBirth: { type: Sequelize.DATEONLY, allowNull: false },
        foto: { type: Sequelize.STRING },
        // docTypeId: { type: Sequelize.INTEGER },
        // document: { type: Sequelize.STRING },
        email: {
            type: Sequelize.STRING,
            // unique: true,
            // isEmail: true, //checks for email format
            allowNull: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: "El campo tiene que ser un correo valido"
                }
            }
        },
        created: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        updated: { type: Sequelize.DATE },
        userId: { type: Sequelize.INTEGER, allowNull: true },
        status: { type: Sequelize.BOOLEAN, defaultValue: '1' },
    }
    const options = {
        timestamps: false
    }

    const Person = sequelize.define("person", attributes, options);

    Person.associate = function (models) {
        Person.belongsTo(models.person_document_type, {
            foreignKey: 'documentTypeId', targetKey: 'id', as: 'documentType'
        });
        Person.belongsTo(models.title, {
            foreignKey: 'titleId', targetKey: 'id', as: 'title'
        });
        Person.belongsTo(models.person_gender, {
            foreignKey: 'genderId', targetKey: 'id', as: 'gender'
        });
        Person.belongsTo(models.person_profession, {
            foreignKey: 'professionId', targetKey: 'id', as: 'profession'
        });
        Person.belongsTo(models.person_civil_state, {
            foreignKey: 'civilStateId', targetKey: 'id', as: 'civilState'
        });
        Person.hasMany(models.address, {
            foreignKey: 'personId', targetKey: 'id'
        });
    };

    return Person;
};