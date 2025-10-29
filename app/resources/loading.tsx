import { Skeleton } from '@/components/ui/skeleton';
import { ResourceGridSkeleton } from '@/app/components/skeletons/resource-grid-skeleton';

export default function ResourcesLoading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-1 w-12 rounded-full" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-6 w-96 ml-[3.75rem]" />
      </div>

      {/* Filters Skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-80" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Grid Skeleton */}
      <ResourceGridSkeleton count={6} />
    </div>
  );
}

