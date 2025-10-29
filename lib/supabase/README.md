# Supabase Integration

This directory contains Supabase client utilities for different Next.js contexts.

## Files

- **`client.ts`** - Browser client for Client Components (`'use client'`)
- **`server.ts`** - Server client for Server Components, Server Actions, and Route Handlers
- **`proxy.ts`** - Proxy utility for session management (Next.js 16+)

## Usage Examples

### Server Component (Default - Recommended)

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  
  const { data: items } = await supabase
    .from('items')
    .select('*');

  return <div>{/* Render items */}</div>;
}
```

### Client Component

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function ClientComponent() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('items').select('*');
      setData(data);
    }
    loadData();
  }, []);

  return <div>{/* Render data */}</div>;
}
```

### Server Action

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('items')
    .insert({
      name: formData.get('name'),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/items');
  return { success: true };
}
```

### Authentication Example

```typescript
// Server Component
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.email}</div>;
}
```

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Proxy (Next.js 16+)

The root `proxy.ts` file automatically refreshes auth sessions on every request. (Previously called `middleware.ts` in older Next.js versions)

## Best Practices

1. **Prefer Server Components** - Use the server client whenever possible for better performance and security
2. **Use Client Components only when needed** - For interactive features requiring browser APIs or React hooks
3. **Handle errors gracefully** - Always check for errors in responses
4. **Type safety** - Generate TypeScript types from your database schema using Supabase CLI

## Resources

- [Supabase Next.js Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)

