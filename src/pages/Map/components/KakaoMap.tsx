import { useEffect, useState, useRef } from 'react';
import CircleButton from '../../../components/CircleButton';
import { isStoreOpen } from '../../../utils/isStoreOpen';
import { parseKakaoPolyline } from '../../../utils/parsePolyline';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  stores: any[];
  selectedStore: any;
  onMarkerSelect: (store: any) => void;
  routePath: any[] | null;
}

export default function KakaoMap({
  stores,
  selectedStore,
  onMarkerSelect,
  routePath,
}: KakaoMapProps) {
  const [currentPos, setCurrentPos] = useState<any>(null);

  const mapRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  /* 1) GPS 최초 조회 */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () =>
        setCurrentPos({
          lat: stores[0]?.lat,
          lng: stores[0]?.lng,
        })
    );
  }, []);

  /* 2) 지도 초기 렌더링 */
  useEffect(() => {
    if (!currentPos) return;

    const { kakao } = window;
    const container = document.getElementById('map');

    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(currentPos.lat, currentPos.lng),
      level: 3,
    });

    mapRef.current = map;
    kakao.maps.event.addListener(map, 'bounds_changed', () => {
      const bounds = map.getBounds();

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      // const se = bounds.getSouthEast();
      // const nw = bounds.getNorthWest();

      // console.log('좌상단(NW):', nw.getLat(), nw.getLng());
    });

    // 🔵 내 위치 마커
    const blueDot = new kakao.maps.MarkerImage(
      '/marker/marker-blue.svg',
      new kakao.maps.Size(18, 18),
      { offset: new kakao.maps.Point(9, 9) }
    );

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(currentPos.lat, currentPos.lng),
      map,
      image: blueDot,
    });

    currentLocationMarkerRef.current = marker;

    // 🟢 / 🔴 가게 마커
    const greenMarker = '/marker/marker-green.svg';
    const redMarker = '/marker/marker-red.svg';

    stores.forEach((store) => {
      const isOpen = isStoreOpen(store);

      const markerImage = new kakao.maps.MarkerImage(
        isOpen ? greenMarker : redMarker,
        new kakao.maps.Size(36, 36),
        { offset: new kakao.maps.Point(18, 36) }
      );

      const stMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.latitude, store.longitude),
        map,
        image: markerImage,
      });

      kakao.maps.event.addListener(stMarker, 'click', () => {
        const pos = new kakao.maps.LatLng(store.latitude, store.longitude);
        map.setLevel(2, { anchor: pos });
        map.panTo(pos);
        onMarkerSelect(store);
        console.log('가게 선택:', store);
      });
    });
  }, [currentPos]);

  /* 3) 선택된 가게 이동 */
  useEffect(() => {
    if (!selectedStore || !mapRef.current) return;

    const { kakao } = window;
    const pos = new kakao.maps.LatLng(
      selectedStore.latitude - 0.0005,
      selectedStore.longitude
    );

    mapRef.current.setLevel(2, { anchor: pos });
    mapRef.current.panTo(pos);
  }, [selectedStore]);

  /* 4) ⭐ Polyline 표시 */
  useEffect(() => {
    console.log('routePath changed:', routePath);

    const { kakao } = window;

    // ⭐ routePath가 null인 경우 → 기존 Polyline 지우기
    if (!routePath) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }

    if (!mapRef.current) return;

    // 기존 경로 삭제
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const linePath = parseKakaoPolyline(routePath, kakao);

    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#00A3FF',
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
    });

    polyline.setMap(mapRef.current);
    polylineRef.current = polyline;

    // 지도 범위 맞추기
    const bounds = new kakao.maps.LatLngBounds();
    linePath.forEach((latlng) => bounds.extend(latlng));
    mapRef.current.setBounds(bounds);
  }, [routePath]);

  /* 🔵 현재 위치 버튼 */
  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { kakao } = window;

      const loc = new kakao.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
      );
      console.log('현재 위치로 이동:', loc);
      // ⭐ 현재 위치로 이동하면서 level 3으로 고정
      mapRef.current.setLevel(3, { anchor: loc });
      mapRef.current.panTo(loc);

      // 기존 마커 삭제
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }

      // 새 파란점
      const blueDot = new kakao.maps.MarkerImage(
        '/marker/marker-blue.svg',
        new kakao.maps.Size(18, 18),
        { offset: new kakao.maps.Point(9, 9) }
      );

      const marker = new kakao.maps.Marker({
        position: loc,
        map: mapRef.current,
        image: blueDot,
      });

      currentLocationMarkerRef.current = marker;
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const { kakao } = window;

    const map = mapRef.current;

    kakao.maps.event.addListener(map, 'bounds_changed', () => {
      const bounds = map.getBounds();

      // const sw = bounds.getSouthWest();
      // const ne = bounds.getNorthEast();

      // console.log('좌하단(SW):', sw.getLat(), sw.getLng());
      // console.log('우상단(NE):', ne.getLat(), ne.getLng());
    });
  }, []);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full"></div>

      {/* 🟦 현재 위치 버튼 */}
      <CircleButton
        icon="📍"
        onClick={goToCurrentLocation}
        label="내 위치"
        className="absolute top-50 right-4 z-50"
      />
    </div>
  );
}
