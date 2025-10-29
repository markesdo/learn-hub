import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <FileQuestion className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {hasFilters ? 'No resources found' : 'No resources yet'}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {hasFilters
          ? 'Try adjusting your search or filters'
          : 'Be the first to share a learning resource!'}
      </p>
    </div>
  );
}

