// import multer and the AvatarStorage engine
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var AvatarStorage = require('../helpers/avatar-storage');

// setup a new instance of the AvatarStorage engine 
var storage = AvatarStorage({
    square: true,
    responsive: true,
    greyscale: true,
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
    router.post('/', upload.single(process.env.AVATAR_FIELD), function (req, res, next) {

        var files;
        var file = req.file.filename;
        var matches = file.match(/^(.+?)_.+?\.(.+)$/i);

        if (matches) {
            files = _.map(['lg', 'md', 'sm'], function (size) {
                return matches[1] + '_' + size + '.' + matches[2];
            });
        } else {
            files = [file];
        }

        files = _.map(files, function (file) {
            var port = req.app.get('http-port') ? req.app.get('http-port') : req.app.get('https-port');
            var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
            var url = path.join(req.file.baseUrl, file).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

            return (req.file.storage == 'local' ? base : '') + '/' + url;
        });

        res.json({ images: files });

    });

    app.use('/upload', router);
};