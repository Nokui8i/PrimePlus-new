import React, { useState } from 'react';
import { SubscriptionPlan } from '@/types/subscription';
import Button from '../ui/button';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface SubscribeFormProps {
  plan: SubscriptionPlan;
  onSubmit: (paymentMethod: string, cardDetails?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }) => void;
  isLoading?: boolean;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  plan,
  onSubmit,
  isLoading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'crypto'>('credit_card');
  const [agreed, setAgreed] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'credit_card') {
      onSubmit(paymentMethod, {
        number: cardNumber,
        expiry: cardExpiry,
        cvc: cardCvc,
        name: cardName
      });
    } else {
      onSubmit(paymentMethod);
    }
  };

  // Format interval for display
  const intervalDisplay = {
    monthly: 'month',
    quarterly: '3 months',
    biannual: '6 months',
    annual: 'year'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span>{plan.name}</span>
          {plan.creator?.profileImage && (
            <div className="relative w-6 h-6 ml-2">
              <Image
                src={plan.creator.profileImage}
                alt={plan.creator.username || 'Creator'}
                fill
                sizes="24px"
                className="rounded-full"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <span className="text-sm text-gray-500 ml-1">
            {plan.creator?.username || 'Creator'}
          </span>
        </h3>
        <p className="mt-1 text-gray-600">{plan.description}</p>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
          <span className="ml-1 text-sm text-gray-500">/ {intervalDisplay[plan.interval]}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Plan Features */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">What's included in your plan:</h4>
          <ul className="space-y-2">
            {plan.features?.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Which payment method would you like to use?</h4>
          <div className="mt-2 space-y-4">
            <div className="flex items-center">
              <input
                id="credit_card"
                name="payment_method"
                type="radio"
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="credit_card" className="ml-3 text-sm text-gray-700 font-medium">
                Credit Card
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="paypal"
                name="payment_method"
                type="radio"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="paypal" className="ml-3 text-sm text-gray-700 font-medium">
                PayPal
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="crypto"
                name="payment_method"
                type="radio"
                checked={paymentMethod === 'crypto'}
                onChange={() => setPaymentMethod('crypto')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="crypto" className="ml-3 text-sm text-gray-700 font-medium">
                Cryptocurrency
              </label>
            </div>
          </div>
        </div>

        {/* Credit Card Details - Only show if credit card is selected */}
        {paymentMethod === 'credit_card' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="card_number" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="card_number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card_expiry" className="block text-sm font-medium text-gray-700">
                  Expiration Date
                </label>
                <input
                  type="text"
                  id="card_expiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM / YY"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="card_cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="card_cvc"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="card_name" className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                type="text"
                id="card_name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Terms Agreement */}
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!agreed || isLoading}
          >
            {isLoading ? 'Processing...' : `Subscribe for ${formatCurrency(plan.price)}/${intervalDisplay[plan.interval]}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeForm; 