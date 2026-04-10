'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

interface MapControlsProps {
  onSearch: () => void;
  onFilter: () => void;
  hasFilter: boolean;
}

export default function MapControls({ onSearch, onFilter, hasFilter }: MapControlsProps) {
  return (
    <div className="absolute right-4 z-10 flex flex-col gap-2" style={{ top: '130px' }}>
      <button
        onClick={onSearch}
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
        title="검색"
      >
        <Search size={17} className="text-gray-600" />
      </button>
      <button
        onClick={onFilter}
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors border ${
          hasFilter
            ? 'bg-[#E84032] border-[#E84032] hover:bg-[#C0392B]'
            : 'bg-white border-gray-100 hover:bg-gray-50'
        }`}
        title="필터"
      >
        <SlidersHorizontal size={17} className={hasFilter ? 'text-white' : 'text-gray-600'} />
      </button>
    </div>
  );
}
