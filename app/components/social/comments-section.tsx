'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { MessageCircle } from 'lucide-react';
import { createComment } from '@/app/actions/comments';
import type { Comment } from '@/app/actions/comments';
import { CommentCard } from './comment-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommentsSectionProps {
  resourceId: string;
  initialComments: Comment[];
  currentUserId: string | null;
}

export function CommentsSection({
  resourceId,
  initialComments,
  currentUserId,
}: CommentsSectionProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [...state, newComment]
  );

  const maxLength = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      setError('Please sign in to comment');
      return;
    }

    if (content.trim().length === 0) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > maxLength) {
      setError(`Comment must be at most ${maxLength} characters`);
      return;
    }

    setError(null);
    const commentContent = content.trim();
    setContent('');

    startTransition(async () => {
      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        resource_id: resourceId,
        user_id: currentUserId,
        content: commentContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: currentUserId,
          username: 'You', // Will be replaced with actual username
        },
      };

      addOptimisticComment(optimisticComment);

      const result = await createComment(resourceId, commentContent);

      if (!result.success) {
        setError(result.error || 'Failed to post comment');
        setContent(commentContent); // Restore content on error
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    // Optimistically remove from list
    // The page will revalidate and update
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">
          Comments ({optimisticComments.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="comment">Add a comment</Label>
            <Textarea
              id="comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              maxLength={maxLength}
              disabled={isPending}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                {maxLength - content.length} characters remaining
              </span>
              {error && (
                <span className="text-xs text-red-600">{error}</span>
              )}
            </div>
          </div>
          <Button type="submit" disabled={isPending || content.trim().length === 0}>
            {isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {optimisticComments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
            <MessageCircle className="mx-auto h-12 w-12 text-zinc-400" />
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          optimisticComments.map((comment, index) => (
            <div key={comment.id} className="animate-slide-in-up">
              <CommentCard
                comment={comment}
                currentUserId={currentUserId}
                onDelete={handleDeleteComment}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

