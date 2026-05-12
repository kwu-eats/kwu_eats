'use client';

import Script from 'next/script';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { clientEnv } from '@/env';
import { KWU_CENTER } from '@/hooks/useKakaoMap';

export interface KakaoMapHandle {
  map: kakao.maps.Map | null;
  panTo: (lat: number, lng: number) => void;
  setLevel: (level: number) => void;
}

interface KakaoMapProps {
  className?: string;
  onMapReady?: (map: kakao.maps.Map) => void;
}

export const KakaoMap = forwardRef<KakaoMapHandle, KakaoMapProps>(
  ({ className = 'w-full h-full', onMapReady }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(
      typeof window !== 'undefined' && !!window.kakao?.maps,
    );

    useEffect(() => {
      if (!scriptLoaded || !containerRef.current || mapRef.current) return;

      window.kakao.maps.load(() => {
        if (!containerRef.current) return;
        const center = new window.kakao.maps.LatLng(KWU_CENTER.lat, KWU_CENTER.lng);
        const map = new window.kakao.maps.Map(containerRef.current, {
          center,
          level: 5,
        });
        mapRef.current = map;
        // onMapReady 가 먼저 호출되어 사용자가 setCenter/setLevel 로 뷰포트 복원할
        // 기회를 갖도록 한 다음, 컨테이너 크기 보정용 relayout 만 실행.
        // (이전엔 setCenter 로 다시 KWU_CENTER 로 되돌려 복원이 덮어써졌음)
        onMapReady?.(map);
        setTimeout(() => {
          map.relayout();
        }, 100);
      });
    }, [scriptLoaded, onMapReady]);

    useImperativeHandle(ref, () => ({
      get map() {
        return mapRef.current;
      },
      panTo(lat, lng) {
        mapRef.current?.panTo(new window.kakao.maps.LatLng(lat, lng));
      },
      setLevel(level) {
        mapRef.current?.setLevel(level, { animate: true });
      },
    }));

    const sdkUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${clientEnv.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=clusterer&autoload=false`;

    return (
      <>
        <Script
          src={sdkUrl}
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
        <div ref={containerRef} className={className} />
      </>
    );
  },
);

KakaoMap.displayName = 'KakaoMap';
