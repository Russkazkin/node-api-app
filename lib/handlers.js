const handlers = {};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => callback(404);

handlers.users = (data, callback) => {

};

module.exports = handlers;