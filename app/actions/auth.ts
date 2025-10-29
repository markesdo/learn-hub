'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface ActionResponse {
  error?: string;
  success?: boolean;
}

/**
 * Sign up a new user with email, password, and username
 */
export async function signUp(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  // Validate input
  const validationResult = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { email, password, username } = validationResult.data;

  // Check if username already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingProfile) {
    return { error: 'Username already taken' };
  }

  // Sign up the user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!authData.user) {
    return { error: 'Failed to create user' };
  }

  // Update the profile with the custom username
  // (The trigger creates a profile with email prefix as username, we update it)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', authData.user.id);

  if (profileError) {
    return { error: 'Failed to create profile' };
  }

  redirect('/');
}

/**
 * Sign in an existing user
 */
export async function signIn(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  // Validate input
  const validationResult = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { email, password } = validationResult.data;

  // Sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password' };
  }

  redirect('/');
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

/**
 * Get the current authenticated user with their profile
 */
export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    username: profile?.username || user.email!.split('@')[0],
  };
}

