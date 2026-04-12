const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.tflite': 'application/octet-stream',
  '.binarypb': 'application/octet-stream'
};

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(body);
}

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relativePath = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\/+/, '');
  const fullPath = path.resolve(root, relativePath);
  if (!fullPath.startsWith(root)) return null;
  return fullPath;
}

const server = http.createServer((req, res) => {
  const requestedPath = resolvePath(req.url);
  if (!requestedPath) {
    send(res, 403, 'forbidden');
    return;
  }

  fs.stat(requestedPath, (statErr, stats) => {
    if (statErr) {
      send(res, 404, 'not found');
      return;
    }

    const filePath = stats.isDirectory() ? path.join(requestedPath, 'index.html') : requestedPath;
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        send(res, 404, 'not found');
        return;
      }

      const contentType = mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      send(res, 200, data, contentType);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}`);
});
