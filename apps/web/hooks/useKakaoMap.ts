'use client';

import { useEffect, useState } from 'react';

export const KWU_CENTER = { lat: 37.6192, lng: 127.0589 };

export function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(
    typeof window !== 'undefined' && !!window.kakao?.maps,
  );

  useEffect(() => {
    if (isLoaded) return;

    const id = setInterval(() => {
      if (window.kakao?.maps) {
        setIsLoaded(true);
        clearInterval(id);
      }
    }, 100);

    return () => clearInterval(id);
  }, [isLoaded]);

  return { isLoaded };
}
