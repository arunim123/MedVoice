
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Activity, User, UserPlus } from 'lucide-react';
import { UserProfile } from '../types';
import { MOCK_USER_PROFILE } from '../services/mockData';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering && password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    setLoading(true);
    // Simulate network request
    setTimeout(() => {
        setLoading(false);
        // Mock successful login/registration
        onLogin({
            ...MOCK_USER_PROFILE,
            name: isRegistering ? fullName : (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)), // Simple name extraction
            email: email,
        });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-500">
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
             {/* Decorative background circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

             <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm relative z-10">
                <Activity className="text-white w-8 h-8" />
             </div>
             <h1 className="text-2xl font-bold text-white relative z-10">MedVoice Portal</h1>
             <p className="text-indigo-100 mt-2 relative z-10">
                {isRegistering ? "Create your patient account" : "Secure Patient Access"}
             </p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                {isRegistering && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                required={isRegistering}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {isRegistering && (
                    <div className="animate-in slide-in-from-top-2 duration-300 delay-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required={isRegistering}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center shadow-lg shadow-indigo-200"
                >
                    {loading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        isRegistering ? (
                            <>Create Account <UserPlus className="ml-2 w-4 h-4" /></>
                        ) : (
                            <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
                        )
                    )}
                </button>
            </form>
            
            <div className="mt-6 flex flex-col items-center space-y-4">
                <div className="text-sm text-gray-600">
                    {isRegistering ? "Already have an account?" : "New to MedVoice?"}
                    <button 
                        onClick={() => { setIsRegistering(!isRegistering); setFullName(''); setConfirmPassword(''); }}
                        className="ml-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {isRegistering ? "Sign In" : "Register Now"}
                    </button>
                </div>

                {!isRegistering && (
                     <div className="text-xs text-center text-gray-400 w-full pt-4 border-t border-gray-100">
                        <p className="mb-2">Protected by SSL Encryption.</p>
                        <button 
                            className="text-indigo-400 hover:text-indigo-600 transition-colors" 
                            onClick={() => { setEmail('guest@medvoice.ai'); setPassword('demo123'); }}
                        >
                            Auto-fill Demo Credentials
                        </button>
                    </div>
                )}
                
                {/* Copyright Notice */}
                <div className="text-[10px] text-gray-400 pt-2 text-center">
                    © Arunim, Atharav, Jervin
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
