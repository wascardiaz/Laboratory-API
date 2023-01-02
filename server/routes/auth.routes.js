const { verifySignUp } = require("../middleware");
const Joi = require('@hapi/joi');
const authController = require("../controllers/auth.controller");
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');

module.exports = function (app) {
    var router = require("express").Router();
    router.post("/signup",signupSchema, [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], authController.signup);
    router.post("/signin", signinSchema, authController.signin);
    router.post("/signout", /* authorize(), */ signoutScheme, authController.signout);
    router.post("/refreshtoken", authController.refreshToken);
    router.post('/verify-email', verifyEmailSchema, authController.verifyEmail);
    router.post('/forgot-password', forgotPasswordSchema, authController.forgotPassword);
    router.post('/validate-reset-token', validateResetTokenSchema, authController.validateResetToken);
    router.post('/reset-password', resetPasswordSchema, authController.resetPassword);

    app.use('/api/auth', router);
};

function signinSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function signoutScheme(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function signupSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        userGroupId: Joi.number().required(),
        roleId: Joi.number().required(),
        roleId: Joi.number().empty(null),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        acceptTerms: Joi.boolean().valid(true).required()
    });
    validateRequest(req, next, schema);
}

function verifyEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}