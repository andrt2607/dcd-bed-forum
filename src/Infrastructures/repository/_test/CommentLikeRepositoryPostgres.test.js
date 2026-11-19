/* eslint-disable camelcase */
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres.js';

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like to database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikesById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper
        .findLikesByCommentIdAndOwner('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyUserCommentLike function', () => {
    it('should return false when user has not liked comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres
        .verifyUserCommentLike('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(false);
    });

    it('should return true when user has liked comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres
        .verifyUserCommentLike('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(true);
    });
  });

  describe('getLikesByThreadId function', () => {
    it('should return likes by threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      await CommentLikesTableTestHelper.addLike({
        id: 'like-456',
        commentId: 'comment-123',
        owner: 'user-456',
      });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likes = await commentLikeRepositoryPostgres.getLikesByThreadId('thread-123');

      // Assert
      expect(likes).toStrictEqual([
        {
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
        {
          id: 'like-456',
          comment_id: 'comment-123',
          owner: 'user-456',
        },
      ]);
    });
  });
});

