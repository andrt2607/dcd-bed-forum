import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

const createRepliesRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post(
    '/:threadId/comments/:commentId/replies',
    authenticateToken,
    handler.postReplyHandler,
  );
  router.delete(
    '/:threadId/comments/:commentId/replies/:replyId',
    authenticateToken,
    handler.deleteReplyHandler,
  );

  return router;
};

export default createRepliesRouter;

