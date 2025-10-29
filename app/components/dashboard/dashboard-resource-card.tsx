'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Resource } from '@/app/actions/resources';
import { deleteResource } from '@/app/actions/resources';
import { ResourceCard } from '../resources/resource-card';

interface DashboardResourceCardProps {
  resource: Resource;
  likeCount?: number;
  commentCount?: number;
}

export function DashboardResourceCard({ resource, likeCount = 0, commentCount = 0 }: DashboardResourceCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteResource(resource.id);
      if (result.success) {
        router.refresh();
        setIsDialogOpen(false);
      } else {
        setDeleteError(result.error || 'Failed to delete resource');
        setIsDialogOpen(false);
      }
    });
  };

  return (
    <>
      <ResourceCard
        resource={resource}
        variant="dashboard"
        likeCount={likeCount}
        commentCount={commentCount}
        onDelete={handleDeleteClick}
        onDeletePending={isPending}
      />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <span className="font-semibold"> "{resource.title}"</span> and all associated
              likes and comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {deleteError && (
        <p className="mt-2 text-xs text-red-600">{deleteError}</p>
      )}
    </>
  );
}

