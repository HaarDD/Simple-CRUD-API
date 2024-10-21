//src/routes/router.ts
import { IncomingMessage, ServerResponse } from 'http';
import {
  getUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController';

export const router = (req: IncomingMessage, res: ServerResponse, store: any): void => {
  const { method, url } = req;

  if (!url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid URL' }));
    return;
  }

  if (method === 'GET' && url === '/api/users') {
    getUsers(store)(req, res);
  } else if (method === 'GET' && /^\/api\/users\/\w+$/.test(url)) {
    const id = url.split('/')[3];
    if (id) {
      getUser(store)(req, res, { id });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid ID' }));
    }
  } else if (method === 'POST' && url === '/api/users') {
    createUserHandler(store)(req, res);
  } else if (method === 'PUT' && /^\/api\/users\/\w+$/.test(url)) {
    const id = url.split('/')[3];
    if (id) {
      updateUserHandler(store)(req, res, { id });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid ID' }));
    }
  } else if (method === 'DELETE' && /^\/api\/users\/\w+$/.test(url)) {
    const id = url.split('/')[3];
    if (id) {
      deleteUserHandler(store)(req, res, { id });
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid ID' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};