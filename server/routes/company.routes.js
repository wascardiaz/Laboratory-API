const companyController = require("../controllers/company.controller");
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');
const validateRequest = require('../middleware/validate-request');
const Joi = require('@hapi/joi');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [authorize()], companyController.findAndCountAll);
    router.post("/", [authorize(Role.Admin)], createSchema, companyController.create);
    // Retrieve all Properties
    router.get("/", [authorize(Role.Admin)], companyController.findAll);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], companyController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], companyController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], companyController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], companyController.deleteAll);
    app.use('/api/companies', router);
};

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}