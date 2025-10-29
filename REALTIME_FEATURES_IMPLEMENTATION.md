# Real-time Social Features Implementation

This document outlines the implementation of real-time updates for likes and comments on LearnHub using Supabase Realtime.

## Overview

Real-time features allow users viewing a resource detail page to see likes and comments updates instantly when other users interact with the resource - no page refresh needed.

## Architecture

### Database Layer
- **Realtime publication enabled** on `resource_likes` and `resource_comments` tables
- Supabase broadcasts INSERT, UPDATE, and DELETE events to subscribed clients
- RLS policies ensure security while maintaining real-time capabilities

### Client Layer
The implementation uses a clean separation of concerns:

1. **Custom Hook** (`lib/hooks/use-realtime-social.ts`)
   - Manages Supabase Realtime subscriptions
   - Listens for database changes
   - Updates local state in response to events
   - Handles cleanup on unmount

2. **Client Component** (`app/resource/[id]/resource-detail-client.tsx`)
   - Uses the realtime hook
   - Renders UI with real-time data
   - Passes data to child components

3. **Server Component** (`app/resource/[id]/page.tsx`)
   - Fetches initial data server-side
   - Passes data to client component
   - Maintains fast initial page load

## Implementation Details

### 1. Database Migration

```sql
-- Enable Realtime replication
alter publication supabase_realtime add table resource_likes;
alter publication supabase_realtime add table resource_comments;
```

Migration file: `enable_realtime_social.sql`

### 2. Realtime Hook

**File**: `lib/hooks/use-realtime-social.ts`

**Features**:
- Single channel subscription per resource (`resource:${resourceId}`)
- Listens for 4 event types on likes (INSERT, DELETE)
- Listens for 6 event types on comments (INSERT, UPDATE, DELETE)
- Automatically fetches user info for new comments
- Prevents duplicate comments (handles race conditions)
- Proper cleanup on unmount

**Usage**:
```tsx
const { likeCount, isLiked, comments } = useRealtimeSocial({
  resourceId,
  initialLikeCount,
  initialIsLiked,
  initialComments,
  userId,
});
```

### 3. Component Architecture

**Server Component** (`page.tsx`):
```tsx
export default async function ResourceDetailPage({ params }) {
  const { id } = await params;
  const [resource, user, likeData, comments] = await Promise.all([
    getResourceById(id),
    getUser(),
    getLikeData(id),
    getComments(id),
  ]);

  return (
    <ResourceDetailClient
      resource={resource}
      userId={user?.id || null}
      isOwner={user?.id === resource.owner.id}
      initialLikeCount={likeData.likeCount}
      initialIsLiked={likeData.isLiked}
      initialComments={comments}
    />
  );
}
```

**Client Component** (`resource-detail-client.tsx`):
```tsx
export function ResourceDetailClient({ resource, userId, initialLikeCount, initialIsLiked, initialComments }) {
  const { likeCount, isLiked, comments } = useRealtimeSocial({
    resourceId: resource.id,
    initialLikeCount,
    initialIsLiked,
    initialComments,
    userId,
  });

  return (
    // Render UI with real-time data
  );
}
```

### 4. Event Handling

#### Likes
- **INSERT**: Increment count, update `isLiked` if current user
- **DELETE**: Decrement count, update `isLiked` if current user

#### Comments
- **INSERT**: Fetch full comment with user info, add to list (avoid duplicates)
- **UPDATE**: Update content and timestamp
- **DELETE**: Remove from list

### 5. Visual Feedback

**CSS Animations** (`app/globals.css`):
- `animate-pulse-subtle`: Subtle scale/opacity for like count changes
- `animate-slide-in-up`: Comments slide in from bottom
- `animate-fade-in`: Smooth fade for new elements

**Applied to**:
- Like count: Pulses when updated from real-time
- Comments: Slide in animation for new comments
- All animations are subtle and non-intrusive

## Benefits

1. **Instant Updates**: Users see changes without refreshing
2. **Better Engagement**: Real-time interaction feels more social
3. **No Polling**: Efficient WebSocket connection
4. **Scalable**: Built on Supabase's infrastructure
5. **Progressive Enhancement**: Falls back gracefully if connection fails

## Performance Considerations

1. **Single Channel**: One WebSocket per resource (not per table)
2. **Selective Fetching**: Only fetch full comment data on INSERT
3. **Duplicate Prevention**: Check for existing comments before adding
4. **Cleanup**: Proper unsubscription on component unmount
5. **Initial SSR**: Fast first paint with server-rendered data

## Testing

### Manual Testing Steps

1. **Open two browser windows** side-by-side
2. **Navigate to same resource** in both windows
3. **Test likes**:
   - Click like in window 1
   - Verify count updates in window 2
   - Verify animation plays
4. **Test comments**:
   - Post comment in window 1
   - Verify it appears instantly in window 2
   - Verify slide-in animation
5. **Test edit/delete**:
   - Edit comment in window 1
   - Verify update appears in window 2
   - Delete comment in window 1
   - Verify removal in window 2

### Console Logs

When subscribed, you'll see:
```
✅ Subscribed to real-time updates for resource [resource-id]
```

When unsubscribed:
```
🔌 Unsubscribed from resource [resource-id]
```

## Troubleshooting

### Real-time Not Working

1. **Check Realtime is enabled** in Supabase dashboard
2. **Verify publication** includes both tables
3. **Check RLS policies** allow reads
4. **Inspect browser console** for connection errors
5. **Check WebSocket connection** in Network tab

### Duplicate Comments

The hook includes duplicate prevention:
```tsx
setComments((prev) => {
  if (prev.some((c) => c.id === comment.id)) {
    return prev; // Skip if already exists
  }
  return [...prev, comment];
});
```

### Memory Leaks

The hook properly cleans up on unmount:
```tsx
return () => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};
```

## Future Enhancements

1. **Presence**: Show who's viewing the resource
2. **Typing Indicators**: Show when someone is typing a comment
3. **Read Receipts**: Track who has seen comments
4. **Conflict Resolution**: Handle simultaneous edits
5. **Offline Support**: Queue actions when offline
6. **Push Notifications**: Notify users of activity on their resources

## Files Modified

### New Files
- `lib/hooks/use-realtime-social.ts` - Realtime subscription hook
- `app/resource/[id]/resource-detail-client.tsx` - Client wrapper component

### Modified Files
- `app/resource/[id]/page.tsx` - Split into server/client
- `app/globals.css` - Added real-time animation keyframes
- `app/components/social/like-button.tsx` - Animation on count change
- `app/components/social/comments-section.tsx` - Animation on new comments

### Database Migrations
- `enable_realtime_social.sql` - Enable Realtime on social tables

## Related Documentation

- [Social Features Implementation](./SOCIAL_FEATURES_IMPLEMENTATION.md)
- [Authentication Implementation](./AUTH_IMPLEMENTATION.md)
- [Resources Database Setup](./RESOURCES_DATABASE_SETUP.md)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)

