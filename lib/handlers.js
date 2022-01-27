const _data = require('./data');
const helpers = require('./helpers');
const fs = require("fs");

const handlers = {};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => callback(404);

handlers.users = (data, callback) => {
    const method = data.method.toLowerCase();
    const acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.includes(method)) {
        handlers._users[method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};
handlers._users.post = (data, callback) => {
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10
        ? data.payload.phone.trim()
        : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 5
        ? data.payload.password.trim()
        : false;
    const tosAgreement = typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true
        ? data.payload.tosAgreement
        : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        if (!_data.checkRecordExists('users', phone)) {
            const hashedPassword = helpers.hash(password);
            if (hashedPassword) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    hashedPassword,
                    tosAgreement,
                }
                _data.writePromise('users', phone, userObject)
                    .then(callback(201))
                    .catch(error => {
                        console.error(error);
                        callback(500, {Error: 'Could not create the new user.'})
                    });
            } else {
                callback(500, {Error: 'Could not create user\'s password.'})
            }
        } else {
            callback(422, {Error: 'A user with that phone number already exists.'});
        }
    } else {
        callback(422, {Error: 'Missing required fields.'})
    }
};
handlers._users.get = (data, callback) => {
    const phone = typeof (data.queryStringObject.phone) === 'string'
    && data.queryStringObject.phone.trim().length === 10
        ? data.queryStringObject.phone.trim()
        : false;
    if (phone) {
        _data.readPromise('users', phone).then(response => {
            delete response.hashedPassword;
            callback(200, response);
        }).catch(error => {
            console.log(error);
            callback(404);
        });
    } else {
        callback(422, {Error: 'Missing required field.'})
    }
};
handlers._users.put = (data, callback) => {
    const phone = typeof (data.payload.phone) === 'string'
    && data.payload.phone.trim().length === 10
        ? data.payload.phone.trim()
        : false;
    const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;
    const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;
    const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 5
        ? data.payload.password.trim()
        : false;
    if (phone) {
        if (firstName || lastName || password) {
            _data.readPromise('users', phone).then(response => {
                const userData = JSON.parse(response);
                if (typeof (userData) === "object") {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    _data.updatePromise('users', phone, userData).then(() => {
                        callback(200, userData);
                    }).catch(error => {
                        console.log(error);
                        callback(500, {Error: 'Could not update the user.'});
                    })
                } else {
                    callback(500, {Error: 'Could not read the user data.'});
                }
            }).catch(() => {
                callback(404, {Error: 'The specified user does not exist.'});
            });
        } else {
            callback(422, {Error: 'Missing fields to update.'})
        }
    } else {
        callback(422, {Error: 'Missing required field.'});
    }
};
handlers._users.delete = (data, callback) => {
    const phone = typeof (data.queryStringObject.phone) === 'string'
    && data.queryStringObject.phone.trim().length === 10
        ? data.queryStringObject.phone.trim()
        : false;
    if (phone) {
        if (_data.checkRecordExists('users', phone)) {
            _data.deletePromise('users', phone).then(() => {
                callback(204);
            }).catch(error => {
                console.log(error);
                callback(500, {Error: 'Could not delete the specified user.'});
            });
        } else {
            callback(404, {Error: 'The specified user does not exist.'});
        }
    } else {
        callback(422, {Error: 'Missing required field.'});
    }
};

module.exports = handlers;