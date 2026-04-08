import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentService, PaymentDetails, PaymentResult } from '../../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: any;
  onSuccess: (result: PaymentResult) => void;
  onError: (error: string) => void;
}

export function PaymentModal({ isOpen, onClose, bookingDetails, onSuccess, onError }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      const paymentDetails: PaymentDetails = {
        amount: bookingDetails.totalPrice,
        currency: 'INR',
        description: `Turf booking for ${bookingDetails.turfName} on ${bookingDetails.date}`,
        userId: bookingDetails.userId,
        bookingId: bookingDetails.id
      };

      const result = await paymentService.processPayment(paymentDetails);

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess(result);
          resetForm();
        }, 2000);
      } else {
        setPaymentStatus('failed');
        onError(result.message);
        setTimeout(() => {
          setPaymentStatus('idle');
        }, 3000);
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      onError(error.message || 'Payment failed. Please try again.');
      setTimeout(() => {
        setPaymentStatus('idle');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCardDetails({
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: ''
    });
    setPaymentMethod('card');
    setPaymentStatus('idle');
  };

  const handleCardChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    handleCardChange('cardNumber', formattedValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={paymentStatus === 'processing'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {paymentStatus === 'idle' && (
            <>
              {/* Order Summary */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Turf: {bookingDetails.turfName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Date: {bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Time: {bookingDetails.timeSlot}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Duration: {bookingDetails.duration} hours</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{bookingDetails.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Select Payment Method</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {paymentService.getPaymentMethods().map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg text-sm ${paymentMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                        }`}
                    >
                      <div className="text-xl sm:text-2xl mb-1">{method.icon}</div>
                      <span className="text-xs sm:text-sm">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => handleCardChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter cardholder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                        placeholder="0000 0000 0000 0000"
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardChange('expiry', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">UPI ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="yourname@upi"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Select Bank</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Select your bank</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Select Wallet</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Select wallet</option>
                      <option>Paytm</option>
                      <option>PhonePe</option>
                      <option>Amazon Pay</option>
                      <option>Mobikwik</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isLoading || (paymentMethod === 'card' && !cardDetails.cardNumber)}
                className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4 text-sm sm:text-base"
              >
                {isLoading ? 'Processing...' : `Pay ₹${bookingDetails.totalPrice.toFixed(2)}`}
              </button>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
              <p className="text-gray-600">Please try again with a different payment method.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
