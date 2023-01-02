module.exports = (sequelize, DataTypes) => {
    const attributes = {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: { msg: "El campo no puede ser nulo" },
                // isAlpha: { args: true, msg: "El nombre solo puede contener letras" },
                len: { args: [3, 64], msg: "El nombre tiene que ser entre 3 y 64 caracteres" }
            }
        },
        emailId: {
            type: DataTypes.STRING,
            unique: true,
            // isEmail: true, //checks for email format
            allowNull: false,
            validate: {
                isEmail: { args: true, msg: "El campo tiene que ser un correo valido" }
            }
        },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        acceptTerms: { type: DataTypes.BOOLEAN },
        verificationToken: { type: DataTypes.STRING },
        verified: { type: DataTypes.DATE },
        resetToken: { type: DataTypes.STRING },
        resetTokenExpires: { type: DataTypes.DATE },
        image: { type: DataTypes.STRING, allowNull: true },
        passwordReset: { type: DataTypes.DATE },
        designation: { type: DataTypes.STRING },
        securityQuestion: { type: DataTypes.STRING },
        securityAnswer: { type: DataTypes.STRING },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },
        isVerified: {
            type: DataTypes.VIRTUAL,
            get() { return !!(this.verified || this.passwordReset); }
        }
    }
    const options = {
        timestamps: false,
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    }

    const User = sequelize.define("user", attributes, options);

    User.associate = function (models) {
        User.belongsTo(models.role, {
            foreignKey: 'roleId', targetKey: 'id'
        });

        User.belongsTo(models.user_group, {
            foreignKey: 'userGroupId', targetKey: 'id'
        });

        User.belongsTo(models.person, {
            foreignKey: 'personId', targetKey: 'id'
        });

        User.belongsTo(models.customer, {
            foreignKey: 'customerId', targetKey: 'id'
        });
    };

    return User;
};