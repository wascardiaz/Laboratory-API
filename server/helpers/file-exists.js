var fs = require('fs');

module.exports = { fileExists, getFile };

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

function getFile(filename, directoryPath, baseUrl = 'http://localhost:3800/api/') {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.log(err);
            return err;
        }

        const file = files.find(file => file === filename);

        if (file)
            return baseUrl + file;
        else
            return null;
    });
};