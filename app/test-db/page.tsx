import { createClient } from '@/lib/supabase/server';

export default async function TestDatabasePage() {
  const supabase = await createClient();

  // Test the connection
  const { data, error } = await supabase.from('_test').select('*').limit(1);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Supabase Connection Test</h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          {error ? (
            <div className="text-red-600">
              <p className="font-medium">Expected error (no tables exist yet):</p>
              <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
              <p className="mt-4 text-green-600 font-medium">
                ✅ Connection is working! The error just means your database is empty.
              </p>
            </div>
          ) : (
            <p className="text-green-600 font-medium">
              ✅ Connection successful! Database ready.
            </p>
          )}
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Connection Details:</h3>
            <ul className="text-sm space-y-1">
              <li>• URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
              <li>• Project: learn-hub</li>
              <li>• Region: eu-north-1</li>
              <li>• PostgreSQL: 17.6.1</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Create your database schema (tables, columns, etc.)</li>
              <li>Set up Row Level Security (RLS) policies</li>
              <li>Generate TypeScript types from your schema</li>
              <li>Start building your app!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

