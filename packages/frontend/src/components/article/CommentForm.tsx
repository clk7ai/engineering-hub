'use client';

import { useState, FormEvent } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  onSubmit,
  placeholder = 'Share your thoughts...',
  buttonText = 'Post Comment',
  autoFocus = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 1000) {
      setError('Comment is too long (max 1000 characters)');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = content.length;
  const isNearLimit = characterCount > 900;
  const isOverLimit = characterCount > 1000;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={isSubmitting}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#0A7FBF] focus:border-[#0A7FBF]'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          rows={4}
        />
        
        {/* Character Count */}
        {content && (
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${
            isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-400'
          }`}>
            {characterCount}/1000
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="hidden sm:inline">Markdown supported. </span>
          Be respectful and constructive.
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || isOverLimit}
          className="px-6 py-2 bg-[#0A7FBF] text-white rounded-lg hover:bg-[#0968A0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  );
}
