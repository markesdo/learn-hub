import { notFound } from 'next/navigation';
import { getResourceById } from '@/app/actions/resources';
import { getUser } from '@/app/actions/auth';
import { getLikeData } from '@/app/actions/likes';
import { getComments } from '@/app/actions/comments';
import { ResourceDetailClient } from './resource-detail-client';

interface ResourceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params;
  const [resource, user, likeData, comments] = await Promise.all([
    getResourceById(id),
    getUser(),
    getLikeData(id),
    getComments(id),
  ]);

  if (!resource) {
    notFound();
  }

  const isOwner = user?.id === resource.owner.id;

  return (
    <ResourceDetailClient
      resource={resource}
      userId={user?.id || null}
      isOwner={isOwner}
      initialLikeCount={likeData.likeCount}
      initialIsLiked={likeData.isLiked}
      initialComments={comments}
    />
  );
}

