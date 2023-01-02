// const { authJwt } = require("../middleware");
const resultado = require("../controllers/resultado.controler");
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');
module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [authorize(Role.Admin)], resultado.findAll);
    router.post("/", [authorize(Role.Admin)], resultado.create);
    // Retrieve all Properties
    router.get("/", [authorize(Role.Admin)], resultado.findAll);
    // Retrieve a single Property with id
    router.get("/:id", [authorize(Role.Admin)], resultado.findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], resultado.update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], resultado.delete);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], resultado.deleteAll);
    app.use('/api/resultados', router);
};