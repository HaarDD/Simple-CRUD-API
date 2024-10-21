import { IncomingMessage } from 'http';
import { validate as validateUuidv4 } from 'uuid';

export const parseRequestBody = (req: IncomingMessage, callback: (body: any) => void): void => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(JSON.parse(body));
  });
};

export const validateUuid = (id: string): boolean => validateUuidv4(id);
