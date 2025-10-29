'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Comment {
  id: string;
  resource_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
  };
}

// Validation schema
const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters'),
});

/**
 * Get all comments for a resource with user information
 */
export async function getComments(resourceId: string): Promise<Comment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return (data || []).map((comment: any) => ({
    id: comment.id,
    resource_id: comment.resource_id,
    user_id: comment.user_id,
    content: comment.content,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    user: {
      id: Array.isArray(comment.user) ? comment.user[0]?.id : comment.user?.id,
      username: Array.isArray(comment.user) ? comment.user[0]?.username : comment.user?.username,
    },
  }));
}

/**
 * Create a new comment
 */
export async function createComment(
  resourceId: string,
  content: string
): Promise<{ success: boolean; error?: string; comment?: Comment }> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to comment' };
  }

  // Validate content
  const validationResult = commentSchema.safeParse({ content });

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.issues[0].message };
  }

  // Insert comment
  const { data, error } = await supabase
    .from('resource_comments')
    .insert({
      resource_id: resourceId,
      user_id: user.id,
      content: validationResult.data.content,
    })
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
    .single();

  if (error || !data) {
    console.error('Error creating comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }

  // Revalidate paths
  revalidatePath(`/resource/${resourceId}`);
  revalidatePath('/resources');
  revalidatePath('/dashboard');

  // Extract user data (Supabase can return it as array or object)
  const userData: any = data.user;
  const userInfo = Array.isArray(userData) ? userData[0] : userData;

  const comment: Comment = {
    id: data.id,
    resource_id: data.resource_id,
    user_id: data.user_id,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user: {
      id: userInfo?.id || data.user_id,
      username: userInfo?.username || 'Unknown',
    },
  };

  return { success: true, comment };
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to edit comments' };
  }

  // Validate content
  const validationResult = commentSchema.safeParse({ content });

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.issues[0].message };
  }

  // Update comment (RLS will ensure user owns it)
  const { data, error } = await supabase
    .from('resource_comments')
    .update({ content: validationResult.data.content })
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select('resource_id')
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return { success: false, error: 'Failed to update comment' };
  }

  // Revalidate paths
  if (data?.resource_id) {
    revalidatePath(`/resource/${data.resource_id}`);
  }

  return { success: true };
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to delete comments' };
  }

  // Get resource_id before deleting
  const { data: comment } = await supabase
    .from('resource_comments')
    .select('resource_id')
    .eq('id', commentId)
    .single();

  // Delete comment (RLS will ensure user owns it)
  const { error } = await supabase
    .from('resource_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }

  // Revalidate paths
  if (comment?.resource_id) {
    revalidatePath(`/resource/${comment.resource_id}`);
  }

  return { success: true };
}

/**
 * Get comment count for a resource
 */
export async function getCommentCount(resourceId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('resource_comments')
    .select('*', { count: 'exact', head: true })
    .eq('resource_id', resourceId);

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get comment counts for multiple resources (for card displays)
 */
export async function getCommentCounts(resourceIds: string[]): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resource_comments')
    .select('resource_id')
    .in('resource_id', resourceIds);

  if (error) {
    console.error('Error fetching comment counts:', error);
    return {};
  }

  // Count comments per resource
  const counts: Record<string, number> = {};
  for (const comment of data || []) {
    counts[comment.resource_id] = (counts[comment.resource_id] || 0) + 1;
  }

  return counts;
}

