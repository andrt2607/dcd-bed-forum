class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);

    const isLiked = await this._commentLikeRepository.verifyUserCommentLike(commentId, owner);

    if (isLiked) {
      await this._commentLikeRepository.deleteLike(commentId, owner);
    } else {
      await this._commentLikeRepository.addLike(commentId, owner);
    }
  }

  _validatePayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ToggleCommentLikeUseCase;

