/* eslint-disable camelcase */
import { vi } from 'vitest';
import DetailThread from '../../../Domains/threads/entities/DetailThread.js';
import DetailComment from '../../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../../Domains/replies/entities/DetailReply.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentLikeRepository from '../../../Domains/likes/CommentLikeRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2021-08-08T08:00:00.000Z',
        content: 'komentar yang dihapus',
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: 'balasan yang dihapus',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_delete: true,
      },
      {
        id: 'reply-456',
        comment_id: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];

    const mockLikes = [
      {
        id: 'like-1',
        comment_id: 'comment-123',
        owner: 'user-123',
      },
      {
        id: 'like-2',
        comment_id: 'comment-123',
        owner: 'user-456',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));
    mockCommentLikeRepository.getLikesByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockLikes));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:59:18.982Z',
          content: 'sebuah comment',
          isDelete: false,
          likeCount: 2,
          replies: [
            new DetailReply({
              id: 'reply-123',
              content: 'balasan yang dihapus',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
              isDelete: true,
            }),
            new DetailReply({
              id: 'reply-456',
              content: 'sebuah balasan',
              date: '2021-08-08T08:07:01.522Z',
              username: 'dicoding',
              isDelete: false,
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T08:00:00.000Z',
          content: 'komentar yang dihapus',
          isDelete: true,
          likeCount: 0,
          replies: [],
        }),
      ],
    }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentLikeRepository.getLikesByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});
