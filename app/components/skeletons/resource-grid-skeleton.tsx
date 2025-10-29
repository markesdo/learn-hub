import { ResourceCardSkeleton } from './resource-card-skeleton';

interface ResourceGridSkeletonProps {
  count?: number;
}

export function ResourceGridSkeleton({ count = 6 }: ResourceGridSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </div>
  );
}

