import { requireAuth } from '@/lib/auth/guards';
import { ResourceForm } from '@/app/components/resources/resource-form';

export default async function SubmitPage() {
  await requireAuth();

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <ResourceForm />
    </div>
  );
}

