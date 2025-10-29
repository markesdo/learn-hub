'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: 'video' | 'article' | 'pdf';
  created_at: string;
  owner: {
    id: string;
    username: string;
  };
}

// Validation schema for creating a resource
const createResourceSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      'URL must start with http:// or https://'
    ),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  type: z.enum(['video', 'article', 'pdf'], {
    message: 'Please select a valid resource type',
  }),
});

interface CreateResourceResponse {
  error?: string;
  errors?: {
    title?: string[];
    url?: string[];
    description?: string[];
    type?: string[];
  };
}

/**
 * Fetch resources with optional search and type filtering
 */
export async function getResources(
  search?: string,
  type?: 'video' | 'article' | 'pdf'
): Promise<Resource[]> {
  const supabase = await createClient();

  let query = supabase
    .from('resources')
    .select(`
      id,
      title,
      description,
      url,
      type,
      created_at,
      owner:profiles!owner_id (
        id,
        username
      )
    `)
    .order('created_at', { ascending: false });

  // Apply type filter if provided
  if (type) {
    query = query.eq('type', type);
  }

  // Apply search filter if provided (case-insensitive search in title and description)
  if (search && search.trim()) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  // Transform the data to match our Resource interface
  return (data || []).map((resource: any) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    url: resource.url,
    type: resource.type as 'video' | 'article' | 'pdf',
    created_at: resource.created_at,
    owner: {
      id: Array.isArray(resource.owner) ? resource.owner[0]?.id : resource.owner?.id,
      username: Array.isArray(resource.owner) ? resource.owner[0]?.username : resource.owner?.username,
    },
  }));
}

/**
 * Fetch all resources created by a specific user
 */
export async function getResourcesByUserId(userId: string): Promise<Resource[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      description,
      url,
      type,
      created_at,
      owner:profiles!owner_id (
        id,
        username
      )
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user resources:', error);
    return [];
  }

  return (data || []).map((resource: any) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    url: resource.url,
    type: resource.type as 'video' | 'article' | 'pdf',
    created_at: resource.created_at,
    owner: {
      id: Array.isArray(resource.owner) ? resource.owner[0]?.id : resource.owner?.id,
      username: Array.isArray(resource.owner) ? resource.owner[0]?.username : resource.owner?.username,
    },
  }));
}

/**
 * Fetch a single resource by ID with owner information
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      description,
      url,
      type,
      created_at,
      owner:profiles!owner_id (
        id,
        username
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  const resourceData = data as any;

  return {
    id: resourceData.id,
    title: resourceData.title,
    description: resourceData.description,
    url: resourceData.url,
    type: resourceData.type as 'video' | 'article' | 'pdf',
    created_at: resourceData.created_at,
    owner: {
      id: Array.isArray(resourceData.owner) ? resourceData.owner[0]?.id : resourceData.owner?.id,
      username: Array.isArray(resourceData.owner) ? resourceData.owner[0]?.username : resourceData.owner?.username,
    },
  };
}

/**
 * Create a new resource
 */
export async function createResource(
  prevState: unknown,
  formData: FormData
): Promise<CreateResourceResponse> {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a resource' };
  }

  // Validate input
  const validationResult = createResourceSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    description: formData.get('description'),
    type: formData.get('type'),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { title, url, description, type } = validationResult.data;

  // Insert the resource into the database
  const { data: newResource, error: insertError } = await supabase
    .from('resources')
    .insert({
      title,
      url,
      description: description || null,
      type,
      owner_id: user.id,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error creating resource:', insertError);
    return { error: 'Failed to create resource. Please try again.' };
  }

  if (!newResource) {
    return { error: 'Failed to create resource. Please try again.' };
  }

  // Redirect to the new resource detail page
  redirect(`/resource/${newResource.id}`);
}

/**
 * Update an existing resource
 */
export async function updateResource(
  resourceId: string,
  prevState: unknown,
  formData: FormData
): Promise<CreateResourceResponse> {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update a resource' };
  }

  // Validate input
  const validationResult = createResourceSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    description: formData.get('description'),
    type: formData.get('type'),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { title, url, description, type } = validationResult.data;

  // Update the resource in the database (RLS will enforce ownership)
  const { error: updateError } = await supabase
    .from('resources')
    .update({
      title,
      url,
      description: description || null,
      type,
    })
    .eq('id', resourceId)
    .eq('owner_id', user.id);

  if (updateError) {
    console.error('Error updating resource:', updateError);
    return { error: 'Failed to update resource. Please try again.' };
  }

  // Revalidate affected paths
  revalidatePath(`/resource/${resourceId}`);
  revalidatePath('/resources');
  revalidatePath('/dashboard');

  // Redirect to the resource detail page
  redirect(`/resource/${resourceId}`);
}

/**
 * Delete a resource
 */
export async function deleteResource(
  resourceId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to delete a resource' };
  }

  // Delete the resource (RLS will enforce ownership)
  const { error: deleteError } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId)
    .eq('owner_id', user.id);

  if (deleteError) {
    console.error('Error deleting resource:', deleteError);
    return { success: false, error: 'Failed to delete resource. Please try again.' };
  }

  // Revalidate affected paths
  revalidatePath('/resources');
  revalidatePath('/dashboard');

  return { success: true };
}

