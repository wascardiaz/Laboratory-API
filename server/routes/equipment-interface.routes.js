const equipmentInterfaceController = require("../controllers/equipment-interface.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], equipmentInterfaceController.findAll);
    router.post("/", [authorize(Role.Admin)], createSchema, equipmentInterfaceController.create);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], equipmentInterfaceController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], /* updateSchema,  */equipmentInterfaceController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], equipmentInterfaceController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], equipmentInterfaceController.deleteAll);

    app.use('/api/equipments-interface', router);
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