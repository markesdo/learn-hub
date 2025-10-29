import { Skeleton } from '@/components/ui/skeleton';
import { ResourceGridSkeleton } from '@/app/components/skeletons/resource-grid-skeleton';

export default function ResourcesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-80" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Grid Skeleton */}
      <ResourceGridSkeleton count={6} />
    </div>
  );
}

