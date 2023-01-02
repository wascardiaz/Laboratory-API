const roleController = require("../controllers/role.controller");
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", /* [authorize(Role.Admin)], */ roleController.findAll);
    router.post("/", [authorize(Role.Admin)], roleController.create);
    // Retrieve all Properties
    // router.get("/", [authorize(Role.Admin)], roleController.findAll);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], roleController.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], roleController.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], roleController.delete);
    // Delete all Properties
    router.delete("/",[authorize(Role.Admin)], roleController.deleteAll);
    app.use('/api/roles', router);
};