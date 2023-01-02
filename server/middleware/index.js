const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const errorHandler = require("./error-handler");
module.exports = {
    authJwt,
    verifySignUp,
    errorHandler
};