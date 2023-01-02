// const jwt = require('express-jwt');
const jwt = require("express-jwt");
const secret = require('../config/env.config').jwt_secret;
const db = require('../models');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {

            // const user = await db.user.findByPk(req.user.id);
            const user = await db.user.findByPk(req.user.id, { include: db.role /* { all: true, nested: false } */ });

            if (!user || (roles.length && !roles.includes(user.role.name))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Acceso no autorizado.' });
            }

            req.user.role = user.role.name;
            req.user.userGroupId = user.userGroupId;
            req.user.customerId = user.customerId;

            // authentication and authorization successful
            await db.refreshToken.findAll({ where: { userId: user.id } }).then(tokens => {
                req.user.ownsToken = token => !!tokens.find(x => x.token === token);
            });

            next();
        }
    ];
}