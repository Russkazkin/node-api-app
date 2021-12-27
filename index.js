/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const buffer = require("buffer");

const server = http.createServer(((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/$/g, '');
    const method = req.method.toUpperCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    const decoder = new StringDecoder('utf-8');
    let payload = '';
    req.on('data', data => payload += decoder.write(data));
    req.on('end', () => {
        payload += decoder.end()
        const chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers: headersObject,
            payload: buffer,
        };
        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            payload = typeof(payload) === "object" ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(payloadString, 'payload');
            console.log(statusCode, 'status code');
        });
    });
}));

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});

const handlers = {};

handlers.sample = (data, callback) => {
    callback(406, { name: 'Sample Handler' });
};

handlers.notFound = (data, callback) => callback(404);

const router = {
    sample: handlers.sample,
};