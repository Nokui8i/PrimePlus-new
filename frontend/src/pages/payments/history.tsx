import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { paymentService } from '@/services/paymentService';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'tip' | 'content' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  receiver: {
    id: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
  metadata?: any;
}

export default function PaymentHistory() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const response = await paymentService.getUserPaymentHistory();
        if (response.success) {
          setPayments(response.data);
        } else {
          setError('Failed to load payment history');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching payment history');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPaymentHistory();
    }
  }, [isAuthenticated, loading, router]);

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'Subscription';
      case 'tip':
        return 'Tip';
      case 'content':
        return 'Content Purchase';
      default:
        return 'Payment';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No payment history yet</h2>
          <p className="text-gray-500 mb-6">You haven't made any payments on the platform yet.</p>
          <Link href="/explore">
            <Button>Explore Creators</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {payment.receiver.profileImage ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}${payment.receiver.profileImage}`}
                              alt={payment.receiver.username}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-sm font-medium">
                                {payment.receiver.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Link href={`/creator/${payment.receiver.id}`}>
                            <span className="text-sm font-medium text-blue-600 hover:text-blue-900">
                              {payment.receiver.fullName || payment.receiver.username}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getPaymentTypeLabel(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}