/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const { URL } = require('url');

const server = http.createServer(((req, res) => {
    const trimmedPath = req.url.replace(/^\/+|\/$/g, '');
    res.end('Hello World!\n');
    console.log('Request received on path: ' + trimmedPath);
}));

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});