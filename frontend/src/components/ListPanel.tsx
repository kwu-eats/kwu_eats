'use client';

import { Restaurant } from '@/types/restaurant';
import { X, List } from 'lucide-react';

interface ListPanelProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  onClose: () => void;
  selectedId: number | null;
}

const CATEGORY_EMOJI: Record<string, string> = {
  '한식': '🍚', '한식부페': '🍱', '중식': '🥢', '일식': '🍣',
  '양식': '🍝', '아시안': '🌏', '면요리': '🍜', '치킨': '🍗',
  '피자': '🍕', '족발/보쌈': '🐷', '고기/구이': '🥩', '찜/탕': '🍲',
  '버거': '🍔', '도시락': '🥡', '샐러드': '🥗', '분식': '🥟',
};

export default function ListPanel({ restaurants, onSelect, onClose, selectedId }: ListPanelProps) {
  return (
    <div className="absolute left-0 top-14 bottom-0 z-20 w-80 bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <List size={16} className="text-[#E84032]" />
          <span className="font-bold text-gray-900">식당 목록</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {restaurants.length}개
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {restaurants.length === 0 ? (
          <li className="flex items-center justify-center h-40 text-sm text-gray-400">
            검색 결과가 없습니다
          </li>
        ) : (
          restaurants.map((r) => (
            <li
              key={r.id}
              onClick={() => onSelect(r)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedId === r.id ? 'bg-red-50 border-l-2 border-[#E84032]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {CATEGORY_EMOJI[r.category] || '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-gray-900 truncate">{r.name}</span>
                    <span className="font-bold text-sm text-[#E84032] flex-shrink-0">
                      {r.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">{r.address}</div>
                  {r.menuName && (
                    <div className="text-xs text-gray-500 mt-1">{r.menuName}</div>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
