'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createRestaurant } from '@/lib/api';

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    price: '',
    menuName: '',
    category: '한식',
    latitude: '37.5665',
    longitude: '126.9780',
  });
  const [loading, setLoading] = useState(false);

  const categories = ['한식', '분식', '중식', '일식', '양식', '기타'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.price) return;
    setLoading(true);
    try {
      await createRestaurant({
        name: form.name,
        address: form.address,
        price: parseInt(form.price),
        menuName: form.menuName,
        category: form.category,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-base font-bold text-gray-900">가게 제보하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">가게명 *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="예) 을지로 국밥집"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">주소 *</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="예) 서울특별시 중구 을지로 100"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">가격 (원) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="6000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">카테고리</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">대표 메뉴</label>
            <input
              type="text"
              value={form.menuName}
              onChange={e => setForm(f => ({ ...f, menuName: e.target.value }))}
              placeholder="예) 순대국밥"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">위도</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">경도</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E84032] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E84032] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#C0392B] transition-colors disabled:opacity-50"
          >
            {loading ? '등록 중...' : '제보하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
