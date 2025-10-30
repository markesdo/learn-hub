'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, Pencil, Trash2 } from 'lucide-react';
import { useRealtimeSocial } from '@/lib/hooks/use-realtime-social';
import type { Resource } from '@/app/actions/resources';
import type { Comment } from '@/app/actions/comments';
import { deleteResource } from '@/app/actions/resources';
import { LikeButton } from '@/app/components/social/like-button';
import { CommentsSection } from '@/app/components/social/comments-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ResourceDetailClientProps {
  resource: Resource;
  userId: string | null;
  isOwner: boolean;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialComments: Comment[];
}

const typeConfig = {
  video: {
    label: 'Video',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  article: {
    label: 'Article',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  pdf: {
    label: 'PDF',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
};

export function ResourceDetailClient({
  resource,
  userId,
  isOwner,
  initialLikeCount,
  initialIsLiked,
  initialComments,
}: ResourceDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Subscribe to real-time updates
  const { likeCount, isLiked, comments } = useRealtimeSocial({
    resourceId: resource.id,
    initialLikeCount,
    initialIsLiked,
    initialComments,
    userId,
  });

  const typeInfo = typeConfig[resource.type];
  const createdDate = new Date(resource.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = () => {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteResource(resource.id);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setDeleteError(result.error || 'Failed to delete resource');
        setIsDialogOpen(false);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resources
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${typeInfo.className}`}
                >
                  {typeInfo.label}
                </span>
              </div>
              <CardTitle className="text-3xl">{resource.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                <span>Submitted by @{resource.owner.username}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {createdDate}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-start">
              <LikeButton
                resourceId={resource.id}
                initialLikeCount={likeCount}
                initialIsLiked={isLiked}
                userId={userId}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {resource.description && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h3>
              <p className="text-base leading-relaxed text-foreground">
                {resource.description}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Access Resource
            </h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Resource
              </Button>
            </a>
          </div>

          {isOwner && (
            <div className="border-t pt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Manage
              </h3>
              <div className="flex gap-3">
                <Link href={`/resource/${resource.id}/edit`}>
                  <Button variant="outline" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2" disabled={isPending}>
                      <Trash2 className="h-4 w-4" />
                      {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Resource?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the resource
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
              </div>
              {deleteError && (
                <p className="mt-3 text-sm text-red-600">{deleteError}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mt-8">
        <Card>
          <CardContent className="pt-6">
            <CommentsSection
              resourceId={resource.id}
              initialComments={comments}
              currentUserId={userId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

