const rawMaterialOrderController = require("../controllers/raw-material-order.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], rawMaterialOrderController.findAll);
    router.post("/", [authorize(Role.Admin)], /* createSchema, */ rawMaterialOrderController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], rawMaterialOrderController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], /* updateSchema,  */rawMaterialOrderController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], rawMaterialOrderController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], rawMaterialOrderController.deleteAll);

    app.use('/api/raw-material-orders', router);
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