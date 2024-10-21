// src/cluster.ts
import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import * as userStoreWithSync from './services/userStoreWithSync';
import { router } from './routes/router';

const numCPUs = cpus().length;
const PORT = parseInt(process.env.PORT || '4000', 10);
let currentWorker = 0;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  const loadBalancer = http.createServer((req, res) => {
    const workerId = currentWorker % (numCPUs - 1) + 1;
    currentWorker++;
    const options = {
      hostname: 'localhost',
      port: PORT + workerId,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    req.pipe(proxyReq, { end: true });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, starting new worker`);
    cluster.fork();
  });
} else {
  const server = http.createServer((req, res) => {
    router(req, res, userStoreWithSync);
  });
  server.listen(PORT + cluster.worker!.id, () => {
    console.log(`Worker ${cluster.worker!.id} running on port ${PORT + cluster.worker!.id}`);
  });
}
