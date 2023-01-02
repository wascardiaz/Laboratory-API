module.exports = function (app) {
    var router = require("express").Router();

    /* GET users listing. */
    router.get('/', function (req, res, next) {
        res.send('respond with a resource');
    });

    app.use('/users', router);
};