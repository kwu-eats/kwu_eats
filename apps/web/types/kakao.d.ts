declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number, options?: { animate?: boolean }): void;
      getLevel(): number;
      panTo(latlng: LatLng): void;
      setBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latlng: LatLng): void;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setContent(content: string | HTMLElement): void;
    }

    class MarkerClusterer {
      constructor(options: MarkerClustererOptions);
      addMarker(marker: Marker): void;
      addMarkers(markers: Marker[]): void;
      removeMarker(marker: Marker): void;
      removeMarkers(markers: Marker[]): void;
      clear(): void;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
      mapTypeId?: number;
    }

    interface CustomOverlayOptions {
      position: LatLng;
      content: string | HTMLElement;
      map?: Map;
      yAnchor?: number;
      xAnchor?: number;
      zIndex?: number;
      clickable?: boolean;
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
    }

    interface MarkerClustererOptions {
      map: Map;
      averageCenter?: boolean;
      minLevel?: number;
      gridSize?: number;
    }

    namespace event {
      function addListener(
        target: Map | Marker | CustomOverlay,
        type: string,
        handler: (...args: unknown[]) => void,
      ): void;
      function removeListener(
        target: Map | Marker | CustomOverlay,
        type: string,
        handler: (...args: unknown[]) => void,
      ): void;
    }
  }
}

interface Window {
  kakao: typeof kakao;
}
