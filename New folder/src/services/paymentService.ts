// Mock payment service - in a real app, this would connect to a payment gateway like Stripe, Razorpay, etc.
export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  userId: string;
  bookingId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  paymentId?: string;
}

export const paymentService = {
  // Process payment
  async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would call the payment gateway API
        // For demo purposes, we'll simulate a successful payment
        if (Math.random() > 0.1) { // 90% success rate for demo
          resolve({
            success: true,
            transactionId: `TXN${Date.now()}`,
            paymentId: `PAY${Date.now()}`,
            message: 'Payment processed successfully'
          });
        } else {
          resolve({
            success: false,
            message: 'Payment failed. Please try again.'
          });
        }
      }, 1500);
    });
  },

  // Verify payment
  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId,
          message: 'Payment verified successfully'
        });
      }, 1000);
    });
  },

  // Refund payment
  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId,
          message: `Refund processed for transaction ${transactionId}`
        });
      }, 1500);
    });
  },

  // Get payment methods
  getPaymentMethods() {
    return [
      { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
      { id: 'upi', name: 'UPI', icon: '📱' },
      { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
      { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
    ];
  },

  // Validate card details (mock)
  validateCardDetails(cardNumber: string, expiry: string, cvv: string) {
    // Basic validation
    const cardNum = cardNumber.replace(/\s/g, '');
    
    if (cardNum.length < 16) {
      return { valid: false, error: 'Card number must be 16 digits' };
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return { valid: false, error: 'Invalid expiry date format (MM/YY)' };
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
      return { valid: false, error: 'CVV must be 3-4 digits' };
    }
    
    return { valid: true, error: null };
  }
};