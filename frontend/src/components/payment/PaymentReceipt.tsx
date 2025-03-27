import { useState } from 'react';
import Button from '@/components/ui/Button';

interface PaymentReceiptProps {
  paymentData: {
    id: string;
    amount: number;
    currency: string;
    date: string;
    type: string;
    recipientName: string;
    description: string;
    reference: string;
  };
  onClose: () => void;
}

export default function PaymentReceipt({ paymentData, onClose }: PaymentReceiptProps) {
  const [showPrintVersion, setShowPrintVersion] = useState(false);

  const handlePrint = () => {
    setShowPrintVersion(true);
    setTimeout(() => {
      window.print();
      setShowPrintVersion(false);
    }, 100);
  };

  if (showPrintVersion) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">PrimePlus+</h1>
          <p className="text-gray-500">Payment Receipt</p>
        </div>
        
        <div className="border-t border-b py-4 my-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Receipt Number</p>
              <p className="font-medium">{paymentData.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{new Date(paymentData.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Type</p>
              <p className="font-medium">{paymentData.type}</p>
            </div>
            <div>
              <p className="text-gray-500">Reference</p>
              <p className="font-medium">{paymentData.reference}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-500">Recipient</p>
          <p className="font-medium">{paymentData.recipientName}</p>
          <p className="text-gray-500 mt-4">Description</p>
          <p className="font-medium">{paymentData.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>{paymentData.currency} {paymentData.amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Thank you for using PrimePlus+</p>
          <p>This is an automatically generated receipt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="bg-blue-600 text-white px-6 py-4">
        <h3 className="text-xl font-semibold">Payment Receipt</h3>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900">Payment Successful</h4>
          <p className="text-sm text-gray-500">Transaction ID: {paymentData.id}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{new Date(paymentData.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient:</span>
            <span className="font-medium">{paymentData.recipientName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Type:</span>
            <span className="font-medium">{paymentData.type}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Description:</span>
            <span className="font-medium">{paymentData.description}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Reference:</span>
            <span className="font-medium">{paymentData.reference}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Amount:</span>
            <span>{paymentData.currency} {paymentData.amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            Print Receipt
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}