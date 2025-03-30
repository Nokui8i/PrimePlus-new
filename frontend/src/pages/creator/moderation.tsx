import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface ReportedContent {
  id: string;
  type: 'post' | 'comment' | 'message';
  contentId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  content: {
    title?: string;
    text?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
  };
}

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  blockedUsers: number;
  contentRemovals: number;
}

const ModerationPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    blockedUsers: 0,
    contentRemovals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);

  useEffect(() => {
    if (!loading && !user?.isCreator) {
      router.push('/');
      return;
    }

    const fetchModerationData = async () => {
      try {
        // Fetch real data from API
        const response = await fetch('/api/moderation/reports');
        const data = await response.json();
        setReports(data.reports);
        setStats(data.stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching moderation data:', error);
        setIsLoading(false);
      }
    };

    fetchModerationData();
  }, [loading, user, router]);

  const handleStatusUpdate = async (reportId: string, newStatus: 'reviewed' | 'resolved') => {
    try {
      const response = await fetch(`/api/moderation/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }

      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report status');
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/moderation/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to block user');
      }

      setStats(prev => ({ ...prev, blockedUsers: prev.blockedUsers + 1 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to block user');
    }
  };

  const handleRemoveContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/moderation/content/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove content');
      }

      setStats(prev => ({ ...prev, contentRemovals: prev.contentRemovals + 1 }));
      // Also remove the report from the list if it exists
      setReports(prev => prev.filter(report => report.contentId !== contentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove content');
    }
  };

  if (loading || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Content Moderation</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Reports</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalReports}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pending Reports</h3>
            <p className="text-2xl font-bold mt-2">{stats.pendingReports}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Resolved Reports</h3>
            <p className="text-2xl font-bold mt-2">{stats.resolvedReports}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Blocked Users</h3>
            <p className="text-2xl font-bold mt-2">{stats.blockedUsers}</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Content Removals</h3>
            <p className="text-2xl font-bold mt-2">{stats.contentRemovals}</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  All Reports
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'pending'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('resolved')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'resolved'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">{report.reporterName}</span>
                      <span className="text-sm text-neutral-500">
                        reported {report.type} • {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{report.reason}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{report.details}</p>
                    
                    {/* Content Preview */}
                    {report.content.mediaUrl && (
                      <div className="relative w-48 h-32 mb-4">
                        <Image
                          src={report.content.thumbnailUrl || report.content.mediaUrl}
                          alt={report.content.title || 'Reported content'}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {report.content.text && (
                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 mb-4">
                        <p className="text-sm">{report.content.text}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                    >
                      {report.status}
                    </span>
                    <div className="flex space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(report.id, 'reviewed');
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Review
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(report.id, 'resolved');
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockUser(report.reporterId);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Block User
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContent(report.contentId);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Content
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ModerationPage; 