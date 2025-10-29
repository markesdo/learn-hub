import { redirect } from 'next/navigation';
import { getUser } from '@/app/actions/auth';

/**
 * Server-side auth guard for protected pages.
 * Redirects to /login if user is not authenticated.
 * Returns the authenticated user if successful.
 */
export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

