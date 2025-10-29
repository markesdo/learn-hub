import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardSkeleton } from '@/app/components/skeletons/stats-card-skeleton';
import { ResourceGridSkeleton } from '@/app/components/skeletons/resource-grid-skeleton';

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-11 w-full sm:w-56" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Resources Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-64" />
        <ResourceGridSkeleton count={6} />
      </div>
    </div>
  );
}

