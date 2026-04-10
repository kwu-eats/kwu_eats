'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Restaurant } from '@/types/restaurant';
import { getRestaurants, getRecent, getRanking, seedRestaurants } from '@/lib/api';
import RankingPanel from '@/components/RankingPanel';
import RecentPanel from '@/components/RecentPanel';
import RestaurantDetail from '@/components/RestaurantDetail';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import RegisterModal from '@/components/RegisterModal';
import ListPanel from '@/components/ListPanel';
import SearchModal from '@/components/SearchModal';
import FilterModal from '@/components/FilterModal';
import MapControls from '@/components/MapControls';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recent, setRecent] = useState<Restaurant[]>([]);
  const [ranking, setRanking] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      await seedRestaurants();
      const [all, rec, rank] = await Promise.all([
        getRestaurants(),
        getRecent(),
        getRanking(),
      ]);
      setRestaurants(all);
      setRecent(rec);
      setRanking(rank);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      if (maxPrice !== null && r.price > maxPrice) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(r.category)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.address.toLowerCase().includes(q) &&
          !r.district?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [restaurants, maxPrice, selectedCategories, searchQuery]);

  const handleSelect = useCallback((r: Restaurant) => {
    setSelected(prev => prev?.id === r.id ? null : r);
  }, []);

  const hasFilter = maxPrice !== null || selectedCategories.length > 0;

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Header */}
      <Header onSearch={setSearchQuery} />

      {/* Map */}
      <div className="absolute inset-0 pt-14">
        {!loading ? (
          <Map
            restaurants={filtered}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[#E84032] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* List panel (left drawer) */}
      {showList && (
        <ListPanel
          restaurants={filtered}
          onSelect={(r) => { handleSelect(r); setShowList(false); }}
          onClose={() => setShowList(false)}
          selectedId={selected?.id ?? null}
        />
      )}

      {/* Ranking panel */}
      {!showList && (
        <div className="absolute top-[130px] left-4 z-10">
          <RankingPanel
            restaurants={ranking}
            onSelect={handleSelect}
            selectedId={selected?.id ?? null}
          />
        </div>
      )}

      {/* Recent panel */}
      <div className="absolute top-[130px] right-16 z-10">
        <RecentPanel restaurants={recent} onSelect={handleSelect} />
      </div>

      {/* Map controls (search + filter) */}
      <MapControls
        onSearch={() => setShowSearch(true)}
        onFilter={() => setShowFilter(true)}
        hasFilter={hasFilter}
      />

      {/* Active filter chips */}
      {hasFilter && (
        <div className="absolute top-[72px] left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md px-3 py-1.5 pointer-events-auto">
            {maxPrice && (
              <span className="text-xs bg-[#E84032] text-white px-2.5 py-1 rounded-full font-medium">
                ~{maxPrice.toLocaleString()}원
              </span>
            )}
            {selectedCategories.map(c => (
              <span key={c} className="text-xs bg-gray-800 text-white px-2.5 py-1 rounded-full font-medium">
                {c}
              </span>
            ))}
            <button
              onClick={() => { setMaxPrice(null); setSelectedCategories([]); }}
              className="text-xs text-gray-400 hover:text-gray-600 ml-1"
            >
              ✕ 초기화
            </button>
          </div>
        </div>
      )}

      {/* Restaurant detail popup */}
      {selected && (
        <RestaurantDetail
          restaurant={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Bottom nav */}
      <BottomNav
        onRegister={() => setShowRegister(true)}
        onList={() => setShowList(v => !v)}
        showList={showList}
      />

      {/* Modals */}
      {showSearch && (
        <SearchModal
          initialQuery={searchQuery}
          onSearch={setSearchQuery}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showFilter && (
        <FilterModal
          maxPrice={maxPrice}
          selectedCategories={selectedCategories}
          onApply={(price, cats) => { setMaxPrice(price); setSelectedCategories(cats); }}
          onClose={() => setShowFilter(false)}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSuccess={loadData}
        />
      )}
    </main>
  );
}
