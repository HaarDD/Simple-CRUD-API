// src/ipc.ts
import cluster from 'cluster';

interface Message {
  type: string;
  payload?: any;
}

export const notifyWorkers = async (message: Message) => {
  if (cluster.isPrimary) {
    for (const id in cluster.workers) {
      cluster.workers[id]?.send(message);
    }
  }
};

export const handleWorkerMessages = (callback: (message: Message) => void) => {
  if (!cluster.isPrimary) {
    process.on('message', (message: Message) => {
      callback(message);
    });
  }
};
