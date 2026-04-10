'use client';

import { useEffect, useRef } from 'react';
import { Restaurant } from '@/types/restaurant';

declare global {
  interface Window { kakao: any; }
}

interface MapProps {
  restaurants: Restaurant[];
  selectedId: number | null;
  onSelect: (r: Restaurant) => void;
}

export default function Map({ restaurants, selectedId, onSelect }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) return;
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        };
        mapRef.current = new window.kakao.maps.Map(containerRef.current, options);
      });
    };

    if (window.kakao) {
      initMap();
    } else {
      const timer = setInterval(() => {
        if (window.kakao) {
          clearInterval(timer);
          initMap();
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, []);

  // 마커(오버레이) 업데이트
  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;

    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    restaurants.forEach((r) => {
      const el = document.createElement('div');
      el.className = `price-marker${selectedId === r.id ? ' selected' : ''}`;
      el.textContent = `${r.price.toLocaleString()}원`;
      el.addEventListener('click', () => onSelect(r));

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(Number(r.latitude), Number(r.longitude)),
        content: el,
        yAnchor: 1.3,
        zIndex: selectedId === r.id ? 10 : 1,
      });
      overlay.setMap(mapRef.current);
      overlaysRef.current.push(overlay);
    });
  }, [restaurants, selectedId, onSelect]);

  return <div ref={containerRef} className="w-full h-full" />;
}
