/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const { URL } = require('url');

const server = http.createServer(((req, res) => {
    const path = req.url.replace(/^\/+|\/$/g, '');
    const method = req.method.toUpperCase();
    res.end('Hello World!\n');
    console.log(`Request received on path ${path} with ${method} method`);
}));

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});