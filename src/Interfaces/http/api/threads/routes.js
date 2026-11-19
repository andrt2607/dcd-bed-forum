import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authenticateToken, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadByIdHandler);

  return router;
};

export default createThreadsRouter;

