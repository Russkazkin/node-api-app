const fs = require('fs');
const path = require('path');
const helpers = require("./helpers");

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
        if (!error && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(error, data);
        }
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

lib.readPromise = (dir, file) => {
    return fs.promises.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8');
}
lib.writePromise = (dir, file, data) => fs.promises.writeFile(`${lib.baseDir}${dir}/${file}.json`, JSON.stringify(data), {flag: 'wx'});
lib.updatePromise = async (dir, file, data) => {
    const path = `${lib.baseDir}${dir}/${file}.json`;
    try {
        await fs.promises.truncate(path);
        return await fs.promises.writeFile(path, JSON.stringify(data), {flag: 'r+'});
    } catch (error) {
        throw error;
    }

}
lib.deletePromise = (dir, file) => fs.promises.unlink(`${lib.baseDir}${dir}/${file}.json`);

lib.checkRecordExists = (dir, file) => fs.existsSync(`${lib.baseDir}${dir}/${file}.json`);

module.exports = lib;