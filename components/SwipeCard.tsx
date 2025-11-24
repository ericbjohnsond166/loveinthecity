import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { User } from '../types';
import { MapPin, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe, active }) => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Visual indicators
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/user/${user.id}`);
  };

  if (!active) return null;

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full p-4 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-secondary">
        {/* Background Image */}
        <img
          src={user.images[0]}
          alt={user.name}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none" />

        {/* Swipe Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-1 transform -rotate-12 z-20">
            <span className="text-green-500 font-bold text-4xl uppercase tracking-widest">LIKE</span>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-1 transform rotate-12 z-20">
            <span className="text-red-500 font-bold text-4xl uppercase tracking-widest">NOPE</span>
        </motion.div>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-6 text-white pointer-events-none">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
            {user.isVip && (
                <span className="bg-gold text-black text-xs font-bold px-2 py-0.5 rounded-full">VIP</span>
            )}
          </div>
          
          <div className="flex items-center text-gray-300 text-sm mb-4">
             <MapPin size={14} className="mr-1" />
             <span>{user.distance} km away</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {user.tags.map(tag => (
                <span key={tag} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                    {tag}
                </span>
            ))}
          </div>

          <p className="text-gray-200 line-clamp-2">{user.bio}</p>
        </div>
        
        {/* Info Button - Now Interactive */}
        <button 
            onPointerDown={handleInfoClick}
            className="absolute bottom-28 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-white/30 transition z-30"
        >
             <Info size={20} />
        </button>
      </div>
    </motion.div>
  );
};