// ============================================
// PAYMENT PAGE
// Payment processing for classes
// ============================================

import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClassById, addPayment } from '@/data/store';
import type { Class } from '@/types';

interface PaymentProps {
  classId: string | null;
  onNavigate: (page: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ classId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [classData, setClassData] = useState<Class | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'payhere' | 'bank'>('payhere');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bankSlip, setBankSlip] = useState<File | null>(null);

  useEffect(() => {
    if (classId) {
      const data = getClassById(classId);
      setClassData(data || null);
    }
  }, [classId]);

  if (!currentUser) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login</h3>
          <p className="text-gray-500 mb-4">You need to login to make a payment</p>
          <button onClick={() => onNavigate('login')} className="btn-primary">
            Login Now
          </button>
        </div>
      </section>
    );
  }

  if (!classData) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Class Not Found</h3>
          <button onClick={() => onNavigate('store')} className="btn-primary">
            Browse Classes
          </button>
        </div>
      </section>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      addPayment({
        studentId: currentUser.id,
        classId: classData.id,
        amount: classData.price,
        method: paymentMethod === 'payhere' ? 'payhere' : 'bank_transfer',
        status: paymentMethod === 'payhere' ? 'completed' : 'pending',
        bankSlipUrl: bankSlip ? URL.createObjectURL(bankSlip) : undefined
      });

      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            {paymentMethod === 'payhere' 
              ? 'Your payment has been processed. You can now access the class.'
              : 'Your bank slip has been submitted for approval. You will be notified once approved.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => onNavigate('my-classes')} className="btn-primary">
              Go to My Classes
            </button>
            <button onClick={() => onNavigate('store')} className="btn-secondary">
              Browse More
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom max-w-2xl">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('store')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">{classData.name}</p>
              <p className="text-sm text-gray-500 sinhala-text">{classData.nameSinhala}</p>
            </div>
            <p className="font-bold text-gray-900">Rs. {classData.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center py-3">
            <p className="font-semibold text-gray-900">Total</p>
            <p className="text-2xl font-bold text-blue-700">Rs. {classData.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            {/* PayHere Option */}
            <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'payhere' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                value="payhere"
                checked={paymentMethod === 'payhere'}
                onChange={() => setPaymentMethod('payhere')}
                className="w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">PayHere (Online)</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pay with credit/debit card instantly</p>
              </div>
            </label>

            {/* Bank Transfer Option */}
            <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                className="w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Bank Transfer</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Upload bank slip for verification</p>
              </div>
            </label>
          </div>

          {/* Bank Details (if bank transfer selected) */}
          {paymentMethod === 'bank' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Bank Account Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Bank:</span> <span className="font-medium">Commercial Bank</span></p>
                <p><span className="text-gray-500">Account Name:</span> <span className="font-medium">Science with Kalana</span></p>
                <p><span className="text-gray-500">Account Number:</span> <span className="font-medium">1234567890</span></p>
                <p><span className="text-gray-500">Branch:</span> <span className="font-medium">Colombo</span></p>
              </div>
              
              <div className="mt-4">
                <label className="form-label">Upload Bank Slip</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload bank slip</p>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setBankSlip(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                {bankSlip && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {bankSlip.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading || (paymentMethod === 'bank' && !bankSlip)}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {paymentMethod === 'payhere' ? 'Pay Now' : 'Submit for Approval'}
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Payment;
