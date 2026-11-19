import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

const createLikesRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.put(
    '/:threadId/comments/:commentId/likes',
    authenticateToken,
    handler.putCommentLikeHandler,
  );

  return router;
};

export default createLikesRouter;

