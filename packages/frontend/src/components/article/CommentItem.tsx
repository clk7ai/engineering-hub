'use client';

import { useState } from 'react';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  depth?: number;
  currentUserId?: string;
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  onLike,
  depth = 0,
  currentUserId
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);

  const isAuthor = currentUserId === comment.author._id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3; // Maximum nesting level

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment._id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      onDelete?.(comment._id);
    }
  };

  const formatDate = (date: string) => {
    const commentDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A7FBF] to-[#0968A0] flex items-center justify-center text-white font-semibold">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{comment.author.name}</span>
                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
            </div>

            {/* Content or Edit Form */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A7FBF] focus:border-transparent resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-[#0A7FBF] text-white rounded-lg hover:bg-[#0968A0] text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-2 text-sm">
              <button
                onClick={() => onLike?.(comment._id)}
                className={`flex items-center gap-1 hover:text-[#0A7FBF] transition-colors ${
                  comment.likes?.includes(currentUserId || '') ? 'text-[#0A7FBF] font-medium' : 'text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill={comment.likes?.includes(currentUserId || '') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{comment.likes?.length || 0}</span>
              </button>

              {depth < maxDepth && onReply && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-gray-600 hover:text-[#0A7FBF] transition-colors"
                >
                  Reply
                </button>
              )}

              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-[#0A7FBF] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}

              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-600 hover:text-[#0A7FBF] transition-colors flex items-center gap-1"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                </button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A7FBF] focus:border-transparent resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 bg-[#0A7FBF] text-white rounded-lg hover:bg-[#0968A0] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {hasReplies && showReplies && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  depth={depth + 1}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
