const productOrderRequestController = require("../controllers/product-order-request.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], productOrderRequestController.findAll);
    router.post("/", [authorize(Role.Admin)], /* createSchema, */ productOrderRequestController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], productOrderRequestController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], /* updateSchema,  */productOrderRequestController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], productOrderRequestController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], productOrderRequestController.deleteAll);

    app.use('/api/product-order-requests', router);
};


function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        personId: Joi.number().required(),
        specialtyId: Joi.number().required()
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.Moderator).empty('');
    };

    validateRequest(req, next, schemaRules);
}