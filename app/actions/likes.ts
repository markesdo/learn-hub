'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface LikeData {
  likeCount: number;
  isLiked: boolean;
}

/**
 * Toggle like/unlike for a resource
 */
export async function toggleLike(resourceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to like resources' };
  }

  // Check if user already liked this resource
  const { data: existingLike, error: checkError } = await supabase
    .from('resource_likes')
    .select('id')
    .eq('resource_id', resourceId)
    .eq('user_id', user.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "not found" which is fine
    console.error('Error checking like status:', checkError);
    return { success: false, error: 'Failed to check like status' };
  }

  if (existingLike) {
    // Unlike: Delete the like
    const { error: deleteError } = await supabase
      .from('resource_likes')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error('Error unliking resource:', deleteError);
      return { success: false, error: 'Failed to unlike resource' };
    }
  } else {
    // Like: Insert new like
    const { error: insertError } = await supabase
      .from('resource_likes')
      .insert({
        resource_id: resourceId,
        user_id: user.id,
      });

    if (insertError) {
      console.error('Error liking resource:', insertError);
      return { success: false, error: 'Failed to like resource' };
    }
  }

  // Revalidate paths
  revalidatePath(`/resource/${resourceId}`);
  revalidatePath('/resources');
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Get like count and user's like status for a resource
 */
export async function getLikeData(resourceId: string): Promise<LikeData> {
  const supabase = await createClient();

  // Get total like count
  const { count, error: countError } = await supabase
    .from('resource_likes')
    .select('*', { count: 'exact', head: true })
    .eq('resource_id', resourceId);

  if (countError) {
    console.error('Error fetching like count:', countError);
    return { likeCount: 0, isLiked: false };
  }

  // Get user's like status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isLiked = false;
  if (user) {
    const { data: userLike, error: userLikeError } = await supabase
      .from('resource_likes')
      .select('id')
      .eq('resource_id', resourceId)
      .eq('user_id', user.id)
      .single();

    if (!userLikeError && userLike) {
      isLiked = true;
    }
  }

  return {
    likeCount: count || 0,
    isLiked,
  };
}

/**
 * Get like count for multiple resources (for card displays)
 */
export async function getLikeCounts(resourceIds: string[]): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resource_likes')
    .select('resource_id')
    .in('resource_id', resourceIds);

  if (error) {
    console.error('Error fetching like counts:', error);
    return {};
  }

  // Count likes per resource
  const counts: Record<string, number> = {};
  for (const like of data || []) {
    counts[like.resource_id] = (counts[like.resource_id] || 0) + 1;
  }

  return counts;
}

