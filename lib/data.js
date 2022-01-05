const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '../.data/');

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (e) => {
                        if (!e) {
                            callback(false);
                        } else {
                            callback('Error closing new file.');
                        }
                    });
                } else {
                    callback('Error writing to new file.');
                }
            });
        } else {
            callback('Could not create file, it may already exist.');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (error, data) => {
        callback(error, data);
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, err => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, e => {
                        if (!e) {
                            fs.close(fileDescriptor, closeError => {
                                if (!closeError) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file.');
                                }
                            });
                        } else {
                            callback('Error writing to existing file.')
                        }
                    });
                } else {
                    callback('Error truncating file.');
                }
            });
        } else {
            callback('Could not open the file for updating. It may not exist yet.');
        }
    });
}

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback('Error deleting file.');
        }
    });
};

lib.readPromise = (dir, file) => fs.promises.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8');
lib.writePromise = (dir, file, data) => fs.promises.writeFile(`${lib.baseDir}${dir}/${file}.json`, JSON.stringify(data), {flag: 'wx'});

module.exports = lib;