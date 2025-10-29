import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold">Resource Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The resource you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/resources">Browse Resources</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

