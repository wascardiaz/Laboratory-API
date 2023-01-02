const labAnalysisResultController = require("../../controllers/lab/lab-analysis-result.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../../middleware/validate-request');
const authorize = require('../../middleware/authorize');
const Role = require('../../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize()], labAnalysisResultController.findAll);
    router.post("/", [authorize(Role.Admin)], /* createSchema, */ labAnalysisResultController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize()], labAnalysisResultController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], updateSchema, labAnalysisResultController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], labAnalysisResultController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], labAnalysisResultController.deleteAll);

    app.use('/api/lab-analysis-results', router);
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