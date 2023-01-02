const { authJwt } = require("../middleware");
const userGroupController = require("../controllers/user-group.controller");
module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", userGroupController.findAll);
    router.post("/", [authJwt.verifyToken], userGroupController.create);
    // Retrieve all Properties
    router.get("/", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.findAll);
    // Retrieve a single Property with id
    router.get("/:id", userGroupController.findOne);
    // Update a Property with id
    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.update);
    // Delete a Property with id
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.delete);
    // Delete all Properties
    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.deleteAll);
    app.use('/api/user-groups', router);
};