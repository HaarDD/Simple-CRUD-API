/* eslint-disable no-console */
// src/singleport.ts
import http from 'http';
import { router } from './routes/router';
import dotenv from 'dotenv';
import * as userStore from './services/userStoreWithoutSync';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  router(req, res, userStore);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});