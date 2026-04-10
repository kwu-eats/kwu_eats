'use client';

import { Restaurant } from '@/types/restaurant';
import { X, MapPin, Heart, Eye, Tag } from 'lucide-react';
import { likeRestaurant } from '@/lib/api';
import { useState } from 'react';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  '한식': 'bg-orange-100 text-orange-700',
  '분식': 'bg-yellow-100 text-yellow-700',
  '중식': 'bg-red-100 text-red-700',
  '양식': 'bg-blue-100 text-blue-700',
  '일식': 'bg-green-100 text-green-700',
};

export default function RestaurantDetail({ restaurant, onClose }: RestaurantDetailProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(restaurant.likeCount);

  const handleLike = async () => {
    if (liked) return;
    try {
      await likeRestaurant(restaurant.id);
      setLikes(l => l + 1);
      setLiked(true);
    } catch {}
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-80 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {restaurant.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[restaurant.category] || 'bg-gray-100 text-gray-600'}`}>
              {restaurant.category}
            </span>
          )}
          {restaurant.isVerified && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">인증</span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
        {restaurant.menuName && (
          <div className="flex items-center gap-1 mt-1">
            <Tag size={12} className="text-gray-400" />
            <span className="text-sm text-gray-500">{restaurant.menuName}</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 bg-red-50 rounded-xl px-4 py-3 text-center">
          <div className="text-2xl font-black text-[#E84032]">{restaurant.price.toLocaleString()}원</div>
          {restaurant.menuName && <div className="text-xs text-gray-500 mt-0.5">{restaurant.menuName} 기준</div>}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mt-3">
          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600">{restaurant.address}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-400">
            <Eye size={13} />
            <span className="text-xs">{restaurant.viewCount}</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${liked ? 'text-[#E84032]' : 'text-gray-400 hover:text-[#E84032]'}`}
          >
            <Heart size={13} fill={liked ? '#E84032' : 'none'} />
            <span className="text-xs">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
