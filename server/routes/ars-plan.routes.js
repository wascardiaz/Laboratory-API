const seguroPlanController = require("../controllers/ars-plan.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], seguroPlanController.findAll);
    router.post("/", [authorize(Role.Admin)], createSchema, seguroPlanController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], seguroPlanController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], updateSchema, seguroPlanController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], seguroPlanController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], seguroPlanController.deleteAll);

    app.use('/api/seguro-planes', router);
};

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        name: Joi.string().required()

    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    };

    validateRequest(req, next, schema);
}