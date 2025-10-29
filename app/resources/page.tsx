import { getResources } from '@/app/actions/resources';
import { getLikeCounts } from '@/app/actions/likes';
import { getCommentCounts } from '@/app/actions/comments';
import { ResourceCard } from '@/app/components/resources/resource-card';
import { ResourceFilters } from '@/app/components/resources/resource-filters';
import { EmptyState } from '@/app/components/resources/empty-state';

interface ResourcesPageProps {
  searchParams: Promise<{
    search?: string;
    type?: 'video' | 'article' | 'pdf';
  }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams;
  const resources = await getResources(params.search, params.type);
  const hasFilters = Boolean(params.search || params.type);

  // Fetch social stats for all resources
  const resourceIds = resources.map((r) => r.id);
  const [likeCounts, commentCounts] = await Promise.all([
    getLikeCounts(resourceIds),
    getCommentCounts(resourceIds),
  ]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Learning Resources
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Discover and share quality learning resources
        </p>
      </div>

      <div className="mb-6">
        <ResourceFilters />
      </div>

      {resources.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              likeCount={likeCounts[resource.id] || 0}
              commentCount={commentCounts[resource.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

