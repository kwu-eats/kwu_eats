'use client';

import { useEffect, useRef } from 'react';

interface Props {
  map: kakao.maps.Map;
  lat: number;
  lng: number;
}

/**
 * 선택된 식당 마커 위에 그려지는 펄스 하이라이트.
 * Clusterer 경로(native Marker)·CustomOverlay 경로 둘 다에서 동작하도록
 * 별도 CustomOverlay 로 분리.
 */
export function SelectedMarkerHighlight({ map, lat, lng }: Props) {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  useEffect(() => {
    // 펄스 키프레임은 첫 마운트 시 한 번만 head 에 주입
    if (!document.getElementById('selected-marker-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'selected-marker-pulse-style';
      style.textContent = `
        @keyframes pang-selected-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.18); opacity: 0.85; }
        }
      `;
      document.head.appendChild(style);
    }

    const wrapper = document.createElement('div');
    // 마커 핀 본체(중심) 위에 정확히 오도록 살짝 위로 보정
    wrapper.style.cssText = [
      'position:relative',
      'top:-16px',
      'width:56px',
      'height:56px',
      'pointer-events:none',
    ].join(';');

    const halo = document.createElement('div');
    halo.style.cssText = [
      'position:absolute',
      'inset:0',
      'border-radius:50%',
      'background:radial-gradient(circle, rgba(216,90,48,0.35) 0%, rgba(216,90,48,0.18) 55%, rgba(216,90,48,0) 75%)',
      'box-shadow:0 0 0 2px rgba(216,90,48,0.7), 0 0 16px rgba(216,90,48,0.5)',
      'animation:pang-selected-pulse 1.6s ease-in-out infinite',
    ].join(';');

    wrapper.appendChild(halo);

    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(lat, lng),
      content: wrapper,
      map,
      // 핀 위(아래쪽이 좌표)에 오도록 yAnchor 1.0
      yAnchor: 1.0,
      xAnchor: 0.5,
      clickable: false,
      // 다른 마커보다 위에 표시
      zIndex: 200,
    });

    overlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
      overlayRef.current = null;
    };
  }, [map, lat, lng]);

  return null;
}
