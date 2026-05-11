'use client';

import { useEffect, useRef } from 'react';

/**
 * 마커가 이 개수 이상이면 CustomOverlay 대신 native Marker + Clusterer 로 전환.
 * 마커 디자인을 통일한 뒤로는 사실상 항상 clusterer 경로를 쓰는 게 맞다 —
 * 필터로 식당 수가 줄어도 가까운 것끼리 묶이게 하려면 임계값이 낮아야 함.
 */
export const MARKER_CLUSTER_THRESHOLD = 1;

const BRAND_COLOR = '#D85A30';
const PARTNER_STAR_COLOR = '#EF9F27';
const CLOSED_OPACITY = 0.4;

type SizeTier = 'dot' | 'small' | 'full';

interface ClusterMarkerInput {
  /** 그룹 식별 키 (그룹 내 첫 식당 id 등) */
  id: string;
  lat: number;
  lng: number;
  /** 그룹 내 하나라도 영업중이면 true */
  isOpen: boolean;
  /** 그룹 내 하나라도 제휴면 true */
  isPartner: boolean;
  /** 그룹 크기 — 1 = 단일 식당, 2+ = 같은 건물 묶음 */
  count: number;
  /** 그룹 안 식당 id 목록 (single 일 땐 1개) */
  restaurantIds: string[];
}

interface UseMarkerClustererOptions {
  enabled: boolean;
  minClusterSize?: number;
  /** 단일 식당 마커 클릭 시 */
  onMarkerClick?: (id: string) => void;
  /** 건물(2+) 마커 또는 Kakao 클러스터 버블 클릭 시 */
  onClusterClick?: (restaurantIds: string[]) => void;
}

function buildSinglePinSvg(size: SizeTier, isPartner: boolean): string {
  if (size === 'dot') {
    // 손가락 탭 가능하도록 18~20px 로 키움. viewBox 는 그대로 유지해 디자인 비례 보존.
    if (isPartner) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="${BRAND_COLOR}" stroke="white" stroke-width="2"/><circle cx="10" cy="10" r="2.5" fill="${PARTNER_STAR_COLOR}"/></svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6.5" fill="${BRAND_COLOR}" stroke="white" stroke-width="2"/></svg>`;
  }
  if (size === 'small') {
    const star = isPartner
      ? `<text x="11" y="14.5" font-size="8" font-weight="700" text-anchor="middle" fill="${PARTNER_STAR_COLOR}">★</text>`
      : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28"><path d="M11 0 C4.92 0 0 4.92 0 11 C0 18 11 28 11 28 C11 28 22 18 22 11 C22 4.92 17.08 0 11 0 Z" fill="${BRAND_COLOR}" stroke="white" stroke-width="1.5"/><circle cx="11" cy="11" r="4" fill="white"/>${star}</svg>`;
  }
  const star = isPartner
    ? `<text x="16" y="20" font-size="11" font-weight="700" text-anchor="middle" fill="${PARTNER_STAR_COLOR}">★</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0 C7.16 0 0 7.16 0 16 C0 26 16 40 16 40 C16 40 32 26 32 16 C32 7.16 24.84 0 16 0 Z" fill="${BRAND_COLOR}" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="white"/>${star}</svg>`;
}

function buildGroupPinSvg(size: SizeTier, count: number): string {
  // dot 사이즈는 숫자 못 보여주지만 단일보다 살짝 크게 — 묶음임을 시각적으로 차별.
  if (size === 'dot') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8.5" fill="${BRAND_COLOR}" stroke="white" stroke-width="2.5"/></svg>`;
  }
  // 표시 가능한 최대치 — 100개 넘는 건물은 없을 거지만 안전장치
  const label = count > 99 ? '99+' : String(count);
  if (size === 'small') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28"><path d="M11 0 C4.92 0 0 4.92 0 11 C0 18 11 28 11 28 C11 28 22 18 22 11 C22 4.92 17.08 0 11 0 Z" fill="${BRAND_COLOR}" stroke="white" stroke-width="1.5"/><circle cx="11" cy="11" r="7" fill="white"/><text x="11" y="14" font-size="9" font-weight="800" text-anchor="middle" fill="${BRAND_COLOR}">${label}</text></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0 C7.16 0 0 7.16 0 16 C0 26 16 40 16 40 C16 40 32 26 32 16 C32 7.16 24.84 0 16 0 Z" fill="${BRAND_COLOR}" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="9" fill="white"/><text x="16" y="20" font-size="13" font-weight="800" text-anchor="middle" fill="${BRAND_COLOR}">${label}</text></svg>`;
}

function tierForLevel(level: number): SizeTier {
  if (level >= 4) return 'dot';
  if (level === 3) return 'small';
  return 'full';
}

// 줌 레벨별 클러스터 그리드 크기 (픽셀).
// level 1 (최대 줌인) 은 minLevel 로 제외되니 값은 의미 없음.
// 2 → 5 까지 점진적으로 더 공격적으로 묶기.
function gridSizeForLevel(level: number): number {
  if (level === 1) return 80;
  if (level === 2) return 100;
  if (level === 3) return 140;
  if (level === 4) return 200;
  return 320; // level 5+
}

/**
 * 카카오맵 MarkerClusterer 래퍼.
 *
 * 입력: 그룹화된 마커 (같은 건물 = 1 입력). count 가 1 이면 단일, 2+ 면 건물.
 * - 단일 마커 클릭 → onMarkerClick(식당 id)
 * - 건물 마커 클릭 → onClusterClick(식당 id 들)
 * - Kakao 클러스터 버블 클릭 → onClusterClick(포함된 모든 식당 id 들)
 * 줌 레벨에 따라 marker image 자동 교체. 영업 종료(그룹 내 전원 마감)는 opacity 0.4.
 */
export function useMarkerClusterer(
  map: kakao.maps.Map | null,
  markers: ClusterMarkerInput[],
  { enabled, minClusterSize = 2, onMarkerClick, onClusterClick }: UseMarkerClustererOptions,
) {
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;
  const onClusterClickRef = useRef(onClusterClick);
  onClusterClickRef.current = onClusterClick;

  useEffect(() => {
    if (!map || !enabled) return;
    if (typeof window === 'undefined' || !window.kakao?.maps?.MarkerClusterer) {
      return;
    }

    const makeImg = (svg: string, w: number, h: number) =>
      new window.kakao.maps.MarkerImage(
        `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
        new window.kakao.maps.Size(w, h),
        { offset: new window.kakao.maps.Point(w / 2, h) },
      );
    const makeDotImg = (svg: string, w: number, h: number) =>
      new window.kakao.maps.MarkerImage(
        `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
        new window.kakao.maps.Size(w, h),
        { offset: new window.kakao.maps.Point(w / 2, h / 2) },
      );

    // 단일 식당용 6 이미지 (3 tier × 2 partner)
    const singleImages: Record<SizeTier, { partner: kakao.maps.MarkerImage; normal: kakao.maps.MarkerImage }> = {
      dot: {
        partner: makeDotImg(buildSinglePinSvg('dot', true), 20, 20),
        normal: makeDotImg(buildSinglePinSvg('dot', false), 18, 18),
      },
      small: {
        partner: makeImg(buildSinglePinSvg('small', true), 22, 28),
        normal: makeImg(buildSinglePinSvg('small', false), 22, 28),
      },
      full: {
        partner: makeImg(buildSinglePinSvg('full', true), 32, 40),
        normal: makeImg(buildSinglePinSvg('full', false), 32, 40),
      },
    };

    // 그룹 마커용 이미지 캐시 — tier:count 별로 lazy 생성.
    // 단일 마커와 미세 구분을 위해 ~12% 크게 렌더링 (SVG viewBox 자동 스케일).
    const groupImageCache = new Map<string, kakao.maps.MarkerImage>();
    const getGroupImage = (tier: SizeTier, count: number) => {
      const key = `${tier}:${count}`;
      const cached = groupImageCache.get(key);
      if (cached) return cached;
      const svg = buildGroupPinSvg(tier, count);
      const img =
        tier === 'dot'
          ? makeDotImg(svg, 22, 22)
          : tier === 'small'
            ? makeImg(svg, 25, 31)
            : makeImg(svg, 36, 44);
      groupImageCache.set(key, img);
      return img;
    };

    const pickImage = (tier: SizeTier, m: ClusterMarkerInput) => {
      if (m.count > 1) return getGroupImage(tier, m.count);
      return m.isPartner ? singleImages[tier].partner : singleImages[tier].normal;
    };

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      // 클러스터링 활성화 시작 줌 레벨. level 1 (최대 줌인) 에선 개별 마커 우선.
      minLevel: 2,
      minClusterSize,
      disableClickZoom: true,
      // 초기 줌 레벨에 맞는 gridSize. zoom_changed 핸들러에서 동적 갱신됨.
      gridSize: gridSizeForLevel(map.getLevel()),
      calculator: [10, 30, 100],
      styles: [
        {
          width: '40px',
          height: '40px',
          background: 'rgba(216, 90, 48, 0.92)',
          borderRadius: '50%',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '700',
          lineHeight: '40px',
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
        {
          width: '50px',
          height: '50px',
          background: 'rgba(216, 90, 48, 0.95)',
          borderRadius: '50%',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '700',
          lineHeight: '50px',
          fontSize: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        },
        {
          width: '60px',
          height: '60px',
          background: 'rgba(216, 90, 48, 1)',
          borderRadius: '50%',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '700',
          lineHeight: '60px',
          fontSize: '17px',
          boxShadow: '0 3px 12px rgba(0,0,0,0.35)',
        },
      ],
    });

    let currentTier = tierForLevel(map.getLevel());
    let currentGridSize = gridSizeForLevel(map.getLevel());

    // Kakao 클러스터 click 핸들러용: Marker → 그 그룹의 모든 식당 id
    const markerToIds = new WeakMap<kakao.maps.Marker, string[]>();

    const markersData = markers.map((m) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(m.lat, m.lng),
        image: pickImage(currentTier, m),
        opacity: m.isOpen ? 1 : CLOSED_OPACITY,
      });
      markerToIds.set(marker, m.restaurantIds);
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (m.count === 1) {
          onMarkerClickRef.current?.(m.restaurantIds[0]);
        } else {
          onClusterClickRef.current?.(m.restaurantIds);
        }
      });
      return { marker, input: m };
    });
    clusterer.addMarkers(markersData.map((d) => d.marker));
    clustererRef.current = clusterer;

    // Kakao 클러스터 (여러 건물 묶음) 클릭 → 모든 식당 id flatten
    const handleClusterClick = (cluster: kakao.maps.Cluster) => {
      const ids = cluster
        .getMarkers()
        .flatMap((m) => markerToIds.get(m) ?? []);
      onClusterClickRef.current?.(ids);
    };
    window.kakao.maps.event.addListener(
      clusterer,
      'clusterclick',
      handleClusterClick,
    );

    // 줌 단계 변화 시: 마커 이미지(tier) + 클러스터 gridSize 를 각각 변화 있을 때만 갱신.
    // tier 와 gridSize 는 같은 level 에서 동시에 바뀌지 않을 수 있어 분리해서 체크.
    const handleZoom = () => {
      const nextLevel = map.getLevel();
      const nextTier = tierForLevel(nextLevel);
      if (nextTier !== currentTier) {
        currentTier = nextTier;
        markersData.forEach(({ marker, input }) => {
          marker.setImage(pickImage(nextTier, input));
        });
      }
      const nextGridSize = gridSizeForLevel(nextLevel);
      if (nextGridSize !== currentGridSize) {
        currentGridSize = nextGridSize;
        clusterer.setGridSize(nextGridSize);
        clusterer.redraw();
      }
    };
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoom);

    return () => {
      window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoom);
      window.kakao.maps.event.removeListener(
        clusterer,
        'clusterclick',
        handleClusterClick,
      );
      clusterer.clear();
      markersData.forEach(({ marker }) => marker.setMap(null));
      clustererRef.current = null;
    };
  }, [map, markers, enabled, minClusterSize]);
}
