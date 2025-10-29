import { requireAuth } from '@/lib/auth/guards';
import { ResourceForm } from '@/app/components/resources/resource-form';

export default async function SubmitPage() {
  await requireAuth();

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-12 bg-gradient-to-r from-zinc-900 to-zinc-600 rounded-full"></div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#18181B' }}>
            Submit Resource
          </h1>
        </div>
        <p className="text-lg ml-[3.75rem]" style={{ color: '#52525B' }}>
          Share a valuable learning resource with the community
        </p>
      </div>
      <ResourceForm />
    </div>
  );
}

