const testGroupController = require("../controllers/test-group.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], testGroupController.findAll);
    router.post("/", [authorize(Role.Admin)], createSchema, testGroupController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], testGroupController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], updateSchema, testGroupController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], testGroupController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], testGroupController.deleteAll);

    app.use('/api/test-groups', router);
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