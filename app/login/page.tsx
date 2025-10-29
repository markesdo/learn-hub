import { redirect } from 'next/navigation';
import { getUser } from '@/app/actions/auth';
import { AuthForm } from '@/app/components/auth/auth-form';

export default async function LoginPage() {
  // If user is already logged in, redirect to home
  const user = await getUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <AuthForm />
    </div>
  );
}

