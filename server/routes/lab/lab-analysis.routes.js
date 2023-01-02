const labAnalysisController = require("../../controllers/lab/lab-analysis.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../../middleware/validate-request');
const authorize = require('../../middleware/authorize');
const Role = require('../../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize()], labAnalysisController.findAll);
    router.post("/", [authorize(Role.Admin)], /* createSchema, */ labAnalysisController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize()], labAnalysisController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)],/*  updateSchema, */ labAnalysisController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], labAnalysisController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], labAnalysisController.deleteAll);

    app.use('/api/lab-analysies', router);
};

function createSchema(req, res, next) {
    const schema = Joi.object({        
        testId:Joi.number().require(),
        sampleTypeId:Joi.number().require(),
        analysisGroupId:Joi.number().require(),
        analysisSubGroupId:Joi.number().empty(null),
        labMethodId:Joi.number().empty(null),
        labEquipmentId:Joi.number().empty(null),
        sampleContainerId:Joi.number().empty(null),
        equipId:Joi.number().empty(null),
        labId:Joi.number().empty(null),
        description:Joi.string().min(3).max(255).require(),
        abbreviation:Joi.string().max(32).empty(null),
        sex:Joi.string().empty(null),
        condition:Joi.string().empty(null),
        day:Joi.string().empty(null),
        days:Joi.string().empty(null),
        webResult:Joi.boolean().empty(null),
        normalValue:Joi.string().empty(null),
        status:Joi.boolean().empty(null),
    });

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    };

    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {       
        testId:Joi.number().require(),
        sampleTypeId:Joi.number().require(),
        analysisGroupId:Joi.number().require(),
        analysisSubGroupId:Joi.number().empty(null),
        labMethodId:Joi.number().empty(null),
        labEquipmentId:Joi.number().empty(null),
        sampleContainerId:Joi.number().empty(null),
        equipId:Joi.number().empty(null),
        labId:Joi.number().empty(null),
        description:Joi.string().min(3).max(255).require(),
        abbreviation:Joi.string().max(32).empty(null),
        sex:Joi.string().empty(null),
        condition:Joi.string().empty(null),
        day:Joi.string().empty(null),
        days:Joi.string().empty(null),
        webResult:Joi.boolean().empty(null),
        normalValue:Joi.string().empty(null),
        status:Joi.boolean().empty(null),

    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    };

    validateRequest(req, next, schema);
}