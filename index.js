/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const url = require('url');

const server = http.createServer(((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/$/g, '');
    const method = req.method.toUpperCase();
    const queryStringObject = parsedUrl.query;
    res.end('Hello World!\n');
    console.log(`Request received on path ${trimmedPath} with ${method} method and`, queryStringObject);
}));

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});