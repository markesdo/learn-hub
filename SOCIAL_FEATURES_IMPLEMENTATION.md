# Social Features Implementation

This document outlines the implementation of social features (likes and comments) for the LearnHub MVP.

## Overview

The social features allow users to:
- **Like resources**: Users can like/unlike any resource with a single click
- **Comment on resources**: Users can add, edit, and delete comments on resources
- **View social stats**: All resource cards display like and comment counts

## Database Schema

### Tables Created

#### `resource_likes`
```sql
- id: uuid (primary key)
- resource_id: uuid (foreign key to resources)
- user_id: uuid (foreign key to auth.users)
- created_at: timestamptz
- UNIQUE constraint on (resource_id, user_id) - prevents duplicate likes
```

**Indexes:**
- `resource_likes_resource_id_idx` on `resource_id`
- `resource_likes_user_id_idx` on `user_id`

**RLS Policies:**
- SELECT: Anyone can view likes
- INSERT: Authenticated users can like resources (checks user_id matches auth.uid())
- DELETE: Users can only unlike their own likes

#### `resource_comments`
```sql
- id: uuid (primary key)
- resource_id: uuid (foreign key to resources)
- user_id: uuid (foreign key to auth.users)
- content: text (max 1000 characters)
- created_at: timestamptz
- updated_at: timestamptz
```

**Indexes:**
- `resource_comments_resource_id_idx` on `resource_id`
- `resource_comments_created_at_idx` on `created_at DESC`

**RLS Policies:**
- SELECT: Anyone can view comments
- INSERT: Authenticated users can create comments (checks user_id matches auth.uid())
- UPDATE: Users can only update their own comments
- DELETE: Users can only delete their own comments

**Trigger:**
- `update_resource_comments_updated_at`: Automatically updates `updated_at` timestamp on comment updates

## Server Actions

### Likes (`app/actions/likes.ts`)

**Functions:**
- `toggleLike(resourceId: string)`: Toggles like/unlike for the current user
- `getLikeData(resourceId: string)`: Gets like count and current user's like status
- `getLikeCounts(resourceIds: string[])`: Batch fetches like counts for multiple resources

**Features:**
- Optimistic updates via revalidation
- Proper authentication checks
- Efficient batch fetching for lists

### Comments (`app/actions/comments.ts`)

**Functions:**
- `getComments(resourceId: string)`: Fetches all comments for a resource with user info
- `createComment(resourceId: string, content: string)`: Creates a new comment
- `updateComment(commentId: string, content: string)`: Updates an existing comment
- `deleteComment(commentId: string)`: Deletes a comment
- `getCommentCount(resourceId: string)`: Gets comment count for a single resource
- `getCommentCounts(resourceIds: string[])`: Batch fetches comment counts for multiple resources

**Features:**
- Zod validation (1-1000 characters)
- Proper error handling
- RLS-enforced ownership checks
- Optimistic updates via revalidation
- Joins with profiles table for user info

## UI Components

### LikeButton (`app/components/social/like-button.tsx`)

**Features:**
- Client component with optimistic updates using `useOptimistic`
- Heart icon that fills when liked
- Displays like count
- Error handling with user feedback
- Disabled state during pending actions
- Prompts to sign in if not authenticated

**Usage:**
```tsx
<LikeButton
  resourceId={resource.id}
  initialLikeCount={10}
  initialIsLiked={false}
  userId={user?.id || null}
/>
```

### CommentCard (`app/components/social/comment-card.tsx`)

**Features:**
- Displays individual comment with user info and timestamp
- Edit mode with textarea and character counter
- Delete confirmation dialog
- Owner-only edit/delete buttons
- Relative timestamps (e.g., "5m ago", "2h ago")
- Error handling for edit/delete operations

### CommentsSection (`app/components/social/comments-section.tsx`)

**Features:**
- Client component with optimistic updates using `useOptimistic`
- Comment submission form with validation
- Character counter (1000 max)
- Empty state when no comments exist
- Prompts to sign in if not authenticated
- Lists all comments with CommentCard components

**Usage:**
```tsx
<CommentsSection
  resourceId={resource.id}
  initialComments={comments}
  currentUserId={user?.id || null}
/>
```

## Integration Points

### Resource Detail Page (`app/resource/[id]/page.tsx`)

**Updates:**
- Fetches like data and comments in parallel with resource data
- Displays LikeButton in a bordered section
- Displays CommentsSection in a separate card below the main content

### Resource Cards (`app/components/resources/resource-card.tsx`)

**Updates:**
- Accepts optional `likeCount` and `commentCount` props
- Displays social stats with heart and message icons
- Stats shown in small text below description

### Dashboard Resource Cards (`app/components/dashboard/dashboard-resource-card.tsx`)

**Updates:**
- Same social stats display as ResourceCard
- Shows user's resources with engagement metrics

### Resources List Page (`app/resources/page.tsx`)

**Updates:**
- Batch fetches like and comment counts for all resources
- Passes counts to each ResourceCard

### Dashboard Page (`app/dashboard/page.tsx`)

**Updates:**
- Batch fetches like and comment counts for user's resources
- Passes counts to each DashboardResourceCard

## Optimistic Updates

Both likes and comments use React 19's `useOptimistic` hook for instant UI feedback:

### Likes
- UI immediately reflects the toggled state
- Like count updates instantly
- Reverts on server error

### Comments
- New comment appears in list immediately
- Shows "You" as username temporarily
- Updates with real data after server confirms

## Error Handling

All social features include comprehensive error handling:

1. **Authentication errors**: Clear messages prompting users to sign in
2. **Validation errors**: Inline error messages for form inputs
3. **Server errors**: Fallback error states with retry options
4. **Network errors**: Graceful degradation with error messages

## Performance Optimizations

1. **Batch fetching**: Social stats for multiple resources fetched in single queries
2. **Parallel requests**: Like and comment data fetched simultaneously with `Promise.all()`
3. **Optimistic updates**: Immediate UI feedback without waiting for server
4. **Indexed queries**: Database indexes on frequently queried columns
5. **RLS optimization**: Policies use `(select auth.uid())` to prevent per-row evaluation

## Security

1. **RLS policies**: All tables protected with row-level security
2. **Ownership validation**: Server actions verify user ownership before updates/deletes
3. **Input validation**: Zod schemas validate all user input
4. **SQL injection protection**: Supabase client handles parameterization
5. **CSRF protection**: Next.js server actions include built-in CSRF protection

## Testing Recommendations

1. **Like functionality**:
   - Test toggling likes (like → unlike → like)
   - Test as unauthenticated user
   - Test optimistic updates with network throttling
   - Verify counts update across all pages

2. **Comment functionality**:
   - Test creating, editing, and deleting comments
   - Test character limit validation
   - Test as unauthenticated user
   - Test edit/delete buttons only show for comment owners
   - Verify timestamps display correctly

3. **Social stats**:
   - Verify counts display on all resource cards
   - Test with resources that have 0, 1, and many likes/comments
   - Verify counts update after like/unlike or comment actions

## Future Enhancements

Potential improvements for Phase B or later:

1. **Notifications**: Notify resource owners when their resources are liked or commented on
2. **Nested replies**: Allow users to reply to specific comments
3. **Reactions**: Add emoji reactions beyond just likes
4. **Comment sorting**: Sort by newest, oldest, or most liked
5. **Pagination**: Paginate comments for resources with many comments
6. **User profiles**: Click usernames to view user profiles
7. **Moderation**: Allow resource owners to moderate comments
8. **Rich text**: Support markdown or rich text in comments
9. **Mentions**: Allow @mentions of other users
10. **Search**: Search within comments

## Migration Files

Migrations are tracked in the Supabase dashboard:
- `create_likes_table.sql`: Creates resource_likes table with RLS
- `create_comments_table.sql`: Creates resource_comments table with RLS and trigger

## Related Documentation

- [Authentication Implementation](./AUTH_IMPLEMENTATION.md)
- [Resources Database Setup](./RESOURCES_DATABASE_SETUP.md)
- [PRD](./PRD.txt)

