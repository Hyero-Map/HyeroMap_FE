import { useEffect, useState, useRef } from 'react';
import CircleButton from '../../../components/CircleButton';
import { isStoreOpen } from '../../../utils/isStoreOpen';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({ stores, selectedStore, onMarkerSelect }) {
  const [currentPos, setCurrentPos] = useState(null);
  const mapRef = useRef(null);

  // 🔵 현재 위치 마커 ref
  const currentLocationMarkerRef = useRef(null);

  // 1) 처음 GPS 요청
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCurrentPos({ lat: stores[0]?.lat, lng: stores[0]?.lng })
    );
  }, []);

  // 2) 지도 초기 렌더링 + 초기 파란점 생성
  useEffect(() => {
    if (!currentPos) return;

    const { kakao } = window;
    const container = document.getElementById('map');

    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(currentPos.lat, currentPos.lng),
      level: 3,
    });

    mapRef.current = map;

    const blueDotImage = new kakao.maps.MarkerImage(
      '/marker/marker-blue.svg',
      new kakao.maps.Size(18, 18),
      { offset: new kakao.maps.Point(9, 9) }
    );

    const initialMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(currentPos.lat, currentPos.lng),
      map,
      image: blueDotImage,
    });

    currentLocationMarkerRef.current = initialMarker;

    const greenMarker = '/marker/marker-green.svg';
    const redMarker = '/marker/marker-red.svg';

    stores.forEach((store) => {
      const isOpen = isStoreOpen(store);

      const markerImage = new kakao.maps.MarkerImage(
        isOpen ? greenMarker : redMarker,
        new kakao.maps.Size(36, 36),
        { offset: new kakao.maps.Point(18, 36) }
      );

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.lat, store.lng),
        map,
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        const pos = new kakao.maps.LatLng(store.lat, store.lng);
        map.setLevel(2, { anchor: pos });
        map.panTo(pos);
        onMarkerSelect(store);
      });
    });
  }, [currentPos]);

  // 3) 선택된 가게로 이동
  useEffect(() => {
    if (!selectedStore || !mapRef.current) return;
    const { kakao } = window;

    const pos = new kakao.maps.LatLng(selectedStore.lat, selectedStore.lng);
    mapRef.current.setLevel(2, { anchor: pos });
    mapRef.current.panTo(pos);
  }, [selectedStore]);

  // 🔵 버튼: 현재 위치로 이동 + 파란점 업데이트
  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { kakao } = window;

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const loc = new kakao.maps.LatLng(lat, lng);

      mapRef.current.panTo(loc);

      // 기존 파란점 제거
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }

      // 새 파란점 생성
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

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full"></div>

      <CircleButton
        icon="📍"
        onClick={goToCurrentLocation}
        className="absolute top-50 right-4 z-50"
        label="내 위치"
      />
    </div>
  );
}
