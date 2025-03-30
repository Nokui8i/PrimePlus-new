import React from 'react';
import { formatDate } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import { Subscriber } from '@/types/subscription';

interface SubscribersManagementProps {
  subscribers: Subscriber[];
  totalSubscribers: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const SubscribersManagement: React.FC<SubscribersManagementProps> = ({
  subscribers,
  totalSubscribers,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      past_due: { label: 'Past Due', className: 'bg-yellow-100 text-yellow-800' },
      trialing: { label: 'Trial Period', className: 'bg-blue-100 text-blue-800' },
      unpaid: { label: 'Unpaid', className: 'bg-gray-100 text-gray-800' },
    };

    const { label, className } = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="rounded-lg border shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subscriber</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Plan</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Join Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Renewal Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No subscribers to display
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr 
                    key={subscriber.id} 
                    className="border-b transition-colors hover:bg-gray-50/50"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                          {subscriber.avatar ? (
                            <img
                              src={subscriber.avatar}
                              alt={subscriber.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {subscriber.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{subscriber.name}</p>
                          <p className="text-xs text-gray-500">{subscriber.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div>
                        <p className="font-medium">{subscriber.planName}</p>
                        <p className="text-xs text-gray-500">${subscriber.planPrice} / month</p>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {formatStatus(subscriber.status)}
                    </td>
                    <td className="p-4 align-middle">
                      {formatDate(subscriber.startDate)}
                    </td>
                    <td className="p-4 align-middle">
                      {formatDate(subscriber.renewalDate)}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex space-x-2">
                        <button
                          className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
                          onClick={() => {}}
                        >
                          View
                        </button>
                        <button
                          className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                          onClick={() => {}}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalSubscribers)} of {totalSubscribers} subscribers
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersManagement; 