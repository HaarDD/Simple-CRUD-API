import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUser, createUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController';

type RouteHandler = (req: IncomingMessage, res: ServerResponse, params: Record<string, string>) => void;

interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
}

const routes: Route[] = [
  { method: 'GET', path: '/api/users', handler: getUsers },
  { method: 'GET', path: '/api/users/:id', handler: getUser },
  { method: 'POST', path: '/api/users', handler: createUserHandler },
  { method: 'PUT', path: '/api/users/:id', handler: updateUserHandler },
  { method: 'DELETE', path: '/api/users/:id', handler: deleteUserHandler },
];

const matchRoute = (method: string, url: string): { handler: RouteHandler; params: Record<string, string> } | null => {
  for (const route of routes) {
    if (route.method === method) {
      const pathPattern = route.path.replace(/:\w+/g, '([^/]+)');
      const regex = new RegExp(`^${pathPattern}$`);
      const match = url.match(regex);
      if (match) {
        const params: Record<string, string> = {};
        const keys = route.path.match(/:\w+/g);
        if (keys) {
          keys.forEach((key, index) => {
            const paramValue = match[index + 1];
            if (paramValue !== undefined) {
              params[key.substring(1)] = paramValue;
            }
          });
        }
        return {
          handler: route.handler,
          params,
        };
      }
    }
  }
  return null;
};

export const router = (req: IncomingMessage, res: ServerResponse): void => {
  const { method, url } = req;

  if (!url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid URL' }));
    return;
  }

  const route = matchRoute(method!, url);

  if (route) {
    route.handler(req, res, route.params);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};
