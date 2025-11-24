import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../constants';
import { Phone, RefreshCw, Video, Lock, ShieldCheck, FileText, Bell, LogOut, ChevronRight } from 'lucide-react';

interface MinePageProps {
    onLogout: () => void;
}

export const MinePage: React.FC<MinePageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  // Using a mock user for the profile
  const me = {
      id: 'me',
      creditScore: 80,
      points: 0.00,
      phone: '123456123456'
  };

  return (
    <div className="min-h-full bg-gray-50 pb-20 relative font-sans text-gray-900">
        {/* Header Background */}
        <div className="bg-white pb-6 pt-8 px-6 shadow-sm rounded-b-[2rem]">
             <div className="flex items-center">
                 <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary p-0.5 mr-4 shadow-md">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Me" className="w-full h-full object-cover rounded-full" />
                 </div>
                 <div className="flex-1">
                     <div className="text-xl font-bold text-gray-900 mb-1">{me.phone}</div>
                     <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-white bg-primary px-2 py-0.5 rounded-full">VIP Member</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">Score: {me.creditScore}</span>
                     </div>
                 </div>
                 <div className="bg-[#25D366] rounded-full p-2 text-white shadow-md">
                     <Phone size={20} />
                 </div>
             </div>
        </div>

        {/* Content Container */}
        <div className="px-4 mt-6">
            {/* Activity Points */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Points Balance</span>
                        <div className="text-4xl font-bold mt-1">{me.points.toFixed(2)}</div>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 transition text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center">
                        Redeem <ChevronRight size={12} className="ml-1" />
                    </button>
                </div>
            </div>

            {/* Grid Menu */}
            <h3 className="text-gray-900 font-bold mb-3 ml-1">Services</h3>
            <div className="bg-white rounded-2xl p-4 grid grid-cols-3 gap-y-6 shadow-soft border border-gray-100 mb-6">
                {[
                    { icon: Video, label: 'Private Videos', color: 'text-pink-500', bg: 'bg-pink-50' },
                    { icon: Lock, label: 'Login Password', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: ShieldCheck, label: 'Payment PIN', color: 'text-purple-500', bg: 'bg-purple-50' },
                    { icon: FileText, label: 'Funding Details', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { icon: Bell, label: 'Announcements', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { icon: Phone, label: 'Support 24/7', color: 'text-green-500', bg: 'bg-green-50' },
                ].map((item, i) => (
                    <button 
                        key={i} 
                        onClick={() => navigate('/messages')}
                        className="flex flex-col items-center justify-center space-y-2 cursor-pointer group"
                    >
                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center transition-transform group-active:scale-95 hover:shadow-md`}>
                            <item.icon size={24} className={item.color} />
                        </div>
                        <span className="text-[11px] font-medium text-gray-600 text-center">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Logout */}
            <button onClick={onLogout} className="w-full bg-white border border-gray-200 text-red-500 py-3.5 rounded-xl font-bold shadow-sm hover:bg-red-50 transition mb-6">
                Log Out
            </button>
        </div>
    </div>
  );
};