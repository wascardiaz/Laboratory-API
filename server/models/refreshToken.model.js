const config = require("../config/env.config");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        token: {
            type: Sequelize.STRING,
        },
        expiryDate: {
            type: Sequelize.DATE,
        },
        isExpired: {
            type: Sequelize.VIRTUAL,
            get() { return Date.now() >= this.expiryDate; }
        }
    },
        {
            timestamps: false
        });


    RefreshToken.removeAttribute('id');

    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
        let _token = uuidv4();
        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });
        return refreshToken.token;
    };
    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    RefreshToken.associate = function (models) {
        RefreshToken.belongsTo(models.user, {
            foreignKey: 'userId', targetKey: 'id'
        });
    };

    return RefreshToken;
};