import http from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

// Query parameters: URL Stateful => filtros, paginação, buscas.
//ex: http://localhost:3333/users?userId=123

// Route parameters:
//ex: GET http://localhost:3333/users/1
//    DELETE http://localhost:3333/users/1

// Request body: Envio de informações de um formulário.

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url),
  );

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end('Not found');
});

server.listen(3333);
