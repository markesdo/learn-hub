'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Comment } from '@/app/actions/comments';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSocialProps {
  resourceId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialComments: Comment[];
  userId: string | null;
}

interface UseRealtimeSocialReturn {
  likeCount: number;
  isLiked: boolean;
  comments: Comment[];
}

export function useRealtimeSocial({
  resourceId,
  initialLikeCount,
  initialIsLiked,
  initialComments,
  userId,
}: UseRealtimeSocialProps): UseRealtimeSocialReturn {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  useEffect(() => {
    console.log('🔵 Realtime hook initialized:');
    console.log('   resourceId:', resourceId);
    console.log('   userId:', userId);
    console.log('   initialLikeCount:', initialLikeCount);
    console.log('   initialIsLiked:', initialIsLiked);
    
    const supabase = createClient();
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Create a channel for this specific resource
      channel = supabase.channel(`resource:${resourceId}`);

      // Listen for likes INSERT events
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'resource_likes',
          filter: `resource_id=eq.${resourceId}`,
        },
        (payload) => {
          console.log('💚 Like added by user:', payload.new.user_id);
          setLikeCount((prev) => prev + 1);
          // Note: isLiked is managed locally by the LikeButton component
        }
      );

      // Listen for likes DELETE events
      channel.on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'resource_likes',
          filter: `resource_id=eq.${resourceId}`,
        },
        (payload) => {
          console.log('🔴 Like removed');
          setLikeCount((prev) => Math.max(0, prev - 1));
          // Note: isLiked is managed locally by the LikeButton component
        }
      );

      // Listen for comments INSERT events
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'resource_comments',
          filter: `resource_id=eq.${resourceId}`,
        },
        async (payload) => {
          // Fetch the complete comment with user info
          const { data: newComment } = await supabase
            .from('resource_comments')
            .select(`
              id,
              resource_id,
              user_id,
              content,
              created_at,
              updated_at,
              user:profiles!user_id (
                id,
                username
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (newComment) {
            const userData: any = newComment.user;
            const userInfo = Array.isArray(userData) ? userData[0] : userData;

            const comment: Comment = {
              id: newComment.id,
              resource_id: newComment.resource_id,
              user_id: newComment.user_id,
              content: newComment.content,
              created_at: newComment.created_at,
              updated_at: newComment.updated_at,
              user: {
                id: userInfo?.id || newComment.user_id,
                username: userInfo?.username || 'Unknown',
              },
            };

            setComments((prev) => {
              // Avoid duplicates (in case of optimistic update race)
              if (prev.some((c) => c.id === comment.id)) {
                return prev;
              }
              return [...prev, comment];
            });
          }
        }
      );

      // Listen for comments UPDATE events
      channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resource_comments',
          filter: `resource_id=eq.${resourceId}`,
        },
        (payload) => {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === payload.new.id
                ? {
                    ...comment,
                    content: payload.new.content,
                    updated_at: payload.new.updated_at,
                  }
                : comment
            )
          );
        }
      );

      // Listen for comments DELETE events
      channel.on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'resource_comments',
          filter: `resource_id=eq.${resourceId}`,
        },
        (payload) => {
          setComments((prev) => prev.filter((comment) => comment.id !== payload.old.id));
        }
      );

      // Subscribe to the channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to real-time updates for resource ${resourceId}`);
        }
      });
    };

    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`🔌 Unsubscribed from resource ${resourceId}`);
      }
    };
  }, [resourceId, userId]);

  // Update state when initial props change (for navigation)
  useEffect(() => {
    setLikeCount(initialLikeCount);
    setIsLiked(initialIsLiked);
    setComments(initialComments);
  }, [initialLikeCount, initialIsLiked, initialComments]);

  return {
    likeCount,
    isLiked,
    comments,
  };
}

