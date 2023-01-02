const { authJwt } = require("../middleware");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const Joi = require('@hapi/joi');
const validateRequest = require('../middleware/validate-request');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');
// import multer and the AvatarStorage engine
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var AvatarStorage = require('../helpers/avatar-storage');


var UPLOAD_PATH = path.resolve(__dirname, '..', process.env.AVATAR_STORAGE);

// setup a new instance of the AvatarStorage engine 
var storage = AvatarStorage({
    square: false,
    responsive: true,
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
    limits: limits,
    fileFilter: fileFilter
});

module.exports = function (app) {
    var router = require("express").Router();
    router.get("/", [/* authJwt.verifyToken, */ authorize(Role.Admin)], userController.findAll);
    router.post("/", [authorize(Role.Admin)], createSchema, userController.create);
    // Retrieve all Properties
    // router.get("/", [authorize(Role.Admin)], userController.findAll);
    // Retrieve a single Property with id
    router.get("/:id", [authorize()], userController.findOne);
    router.get("/pic/:name", [authorize()], (rex, res, next) => { rex.body.directory = '"/public/images/user"'; next(); }, uploadController.getFile);
    // Update a Property with id
    router.put("/:id", [authorize()], updateSchema, userController.update);
    // Update a Property Profile with id
    router.put("/profile/:id", [authorize()], profileUpdateSchema, userController.updateProfile);
    // Delete a Property with id
    router.delete("/:id", [authorize(Role.Admin)], userController.delete);
    // Delete all Properties
    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteAll);

    app.use('/api/users', router);
};

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        userGroupId: Joi.number().required(),
        roleId: Joi.number().required(),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        emailId: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        // role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        username: Joi.string().required(),
        userGroupId: Joi.number().required(),
        roleId: Joi.number().required(),
        titleId: Joi.number().required(),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).empty(null),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(null),
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function profileUpdateSchema(req, res, next) {
    const schemaRules = {
        designation: Joi.string().empty(''),
        emailId: Joi.string().empty(''),
        image: Joi.string().empty(''),
        person: Joi.object().empty(''),
        // personId: Joi.number().required(),
        role: Joi.object().empty(''),
        // roleId: Joi.number().required(),
        securityAnswer: Joi.string().required(),
        securityQuestion: Joi.string().required(),
        // userGroupId: Joi.number().required(),
        // username: Joi.string().required(),
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}