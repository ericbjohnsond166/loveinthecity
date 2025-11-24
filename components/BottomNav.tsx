import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, Building2, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/community', icon: MessageCircle, label: 'Community' }, 
    { path: '/choose', icon: Heart, label: 'Choose' },
    { path: '/hotel', icon: Building2, label: 'Hotel' },
    { path: '/mine', icon: User, label: 'Mine' },
  ];

  return (
    <nav className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 shadow-lg pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
              isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} fill={isActive ? "currentColor" : "none"} strokeWidth={isActive ? 0 : 2} className="transition-transform duration-200 active:scale-90" />
            <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-primary' : 'text-gray-400'}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};