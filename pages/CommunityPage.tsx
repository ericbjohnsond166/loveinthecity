import React from 'react';
import { SUCCESS_STORIES } from '../constants/successStories';
import { Phone, Heart } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50 pb-4 font-sans text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold mx-auto">Success Stories</h1>
      </div>

      {/* Feed */}
      <div className="p-4 space-y-5">
        {SUCCESS_STORIES.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100">
                <div className="p-4">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-primary mr-3">
                            <Heart size={16} fill="currentColor" />
                        </div>
                        <h2 className="font-bold text-gray-900 text-sm leading-tight flex-1">
                            {post.title}
                        </h2>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {post.content}
                    </p>
                    
                    <div className="rounded-xl overflow-hidden mb-3">
                        <img src={post.image} alt="Success Story" className="w-full h-64 object-cover" />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span className="text-primary text-xs font-bold bg-pink-50 px-2 py-1 rounded">Verified Match</span>
                        <span className="text-gray-400 text-xs">{post.timestamp.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};