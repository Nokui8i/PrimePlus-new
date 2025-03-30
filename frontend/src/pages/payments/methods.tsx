import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { paymentService } from '@/services/paymentService';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import PaymentMethodForm, { PaymentMethodData } from '@/components/payment/PaymentMethodForm';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'other';
  details: {
    last4: string;
    brand: string;
    expiryDate: string;
  };
  isDefault: boolean;
}

export default function PaymentMethods() {
  const router = useRouter();
  const { isAuthenticated, loading } = useContext(UserContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        // This would normally call an API, but for the demo we'll mock some data
        // const response = await paymentService.getPaymentMethods();
        
        // Mock data for demonstration
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'card',
            details: {
              last4: '4242',
              brand: 'Visa',
              expiryDate: '12/25'
            },
            isDefault: true
          },
          {
            id: '2',
            type: 'card',
            details: {
              last4: '1234',
              brand: 'Mastercard',
              expiryDate: '10/24'
            },
            isDefault: false
          }
        ];
        
        setPaymentMethods(mockPaymentMethods);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching payment methods');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPaymentMethods();
    }
  }, [isAuthenticated, loading, router]);

  const handleAddPaymentMethod = async (data: PaymentMethodData) => {
    try {
      // This would normally send data to an API
      // const response = await paymentService.addPaymentMethod(data);
      
      // Mock adding a new payment method
      const newMethod: PaymentMethod = {
        id: `${Date.now()}`,
        type: 'card',
        details: {
          last4: data.cardNumber.slice(-4),
          brand: getCardBrand(data.cardNumber),
          expiryDate: data.expiryDate
        },
        isDefault: paymentMethods.length === 0 // Make default if it's the first one
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setShowAddForm(false);
      setSuccessMessage('Payment method added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding payment method');
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    setSuccessMessage('Default payment method updated');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      // Don't allow deletion of the default payment method if it's the only one
      const methodToDelete = paymentMethods.find(method => method.id === id);
      if (methodToDelete?.isDefault && paymentMethods.length > 1) {
        setError('Cannot delete the default payment method. Please set another method as default first.');
        return;
      }
      
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      setSuccessMessage('Payment method deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  // Simple function to determine card brand based on first digit
  const getCardBrand = (cardNumber: string): string => {
    const firstDigit = cardNumber.replace(/\s/g, '').charAt(0);
    
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'Mastercard';
      case '3':
        return 'American Express';
      case '6':
        return 'Discover';
      default:
        return 'Card';
    }
  };

  const getCardIcon = (brand: string): string => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'american express':
        return '💳 Amex';
      case 'discover':
        return '💳 Discover';
      default:
        return '💳 Card';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Payment Methods</h2>
            <Button 
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              Add Payment Method
            </Button>
          </div>

          {paymentMethods.length === 0 && !showAddForm ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any payment methods saved yet.</p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`border rounded-lg p-4 ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {getCardIcon(method.details.brand)}
                        <span className="ml-2">•••• {method.details.last4}</span>
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Expires {method.details.expiryDate}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddForm && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Payment Method</h3>
              <PaymentMethodForm
                onSave={handleAddPaymentMethod}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
        <p className="text-gray-600 mb-4">
          Your payment information is securely stored and processed. We never store your full card details.
        </p>
        <div className="space-y-2">
          <Link href="/payments/history">
            <Button variant="outline" fullWidth>
              View Payment History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}