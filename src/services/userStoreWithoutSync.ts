/* eslint-disable no-console */
// src/services/userStoreWithoutSync.ts
import { User } from '../models/User';

const users: User[] = [];

export const addUser = (user: User): boolean => {
  
  users.push(user);
  return true;
};

export const updateUser = (id: string, updatedUser: User): boolean => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = updatedUser;
    return true;
  }
  return false;
};

export const deleteUser = (id: string): boolean => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

export const test = (): boolean => {
  return true;

};


export const getAllUsers = (): User[] => users;
export const getUserById = (id: string): User | undefined => users.find((user) => user.id === id);
