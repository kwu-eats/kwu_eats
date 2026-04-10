'use client';

import { Search, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState('');

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="text-lg font-black text-[#E84032]">거지맵</div>
          <div className="text-[9px] text-gray-400 -mt-1 leading-tight">고물가 시대 극가성비 식당 모음</div>
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch(query)}
            placeholder="식당명, 지역으로 검색..."
            className="ml-2 bg-transparent text-sm flex-1 outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <button className="text-gray-500 hover:text-gray-700 flex-shrink-0">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
