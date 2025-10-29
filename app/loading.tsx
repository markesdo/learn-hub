import { Skeleton } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Logo/Title Skeleton */}
        <div className="flex items-center justify-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Hero Text Skeleton */}
        <div className="space-y-3">
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-6 w-2/3" />
        </div>

        {/* CTA Skeleton */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-40" />
        </div>

        {/* Stats Skeleton */}
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8 pt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="mx-auto h-8 w-16" />
              <Skeleton className="mx-auto h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

