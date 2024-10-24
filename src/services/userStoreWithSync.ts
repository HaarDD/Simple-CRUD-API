import { User } from '../models/User';
import { notifyWorkers, handleWorkerMessages } from '../utils/ipc';
import cluster from 'cluster';

const users: User[] = [];

export const addUser = async (user: User): Promise<boolean> => {
  users.push(user);
  await notifyWorkers({ type: 'ADD_USER', payload: user });
  return true;
};

export const updateUser = async (id: string, updatedUser: User): Promise<boolean> => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = updatedUser;
    await notifyWorkers({ type: 'UPDATE_USER', payload: updatedUser });
    return true;
  }
  return false;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    await notifyWorkers({ type: 'DELETE_USER', payload: id });
    return true;
  }
  return false;
};

export const getAllUsers = (): User[] => users;
export const getUserById = (id: string): User | undefined => users.find((user) => user.id === id);

if (!cluster.isPrimary) {
  handleWorkerMessages((message) => {
    switch (message.type) {
      case 'ADD_USER': {
        users.push(message.payload);
        break;
      }
      case 'UPDATE_USER': {
        const index = users.findIndex((user) => user.id === message.payload.id);
        if (index !== -1) users[index] = message.payload;
        break;
      }
      case 'DELETE_USER': {
        const userIndex = users.findIndex((user) => user.id === message.payload);
        if (userIndex !== -1) users.splice(userIndex, 1);
        break;
      }
    }
  });
}
