import { useEffect, useState } from 'react';
import KakaoMap from './components/KakaoMap';
import SearchBar from '../../components/SearchBar';
import CircleButton from '../../components/CircleButton';
import StoreDetailBottomSheet from '../../components/StoreDeatailBottomSheet';
import FavoriteBottomSheet from '../../components/FavoriteBottomSheet';
import RecomendBottomSheet from '../../components/RecommendBottomSheet';
import MyInfoBottomSheet from '../../components/MyInfoBottomSheet';
import { fetchKakaoRoute } from '../../api/KakaoApi';
import RouteBottomSheet from '../../components/RouteBottomSheet';

const mockStores = [
  {
    id: 101,
    name: '대구 동성로 시니어 할인식당',
    roadAddress: '대구 중구 동성로 25',
    lat: 35.8682,
    lng: 128.5987,
    phone: '053-111-1111',
    minAge: 65,
    discountPercent: 30,
    discountAmount: null,
    serviceType: '식사 할인',
    extraInfo: '신분증 지참',
    weekday: { start: '09:00', end: '20:00' },
    saturday: { start: '10:00', end: '19:00' },
    weekend: { start: '10:00', end: '19:00' },
    categoryCode: 'FNB001',
  },
  {
    id: 102,
    name: '대구 현대백화점 시니어 영화할인',
    roadAddress: '대구 중구 달구벌대로 2077',
    lat: 35.8701,
    lng: 128.5938,
    phone: '053-222-2222',
    minAge: 65,
    discountPercent: null,
    discountAmount: 5000,
    serviceType: '영화 할인',
    extraInfo: '평일 낮 시간대만 적용',
    weekday: { start: '10:00', end: '20:00' },
    saturday: { start: '10:00', end: '21:00' },
    weekend: { start: '10:00', end: '21:00' },
    categoryCode: 'CULTURE002',
  },
  {
    id: 103,
    name: '대구 삼덕동 문화센터 시니어 강좌',
    roadAddress: '대구 중구 삼덕동3가 201',
    lat: 35.8665,
    lng: 128.6112,
    phone: '053-333-3333',
    minAge: 60,
    discountPercent: 20,
    discountAmount: null,
    serviceType: '문화 강좌 할인',
    extraInfo: '일부 강좌 제외',
    weekday: { start: '09:00', end: '20:00' },
    saturday: { start: '10:00', end: '20:00' },
    weekend: { start: '10:00', end: '20:00' },
    categoryCode: 'CULTURE003',
  },
  {
    id: 104,
    name: '대구 칠성시장 노포식당 시니어 할인',
    roadAddress: '대구 북구 칠성동1가 100',
    lat: 35.8803,
    lng: 128.5934,
    phone: '053-444-4444',
    minAge: 65,
    discountPercent: 10,
    discountAmount: null,
    serviceType: '식사 할인',
    extraInfo: '점심시간 제외',
    weekday: { start: '11:00', end: '21:00' },
    saturday: { start: '11:00', end: '20:00' },
    weekend: { start: '11:00', end: '20:00' },
    categoryCode: 'FNB002',
  },
  {
    id: 105,
    name: '대구 중구 건강복지센터 시니어 검진',
    roadAddress: '대구 중구 국채보상로 670',
    lat: 35.8709,
    lng: 128.5975,
    phone: '053-555-5555',
    minAge: 65,
    discountPercent: null,
    discountAmount: null,
    serviceType: '무료 건강검진',
    extraInfo: '사전 예약 필수',
    weekday: { start: '09:00', end: '17:00' },
    saturday: { start: null, end: null },
    weekend: { start: null, end: null },
    categoryCode: 'HEALTH004',
  },
  {
    id: 106,
    name: '대구 수성구 시니어 스포츠센터',
    roadAddress: '대구 수성구 수성로 310',
    lat: 35.8585,
    lng: 128.6301,
    phone: '053-666-6666',
    minAge: 60,
    discountPercent: 50,
    discountAmount: null,
    serviceType: '헬스장 할인',
    extraInfo: '오전 9~12시 적용',
    weekday: { start: '06:00', end: '22:00' },
    saturday: { start: '06:00', end: '20:00' },
    weekend: { start: '08:00', end: '18:00' },
    categoryCode: 'SPORT005',
  },
  {
    id: 107,
    name: '대구 어린이대공원 박물관 시니어 할인',
    roadAddress: '대구 달서구 공원순환로 46',
    lat: 35.8292,
    lng: 128.5329,
    phone: '053-777-7777',
    minAge: 65,
    discountPercent: null,
    discountAmount: 3000,
    serviceType: '입장료 할인',
    extraInfo: '평일/주말 동일 적용',
    weekday: { start: '10:00', end: '18:00' },
    saturday: { start: '10:00', end: '18:00' },
    weekend: { start: '10:00', end: '18:00' },
    categoryCode: 'MUSEUM006',
  },
  {
    id: 108,
    name: '대구 범어동 미용실 시니어데이',
    roadAddress: '대구 수성구 범어천로 55',
    lat: 35.8591,
    lng: 128.6231,
    phone: '053-888-8888',
    minAge: 65,
    discountPercent: 40,
    discountAmount: null,
    serviceType: '커트 할인',
    extraInfo: '매주 화요일 적용',
    weekday: { start: '10:00', end: '20:00' },
    saturday: { start: '10:00', end: '20:00' },
    weekend: { start: '11:00', end: '18:00' },
    categoryCode: 'BEAUTY007',
  },
];
export default function Map() {
  const [filteredStores, setFilteredStores] = useState(mockStores);
  const [selectedStore, setSelectedStore] = useState(null);

  // 🔥 bottom sheet flags
  const [RecommendSheetOpen, setRecommendSheetOpen] = useState(false);
  const [favoriteSheetOpen, setFavoriteSheetOpen] = useState(false);
  const [myinfoSheetOpen, setMyInfoSheetOpen] = useState(false);
  const [routeSheetOpen, setRouteSheetOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  // 🔵 현재 위치
  const [currentPos, setCurrentPos] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setCurrentPos({ lat: 37.5665, lng: 126.978 }) // fallback
    );
  }, []);

  // 🔥 경로 polyline 데이터
  const [routePath, setRoutePath] = useState(null);

  // ⭐ 즐겨찾기 임시
  const handleFavorite = (store) => {
    console.log('즐겨찾기 추가:', store);
  };

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredStores(mockStores);
      return;
    }
    const filtered = mockStores.filter((store) => store.name.includes(keyword));
    setFilteredStores(filtered);
  };

  if (!currentPos) return null;

  return (
    <div className="animate-fadeIn w-full h-full relative">
      <SearchBar
        onSearch={handleSearch}
        results={filteredStores}
        onSelect={(store) => setSelectedStore(store)}
      />

      {/* 즐겨찾기 */}
      <CircleButton
        className="absolute top-70 right-4 z-50"
        onClick={() => setFavoriteSheetOpen(true)}
        icon="⭐"
        label="즐겨찾기"
      />

      {/* AI 추천 */}
      <CircleButton
        onClick={() => setRecommendSheetOpen(true)}
        icon="🤖"
        className="absolute top-90 right-4 z-50"
        label="AI 추천 메뉴"
      />

      {/* 내 정보 */}
      <CircleButton
        icon="👤"
        className="absolute top-110 right-4 z-50"
        label="내 정보"
        onClick={() => setMyInfoSheetOpen(true)}
      />

      <KakaoMap
        stores={filteredStores}
        selectedStore={selectedStore}
        onMarkerSelect={(store) => setSelectedStore(store)}
        routePath={routePath}
      />
      <StoreDetailBottomSheet
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onFavorite={handleFavorite}
        onRouteRequest={async (store) => {
          const res = await fetchKakaoRoute({
            origin: currentPos,
            destination: { lat: store.lat, lng: store.lng },
          });

          setRoutePath(res.routes[0].sections[0].roads);

          // 요약 정보 저장
          const section = res.routes[0].sections[0];
          console.log('section', section.guides);
          setRouteInfo({
            duration: Math.round(section.duration / 60) * 5,
            distance: section.distance,
            guides: section.guides,
          });

          setRouteSheetOpen(true);
        }}
      />

      <RouteBottomSheet
        open={routeSheetOpen}
        onClose={() => {
          setRoutePath(null);
          setRouteSheetOpen(false);
        }}
        routeInfo={routeInfo}
      />

      <FavoriteBottomSheet
        open={favoriteSheetOpen}
        onClose={() => setFavoriteSheetOpen(false)}
        onSelect={(store) => setSelectedStore(store)}
      />

      <RecomendBottomSheet
        open={RecommendSheetOpen}
        onClose={() => setRecommendSheetOpen(false)}
      />

      <MyInfoBottomSheet
        open={myinfoSheetOpen}
        onClose={() => setMyInfoSheetOpen(false)}
      />
    </div>
  );
}
