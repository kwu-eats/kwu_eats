'use client';

import { useEffect, useRef } from 'react';

/**
 * 마커가 이 개수 이상이면 CustomOverlay 대신 native Marker + Clusterer 로 전환.
 * 시드 데이터 수준(5개 안팎) 에서는 의미 없고, 운영 데이터가 쌓이면 활성화.
 */
export const MARKER_CLUSTER_THRESHOLD = 50;

interface ClusterMarkerInput {
  id: string;
  lat: number;
  lng: number;
}

interface UseMarkerClustererOptions {
  enabled: boolean;
  minClusterSize?: number;
  onMarkerClick?: (id: string) => void;
}

/**
 * 카카오맵 MarkerClusterer 래퍼.
 *
 * - enabled=false: no-op (CustomOverlay 기반 RestaurantMarker 만 렌더링)
 * - enabled=true: native Marker 인스턴스를 만들어 Clusterer 에 묶고,
 *   호출측은 RestaurantMarker 렌더링을 건너뛰어야 한다.
 *
 * 활성/비활성 전환 기준은 MARKER_CLUSTER_THRESHOLD.
 */
export function useMarkerClusterer(
  map: kakao.maps.Map | null,
  markers: ClusterMarkerInput[],
  { enabled, minClusterSize = 5, onMarkerClick }: UseMarkerClustererOptions,
) {
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!map || !enabled) return;
    if (typeof window === 'undefined' || !window.kakao?.maps?.MarkerClusterer) {
      return;
    }

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 4,
      minClusterSize,
      disableClickZoom: false,
    });

    const kakaoMarkers = markers.map((m) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(m.lat, m.lng),
      });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClickRef.current?.(m.id);
      });
      return marker;
    });
    clusterer.addMarkers(kakaoMarkers);
    clustererRef.current = clusterer;

    return () => {
      clusterer.clear();
      kakaoMarkers.forEach((m) => m.setMap(null));
      clustererRef.current = null;
    };
  }, [map, markers, enabled, minClusterSize]);
}
