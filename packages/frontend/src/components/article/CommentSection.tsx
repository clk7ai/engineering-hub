'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { Comment } from '@/types';
import Loading from '../ui/Loading';

interface CommentSectionProps {
  articleId: string;
  currentUserId?: string;
}

export default function CommentSection({ articleId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('popular');

  useEffect(() => {
    fetchComments();
  }, [articleId, sortBy]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${articleId}/comments?sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to load comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (content: string) => {
    const response = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    await fetchComments();
  };

  const handleReply = async (commentId: string, content: string) => {
    const response = await fetch(`/api/comments/${commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to post reply');
    }

    await fetchComments();
  };

  const handleEdit = async (commentId: string, content: string) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }

    await fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    await fetchComments();
  };

  const handleLike = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to like comment');
    }

    await fetchComments();
  };

  const totalComments = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="mt-12 border-t pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({totalComments})
        </h2>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'popular'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'newest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'oldest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      {currentUserId ? (
        <div className="mb-8">
          <CommentForm onSubmit={handlePostComment} />
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-700 mb-3">Join the conversation!</p>
          <button className="px-6 py-2 bg-[#0A7FBF] text-white rounded-lg hover:bg-[#0968A0] font-medium">
            Sign in to comment
          </button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-6">
          <Loading.CommentSkeleton />
          <Loading.CommentSkeleton />
          <Loading.CommentSkeleton />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchComments}
            className="px-4 py-2 bg-[#0A7FBF] text-white rounded-lg hover:bg-[#0968A0]"
          >
            Try Again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-600">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
