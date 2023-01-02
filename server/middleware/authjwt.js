const jwt = require("jsonwebtoken");
const jwSecret = require('../config/env.config.js').jwt_secret;
const db = require("../models");
const User = db.user;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "No autorizado! El token de acceso ha expirado!" });
  }
  return res.sendStatus(401).send({ message: "No autorizado!" });
}

verifyToken = (req, res, next) => {
    // let token = req.session.token;
    // let token = req.headers["x-access-token"];
    const token = req.body.refreshToken;
    if (!token) {
        return res.status(403).send({
            message: "No se ha poveeido ningun token!",
        });
    }
    jwt.verify(token, jwSecret, (err, decoded) => {
        if (err) {
            return catchError(err, res)
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    try {
        const user = /* await */ User.findByPk(req.userId);
        const roles = /* await */ user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Requiere permisos de Administrador!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};

isModerator = async (req, res, next) => {
    try {
        const user = /* await */ User.findByPk(req.userId);
        const roles = /* await */ user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Moderator Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Moderator role!",
        });
    }
};

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = /* await */ User.findByPk(req.userId);
        const roles = /* await */ user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
            if (roles[i].name === "admin") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Moderator or Admin Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Moderator or Admin role!",
        });
    }
};
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};
module.exports = authJwt;