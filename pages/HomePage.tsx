import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Volume2, Star, Check, X, Phone, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Whatsapp Icon Component for reuse
const WhatsAppIcon = ({ size = 24 }) => (
  <div className={`bg-[#25D366] rounded-full p-1 flex items-center justify-center shadow-md`} style={{ width: size, height: size }}>
    <Phone className="text-white fill-current" size={size * 0.6} />
  </div>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Show modal on first load
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenHomeModal');
    if (!hasSeenModal) {
        setTimeout(() => setShowModal(true), 500);
    }
  }, []);

  const handleCloseModal = () => {
      setShowModal(false);
      sessionStorage.setItem('hasSeenHomeModal', 'true');
  };

  // Filter out support user
  const recommendedUsers = MOCK_USERS.filter(u => u.id !== 'support');
  const highEndUsers = recommendedUsers.slice(0, 5);

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 pb-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-40 shadow-sm">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Love in the City</h1>
        <WhatsAppIcon size={32} />
      </div>

      {/* Hero Banner */}
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden relative aspect-[16/9] shadow-lg mt-4 group">
        <img 
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop" 
            alt="Banner" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
             <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 text-xs font-bold rounded-full mb-2 inline-block">Featured</span>
             <p className="text-white text-lg font-bold">Find your special connection today</p>
        </div>
      </div>

      {/* Ticker */}
      <div className="mx-4 mb-6 bg-white rounded-full flex items-center px-4 py-2.5 shadow-sm border border-gray-100">
        <Volume2 size={16} className="text-primary mr-2" />
        <div className="flex-1 overflow-hidden whitespace-nowrap">
            <p className="text-gray-600 text-xs font-medium animate-marquee inline-block">
                Customer Service Hours (New York Time): 24/7 Online Support. Verification required for all dates.
            </p>
        </div>
      </div>

      {/* Customer Care CTA */}
      <div className="mx-4 mb-6">
        <button
          onClick={() => navigate('/messages')}
          className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-pink-600 hover:to-primary text-white rounded-2xl p-5 shadow-xl shadow-primary/30 active:scale-95 transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Send size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">💬 Need Help?</p>
              <p className="text-xs opacity-90">Contact Customer Care - Match with a Partner</p>
            </div>
            <div className="flex-1"></div>
            <div className="text-xl font-bold">→</div>
          </div>
        </button>
      </div>

      {/* High-end Zone */}
      <div className="mb-6 pl-4">
        <div className="flex items-center mb-3">
            <span className="text-gray-900 font-bold text-lg mr-2">High-end Zone</span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] px-2 py-0.5 font-bold rounded shadow-sm">Premium</span>
        </div>
        <div className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide pr-4">
            {highEndUsers.map(user => (
                <div key={user.id} className="flex-shrink-0 w-24 relative group cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                    <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-primary transition-all shadow-md">
                        <img src={user.images[0]} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Verified
                    </div>
                    <p className="text-center text-gray-700 text-sm mt-2 font-medium">{user.name}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Recommended Connections */}
      <div className="px-4 pb-20">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star size={18} className="mr-2 text-yellow-400 fill-yellow-400" />
            Recommended For You
        </h2>
        <div className="space-y-4">
            {recommendedUsers.map(user => (
                <div key={user.id} className="bg-white rounded-2xl p-3 flex shadow-soft active:scale-98 transition-transform border border-gray-100 cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                    {/* Image */}
                    <div className="w-24 h-28 flex-shrink-0 relative mr-3">
                        <img src={user.images[0]} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute top-1 left-1 bg-black/50 backdrop-blur text-white text-[8px] font-bold px-1.5 py-0.5 rounded">New</div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-gray-900 font-bold text-lg">{user.name}, {user.age}</h3>
                                <div className="flex text-yellow-400">
                                    {[...Array(user.chargeRange || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                                {user.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-medium">{tag}</span>
                                ))}
                            </div>
                            
                            <div className="text-[11px] text-gray-500 space-y-0.5">
                                <p>{user.serviceCity || 'USA'} • {user.distance}km away</p>
                            </div>
                        </div>
                        <button className="w-full bg-gray-900 text-white text-xs font-bold py-2 rounded-lg mt-1 shadow hover:bg-black transition-colors">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
            >
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
                    <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                    
                    <h3 className="font-bold text-center text-2xl mb-4 text-primary">
                        Welcome Back!
                    </h3>

                    <div className="space-y-4 text-sm text-gray-600">
                        <p className="text-center">
                            Please update your contact info to stay connected with your matches.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                             <div className="flex items-center">
                                <Phone size={18} className="text-green-500 mr-3" />
                                <span className="font-bold text-gray-800">WA: +1 408 914 0908</span>
                             </div>
                             <div className="flex items-center">
                                <Send size={18} className="text-blue-500 mr-3" />
                                <span className="font-bold text-gray-800">TG: @TrueLove_Official01</span>
                             </div>
                        </div>

                        <div className="bg-primary/5 p-3 rounded-xl">
                            <p className="font-bold flex items-center text-primary mb-1"><Star size={14} fill="currentColor" className="mr-1" /> First Date Benefit</p>
                            <p className="text-xs text-gray-500">Enjoy a free stay in a 5-star hotel when you book your first date through us.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCloseModal}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-6 shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
                    >
                        Got it!
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};