/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

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
        res.end('Hello World!\n');
        console.log(payload, 'payload');
    });
}));

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});