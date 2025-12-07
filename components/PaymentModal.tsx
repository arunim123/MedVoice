
import React, { useState } from 'react';
import { CreditCard, CheckCircle, Shield, X, ShieldCheck } from 'lucide-react';
import { Insurance } from '../types';

interface PaymentModalProps {
    bookingId: string;
    amount: number;
    doctorName: string;
    onSuccess: () => void;
    onCancel: () => void;
    insurance: Insurance;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ bookingId, amount, doctorName, onSuccess, onCancel, insurance }) => {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const discount = amount * insurance.coverage;
    const finalAmount = amount - discount;

    const handlePay = () => {
        setProcessing(true);
        // Simulate gateway delay
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
                    <p className="text-gray-500 mt-2">Booking ID: {bookingId}</p>
                    <p className="text-sm text-gray-400 mt-4">Redirecting to chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="font-bold">Secure Payment Gateway</span>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500">Consultation with</p>
                        <p className="font-bold text-lg text-gray-900">{doctorName}</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Total Fee</span>
                                <span className="line-through">₹{amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                                <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Insurance ({(insurance.coverage*100).toFixed(0)}%)</span>
                                <span>-₹{discount.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-900 font-bold">You Pay</span>
                                <span className="font-bold text-xl text-indigo-600">₹{finalAmount.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700">Payment Method</p>
                        <div className="flex space-x-2">
                            <div className="flex-1 border-2 border-indigo-600 bg-indigo-50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer">
                                <CreditCard className="w-6 h-6 text-indigo-600 mb-1" />
                                <span className="text-xs font-bold text-indigo-700">Card</span>
                            </div>
                            <div className="flex-1 border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center opacity-50 cursor-not-allowed">
                                <span className="text-xs font-bold">UPI</span>
                            </div>
                            <div className="flex-1 border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center opacity-50 cursor-not-allowed">
                                <span className="text-xs font-bold">NetBanking</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <input 
                                type="text" 
                                value="4242 4242 4242 4242" 
                                readOnly 
                                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handlePay}
                        disabled={processing}
                        className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg shadow-indigo-200"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            `Pay ₹${finalAmount.toFixed(0)}`
                        )}
                    </button>
                    
                    <div className="mt-4 flex justify-center space-x-4">
                         <img src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png" alt="Visa" className="h-6 opacity-60" />
                         <img src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-2-226448.png" alt="Mastercard" className="h-6 opacity-60" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
