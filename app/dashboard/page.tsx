import Link from 'next/link';
import { Plus, FileText, Video, File } from 'lucide-react';
import { requireAuth } from '@/lib/auth/guards';
import { getResourcesByUserId } from '@/app/actions/resources';
import { getLikeCounts } from '@/app/actions/likes';
import { getCommentCounts } from '@/app/actions/comments';
import { StatsCard } from '@/app/components/dashboard/stats-card';
import { DashboardResourceCard } from '@/app/components/dashboard/dashboard-resource-card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await requireAuth();
  const resources = await getResourcesByUserId(user.id);

  // Fetch social stats for user's resources
  const resourceIds = resources.map((r) => r.id);
  const [likeCounts, commentCounts] = await Promise.all([
    getLikeCounts(resourceIds),
    getCommentCounts(resourceIds),
  ]);

  // Calculate stats
  const totalResources = resources.length;
  const videoCount = resources.filter((r) => r.type === 'video').length;
  const articleCount = resources.filter((r) => r.type === 'article').length;
  const pdfCount = resources.filter((r) => r.type === 'pdf').length;

  const videoPercentage = totalResources > 0 ? Math.round((videoCount / totalResources) * 100) : 0;
  const articlePercentage = totalResources > 0 ? Math.round((articleCount / totalResources) * 100) : 0;
  const pdfPercentage = totalResources > 0 ? Math.round((pdfCount / totalResources) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            My Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your learning resources
          </p>
        </div>
        <Link href="/submit">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Resource
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Resources"
          value={totalResources}
          icon={FileText}
          description="All your submissions"
        />
        <StatsCard
          title="Videos"
          value={videoCount}
          icon={Video}
          description={`${videoPercentage}% of total`}
        />
        <StatsCard
          title="Articles"
          value={articleCount}
          icon={FileText}
          description={`${articlePercentage}% of total`}
        />
        <StatsCard
          title="PDFs"
          value={pdfCount}
          icon={File}
          description={`${pdfPercentage}% of total`}
        />
      </div>

      {/* Resources Grid */}
      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <FileText className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No resources yet
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You haven't submitted any resources yet. Share your first learning resource!
          </p>
          <Link href="/submit" className="mt-6">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Resource
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Your Resources ({totalResources})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <DashboardResourceCard
                key={resource.id}
                resource={resource}
                likeCount={likeCounts[resource.id] || 0}
                commentCount={commentCounts[resource.id] || 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

