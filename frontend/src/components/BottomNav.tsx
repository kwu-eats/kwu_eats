'use client';

import { Users, Flame, Plus, List } from 'lucide-react';

interface BottomNavProps {
  onRegister: () => void;
  onList: () => void;
  showList: boolean;
}

export default function BottomNav({ onRegister, onList, showList }: BottomNavProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-gray-900 rounded-full shadow-xl px-3 py-2">
      <button
        onClick={onList}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
          showList ? 'bg-white text-gray-900' : 'text-white hover:bg-gray-800'
        }`}
      >
        <List size={14} />
        <span className="text-xs font-medium">목록</span>
      </button>
      <button className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
        <Users size={14} />
        <span className="text-xs font-medium">거지방</span>
      </button>
      <button
        onClick={onRegister}
        className="flex items-center gap-1.5 bg-[#E84032] text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-[#C0392B] transition-colors shadow-lg"
      >
        <Plus size={16} />
        제보하기
      </button>
      <button className="flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
        <Flame size={14} />
        <span className="text-xs font-medium">핫딜</span>
      </button>
    </div>
  );
}
