const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");
const slugify = require('../helpers/slugify');
const { fileExists } = require('../helpers/file-exists');

const uploadDir = path.resolve(__dirname, '../', process.env.IMAGES_SETTING_STORAGE);

let storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, path.join(uploadDir)); },
  filename: (req, file, cb) => {
    // slugify file name
    var fileExtension = path.extname(file.originalname);
    var fileBase = path.basename(file.originalname, fileExtension);
    var fileSlug = slugify(fileBase) + fileExtension;

    // ensure file name is unique by adding a counter suffix if the file already exists
    var fileCounter = 0;
    while (fileExists(path.join(uploadDir, fileSlug))) {
      // increment counter until unused filename is found
      fileCounter += 1;
      fileSlug = slugify(fileBase) + '-' + fileCounter + fileExtension;
    }

    cb(null, fileSlug);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Solo se pueden cargar archivos de tipo imagenes!'), false);
  }
  cb(null, true)
}

let uploadFile = multer({
  imageFileFilter,
  storage: storage,
  limits: { fileSize: maxSize },
  // }).single("file");
}).array("uploads");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;