const supplierController = require("../controllers/supplier.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], supplierController.findAll);
    router.post("/", [authorize(Role.Admin)], /* createSchema, */ supplierController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], supplierController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], /* updateSchema,  */supplierController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], supplierController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], supplierController.deleteAll);

    app.use('/api/suppliers', router);
};


function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().empty(''),
        phoneNo: Joi.string().empty(''),
        userId: Joi.number().required(),
        created: Joi.date().optional(),
        updated: Joi.date().optional(),
        status: Joi.boolean(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        name: Joi.string().required(),
        location: Joi.string().empty(''),
        phoneNo: Joi.string().empty(''),
        userId: Joi.number().required(),
        created: Joi.date().optional(),
        updated: Joi.date().optional(),
        status: Joi.boolean(),
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.Moderator).empty('');
    };

    validateRequest(req, next, schemaRules);
}