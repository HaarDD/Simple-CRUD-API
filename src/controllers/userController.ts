/* eslint-disable no-console */
// src/controllers/userController.ts
import { IncomingMessage, ServerResponse } from 'http';
import { createUser, User } from '../models/User';
import { parseRequestBody, validateUuid } from '../utils/helpers';

export const getUsers = (store: any) => (_req: IncomingMessage, res: ServerResponse): void => {
  const users = store.getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUser = (store: any) => (_req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): void => {
  try {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return;
    }

    const user = store.getUserById(id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } catch (error) {
    let errorMessage = 'Server error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: errorMessage }));
  }
};

export const createUserHandler = (store: any) => async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    parseRequestBody(req, async (body) => {
      if (!body.username || typeof body.age !== 'number' || !Array.isArray(body.hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        return;
      }

      const newUser = createUser(body.username, body.age, body.hobbies);
      const userAdded = await store.addUser(newUser);
      if (userAdded) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } else {
        throw new Error('Failed to add user');
      }
    });
  } catch (error) {
    let errorMessage = 'Server error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: errorMessage }));
  }
};

export const updateUserHandler = (store: any) => async (req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): Promise<void> => {
  try {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return;
    }

    parseRequestBody(req, async (body) => {
      const { username, age, hobbies } = body;
      if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing or invalid fields' }));
        return;
      }

      const existingUser = store.getUserById(id);
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

      const isUpdated = await store.updateUser(id, updatedUser);
      if (isUpdated) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } else {
        throw new Error('Failed to update user');
      }
    });
  } catch (error) {
    let errorMessage = 'Server error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: errorMessage }));
  }
};

export const deleteUserHandler = (store: any) => async (_req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): Promise<void> => {
  try {
    const id = params?.id;
    if (!id || !validateUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid UUID' }));
      return;
    }

    const userExists = store.getUserById(id);
    if (!userExists) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    const isDeleted = await store.deleteUser(id);
    if (isDeleted) {
      res.writeHead(204);
      res.end();
    } else {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    let errorMessage = 'Server error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error', error: errorMessage }));
  }
};
