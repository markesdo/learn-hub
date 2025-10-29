'use client';

import Link from 'next/link';
import { ExternalLink, Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Resource } from '@/app/actions/resources';

interface ResourceCardProps {
  resource: Resource;
  variant?: 'public' | 'dashboard';
  likeCount?: number;
  commentCount?: number;
  onDelete?: () => void;
  onDeletePending?: boolean;
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
    className: 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-200',
  },
};

export function ResourceCard({
  resource,
  variant = 'public',
  likeCount = 0,
  commentCount = 0,
  onDelete,
  onDeletePending = false,
}: ResourceCardProps) {
  const typeInfo = typeConfig[resource.type];

  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-xl group-hover:text-primary">
            {resource.title}
          </CardTitle>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.className}`}
          >
            {typeInfo.label}
          </span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {variant === 'public'
            ? `Submitted by @${resource.owner.username}`
            : `Created ${new Date(resource.created_at).toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="flex-1 space-y-4">
          {resource.description && (
            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {resource.description}
            </p>
          )}

          {/* Social Stats */}
          <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex flex-wrap items-center gap-2">
          {variant === 'public' ? (
            <>
              <Link href={`/resource/${resource.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
              >
                <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Open
                </Button>
              </a>
            </>
          ) : (
            <>
              <Link href={`/resource/${resource.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Link href={`/resource/${resource.id}/edit`}>
                <Button variant="outline" size="sm" disabled={onDeletePending}>
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              </Link>
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={onDeletePending}
                  onClick={onDelete}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              )}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto"
              >
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

