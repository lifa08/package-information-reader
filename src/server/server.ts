import * as http from 'http';
import * as fs from 'fs';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('index.html', (err, json) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type',  'text/html');
            res.end(json);
        });
    } else if (req.url === '/data' && req.method === 'GET') {
        fs.readFile('statusJson.js', (err, json) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type',  'text/javascript');
            res.end(json);
        });
    } else {
        res.statusCode = 404;
        res.end('404: File Not Found');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});