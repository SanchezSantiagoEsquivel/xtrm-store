// Sirve las functions de api/ como un server plano de Node para desarrollo local
// con `vite dev` (que no sabe nada de serverless functions). `vercel dev` haría
// esto mismo, pero su rewrite SPA de vercel.json rompe las peticiones internas
// de Vite — ver docs/TODO.md. Solo para dev/tests, no se usa en producción
// (ahí Vercel sirve api/ nativamente).
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const port = process.env.API_SHIM_PORT || 3011;
const apiDir = join(import.meta.dirname, '..', 'api');

const routes = {
  '/api/wompi-integrity': (await import(pathToFileURL(join(apiDir, 'wompi-integrity.js')))).default,
};

const server = createServer(async (req, res) => {
  const handler = routes[req.url.split('?')[0]];
  if (!handler) {
    res.statusCode = 404;
    res.end('not found');
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    req.body = raw ? JSON.parse(raw) : {};
  } catch {
    req.body = {};
  }

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  try {
    await handler(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(port, () => console.log(`[api-shim] escuchando en :${port}`));
