import http from 'http';
import { router } from './routes/router';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
