'use client';

import { PanelLeftOpen, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { FilterButton } from '@/components/filters/FilterButton';
import { FilterSheet } from '@/components/filters/FilterSheet';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { ClusterPicker } from '@/components/map/ClusterPicker';
import { KakaoMap, type KakaoMapHandle } from '@/components/map/KakaoMap';
import { MapFloatingButtons } from '@/components/map/MapFloatingButtons';
import { RestaurantMarker } from '@/components/map/RestaurantMarker';
import { BottomSheetContent } from '@/components/restaurant/BottomSheetContent';
import { SearchSheet } from '@/components/search/SearchSheet';
import { useRestaurants } from '@/hooks/queries/useRestaurants';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  MARKER_CLUSTER_THRESHOLD,
  useMarkerClusterer,
} from '@/hooks/useMarkerClusterer';
import { groupRestaurantsByLocation } from '@/lib/groupRestaurants';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useSheetStore } from '@/lib/stores/sheetStore';

interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export default function HomePage() {
  const mapRef = useRef<KakaoMapHandle>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // 지도 가시 영역 — idle 이벤트로 갱신해서 패닝 중 리렌더 방지
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  // 클러스터 클릭 시 그 안의 식당 id 목록 (null = 팝업 닫힘)
  const [clusterIds, setClusterIds] = useState<string[] | null>(null);

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

  // 지도 배경 클릭 시 바텀 시트 내리기 + 가시 영역 추적
  const handleMapReady = useCallback(
    (mapInstance: kakao.maps.Map) => {
      setMap(mapInstance);
      window.kakao.maps.event.addListener(mapInstance, 'click', () => {
        setSnap('peek');
        setSelectedId(null);
      });
      const updateBounds = () => {
        const b = mapInstance.getBounds();
        const sw = b.getSouthWest();
        const ne = b.getNorthEast();
        setBounds({
          minLat: sw.getLat(),
          maxLat: ne.getLat(),
          minLng: sw.getLng(),
          maxLng: ne.getLng(),
        });
      };
      // 초기값 1회 + 이후 패닝/줌이 멈출 때마다 갱신
      updateBounds();
      window.kakao.maps.event.addListener(mapInstance, 'idle', updateBounds);
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

  // 검색 결과 선택 시: 지도 이동 + 줌인 + 마커 선택 + 바텀시트 half 로 펼침
  const handleSearchSelect = useCallback(
    (restaurant: { id: string; latitude: number; longitude: number }) => {
      mapRef.current?.panTo(restaurant.latitude, restaurant.longitude);
      // 줌 레벨이 너무 멀면(>=3) 가까이 당겨오기. 이미 가까우면 유지.
      const currentLevel = mapRef.current?.map?.getLevel();
      if (currentLevel && currentLevel > 2) {
        mapRef.current?.setLevel(2);
      }
      setSelectedId(restaurant.id);
      setSnap('half');
    },
    [setSnap],
  );

  // 지도 가시 영역 내 식당만 (bounds 가 없으면 fallback 으로 전체)
  const visibleRestaurants = useMemo(() => {
    if (!bounds) return restaurants;
    return restaurants.filter(
      (r) =>
        r.latitude >= bounds.minLat &&
        r.latitude <= bounds.maxLat &&
        r.longitude >= bounds.minLng &&
        r.longitude <= bounds.maxLng,
    );
  }, [restaurants, bounds]);

  // 선택된 식당이 가시 영역 밖이어도 맨 앞에 노출 (사용자가 직접 클릭한 의도 존중)
  const orderedRestaurants = useMemo(() => {
    if (!selectedId) return visibleRestaurants;
    const selected = restaurants.find((r) => r.id === selectedId);
    const rest = visibleRestaurants.filter((r) => r.id !== selectedId);
    return selected ? [selected, ...rest] : rest;
  }, [visibleRestaurants, restaurants, selectedId]);

  // 같은 건물(좌표) 식당은 한 마커로 묶기. count===1 은 단일, 2+ 는 건물 마커.
  const restaurantGroups = useMemo(
    () => groupRestaurantsByLocation(restaurants),
    [restaurants],
  );

  // 데이터가 적을 땐 CustomOverlay(개성 있는 핀) 만, 임계치 넘으면 클러스터러로 전환
  const useClusterer = restaurantGroups.length >= MARKER_CLUSTER_THRESHOLD;
  const clusterMarkers = useMemo(
    () =>
      restaurantGroups.map((g) => ({
        id: g.restaurants[0].id,
        lat: g.lat,
        lng: g.lng,
        isOpen: g.restaurants.some((r) => r.isOpen),
        isPartner: g.restaurants.some((r) => r.isPartner),
        count: g.restaurants.length,
        restaurantIds: g.restaurants.map((r) => r.id),
      })),
    [restaurantGroups],
  );
  useMarkerClusterer(map, clusterMarkers, {
    enabled: useClusterer,
    onMarkerClick: handleMarkerClick,
    onClusterClick: (ids) => setClusterIds(ids),
  });

  const clusterRestaurants = useMemo(
    () =>
      clusterIds
        ? clusterIds
            .map((id) => restaurants.find((r) => r.id === id))
            .filter((r): r is (typeof restaurants)[number] => Boolean(r))
        : [],
    [clusterIds, restaurants],
  );

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
          restaurantGroups.map((g) => {
            const first = g.restaurants[0];
            const isAnyOpen = g.restaurants.some((r) => r.isOpen);
            const isAnyPartner = g.restaurants.some((r) => r.isPartner);
            const isAnySelected = g.restaurants.some(
              (r) => r.id === selectedId,
            );
            return (
              <RestaurantMarker
                key={first.id}
                map={map}
                lat={g.lat}
                lng={g.lng}
                isOpen={isAnyOpen}
                isPartner={isAnyPartner}
                isSelected={isAnySelected}
                onClick={() => {
                  if (g.restaurants.length === 1) {
                    handleMarkerClick(first.id);
                  } else {
                    setClusterIds(g.restaurants.map((r) => r.id));
                  }
                }}
              />
            );
          })}

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
      <SearchSheet
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />

      <ClusterPicker
        open={clusterIds !== null}
        restaurants={clusterRestaurants}
        onSelect={(id) => {
          setClusterIds(null);
          handleMarkerClick(id);
        }}
        onClose={() => setClusterIds(null)}
      />

      {/* 모바일 바텀 시트 */}
      <div className="lg:hidden">
        <BottomSheet>
          <ActiveFilterBar variant="inline" />
          <BottomSheetContent
            restaurants={orderedRestaurants}
            isLoading={isLoading}
            isError={isError}
            hasMoreOutsideView={
              restaurants.length > 0 && visibleRestaurants.length === 0
            }
            selectedId={selectedId}
          />
        </BottomSheet>
      </div>

      {/* 데스크톱 사이드 패널 */}
      {sidebarOpen && (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-[380px] lg:flex-col lg:bg-surface lg:shadow-lg">
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between px-4 pt-16 pb-3 border-b border-border flex-shrink-0">
            <span className="text-sm font-semibold text-ink-primary">
              식당 목록{' '}
              {restaurants.length > 0 &&
                (visibleRestaurants.length === restaurants.length
                  ? `(${restaurants.length})`
                  : `(${visibleRestaurants.length} / ${restaurants.length})`)}
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
            <ActiveFilterBar variant="inline" />
            <BottomSheetContent
              restaurants={orderedRestaurants}
              isLoading={isLoading}
              isError={isError}
              hasMoreOutsideView={
                restaurants.length > 0 && visibleRestaurants.length === 0
              }
              selectedId={selectedId}
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
