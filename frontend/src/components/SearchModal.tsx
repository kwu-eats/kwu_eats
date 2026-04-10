'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface SearchModalProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onClose: () => void;
}

export default function SearchModal({ initialQuery, onSearch, onClose }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = () => {
    onSearch(query);
    onClose();
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">식당 검색</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E84032] transition-colors">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="식당명 전역 검색"
            className="ml-2 flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            지우기
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
