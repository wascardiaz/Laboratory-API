const settingController = require("../controllers/setting.controller");
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');
const uploadFile = require("../middleware/uploadNew");
// import multer and the AvatarStorage engine
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var AvatarStorage = require('../helpers/setting-storage');

const db = require("../models");
const fs = require("fs");
const Setting = db.setting;
const { fileExists } = require('../helpers/file-exists');

// setup a new instance of the AvatarStorage engine 
var storage = AvatarStorage({
    square: false,
    responsive: false,
    greyscale: false,
    quality: 90
});

var limits = {
    files: 1, // allow only 1 file per request
    fileSize: 1024 * 1024, // 1 MB (max file size)
};

var fileFilter = function (req, file, cb) {
    // supported image file mimetypes
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if (_.includes(allowedMimes, file.mimetype)) {
        // allow supported image files
        cb(null, true);
    } else {
        // throw error for invalid files
        cb(new Error('Tipo invalido. Solo se permiten imagenes tipo jpg, png y gif.'));
    }
};

// setup multer
var upload = multer({
    storage: storage,
    // limits: limits,
    fileFilter: fileFilter
});

module.exports = function (app) {
    var router = require("express").Router();
    const cpUpload = upload.fields([{ name: 'config_logo', maxCount: 1 }, { name: 'config_image', maxCount: 1 }])
    // POST File
    router.post('/upload', authorize(Role.Admin), /* async (req, res, next) => { await uploadFile(req, res); next(); } */cpUpload, /* uploadImage */async function (req, res, next) {

        const { code } = req.body;

        delete req.body.code;

        const mapObj = new Map(Object.entries(req.body));
        mapObj.forEach((value, key) => {
            // console.log(key, value);
            if (key.substring(0, code.length) == code) {

                const element = { companyId: companyId, code: code, key: key, value: value, serialized: '0' };

                if (element.value === true)
                    element.value = '1';
                else if (element.value === false)
                    element.value = '0';

                if (Array.isArray(value)) {
                    element.serialized = '1';
                } else {
                    element.serialized = '0';
                }
            }
        });


        var files;
        // var file = req.file.filename;
        // var matches = file.match(/^(.+?)_.+?\.(.+)$/i);

        // if (req.files) {
        //     files = _.map(req.files, function (file) {
        //         return file;
        //     });
        // } else {
        //     files = [file];
        // }

        files = _.map(req.files, function (file) {
            const port = req.app.get('http-port') ? req.app.get('http-port') : req.app.get('https-port');
            const base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
            const url = path.join(file[0].baseUrl, file[0].filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

            return (file.storage == 'local' ? base : '') + '/' + url;
        });

        res.status(200).json(files)

    });
    router.get('/files', /* authorize(), */ getListFiles);
    router.get('/files/file/:name',/*  authorize(Role.Admin), */getFile);
    router.get('/files/:name',/*  authorize(Role.Admin), */ download);
    router.get("/", [/* authJwt.verifyToken, */ authorize()], findAndCountAll);
    // router.post("/", [authorize(Role.Admin)], create);
    // Retrieve all Properties
    router.post("/", /* [authorize()], */ findAll);
    // Retrieve a single Property with id
    router.get("/:id", [authorize()], findOne);
    // Update a Property with id
    router.put("/:id", [authorize(Role.Admin)], cpUpload, update);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], deleteSetting);
    // Delete all Properties
    router.delete("/", [authorize(Role.Admin)], deleteAll);
    app.use('/api/settings', router);
};

function getFile(req, res, next) { settingController.getFile(req).then(response => res.json(response)).catch(next); }
function uploadImage(req, res, next) { settingController.uploadImage(req.file, req.body).then(response => res.json(response)).catch(next) }
function getListFiles(req, res, next) { settingController.getListFiles().then(response => res.json(response)).catch(next) }
function download(req, res, next) { settingController.download(req.params.name, res)/* .then(response => res.json(response)) */.catch(next) }
function create(req, res, next) { settingController.create().then(response => res.json(response)).catch(next) }
function findAll(req, res, next) { settingController.findAll(req.body).then(response => res.json(response)).catch(next) }
function findAndCountAll(req, res, next) { settingController.findAndCountAll(req.query).then(response => res.json(response)).catch(next) }
function findOne(req, res, next) { settingController.findOne(req.params.id).then(response => res.json(response)).catch(next) }
function update(req, res, next) { settingController.update(req).then(response => res.json(response)).catch(next) }
function deleteSetting(req, res, next) { settingController.deleteSetting(req.params.id).then(response => res.json(response)).catch(next) }
function deleteAll(req, res, next) { settingController.deleteAll().then(response => res.json(response)).catch(next) }
function findAllActive(req, res, next) { settingController.findAllActive().then(response => res.json(response)).catch(next) }