const uploadFile = require("../middleware/uploadNew");
const path = require("path");
const fs = require("fs");
const baseUrl = "http://localhost:3800/public/files/";

exports.upload = async (req, res, next) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        next();

    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

exports.update = async (req, res, next) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        next();

    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

exports.getListFiles = (req, res) => {
    const directoryPath = path.join(__basedir, "/public/files/");

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

exports.getFile = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__basedir, req.body.directory);

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({ message: "Unable to scan files!" });
        }

        const file = files.find(file => file === fileName);

        if (file)
            res.status(200).json({ name: file, url: baseUrl + file, });
        else
            res.status(403).json({ message: `No se encontro el archivo: ${fileName}` });
    });
};

exports.download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__basedir, "/public/files/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

exports.remove = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__basedir, "/public/files/");

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }

        res.status(200).send({
            message: "File is deleted.",
        });
    });
};

exports.removeSync = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__basedir, "/public/files/");

    try {
        fs.unlinkSync(directoryPath + fileName);

        res.status(200).send({
            message: "File is deleted.",
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete the file. " + err,
        });
    }
};