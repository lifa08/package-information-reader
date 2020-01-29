import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import {ServerResponse} from "http";

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;
const staticFilesPath = path.dirname(path.dirname(__dirname)) + "/public_html/";

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {
        sendFile(staticFilesPath, "index.html", 'text/html', res)
    }
    else if (req.url === '/index.css' && req.method === 'GET') {
        sendFile(staticFilesPath, "index.css", 'text/css', res)
    } else if (req.url === '/status.ts' && req.method === 'GET') {
        sendFile(staticFilesPath, "status.ts", 'text/javascript', res)
    } else if (req.url === '/app-bundle.js' && req.method === 'GET') {
        sendFile(staticFilesPath, "app-bundle.js", 'text/javascript', res)
    } else {
        res.statusCode = 404;
        res.end('404: File Not Found');
    }

});

function sendFile(
    filePath : string,
    fileName : string,
    contentType : string,
    res: ServerResponse) {
    fs.readFile(filePath + fileName, (err, data) => {
        if (err) throw err;
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    })
}



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});