const hostCaseController = require("../../controllers/hospital/hos-case.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../../middleware/validate-request');
const authorize = require('../../middleware/authorize');
const Role = require('../../helpers/role');

// module.exports = function (app) {
//     var router = require("express").Router();
//     // router.get("/", hostCaseController.findAll);
//     router.post("/", [authorize(Role.Admin, Role.Moderator)], hostCaseController.create);
//     // Retrieve all Properties
//     router.get("/", authorize(), hostCaseController.findAll);
//     router.get("/pending/", authorize(), hostCaseController.findAll);
//     router.get("/done/", authorize(), hostCaseController.findAll);
//     // Retrieve a single Property with id
//     router.get("/:id", [authorize()], hostCaseController.findOne);
//     // Update a Property with id
//     router.put("/:id", [authorize(Role.Admin)], hostCaseController.update);
//     // Delete a Property with id
//     router.delete("/:id", [authorize(Role.Admin)], hostCaseController.delete);
//     // Delete all Properties
//     router.delete("/", [authorize(Role.Admin)], hostCaseController.deleteAll);
//     app.use('/api/hos-cases', router);
// };
module.exports = function (app) {
    var router = require("express").Router();
    router.get("/done/", authorize(), getAllCaseWithLabOrders);
    router.get("/pending/", authorize(), getAllCasesWithoutLabOrders);
    router.get("/pending/:id", [authorize()], getCaseWithoutLabOrders);
    router.post("/", [authorize(Role.Admin, Role.Moderator)], create);
    router.get("/", authorize(), findAll);
    router.get("/:id", [authorize()], getById);
    router.put("/:id", [authorize(Role.Admin)], update);
    router.delete("/:id", [authorize(Role.Admin)], _delete);
    router.delete("/", [authorize(Role.Admin)], deleteAll);
    app.use('/api/hos-cases', router);
};

function findAll(req, res, next) { hostCaseController.findAll(req.query).then(casos => res.json(casos)).catch(next); }
function getById(req, res, next) { hostCaseController.getById(req.params.id).then(caso => res.json(caso)).catch(next); }
function create(req, res, next) { hostCaseController.create(req.body).then(() => res.json({ message: 'Caso registrado correctamente.' })).catch(next); }
function update(req, res, next) { hostCaseController.update(req.params.id, req.body).then(caso => res.json(caso)).catch(next); }
function _delete(req, res, next) { hostCaseController.delete(req.params.id).then(() => res.json({ message: 'Caso eliminado correctamente.' })).catch(next); }
function deleteAll(req, res, next) { hostCaseController.deleteAll().then(() => res.json({ message: 'Casos eliminados correctamente.' })).catch(next); }

function getAllCaseWithLabOrders(req, res, next) { hostCaseController.findAllWithOrder(req.query, req.user).then(casos => res.json(casos)).catch(next); }
function getAllCasesWithoutLabOrders(req, res, next) { hostCaseController.findAllWithoutOrder(req.query).then(casos => res.json(casos)).catch(next); }
function getCaseWithoutLabOrders(req, res, next) { hostCaseController.getCaseWithoutLabOrders(req.params.id).then(caso => res.json(caso)).catch(next); }