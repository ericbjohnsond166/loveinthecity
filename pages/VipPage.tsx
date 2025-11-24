import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Crown, Star, Zap, Eye, MessageCircle, Headset, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VIP_TIERS = [
  {
    id: 'bronze',
    name: 'Bronze VIP',
    level: 1,
    price: 9.99,
    color: 'bg-amber-700',
    gradient: 'from-amber-700 to-amber-500',
    features: ['Unlimited Swipes', '5 Super Likes/day']
  },
  {
    id: 'silver',
    name: 'Silver VIP',
    level: 2,
    price: 19.99,
    color: 'bg-gray-400',
    gradient: 'from-gray-400 to-gray-300',
    features: ['Unlimited Swipes', '10 Super Likes/day', 'See Who Likes You']
  },
  {
    id: 'gold',
    name: 'Gold VIP',
    level: 3,
    price: 29.99,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-400',
    features: ['All Silver Benefits', 'Priority Matching', 'Read Receipts', 'Profile Boosting']
  },
  {
    id: 'diamond',
    name: 'Diamond VIP',
    level: 4,
    price: 49.99,
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-cyan-400',
    features: ['All Gold Benefits', 'Personal Advisor', 'Exclusive Badge', 'Incognito Mode']
  }
];

export const VipPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(VIP_TIERS[2]); // Default to Gold
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <div className="min-h-full bg-gray-50 pb-20 overflow-x-hidden relative font-sans text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm p-4 flex items-center">
        <button 
            onClick={() => navigate(-1)} 
            className="p-1 -ml-1 rounded-full hover:bg-gray-100"
        >
            <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="ml-2 text-lg font-bold">VIP Membership</h1>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-6 text-center bg-white border-b border-gray-100">
        <div className="inline-block p-4 rounded-full bg-yellow-50 mb-4">
            <Crown size={40} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
            Upgrade Your Life
        </h2>
        <p className="text-gray-500 text-sm px-4">Unlock exclusive features and find your perfect match 3x faster.</p>
      </div>

      {/* Benefits Carousel */}
      <div className="mt-6 mb-8 overflow-x-auto scrollbar-hide px-4 flex space-x-4">
        {[
            { icon: Zap, title: "Boost Profile", desc: "Get 10x more views" },
            { icon: Eye, title: "See Likes", desc: "Know who likes you" },
            { icon: MessageCircle, title: "Read Receipts", desc: "Know when they read it" },
            { icon: Star, title: "Unlimited", desc: "Swipe without limits" }
        ].map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-32 bg-white p-4 rounded-xl flex flex-col items-center text-center border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-700">
                    <item.icon size={16} />
                </div>
                <h3 className="font-bold text-xs mb-1">{item.title}</h3>
                <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
            </div>
        ))}
      </div>

      {/* Tiers Selection */}
      <div className="px-4 space-y-4">
        {VIP_TIERS.map((tier) => (
          <motion.div 
            key={tier.id}
            onClick={() => setSelectedTier(tier)}
            className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                selectedTier.id === tier.id 
                ? `border-primary bg-white shadow-md` 
                : 'border-transparent bg-white shadow-sm'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-5 flex justify-between items-center relative z-10">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-lg font-bold`}>
                            {tier.name}
                        </h3>
                        {selectedTier.id === tier.id && (
                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Selected</span>
                        )}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        ${tier.price}<span className="text-sm text-gray-400 font-normal">/mo</span>
                    </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedTier.id === tier.id ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                    {selectedTier.id === tier.id && <Check size={14} className="text-white" />}
                </div>
            </div>

            {/* Features List for Selected */}
            <motion.div 
                initial={false}
                animate={{ height: selectedTier.id === tier.id ? 'auto' : 0, opacity: selectedTier.id === tier.id ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="px-5 pb-5 pt-0 grid grid-cols-1 gap-2 border-t border-gray-100 mt-2 pt-3">
                    {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                            <Check size={14} className="text-green-500 mr-2" />
                            {feature}
                        </div>
                    ))}
                </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
            <button 
                onClick={() => setShowSupportModal(true)}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg bg-gradient-to-r ${selectedTier.gradient} flex items-center justify-center`}
            >
                Get {selectedTier.name}
            </button>
        </div>
      </div>

      {/* Contact Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSupportModal(false)} />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary relative">
                            <Headset size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Reservation</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            To ensure safety and verify identity, all VIP upgrades are processed by our support team.
                        </p>
                        <button 
                            onClick={() => {
                                setShowSupportModal(false);
                                navigate('/messages');
                            }}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition shadow-lg shadow-primary/25 mb-3"
                        >
                            Contact Support
                        </button>
                        <button 
                            onClick={() => setShowSupportModal(false)}
                            className="py-2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};