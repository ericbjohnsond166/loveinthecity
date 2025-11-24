import React from 'react';
import { MOCK_USERS } from '../constants';
import { Search, Filter, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter out the 'support' user from discovery
  const discoverableUsers = MOCK_USERS.filter(u => u.id !== 'support');

  return (
    <div className="min-h-full bg-darker p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Discover</h1>
        <div className="flex space-x-3">
            <button className="p-2 bg-secondary rounded-full">
                <Search size={20} className="text-gray-400" />
            </button>
            <button className="p-2 bg-secondary rounded-full">
                <Filter size={20} className="text-gray-400" />
            </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
            <Flame className="text-gold mr-2" fill="currentColor" />
            <h2 className="text-lg font-bold text-white">Popular Now</h2>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {discoverableUsers.slice(0,3).map(user => (
                <div 
                    key={user.id} 
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex-shrink-0 relative w-24 h-32 rounded-lg overflow-hidden cursor-pointer"
                >
                    <img src={user.images[0]} alt={user.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute bottom-1 left-1 text-xs font-bold text-white">{user.name}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Main Grid */}
      <h2 className="text-lg font-bold text-white mb-4">Recommended</h2>
      <div className="grid grid-cols-2 gap-3">
        {discoverableUsers.map((user) => (
          <div 
            key={user.id} 
            onClick={() => navigate(`/user/${user.id}`)}
            className="bg-secondary rounded-xl overflow-hidden relative shadow-md group active:scale-95 transition-transform cursor-pointer"
          >
            <div className="aspect-[3/4]">
                <img src={user.images[0]} alt={user.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute top-2 right-2">
                {user.isVip && (
                    <span className="bg-gold/90 backdrop-blur text-black text-[10px] font-bold px-2 py-0.5 rounded">VIP</span>
                )}
            </div>

            <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
              <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{user.name}, {user.age}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">{user.distance}km away</p>
            </div>
          </div>
        ))}
        {/* Fillers for UI demo */}
         {discoverableUsers.map((user) => (
          <div 
            key={`${user.id}-duplicate`} 
            onClick={() => navigate(`/user/${user.id}`)}
            className="bg-secondary rounded-xl overflow-hidden relative shadow-md group active:scale-95 transition-transform cursor-pointer"
          >
             <div className="aspect-[3/4]">
                <img src={user.images[1] || user.images[0]} alt={user.name} className="w-full h-full object-cover opacity-70 grayscale" />
            </div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="bg-black/50 px-3 py-1 rounded-full text-xs border border-white/20">Offline</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};