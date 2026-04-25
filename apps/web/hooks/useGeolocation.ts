'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { KWU_CENTER } from './useKakaoMap';

interface GeolocationState {
  lat: number;
  lng: number;
  isLocating: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: KWU_CENTER.lat,
    lng: KWU_CENTER.lng,
    isLocating: false,
  });

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('위치 정보를 지원하지 않는 브라우저예요. 광운대를 기준으로 표시할게요.');
      return;
    }

    setState((s) => ({ ...s, isLocating: true }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isLocating: false,
        });
      },
      () => {
        toast.error('위치를 가져올 수 없어요. 광운대를 기준으로 표시할게요.');
        setState((s) => ({ ...s, isLocating: false }));
      },
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  return { ...state, locate };
}
