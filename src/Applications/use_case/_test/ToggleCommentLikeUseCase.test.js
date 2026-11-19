import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentLikeRepository from '../../../Domains/likes/CommentLikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should throw error if use case payload not contain valid payload', async () => {
    // Arrange
    const useCasePayload = {};
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Action & Assert
    await expect(toggleCommentLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('TOGGLE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Action & Assert
    await expect(toggleCommentLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add like action correctly when user has not liked comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyUserCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyUserCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentLikeRepository.addLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestrating the delete like action correctly when user has liked comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyUserCommentLike = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyUserCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentLikeRepository.deleteLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});

