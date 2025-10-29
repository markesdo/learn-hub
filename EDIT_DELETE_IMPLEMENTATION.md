# Resource Edit & Delete Implementation

This document describes the implementation of edit and delete functionality for resources in LearnHub.

## Overview

Users can now edit and delete their own resources with full authorization, validation, and user feedback.

## Features Implemented

### 1. Database Authorization

#### UPDATE RLS Policy
Added a new Row Level Security policy to the `resources` table:

```sql
create policy "Users can update their own resources"
on resources
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
```

- **Operation**: UPDATE
- **Access**: Authenticated users only
- **Rule**: Users can only update resources they own
- **Performance**: Uses `(select auth.uid())` pattern for optimal performance

#### DELETE RLS Policy (Already Existed)
The DELETE policy was already in place from the initial setup:
- Users can only delete resources they own
- Cascade delete ensures likes and comments are removed when a resource is deleted

### 2. Server Actions

Added two new server actions to `/app/actions/resources.ts`:

#### `updateResource(resourceId, prevState, formData)`
- Verifies user authentication
- Validates input using existing Zod schema
- Updates resource in database (RLS enforces ownership)
- Revalidates affected paths (`/resource/[id]`, `/resources`, `/dashboard`)
- Redirects to resource detail page on success
- Returns validation errors or general error messages

#### `deleteResource(resourceId)`
- Verifies user authentication
- Deletes resource from database (RLS enforces ownership)
- Cascade deletes all associated likes and comments
- Revalidates affected paths (`/resources`, `/dashboard`)
- Returns success/error response

### 3. Edit Functionality

#### Edit Page (`/app/resource/[id]/edit/page.tsx`)
- **Server Component** that fetches resource and user data
- Verifies resource exists (404 if not found)
- Requires authentication (redirects to login)
- Verifies ownership (redirects to detail page if not owner)
- Renders `ResourceEditForm` component

#### Edit Form Component (`/app/components/resources/resource-form-edit.tsx`)
- **Client Component** with pre-filled form fields
- Uses `useActionState` for form submission
- Displays validation errors inline
- Shows loading state during submission
- Character counter for description field
- Cancel button to return to resource detail page

### 4. Delete Functionality

#### Delete Button with Confirmation
Updated `/app/resource/[id]/resource-detail-client.tsx`:
- Added delete button with AlertDialog confirmation
- Shows destructive variant styling
- Displays resource title in confirmation message
- Handles loading state during deletion
- Shows error messages if deletion fails
- Redirects to dashboard on success

#### UI Components
- **AlertDialog**: Shadcn UI component for confirmation
- **Icons**: Trash2 icon from lucide-react
- **Transitions**: Uses `useTransition` for smooth interactions

### 5. Navigation & UI

#### Edit Button
- Added to "Manage" section of resource detail page
- Only visible to resource owners
- Links to `/resource/[id]/edit`
- Pencil icon from lucide-react

#### Delete Button
- Added to "Manage" section next to Edit button
- Only visible to resource owners
- Opens confirmation dialog
- Trash2 icon from lucide-react

## Security Features

### Authorization
- RLS policies enforce ownership at the database level
- Server-side verification of authentication
- Client-side ownership checks for UI display

### Validation
- Reuses existing Zod schema for consistency
- Server-side validation prevents malicious requests
- Client-side validation provides immediate feedback

### Error Handling
- User-friendly error messages
- Console logging for debugging
- Graceful fallbacks for failures

## User Experience

### Edit Flow
1. User clicks "Edit" button on their resource
2. Redirected to `/resource/[id]/edit`
3. Form is pre-filled with current data
4. User makes changes and clicks "Update Resource"
5. Validation errors shown inline if any
6. On success, redirected to resource detail page with updated data
7. All related pages revalidated (resources list, dashboard)

### Delete Flow
1. User clicks "Delete" button on their resource
2. Confirmation dialog appears with resource title
3. User confirms or cancels
4. On confirm, resource and all associated data deleted
5. On success, redirected to dashboard
6. Resources list and dashboard revalidated

## Database Schema

### Foreign Key Constraints
Both `resource_likes` and `resource_comments` have CASCADE delete:
```sql
resource_likes.resource_id → resources.id (ON DELETE CASCADE)
resource_comments.resource_id → resources.id (ON DELETE CASCADE)
```

This ensures data integrity when resources are deleted.

## Testing Checklist

- ✅ UPDATE RLS policy created and verified
- ✅ DELETE RLS policy verified (already existed)
- ✅ `updateResource` server action implemented
- ✅ `deleteResource` server action implemented
- ✅ Edit page with ownership verification created
- ✅ Edit form with pre-filled data created
- ✅ Delete button with confirmation dialog added
- ✅ Edit button added to resource detail page
- ✅ Cascade delete verified for likes and comments
- ✅ Build passes with no TypeScript errors
- ✅ RLS policies optimized with `(select auth.uid())`

## Files Modified

### New Files
- `/app/resource/[id]/edit/page.tsx` - Edit page with ownership verification
- `/app/components/resources/resource-form-edit.tsx` - Edit form component
- `/components/ui/alert-dialog.tsx` - AlertDialog component (Shadcn UI)

### Modified Files
- `/app/actions/resources.ts` - Added `updateResource` and `deleteResource` actions
- `/app/resource/[id]/resource-detail-client.tsx` - Added Edit and Delete buttons

### Database Migrations
- `add_update_policy_to_resources` - Added UPDATE RLS policy

## Next Steps

To complete the feature, manual testing is recommended:
1. **Test Edit**: Verify users can edit their own resources but not others'
2. **Test Delete**: Verify users can delete their own resources but not others'
3. **Test Validation**: Verify form validation works correctly
4. **Test Cascade**: Verify likes and comments are deleted with resources
5. **Test Navigation**: Verify redirects work correctly
6. **Test UI**: Verify buttons only show for resource owners

