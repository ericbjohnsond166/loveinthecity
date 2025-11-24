import React from 'react';
import { PARTNER_HOTELS } from '../constants';
import { ClipboardList, Phone, Star } from 'lucide-react';

export const HotelPage: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50 pb-4 text-gray-900 font-sans">
        {/* Header Icons */}
        <div className="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-40 shadow-sm">
            <h1 className="font-bold text-xl">Hotel Partners</h1>
            <div className="bg-[#25D366] rounded-full p-2 w-9 h-9 flex items-center justify-center shadow-md">
                <Phone size={18} className="text-white fill-current" />
            </div>
        </div>

        {/* Main Banner */}
        <div className="mx-4 my-4 relative group rounded-2xl overflow-hidden shadow-lg">
             <div className="aspect-video relative">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hotel" />
                <div className="absolute top-4 right-0 bg-[#003580] text-white px-3 py-1 text-xs font-bold rounded-l-md shadow-md">Booking.com</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-lg font-bold">Luxury Escapes</h2>
                    <p className="text-xs text-gray-200">Exclusive partner rates for members</p>
                </div>
             </div>
        </div>

        {/* Match Promo */}
        <div className="mx-4 bg-white rounded-2xl p-5 text-center border border-pink-100 shadow-soft mb-8">
            <div className="inline-block p-2 bg-pink-50 rounded-full mb-3 text-primary">
                <Star size={20} fill="currentColor" />
            </div>
            <h3 className="text-gray-900 font-bold mb-2 text-lg">First Date Exclusive</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Celebrate your first intimate meeting with a <span className="text-primary font-bold">complimentary one-night stay</span> in a luxury couple’s suite.
            </p>
        </div>

        {/* Hotel List */}
        <div className="px-4">
            <h3 className="font-bold mb-4 text-gray-900 text-lg">Featured Hotels</h3>
            <div className="grid grid-cols-2 gap-4">
                {PARTNER_HOTELS.map((hotel, idx) => (
                    <div key={hotel.id} className="bg-white rounded-xl overflow-hidden shadow-soft border border-gray-100 group cursor-pointer hover:shadow-lg transition-all">
                         <div className="h-32 overflow-hidden relative">
                             <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={hotel.name} />
                             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold text-[#003580]">Booking</div>
                         </div>
                         <div className="p-3">
                             <div className="font-bold text-gray-900 text-sm mb-1 truncate">{hotel.name}</div>
                             <div className="flex text-yellow-400">
                                <Star size={10} fill="currentColor" />
                                <Star size={10} fill="currentColor" />
                                <Star size={10} fill="currentColor" />
                                <Star size={10} fill="currentColor" />
                                <Star size={10} fill="currentColor" />
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};