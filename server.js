const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Commission processing endpoint (server-side stub)
  if (req.method === 'POST' && req.url === '/process-commission') {
    // Simple body parsing
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Protect against large payloads
      if (body.length > 1e6) req.connection.destroy();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Simple shared-secret header validation (set COMMISSION_SECRET env var)
        const secret = req.headers['x-commission-secret'] || process.env.COMMISSION_SECRET || 'localdevsecret';
        if (!secret || secret !== (process.env.COMMISSION_SECRET || 'localdevsecret')) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Forbidden' }));
          return;
        }

        // Validate payload
        const visitId = payload.visitId || null;
        const conversionValue = Number(payload.conversionValue) || 0;

        if (!visitId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'visitId required' }));
          return;
        }

        // Commission calculation MUST be done server-side with Firebase Admin in production.
        // This stub calculates 10% locally and returns the result for demonstration.
        const commission = parseFloat((conversionValue * 0.10).toFixed(2));

        console.log('Processed commission for visit:', visitId, 'value:', conversionValue, 'commission:', commission);

        // Respond with calculated commission. In production this endpoint would
        // update Firestore using the Firebase Admin SDK and update partner stats atomically.
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ visitId, conversionValue, commission, status: 'calculated' }));
      } catch (e) {
        console.error('Error processing commission request', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // Serve static files (fallback to index)
  let filePath;
  if (req.url === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    // strip query string
    const cleanUrl = req.url.split('?')[0];
    filePath = path.join(__dirname, cleanUrl);
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, serve 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1><p><a href="/">Return to homepage</a></p>');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
