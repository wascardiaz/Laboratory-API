const uploadController = require("../controllers/upload.controller");
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

module.exports = function (app) {
    var router = require("express").Router();
    // POST File
    router.post('/', authorize(Role.Admin), uploadController.upload);
    router.get('/', /* authorize(), */ uploadController.getListFiles);
    router.get('/:name',/*  authorize(Role.Admin), */ uploadController.download);
    router.put("/:id", [authorize(Role.Admin)], uploadController.update);
    // Delete a Property with id
    router.delete("/:name", [authorize(Role.Admin)], uploadController.remove);
    // Delete all Properties
    router.delete("/", authorize(Role.Admin), uploadController.removeSync);
    app.use('/api/upload', router);
};