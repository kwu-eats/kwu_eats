'use client';

interface PriceFilterProps {
  selected: number | null;
  onChange: (price: number | null) => void;
}

const PRICES = [5000, 6000, 7000, 8000, 10000];

export default function PriceFilter({ selected, onChange }: PriceFilterProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white rounded-full shadow-md px-3 py-2">
      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">최대</span>
      {PRICES.map(price => (
        <button
          key={price}
          onClick={() => onChange(selected === price ? null : price)}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
            selected === price
              ? 'bg-[#E84032] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {price.toLocaleString()}원
        </button>
      ))}
      {selected && (
        <button
          onClick={() => onChange(null)}
          className="text-xs text-gray-400 hover:text-gray-600 ml-1"
        >
          초기화
        </button>
      )}
    </div>
  );
}
