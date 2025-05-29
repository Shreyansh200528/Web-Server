const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function getContentType(filePath) {
  const ext = path.extname(filePath);
  return mimeTypes[ext] || 'text/plain';
}

function getFormattedTimestamp() {
  return new Date().toString();
}

function log(level, message) {
  console.log(`[${level}] ${getFormattedTimestamp()} - ${message}`);
}

function normalizeIp(addr) {
  if (!addr) return '127.0.0.1';
  if (addr === '::1') return '127.0.0.1';
  if (addr.startsWith('::ffff:')) return addr.slice(7);
  return addr;
}

const sockets = new Set();

function serveErrorPage(res, code, fileName, logMessage) {
  const errorPagePath = path.join(__dirname, 'error', fileName);
  fs.readFile(errorPagePath, (err, data) => {
    res.writeHead(code, {
      'Content-Type': 'text/html',
      'Connection': 'close'
    });
    res.end(err ? `<h1>${code} ${logMessage}</h1>` : data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/') pathname = '/index.html';
  if (pathname.endsWith('/')) pathname += 'index.html';

  const filePath = path.join(__dirname, 'www', pathname);
  const method = req.method;
  const httpVersion = req.httpVersion;
  const clientIp = normalizeIp(req.socket.remoteAddress);
  const clientPort = req.socket.remotePort;

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      const code = err.code === 'ENOENT' ? 404 : 403;
      const statusText = code === 404 ? 'Not Found' : 'Forbidden';
      const errorFile = code === 404 ? '404.html' : '403.html';

      serveErrorPage(res, code, errorFile, statusText);
      log('ERROR', `${clientIp}:${clientPort} - "${method} ${pathname} HTTP/${httpVersion}" - ${code} ${statusText}`);
      return;
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        serveErrorPage(res, 403, '403.html', 'Forbidden');
        log('ERROR', `${clientIp}:${clientPort} - "${method} ${pathname} HTTP/${httpVersion}" - 403 Forbidden`);
        return;
      }

      res.writeHead(200, {
        'Content-Type': getContentType(filePath),
        'Content-Length': data.length,
        'Connection': 'close'
      });
      res.end(data);

      log('INFO', `${clientIp}:${clientPort} - "${method} ${pathname} HTTP/${httpVersion}" - 200 OK`);
    });
  });
});

server.on('connection', (socket) => {
  sockets.add(socket);
  socket.on('close', () => sockets.delete(socket));

  const clientIp = normalizeIp(socket.remoteAddress);
  const clientPort = socket.remotePort;
  log('INFO', `Accepted connection from ${clientIp}:${clientPort}`);
});

server.listen(PORT, () => {
  log('INFO', `Server started. Listening on port ${PORT}`);
});

function handleShutdown() {
  log('INFO', 'Shutdown signal received.');

  server.close(() => {
    log('INFO', 'Server stopped accepting new connections.');

    for (const socket of sockets) {
      socket.destroy();
    }

    log('INFO', 'All client sockets closed. Exiting...');
    process.exit(0);
  });

  setTimeout(() => {
    log('ERROR', 'Force exiting after timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
