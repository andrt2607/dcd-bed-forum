import DetailThread from '../../Domains/threads/entities/DetailThread.js';
import DetailComment from '../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';

class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    const likes = await this._commentLikeRepository.getLikesByThreadId(threadId);

    const formattedComments = comments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new DetailReply({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
          isDelete: reply.is_delete,
        }));

      const likeCount = likes.filter((like) => like.comment_id === comment.id).length;

      return new DetailComment({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        isDelete: comment.is_delete,
        replies: commentReplies,
        likeCount,
      });
    });

    return new DetailThread({
      ...thread,
      comments: formattedComments,
    });
  }
}

export default GetThreadDetailUseCase;
