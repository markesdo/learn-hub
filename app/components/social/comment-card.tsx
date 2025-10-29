'use client';

import { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { updateComment, deleteComment } from '@/app/actions/comments';
import type { Comment } from '@/app/actions/comments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentCardProps {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (commentId: string) => void;
}

export function CommentCard({ comment, currentUserId, onDelete }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUserId === comment.user_id;
  const maxLength = 1000;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSave = async () => {
    if (editContent.trim().length === 0 || editContent.length > maxLength) {
      setError('Comment must be between 1 and 1000 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await updateComment(comment.id, editContent);

    if (result.success) {
      setIsEditing(false);
      comment.content = editContent;
    } else {
      setError(result.error || 'Failed to update comment');
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsLoading(true);
    const result = await deleteComment(comment.id);

    if (result.success) {
      onDelete(comment.id);
    } else {
      setError(result.error || 'Failed to delete comment');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            @{comment.user.username}
          </span>
          <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(comment.created_at)}
          </span>
        </div>
        {isOwner && !isEditing && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={maxLength}
            rows={3}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {maxLength - editContent.length} characters remaining
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading || editContent.trim().length === 0}
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}
    </div>
  );
}

