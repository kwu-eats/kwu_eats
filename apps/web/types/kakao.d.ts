declare namespace kakao {
  namespace maps {
    function load(callback: () => void): void;

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number, options?: { animate?: boolean; anchor?: LatLng }): void;
      getLevel(): number;
      panTo(latlng: LatLng): void;
      setBounds(bounds: LatLngBounds): void;
      getBounds(): LatLngBounds;
      relayout(): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latlng: LatLng): void;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
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
      setGridSize(size: number): void;
      redraw(): void;
    }

    interface Cluster {
      getMarkers(): Marker[];
      getCenter(): LatLng;
      getBounds(): LatLngBounds;
      getSize(): number;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setImage(image: MarkerImage): void;
      setOpacity(opacity: number): void;
    }

    class MarkerImage {
      constructor(
        src: string,
        size: Size,
        options?: { offset?: Point },
      );
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
      image?: MarkerImage;
      opacity?: number;
    }

    interface MarkerClustererOptions {
      map: Map;
      averageCenter?: boolean;
      minLevel?: number;
      gridSize?: number;
      minClusterSize?: number;
      disableClickZoom?: boolean;
      calculator?: number[];
      styles?: Array<Record<string, string>>;
    }

    namespace event {
      interface MouseEvent {
        latLng: LatLng;
        point: Point;
      }
      // 이벤트 인자가 종류별로 달라(map click 은 MouseEvent, marker click 은 인자 없음,
      // clusterclick 은 Cluster). 호출측 핸들러 시그니처를 그대로 받기 위해 generic.
      function addListener<H extends (...args: never[]) => void>(
        target: Map | Marker | CustomOverlay | MarkerClusterer,
        type: string,
        handler: H,
      ): void;
      function removeListener<H extends (...args: never[]) => void>(
        target: Map | Marker | CustomOverlay | MarkerClusterer,
        type: string,
        handler: H,
      ): void;
    }

    namespace services {
      interface PlaceSearchResult {
        id: string;
        place_name: string;
        category_name: string;
        address_name: string;
        road_address_name: string;
        phone: string;
        place_url: string;
        x: string;
        y: string;
      }

      type PlacesSearchStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

      class Places {
        keywordSearch(
          keyword: string,
          callback: (
            result: PlaceSearchResult[],
            status: PlacesSearchStatus,
          ) => void,
          options?: { size?: number },
        ): void;
      }
    }
  }
}

interface Window {
  kakao: typeof kakao;
}
