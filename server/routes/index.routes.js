module.exports = function (app) {
    var router = require("express").Router();
    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', { title: 'Upload Avatar', avatar_field: process.env.AVATAR_FIELD });
    });

    app.use('/', router);
};