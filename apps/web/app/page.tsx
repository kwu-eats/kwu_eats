'use client';

import { PanelLeftOpen, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { FilterButton } from '@/components/filters/FilterButton';
import { FilterSheet } from '@/components/filters/FilterSheet';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { SearchSheet } from '@/components/search/SearchSheet';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { KakaoMap, type KakaoMapHandle } from '@/components/map/KakaoMap';
import { MapFloatingButtons } from '@/components/map/MapFloatingButtons';
import { RestaurantMarker } from '@/components/map/RestaurantMarker';
import { BottomSheetContent } from '@/components/restaurant/BottomSheetContent';
import { useRestaurants } from '@/hooks/queries/useRestaurants';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  MARKER_CLUSTER_THRESHOLD,
  useMarkerClusterer,
} from '@/hooks/useMarkerClusterer';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useSheetStore } from '@/lib/stores/sheetStore';

export default function HomePage() {
  const mapRef = useRef<KakaoMapHandle>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { zones, categoryIds, maxPrice, isOpen: isOpenFilter } = useFilterStore();
  const { setSnap } = useSheetStore();
  const { lat, lng, isLocating, locate } = useGeolocation();

  const filters = useDebounce(
    {
      zones: zones.length ? zones : undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      maxPrice: maxPrice ?? undefined,
      isOpen: isOpenFilter || undefined,
    },
    300,
  );

  const { data: restaurants = [], isLoading, isError } = useRestaurants(filters);

  // 지도 배경 클릭 시 바텀 시트 내리기
  const handleMapReady = useCallback(
    (mapInstance: kakao.maps.Map) => {
      setMap(mapInstance);
      window.kakao.maps.event.addListener(mapInstance, 'click', () => {
        setSnap('peek');
        setSelectedId(null);
      });
    },
    [setSnap],
  );

  const handleMarkerClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      setSnap('half');
    },
    [setSnap],
  );

  const handleLocate = useCallback(() => {
    locate();
    if (lat !== 37.6192 || lng !== 127.0589) {
      mapRef.current?.panTo(lat, lng);
    }
  }, [locate, lat, lng]);

  // 선택된 식당을 리스트 맨 앞으로
  const orderedRestaurants = useMemo(
    () =>
      selectedId
        ? [
            ...restaurants.filter((r) => r.id === selectedId),
            ...restaurants.filter((r) => r.id !== selectedId),
          ]
        : restaurants,
    [restaurants, selectedId],
  );

  // 데이터가 적을 땐 CustomOverlay(개성 있는 핀) 만, 임계치 넘으면 클러스터러로 전환
  const useClusterer = restaurants.length >= MARKER_CLUSTER_THRESHOLD;
  const clusterMarkers = useMemo(
    () =>
      restaurants.map((r) => ({ id: r.id, lat: r.latitude, lng: r.longitude })),
    [restaurants],
  );
  useMarkerClusterer(map, clusterMarkers, {
    enabled: useClusterer,
    onMarkerClick: handleMarkerClick,
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <MobileHeader />

      {/* 지도 + 플로팅 필터 버튼 + FAB + 마커 */}
      <div className="relative flex-1 overflow-hidden">
        <KakaoMap
          ref={mapRef}
          className="h-full w-full"
          onMapReady={handleMapReady}
        />

        {map &&
          !useClusterer &&
          restaurants.map((r) => (
            <RestaurantMarker
              key={r.id}
              map={map}
              lat={r.latitude}
              lng={r.longitude}
              isOpen={r.isOpen}
              isPartner={r.isPartner}
              isSelected={selectedId === r.id}
              onClick={() => handleMarkerClick(r.id)}
            />
          ))}

        {/* FAB: 필터 / 현재 위치 / 검색 — 우측 하단 세로 정렬 */}
        <div className="pointer-events-none absolute bottom-36 right-4 z-20 flex flex-col items-end gap-3">
          <FilterButton onClick={() => setFilterOpen(true)} />
          <MapFloatingButtons
            onLocate={handleLocate}
            onSearch={() => setSearchOpen(true)}
            isLocating={isLocating}
          />
        </div>
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 모바일 바텀 시트 */}
      <div className="lg:hidden">
        <BottomSheet>
          <BottomSheetContent
            restaurants={orderedRestaurants}
            isLoading={isLoading}
            isError={isError}
          />
        </BottomSheet>
      </div>

      {/* 데스크톱 사이드 패널 */}
      {sidebarOpen && (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-[380px] lg:flex-col lg:bg-surface lg:shadow-lg">
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between px-4 pt-16 pb-3 border-b border-border flex-shrink-0">
            <span className="text-sm font-semibold text-ink-primary">
              식당 목록 {restaurants.length > 0 && `(${restaurants.length})`}
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="패널 닫기"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BottomSheetContent
              restaurants={orderedRestaurants}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </aside>
      )}

      {/* 데스크톱 패널 열기 버튼 (패널 닫혔을 때) */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="식당 목록 열기"
          className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-surface shadow-md text-ink-body transition-transform hover:scale-105"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}
    </div>
  );
}
