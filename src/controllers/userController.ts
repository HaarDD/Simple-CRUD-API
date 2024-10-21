import { IncomingMessage, ServerResponse } from 'http';
import { createUser, User } from '../models/User';
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../services/database';
import { parseRequestBody, validateUuid } from '../utils/helpers';

export const getUsers = (_req: IncomingMessage, res: ServerResponse): void => {
  const users = getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUser = (_req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): void => {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID'+ id }));
      return;
    }
  
    const user = getUserById(id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  };

export const createUserHandler = (req: IncomingMessage, res: ServerResponse): void => {
  parseRequestBody(req, (body) => {
    if (!body.username || typeof body.age !== 'number' || !Array.isArray(body.hobbies)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Missing required fields' }));
      return;
    }

    const newUser = createUser(body.username, body.age, body.hobbies);
    addUser(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  });
};

export const updateUserHandler = (req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): void => {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return;
    }
  
    parseRequestBody(req, (body) => {
      const { username, age, hobbies } = body;
      if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing or invalid fields' }));
        return;
      }
  
      const existingUser = getUserById(id);
      if (!existingUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
  
      const updatedUser: User = {
        ...existingUser,
        username,
        age,
        hobbies,
      };
  
      const isUpdated = updateUser(id, updatedUser);
      if (isUpdated) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to update user' }));
      }
    });
  };

  export const deleteUserHandler = (_req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): void => {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return;
    }
  
    const userExists = getUserById(id);
    if (!userExists) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }
  
    const isDeleted = deleteUser(id);
    if (isDeleted) {
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Failed to delete user' }));
    }
  };