import { notFound, redirect } from 'next/navigation';
import { getResourceById } from '@/app/actions/resources';
import { getUser } from '@/app/actions/auth';
import { ResourceEditForm } from '@/app/components/resources/resource-form-edit';

interface EditResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params;
  
  // Fetch resource and user in parallel
  const [resource, user] = await Promise.all([
    getResourceById(id),
    getUser(),
  ]);

  // If resource doesn't exist, show 404
  if (!resource) {
    notFound();
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect('/login');
  }

  // If user is not the owner, redirect to resource detail page
  if (resource.owner.id !== user.id) {
    redirect(`/resource/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
        <p className="mt-2 text-muted-foreground">
          Update the details of your learning resource.
        </p>
      </div>

      <ResourceEditForm resource={resource} />
    </div>
  );
}

