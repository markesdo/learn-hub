'use client';

import { useState, useActionState } from 'react';
import { signIn, signUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [signInState, signInAction, isSignInPending] = useActionState(
    async (_: unknown, formData: FormData) => signIn(formData),
    null
  );
  const [signUpState, signUpAction, isSignUpPending] = useActionState(
    async (_: unknown, formData: FormData) => signUp(formData),
    null
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to LearnHub</CardTitle>
        <CardDescription>Sign in or create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form action={signInAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {signInState?.error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {signInState.error}
                </div>
              )}

              <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800" disabled={isSignInPending}>
                {isSignInPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form action={signUpAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  name="username"
                  type="text"
                  placeholder="cooluser123"
                  required
                  autoComplete="username"
                  minLength={3}
                  maxLength={20}
                />
                <p className="text-xs text-zinc-600">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <p className="text-xs text-zinc-600">At least 6 characters</p>
              </div>

              {signUpState?.error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {signUpState.error}
                </div>
              )}

              <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800" disabled={isSignUpPending}>
                {isSignUpPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

