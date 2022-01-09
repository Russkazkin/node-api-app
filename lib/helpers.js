const crypto = require('crypto');
const config = require('../config');

const helpers = {};

module.exports = helpers;

helpers.hash = string => {
    if (typeof(string) === 'string' && string.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
    } else {
        return false;
    }
};

helpers.parseJsonToObject = string => {
    try {
        return JSON.parse(string);
    } catch (error) {
        return {};
    }
}