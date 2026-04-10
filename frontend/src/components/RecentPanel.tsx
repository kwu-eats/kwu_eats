'use client';

import { Restaurant } from '@/types/restaurant';
import { X, Clock } from 'lucide-react';
import { useState } from 'react';

interface RecentPanelProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function RecentPanel({ restaurants, onSelect }: RecentPanelProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg w-72">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#E84032]" />
          <span className="text-sm font-bold text-gray-800">최근 등록 가게</span>
          <span className="text-xs text-gray-400">엄정한 평가요</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {/* List */}
      <ul className="max-h-72 overflow-y-auto py-1">
        {restaurants.map((r, i) => (
          <li
            key={r.id}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
            onClick={() => onSelect(r)}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-400 font-medium mt-0.5">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{r.name}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{r.address}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-[#E84032]">{r.price.toLocaleString()}원</span>
                  <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
