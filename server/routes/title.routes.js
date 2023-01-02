const { authJwt } = require("../middleware");
const titleController = require("../controllers/title.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", titleController.findAll);
    router.post("/", [authorize(Role.Admin)], titleController.create);
    // Retrieve all Properties
    router.get("/", [authorize(Role.Admin)], titleController.findAll);
    // Retrieve a single Property with id
    router.get("/:id", titleController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], titleController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], titleController.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], titleController.deleteAll);
    app.use('/api/titles', router);
};