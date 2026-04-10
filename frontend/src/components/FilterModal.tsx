'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  maxPrice: number | null;
  selectedCategories: string[];
  onApply: (maxPrice: number | null, categories: string[]) => void;
  onClose: () => void;
}

const PRICE_OPTIONS = [
  { label: '전체', value: null },
  { label: '~5,000', value: 5000 },
  { label: '~6,000', value: 6000 },
  { label: '~7,000', value: 7000 },
  { label: '~8,000', value: 8000 },
  { label: '~9,000', value: 9000 },
  { label: '~10,000', value: 10000 },
];

const CATEGORIES = [
  { label: '카테고리 전체', value: 'ALL' },
  { label: '한식', emoji: '🍚' },
  { label: '한식부페', emoji: '🍱' },
  { label: '중식', emoji: '🥢' },
  { label: '일식', emoji: '🍣' },
  { label: '양식', emoji: '🍝' },
  { label: '아시안', emoji: '🌏' },
  { label: '면요리', emoji: '🍜' },
  { label: '치킨', emoji: '🍗' },
  { label: '피자', emoji: '🍕' },
  { label: '족발/보쌈', emoji: '🐷' },
  { label: '고기/구이', emoji: '🥩' },
  { label: '찜/탕', emoji: '🍲' },
  { label: '버거', emoji: '🍔' },
  { label: '도시락', emoji: '🥡' },
  { label: '샐러드', emoji: '🥗' },
  { label: '분식', emoji: '🥟' },
];

export default function FilterModal({ maxPrice, selectedCategories, onApply, onClose }: FilterModalProps) {
  const [localPrice, setLocalPrice] = useState<number | null>(maxPrice);
  const [localCats, setLocalCats] = useState<string[]>(selectedCategories);

  const toggleCategory = (cat: string) => {
    if (cat === 'ALL') {
      setLocalCats([]);
      return;
    }
    setLocalCats(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      if (prev.length >= 3) return prev;
      return [...prev, cat];
    });
  };

  const handleApply = () => {
    onApply(localPrice, localCats);
    onClose();
  };

  const handleReset = () => {
    setLocalPrice(null);
    setLocalCats([]);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">가격 필터</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Price */}
          <div>
            <p className="text-xs text-gray-400 mb-3">
              지역 조회에서 최대 가격/카테고리 필터를 적용합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setLocalPrice(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    localPrice === opt.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs text-gray-400 mb-3">
              카테고리는 최대 3개까지 선택할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isAll = cat.value === 'ALL';
                const isActive = isAll
                  ? localCats.length === 0
                  : localCats.includes(cat.label);
                return (
                  <button
                    key={cat.label}
                    onClick={() => toggleCategory(isAll ? 'ALL' : cat.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.emoji && <span>{cat.emoji}</span>}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-[#E84032] text-white text-sm font-bold hover:bg-[#C0392B] transition-colors"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
