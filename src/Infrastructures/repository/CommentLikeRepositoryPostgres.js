import CommentLikeRepository from '../../Domains/likes/CommentLikeRepository.js';

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyUserCommentLike(commentId, owner) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    return Boolean(result.rowCount);
  }

  async getLikesByThreadId(threadId) {
    const query = {
      text: `SELECT user_comment_likes.id, user_comment_likes.comment_id, user_comment_likes.owner
             FROM user_comment_likes
             INNER JOIN comments ON user_comment_likes.comment_id = comments.id
             WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default CommentLikeRepositoryPostgres;

