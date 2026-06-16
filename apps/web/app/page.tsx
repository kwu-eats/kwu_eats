'use client';

import { PanelLeftOpen, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { useMapStore } from '@/lib/stores/mapStore';
import { useSheetStore } from '@/lib/stores/sheetStore';
import { haversineKm } from '@/lib/utils/distance';

interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export default function HomePage() {
  const router = useRouter();
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

  const {
    zones,
    categoryIds,
    maxPrice,
    isOpen: isOpenFilter,
    maxDistanceKm,
    sortByDistance,
    userLocation,
  } = useFilterStore();
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

  // 지도 배경 클릭 시 바텀 시트 내리기 + 가시 영역 추적 + 뷰포트 저장/복원
  const handleMapReady = useCallback(
    (mapInstance: kakao.maps.Map) => {
      setMap(mapInstance);

      // 메뉴 상세 → 뒤로 가기로 돌아왔을 때 직전 뷰포트 복원.
      // getState() 로 읽어 useCallback 의존성에서 빼고 1회만 적용.
      const saved = useMapStore.getState();
      if (saved.center && saved.level != null) {
        mapInstance.setCenter(
          new window.kakao.maps.LatLng(saved.center.lat, saved.center.lng),
        );
        mapInstance.setLevel(saved.level);
      }

      window.kakao.maps.event.addListener(mapInstance, 'click', () => {
        setSnap('peek');
        setSelectedId(null);
      });

      const updateBoundsAndView = () => {
        const b = mapInstance.getBounds();
        const sw = b.getSouthWest();
        const ne = b.getNorthEast();
        setBounds({
          minLat: sw.getLat(),
          maxLat: ne.getLat(),
          minLng: sw.getLng(),
          maxLng: ne.getLng(),
        });
        // 다음 페이지 → 뒤로 복귀 시 복원하도록 현재 뷰포트도 저장
        const c = mapInstance.getCenter();
        useMapStore
          .getState()
          .setView(
            { lat: c.getLat(), lng: c.getLng() },
            mapInstance.getLevel(),
          );
      };
      // 초기값 1회 + 이후 패닝/줌이 멈출 때마다 갱신
      updateBoundsAndView();
      window.kakao.maps.event.addListener(
        mapInstance,
        'idle',
        updateBoundsAndView,
      );
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

  // 검색 결과 선택 시: 지도 이동 + 줌인 + 마커 선택 + 바텀시트 half 로 펼침.
  // panTo + setLevel 을 동시에 호출하면 두 애니메이션이 충돌해 종착점이 흔들림.
  // setCenter(즉시 중심 이동) 한 뒤 setLevel(애니메이션 줌인) 으로 분리하면 안정적.
  const handleSearchSelect = useCallback(
    (restaurant: { id: string; latitude: number; longitude: number }) => {
      const m = mapRef.current?.map;
      if (m) {
        const target = new window.kakao.maps.LatLng(
          restaurant.latitude,
          restaurant.longitude,
        );
        m.setCenter(target);
        // level 1 = 클러스터링 해제 (minLevel: 2). 개별 마커 확실히 노출.
        if (m.getLevel() > 1) m.setLevel(1, { animate: true });
        // setLevel 애니메이션 도중 사용자가 바로 카드를 탭해 화면을 떠나면
        // idle 이벤트가 못 따라잡으므로 store 에도 즉시 저장.
        useMapStore
          .getState()
          .setView(
            { lat: restaurant.latitude, lng: restaurant.longitude },
            1,
          );
      }
      setSelectedId(restaurant.id);
      setSnap('half');
    },
    [setSnap],
  );

  // 반경 필터 — 내 위치 기준 maxDistanceKm 이내만 남김.
  // bounds 보다 먼저 적용해서 지도 마커·목록 양쪽에 동일하게 반영.
  const radiusFilteredRestaurants = useMemo(() => {
    if (!userLocation || !maxDistanceKm) return restaurants;
    return restaurants.filter(
      (r) =>
        haversineKm(userLocation.lat, userLocation.lng, r.latitude, r.longitude) <= maxDistanceKm,
    );
  }, [restaurants, userLocation, maxDistanceKm]);

  // 지도 가시 영역 내 식당만 (bounds 가 없으면 fallback 으로 반경 결과 전체)
  const visibleRestaurants = useMemo(() => {
    if (!bounds) return radiusFilteredRestaurants;
    return radiusFilteredRestaurants.filter(
      (r) =>
        r.latitude >= bounds.minLat &&
        r.latitude <= bounds.maxLat &&
        r.longitude >= bounds.minLng &&
        r.longitude <= bounds.maxLng,
    );
  }, [radiusFilteredRestaurants, bounds]);

  // 정렬 우선순위:
  //   1) 사용자가 직접 누른 식당 (selectedId) — 가시영역 밖이어도 최상단
  //   2) 영업중인 매장
  //   3) 같은 그룹 내: sortByDistance 활성 시 거리 오름차순, 아니면 입력 순서 유지
  const orderedRestaurants = useMemo(() => {
    const selected = selectedId
      ? restaurants.find((r) => r.id === selectedId)
      : null;
    const pool = selected
      ? visibleRestaurants.filter((r) => r.id !== selectedId)
      : visibleRestaurants;

    const sorted = [...pool].sort((a, b) => {
      const openDiff = Number(!a.isOpen) - Number(!b.isOpen);
      if (openDiff !== 0) return openDiff;
      if (sortByDistance && userLocation) {
        return (
          haversineKm(userLocation.lat, userLocation.lng, a.latitude, a.longitude) -
          haversineKm(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        );
      }
      return 0;
    });

    return selected ? [selected, ...sorted] : sorted;
  }, [visibleRestaurants, restaurants, selectedId, sortByDistance, userLocation]);

  // 같은 건물(좌표) 식당은 한 마커로 묶기. count===1 은 단일, 2+ 는 건물 마커.
  // 반경 필터 결과 기준 → 마커도 목록과 동일하게 반경 밖 식당이 사라짐.
  const restaurantGroups = useMemo(
    () => groupRestaurantsByLocation(radiusFilteredRestaurants),
    [radiusFilteredRestaurants],
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
    selectedId,
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
          router.push(`/restaurants/${id}`);
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
              radiusFilteredRestaurants.length > 0 &&
              visibleRestaurants.length === 0
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
              {radiusFilteredRestaurants.length > 0 &&
                (visibleRestaurants.length === radiusFilteredRestaurants.length
                  ? `(${radiusFilteredRestaurants.length})`
                  : `(${visibleRestaurants.length} / ${radiusFilteredRestaurants.length})`)}
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
                radiusFilteredRestaurants.length > 0 &&
                visibleRestaurants.length === 0
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
