import React from 'react';
import { MOCK_USERS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Grid, List, MapPin, Heart } from 'lucide-react';

export const ChoosePage: React.FC = () => {
  const navigate = useNavigate();
  const users = MOCK_USERS.filter(u => u.id !== 'support');

  return (
    <div className="min-h-full bg-gray-50 pb-4 font-sans text-gray-900">
       {/* Header */}
       <div className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold mx-auto text-gray-900">Discover</h1>
        <div className="absolute right-4 flex space-x-3">
             <Grid size={22} className="text-primary cursor-pointer" />
        </div>
      </div>

       {/* Banner */}
       <div className="mx-4 my-4 rounded-2xl overflow-hidden relative aspect-[2/1] shadow-lg">
            <img 
                src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop" 
                alt="Banner" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded mb-1 inline-block">PREMIUM</span>
                <p className="font-bold text-lg leading-tight">Elite Members Only</p>
            </div>
       </div>

       {/* Section Header */}
       <div className="flex items-center justify-center mb-6">
            <span className="h-px w-8 bg-gray-300"></span>
            <h2 className="mx-3 text-sm font-bold text-gray-500 uppercase tracking-wider">Nearby</h2>
            <span className="h-px w-8 bg-gray-300"></span>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-2 gap-3 px-4">
            {users.map(user => (
                <div key={user.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                    {/* Image Area */}
                    <div className="aspect-[4/5] relative">
                        <img src={user.images[0]} alt={user.name} className="w-full h-full object-cover" />
                        {user.isVip && (
                             <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">VIP</div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center">
                            <Heart size={10} className="mr-1 fill-current" /> {user.likes || 999}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-3">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-900">{user.name}, {user.age}</h3>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            <MapPin size={10} className="mr-1" />
                            {user.residence}
                        </div>
                        <button className="w-full mt-3 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-bold py-2 rounded-lg transition-colors border border-gray-200">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
};