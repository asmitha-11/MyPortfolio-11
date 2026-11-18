const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  // Strip query string and hashes
  let safePath = req.url.split('?')[0].split('#')[0];
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  // Prevent directory traversal attacks
  const normalizedPath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, normalizedPath);

  // Check if file is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    let targetPath = filePath;
    if (stats.isDirectory()) {
      targetPath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(targetPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`=================================================`);
    console.log(` Asmitha Developer Portfolio Server is running!`);
    console.log(` Local URL:   http://localhost:${portToTry}/`);
    console.log(` Press Ctrl+C in terminal to stop.`);
    console.log(`=================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT === 8080 ? 3000 : PORT + 1;
    console.log(`Port ${PORT} is already in use, trying http://localhost:${nextPort}/ instead...`);
    startServer(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);
