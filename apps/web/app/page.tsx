'use client';

import { PanelLeftOpen, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { BottomSheet } from '@/components/layout/BottomSheet';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { KakaoMap, type KakaoMapHandle } from '@/components/map/KakaoMap';
import { MapFloatingButtons } from '@/components/map/MapFloatingButtons';
import { RestaurantMarker } from '@/components/map/RestaurantMarker';
import { FilterChips } from '@/components/filters/FilterChips';
import { ZoneTabs } from '@/components/filters/ZoneTabs';
import { BottomSheetContent } from '@/components/restaurant/BottomSheetContent';
import { useRestaurants } from '@/hooks/queries/useRestaurants';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useSheetStore } from '@/lib/stores/sheetStore';

export default function HomePage() {
  const mapRef = useRef<KakaoMapHandle>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { zone, categoryId, maxPrice, isOpen: isOpenFilter } = useFilterStore();
  const { setSnap } = useSheetStore();
  const { lat, lng, isLocating, locate } = useGeolocation();

  const filters = useDebounce(
    {
      zone: zone ?? undefined,
      categoryId: categoryId ?? undefined,
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
  const orderedRestaurants = selectedId
    ? [
        ...restaurants.filter((r) => r.id === selectedId),
        ...restaurants.filter((r) => r.id !== selectedId),
      ]
    : restaurants;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <MobileHeader />

      {/* 필터 영역 */}
      <div className="z-10 flex-shrink-0 bg-canvas shadow-card">
        <ZoneTabs />
        <FilterChips />
      </div>

      {/* 지도 + FAB + 마커 */}
      <div className="relative flex-1 overflow-hidden">
        <KakaoMap
          ref={mapRef}
          className="h-full w-full"
          onMapReady={handleMapReady}
        />

        {map &&
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

        {/* FAB: 컨테이너는 pointer-events:none, 버튼은 pointer-events:auto */}
        <div className="pointer-events-none absolute bottom-36 right-4 z-20">
          <MapFloatingButtons
            onLocate={handleLocate}
            onSearch={() => setSnap('full')}
            isLocating={isLocating}
          />
        </div>
      </div>

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
