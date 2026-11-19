import serverless from 'serverless-http';
import createServer from '../../src/Infrastructures/http/createServer.js';
import container from '../../src/Infrastructures/container.js';

let cachedHandler;

export const handler = async (event, context) => {
  if (!cachedHandler) {
    const app = await createServer(container);
    cachedHandler = serverless(app);
  }

  return cachedHandler(event, context);
};
