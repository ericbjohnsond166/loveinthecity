import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit2, Crown, Wallet, ChevronRight, CreditCard, Gift, LogOut, Headset } from 'lucide-react';

interface ProfilePageProps {
    onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-darker pb-20">
      {/* Profile Header */}
      <div className="bg-secondary pb-8 pt-6 px-6 rounded-b-[2.5rem] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">My Profile</h1>
            <Settings className="text-gray-400" size={24} />
        </div>
        
        <div className="flex items-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-primary to-purple-600">
                    <img src="https://picsum.photos/200/200" alt="Me" className="w-full h-full rounded-full object-cover border-4 border-secondary" />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-secondary text-white">
                    <Edit2 size={12} />
                </button>
            </div>
            
            <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    Alex, 27
                    <Crown size={20} className="ml-2 text-gold fill-gold" />
                </h2>
                <p className="text-gray-400 text-sm mb-3">ID: 8839201</p>
                <div className="flex space-x-4">
                    <div className="text-center">
                        <span className="block font-bold text-white">128</span>
                        <span className="text-xs text-gray-500">Following</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-white">4.5k</span>
                        <span className="text-xs text-gray-500">Fans</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* VIP Banner */}
      <div className="mx-4 -mt-6 mb-6 bg-gradient-to-r from-gray-900 to-black p-4 rounded-2xl border border-gold/30 shadow-xl flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-gold font-bold text-lg">FUNLOVES VIP</h3>
            <p className="text-gray-400 text-xs">Unlock exclusive features today</p>
        </div>
        <button 
            onClick={() => navigate('/vip')}
            className="relative z-10 bg-gradient-to-r from-gold to-yellow-600 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
        >
            UPGRADE
        </button>
        {/* Decorative background element */}
        <Crown className="absolute -right-4 -bottom-4 text-gold/10 w-24 h-24 rotate-12" />
      </div>

      {/* Wallet Section */}
      <div className="px-4 mb-6">
        <div className="bg-secondary rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center text-white">
                    <Wallet className="mr-2 text-blue-400" size={20} />
                    My Wallet
                </h3>
                <span className="text-2xl font-bold text-white">$450.00</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-darker py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition">Deposit</button>
                <button className="bg-darker py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition">Withdraw</button>
            </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-3">
        {[
            { icon: CreditCard, label: 'Bank Cards', value: '2 Cards', path: null },
            { icon: Gift, label: 'Rewards & Games', value: 'Play', path: null },
            { icon: Crown, label: 'Member Center', value: 'Level 2', path: '/vip' },
            { icon: Headset, label: 'Customer Service', value: '24/7', path: '/messages' },
        ].map((item, i) => (
            <button 
                key={i} 
                onClick={() => item.path && navigate(item.path)}
                className="w-full bg-secondary p-4 rounded-xl flex items-center justify-between hover:bg-gray-800 transition"
            >
                <div className="flex items-center">
                    <div className="bg-darker p-2 rounded-full mr-3 text-gray-300">
                        <item.icon size={18} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center text-gray-500">
                    <span className="text-sm mr-2">{item.value}</span>
                    <ChevronRight size={16} />
                </div>
            </button>
        ))}
        
        <button onClick={onLogout} className="w-full bg-secondary p-4 rounded-xl flex items-center text-red-500 mt-4 hover:bg-gray-800 transition">
             <div className="bg-darker p-2 rounded-full mr-3 text-red-500">
                <LogOut size={18} />
             </div>
             <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};