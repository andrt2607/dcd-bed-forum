import ToggleCommentLikeUseCase from '../../../../Applications/use_case/ToggleCommentLikeUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(req, res, next) {
    try {
      const { id: owner } = req.auth;
      const { threadId, commentId } = req.params;
      const toggleCommentLikeUseCase = this._container
        .getInstance(ToggleCommentLikeUseCase.name);

      await toggleCommentLikeUseCase.execute({
        threadId,
        commentId,
        owner,
      });

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;

