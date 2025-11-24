import React from 'react';
import { Heart, Phone, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-gray-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-glow rotate-3 flex items-center justify-center mb-6">
                <Heart className="text-primary fill-primary" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm text-center">Love in the City</h1>
            <p className="text-white/90 text-lg font-medium mt-2">Where connections happen</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl">
            <div className="space-y-5">
                <div>
                    <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Phone Number</label>
                    <input 
                        type="tel" 
                        placeholder="Enter your phone" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium"
                    />
                </div>
                
                <div>
                    <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium"
                    />
                </div>

                <div className="flex justify-end">
                    <button className="text-primary text-sm font-bold hover:underline">Forgot Password?</button>
                </div>

                <button 
                    onClick={onLogin}
                    className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center group"
                >
                    Start Dating
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center space-y-4">
            <button className="text-white font-bold text-sm bg-white/20 px-6 py-2 rounded-full hover:bg-white/30 transition backdrop-blur-md">
                Create New Account
            </button>
            
            <div className="flex items-center text-white/80 text-xs space-x-1">
                 <Phone size={12} />
                 <span>Need help? Contact Support</span>
            </div>
        </div>

      </div>
    </div>
  );
};