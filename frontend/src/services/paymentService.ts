import api from './api';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  brand?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description: string;
  paymentMethod: PaymentMethod;
}

export interface EarningsData {
  totalEarnings: number;
  currentMonthEarnings: number;
  pendingPayouts: number;
  lastPayout?: {
    amount: number;
    date: string;
  };
}

export const paymentService = {
  // Create new payment
  createPayment: async (amount: number, currency: string, description: string) => {
    try {
      const response = await api.post('/payments', {
        amount,
        currency,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Send tip to creator
  sendTip: async (creatorId: string, amount: number, currency: string) => {
    try {
      const response = await api.post(`/payments/tip/${creatorId}`, {
        amount,
        currency
      });
      return response.data;
    } catch (error) {
      console.error('Error sending tip:', error);
      throw error;
    }
  },

  // Get logged-in user's payment history
  getPaymentHistory: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/payments/history', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Get creator earnings data (only for creator or admin)
  getEarningsData: async (creatorId: string) => {
    try {
      const response = await api.get(`/payments/earnings/${creatorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }
  },

  // Payment method management functions
  paymentMethods: {
    // Get all payment methods
    getAll: async () => {
      try {
        const response = await api.get('/payment-methods');
        return response.data;
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
      }
    },

    // Add new payment method
    add: async (paymentMethodData: any) => {
      try {
        const response = await api.post('/payment-methods', paymentMethodData);
        return response.data;
      } catch (error) {
        console.error('Error adding payment method:', error);
        throw error;
      }
    },

    // Update payment method
    update: async (paymentMethodId: string, updateData: any) => {
      try {
        const response = await api.put(`/payment-methods/${paymentMethodId}`, updateData);
        return response.data;
      } catch (error) {
        console.error('Error updating payment method:', error);
        throw error;
      }
    },

    // Delete payment method
    delete: async (paymentMethodId: string) => {
      try {
        const response = await api.delete(`/payment-methods/${paymentMethodId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting payment method:', error);
        throw error;
      }
    },

    // Set default payment method
    setDefault: async (paymentMethodId: string) => {
      try {
        const response = await api.post(`/payment-methods/${paymentMethodId}/default`);
        return response.data;
      } catch (error) {
        console.error('Error setting default payment method:', error);
        throw error;
      }
    }
  },

  // Pay for subscription
  paySubscription: async (creatorId: string, planId: string, paymentMethodId?: string) => {
    try {
      const response = await api.post(`/payments/subscription/${creatorId}`, {
        planId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      console.error('Error paying for subscription:', error);
      throw error;
    }
  },

  // Pay for single content
  payContent: async (contentId: string, paymentMethodId?: string) => {
    try {
      const response = await api.post(`/payments/content/${contentId}`, {
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      console.error('Error paying for content:', error);
      throw error;
    }
  }
};

export default paymentService;