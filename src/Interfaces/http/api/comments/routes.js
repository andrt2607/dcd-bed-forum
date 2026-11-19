import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

const createCommentsRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/:threadId/comments', authenticateToken, handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authenticateToken, handler.deleteCommentHandler);

  return router;
};

export default createCommentsRouter;

