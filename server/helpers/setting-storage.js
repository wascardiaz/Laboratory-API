// Load dependencies
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Jimp = require('jimp');
var crypto = require('crypto');
var mkdirp = require('mkdirp');
var concat = require('concat-stream');
var streamifier = require('streamifier');

// Configure UPLOAD_PATH
// process.env.AVATAR_STORAGE contains uploads/avatars
var UPLOAD_PATH = path.resolve(__dirname, '..', process.env.IMAGES_SETTING_STORAGE);

// crear un motor de almacenamiento múltiple
var AvatarStorage = function (options) {
    // Esto sirve como constructor
    function AvatarStorage(opts) {

        var baseUrl = process.env.IMAGES_SETTING_BASE_URL;

        var allowedStorageSystems = ['local'];
        var allowedOutputFormats = ['jpg', 'png'];

        // respaldo para las opciones
        var defaultOptions = {
            storage: 'local',
            output: 'png',
            greyscale: false,
            quality: 70,
            square: false,
            threshold: 500,
            responsive: false,
        };

        // ampliar las opciones predeterminadas con opciones pasadas
        var options = (opts && _.isObject(opts)) ? _.pick(opts, _.keys(defaultOptions)) : {};
        options = _.extend(defaultOptions, options);

        // verifique las opciones para los valores correctos y use el valor de reserva cuando sea necesario
        this.options = _.forIn(options, function (value, key, object) {

            switch (key) {
                case 'square':
                case 'greyscale':
                case 'responsive':
                    object[key] = _.isBoolean(value) ? value : defaultOptions[key];
                    break;

                case 'storage':
                    value = String(value).toLowerCase();
                    object[key] = _.includes(allowedStorageSystems, value) ? value : defaultOptions[key];
                    break;

                case 'output':
                    value = String(value).toLowerCase();
                    object[key] = _.includes(allowedOutputFormats, value) ? value : defaultOptions[key];
                    break;

                case 'quality':
                    value = _.isFinite(value) ? value : Number(value);
                    object[key] = (value && value >= 0 && value <= 100) ? value : defaultOptions[key];
                    break;

                case 'threshold':
                    value = _.isFinite(value) ? value : Number(value);
                    object[key] = (value && value >= 0) ? value : defaultOptions[key];
                    break;

            }

        });

        // establecer la ruta de carga
        this.uploadPath = this.options.responsive ? path.join(UPLOAD_PATH, 'responsive') : UPLOAD_PATH;

        // establecer la URL base de carga
        this.uploadBaseUrl = this.options.responsive ? path.join(baseUrl, 'responsive') : baseUrl;

        if (this.options.storage == 'local') {
            // si la ruta de carga no existe, cree la estructura de la ruta de carga
            !fs.existsSync(this.uploadPath) && mkdirp.sync(this.uploadPath);
        }

    }

    // esto genera un nombre de archivo criptográfico aleatorio
    AvatarStorage.prototype._generateRandomFilename = function () {
        // crear bytes pseudoaleatorios
        var bytes = crypto.pseudoRandomBytes(32);

        // crear el hash md5 de los bytes aleatorios
        var checksum = crypto.createHash('MD5').update(bytes).digest('hex');

        // devolver como nombre de archivo el hash con la extensión de salida
        return checksum + '.' + this.options.output;
    };

    // esto crea una secuencia de escritura para una ruta de archivo
    AvatarStorage.prototype._createOutputStream = function (filepath, cb) {

        // crear una referencia para que esto se use en funciones locales
        var that = this;

        // crear una secuencia de escritura desde la ruta del archivo
        var output = fs.createWriteStream(filepath);

        // establecer callback fn como controlador para el evento de error
        output.on('error', cb);

        // establecer controlador para el evento final
        output.on('finish', function () {
            cb(null, {
                destination: that.uploadPath,
                baseUrl: that.uploadBaseUrl,
                filename: path.basename(filepath),
                storage: that.options.storage
            });
        });

        // devolver el flujo de salida
        return output;
    };

    // esto procesa el búfer de imagen Jimp
    AvatarStorage.prototype._processImage = function (image, cb) {

        // crear una referencia para que esto se use en funciones locales
        var that = this;

        var batch = [];

        // los tamaños sensibles
        var sizes = ['lg', 'md', 'sm'];

        var filename = this._generateRandomFilename();

        var mime = Jimp.MIME_PNG;

        // crear un clon de la imagen de Jimp
        var clone = image.clone();

        // obtener las dimensiones de la imagen de Jimp
        var width = clone.bitmap.width;
        var height = clone.bitmap.height;
        var square = Math.min(width, height);
        var threshold = this.options.threshold;

        // resuelve el tipo mime de salida de Jimp
        switch (this.options.output) {
            case 'jpg':
                mime = Jimp.MIME_JPEG;
                break;
            case 'png':
            default:
                mime = Jimp.MIME_PNG;
                break;
        }

        // escalar automáticamente las dimensiones de la imagen para ajustarse al requisito de umbral
        if (threshold && square > threshold) {
            clone = (square == width) ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
        }

        // recortar la imagen a un cuadrado si está habilitado
        if (this.options.square) {

            if (threshold) {
                square = Math.min(square, threshold);
            }

            // obtener las nuevas dimensiones de la imagen y recortar
            clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
        }

        // convertir la imagen a escala de grises si está habilitado
        if (this.options.greyscale) {
            clone = clone.greyscale();
        }

        // establecer la calidad de salida de la imagen
        clone = clone.quality(this.options.quality);

        if (this.options.responsive) {

            // mapee a través de los tamaños receptivos y empújelos al lote
            batch = _.map(sizes, function (size) {

                var outputStream;

                var image = null;
                var filepath = filename.split('.');

                // cree la ruta de archivo completa y cree un flujo de escritura para él
                filepath = filepath[0] + '_' + size + '.' + filepath[1];
                filepath = path.join(that.uploadPath, filepath);
                outputStream = that._createOutputStream(filepath, cb);

                // escalar la imagen según el tamaño
                switch (size) {
                    case 'sm':
                        image = clone.clone().scale(0.3);
                        break;
                    case 'md':
                        image = clone.clone().scale(0.7);
                        break;
                    case 'lg':
                        image = clone.clone();
                        break;
                }

                // devolver un objeto de la corriente y la imagen de Jimp
                return {
                    stream: outputStream,
                    image: image
                };
            });

        } else {

            // empujar un objeto de la secuencia grabable y la imagen de Jimp al lote
            batch.push({
                stream: that._createOutputStream(path.join(that.uploadPath, filename), cb),
                image: clone
            });

        }

        // procesar la secuencia por lotes
        _.each(batch, function (current) {
            // obtener el búfer de la imagen de Jimp usando el tipo mimo de salida
            current.image.getBuffer(mime, function (err, buffer) {
                if (that.options.storage == 'local') {
                    // crear un flujo de lectura desde el búfer y canalizarlo al flujo de salida
                    streamifier.createReadStream(buffer).pipe(current.stream);
                }
            });
        });

    };

    // multer requiere esto para manejar el archivo cargado
    AvatarStorage.prototype._handleFile = function (req, file, cb) {

        // crear una referencia para que esto se use en funciones locales
        var that = this;

        // cree un flujo grabable usando concat-stream que 
        // concatenará todos los búferes escritos en él y pasará el búfer 
        // completo a una devolución de llamada fn
        var fileManipulate = concat(function (imageData) {

            // leer el búfer de imagen con Jimp
            // devuelve una promesa
            Jimp.read(imageData)
                .then(function (image) {
                    // procesar el búfer de imagen Jimp
                    that._processImage(image, cb);
                })
                .catch(cb);
        });

        // escribir el búfer del archivo cargado en la secuencia fileManipulate
        file.stream.pipe(fileManipulate);

    };

    // multer requiere esto para destruir el archivo
    AvatarStorage.prototype._removeFile = function (req, file, cb) {

        var matches, pathsplit;
        var filename = file.filename;
        var _path = path.join(this.uploadPath, filename);
        var paths = [];

        // eliminar las propiedades del archivo
        delete file.filename;
        delete file.destination;
        delete file.baseUrl;
        delete file.storage;

        // crear rutas para imágenes receptivas
        if (this.options.responsive) {
            pathsplit = _path.split('/');
            matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

            if (matches) {
                paths = _.map(['lg', 'md', 'sm'], function (size) {
                    return pathsplit.join('/') + '/' + (matches[1] + '_' + size + '.' + matches[2]);
                });
            }
        } else {
            paths = [_path];
        }

        // eliminar los archivos del sistema de archivos
        _.each(paths, function (_path) {
            fs.unlink(_path, cb);
        });

    };

    // crea una nueva instancia con las opciones pasadas y devuélvela
    return new AvatarStorage(options);

};

// exportar el motor de almacenamiento
module.exports = AvatarStorage;