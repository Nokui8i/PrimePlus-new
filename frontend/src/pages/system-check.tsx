import { useState, useEffect } from 'react';
import { systemCheck } from '@/utils/systemCheck';
import Layout from '@/components/layouts/Layout';

interface CheckResult {
  success: boolean;
  component: string;
  message: string;
  error?: any;
}

export default function SystemCheckPage() {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSystemCheck = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const checkResults = await systemCheck.runAllChecks();
      setResults(checkResults);
    } catch (err) {
      setError('Failed to run system checks');
      console.error(err);
    }
    setIsChecking(false);
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  return (
    <Layout title="System Check">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">System Check</h1>
          <p className="text-gray-600">
            This page runs diagnostics to ensure all system components are working correctly.
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={runSystemCheck}
            disabled={isChecking}
            className={`px-4 py-2 rounded ${
              isChecking
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isChecking ? 'Running Checks...' : 'Run System Check'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow ${
                result.success ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{result.component}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    result.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.success ? 'Passed' : 'Failed'}
                </span>
              </div>
              <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </p>
              {result.error && (
                <pre className="mt-4 p-4 bg-gray-100 rounded overflow-x-auto text-sm">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 