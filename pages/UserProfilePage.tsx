import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../constants';
import { ChevronLeft, Heart, Star, MapPin, MessageCircle, ChevronLeft as SwipeLeft, ChevronRight as SwipeRight } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = MOCK_USERS.find(u => u.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="min-h-full bg-gray-50 flex items-center justify-center font-sans text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
          <button 
            type="button"
            onClick={() => navigate('/choose')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImageIndex < user.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (currentImageIndex < user.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-40 shadow-sm">
        <button type="button" onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <span className="font-bold text-lg">{user.name}</span>
        <div className="w-6"></div>
      </div>

      {/* Sticky Reserve Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4 z-30 max-w-md mx-auto">
        <button
          onClick={() => navigate(`/messages?partnerId=${user.id}`)}
          className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-pink-600 hover:to-primary text-white rounded-2xl py-4 font-bold shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center space-x-2 group"
        >
          <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
          <span>Reserve Now</span>
        </button>
      </div>

      {/* Info Block */}
      <div className="bg-white p-5 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin size={14} className="mr-1" />
              {user.residence || 'USA'} • {user.age} y/o
            </div>

            <div className="flex space-x-2 mb-4">
              {user.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-pink-50 rounded-full p-2.5 mb-1">
              <Heart className="text-primary fill-current" size={22} />
            </div>
            <span className="text-xs font-bold text-gray-600">{user.likes || 999}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Height</p>
            <p className="font-semibold">{user.height}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Bust</p>
            <p className="font-semibold">{user.bust}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs font-bold mr-2 text-gray-500">Rating:</span>
            <div className="flex text-yellow-400">
              {[...Array(user.chargeRange || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
          </div>
          <button
            onClick={() => navigate(`/messages?partnerId=${user.id}`)}
            className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition active:scale-95"
          >
            Reserve Now
          </button>
        </div>
      </div>

      {/* Gallery Thumbnails */}
      <div className="bg-white p-4 mb-3 shadow-sm">
        <h3 className="font-bold text-sm mb-3 text-gray-900">Gallery</h3>
        <div className="grid grid-cols-4 gap-2">
          {user.images.map((img, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={img} 
                className="w-full h-full object-cover" 
                alt=""
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b6b&color=fff&size=200&font-size=0.5`;
                }}
              />
            </div>
          ))}
          {[...Array(Math.max(0, 4 - user.images.length))].map((_, i) => (
            <div key={`filler-${i}`} className="aspect-square bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Large Portrait Image with Swipe */}
      <div className="w-full aspect-[3/4] bg-white relative overflow-hidden">
        {/* Swipeable Image Container */}
        <div
          ref={containerRef}
          className="w-full h-full relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={user.images[currentImageIndex]}
            className="w-full h-full object-cover"
            alt={`Image ${currentImageIndex + 1}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b6b&color=fff&size=200&font-size=0.5`;
            }}
          />

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <SwipeLeft size={20} />
            </button>
          )}

          {currentImageIndex < user.images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <SwipeRight size={20} />
            </button>
          )}

          {/* Image Counter */}
          {user.images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {user.images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {user.images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex space-x-2 justify-center">
              {user.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Profile Bio */}
      {user.bio && (
        <div className="bg-white p-5 mb-3 shadow-sm">
          <p className="text-xs text-primary uppercase font-bold mb-3">Personal profile</p>
          <p className="text-sm text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}
    </div>
  );
};
