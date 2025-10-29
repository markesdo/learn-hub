'use client';

import { useState, useTransition, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/app/actions/likes';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  resourceId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  userId: string | null;
  onToggle?: (newIsLiked: boolean) => void;
}

export function LikeButton({ resourceId, initialLikeCount, initialIsLiked, userId, onToggle }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localIsLiked, setLocalIsLiked] = useState(initialIsLiked);

  // Sync local state when initialIsLiked changes (page load, navigation)
  useEffect(() => {
    console.log('🔵 LikeButton syncing state:');
    console.log('   initialIsLiked:', initialIsLiked);
    console.log('   setting localIsLiked to:', initialIsLiked);
    setLocalIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // Use real-time count, but local liked state
  const likeCount = initialLikeCount;
  const isLiked = localIsLiked;

  const handleToggleLike = () => {
    if (!userId) {
      setError('Please sign in to like resources');
      return;
    }

    setError(null);

    // Immediately toggle local state
    const newIsLiked = !localIsLiked;
    console.log('👆 User clicked like button:');
    console.log('   localIsLiked was:', localIsLiked);
    console.log('   setting to:', newIsLiked);
    setLocalIsLiked(newIsLiked);
    onToggle?.(newIsLiked);

    startTransition(async () => {
      // Server action
      const result = await toggleLike(resourceId);
      if (!result.success && result.error) {
        setError(result.error);
        // Revert on error
        console.log('❌ Error, reverting to:', !newIsLiked);
        setLocalIsLiked(!newIsLiked);
        onToggle?.(!newIsLiked);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleLike}
        disabled={isPending}
        className={`gap-1 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
      >
        <Heart
          className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
        />
        <span
          key={likeCount}
          className="font-medium animate-pulse-subtle"
        >
          {likeCount}
        </span>
      </Button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}

