'use client';

import { Restaurant } from '@/types/restaurant';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface RankingPanelProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  selectedId: number | null;
}

export default function RankingPanel({ restaurants, onSelect, selectedId }: RankingPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`absolute top-4 left-4 z-10 bg-white rounded-xl shadow-lg transition-all duration-300 ${collapsed ? 'w-32' : 'w-56'}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer select-none border-b border-gray-100"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div>
          <div className="text-xs font-bold text-gray-800">랭킹</div>
          <div className="text-xs text-[#E84032] font-semibold">수집중</div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* List */}
      {!collapsed && (
        <ul className="py-1 max-h-80 overflow-y-auto">
          {restaurants.slice(0, 10).map((r, i) => (
            <li
              key={r.id}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === r.id ? 'bg-red-50' : ''}`}
              onClick={() => onSelect(r)}
            >
              <span className={`text-xs font-bold w-4 text-center ${i < 3 ? 'text-[#E84032]' : 'text-gray-400'}`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-800 truncate">{r.name}</div>
                <div className="text-xs text-gray-400">{r.price.toLocaleString()}원</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
