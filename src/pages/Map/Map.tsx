import { useState } from 'react';
import KakaoMap from './components/KakaoMap';
import SearchBar from '../../components/SearchBar';
import CircleButton from '../../components/CircleButton';
import StoreDetailBottomSheet from '../../components/StoreDeatailBottomSheet';
import FavoriteBottomSheet from '../../components/FavoriteBottomSheet';

const mockStores = [
  {
    id: 1,
    name: '서울 시청 어르신 할인식당',
    roadAddress: '서울특별시 중구 세종대로 110',
    lat: 37.5665,
    lng: 126.978,
    phone: '02-120',
    minAge: 65,
    discountPercent: 30,
    discountAmount: null,
    serviceType: '식사 할인',
    extraInfo: '신분증 지참 필수',
    weekday: { start: '09:00', end: '18:00' },
    saturday: { start: '10:00', end: '17:00' },
    weekend: { start: '10:00', end: '17:00' },
    categoryCode: 'FNB001',
  },
  {
    id: 2,
    name: '명동역 CGV 시니어 영화할인',
    roadAddress: '서울 중구 퇴계로 123',
    lat: 37.5651,
    lng: 126.9895,
    phone: '1544-1122',
    minAge: 65,
    discountPercent: null,
    discountAmount: 5000,
    serviceType: '영화 관람료 할인',
    extraInfo: '평일 낮 시간대 적용',
    weekday: { start: '10:00', end: '20:00' },
    saturday: { start: '10:00', end: '22:00' },
    weekend: { start: '10:00', end: '22:00' },
    categoryCode: 'CULTURE002',
  },
  {
    id: 3,
    name: '광화문 교보문고 문화센터',
    roadAddress: '서울 종로구 종로 1',
    lat: 37.57,
    lng: 126.982,
    phone: '02-1544-1900',
    minAge: 60,
    discountPercent: 20,
    discountAmount: null,
    serviceType: '문화 강좌 할인',
    extraInfo: '일부 강좌 제외',
    weekday: { start: '09:30', end: '20:00' },
    saturday: { start: '10:00', end: '20:00' },
    weekend: { start: '10:00', end: '20:00' },
    categoryCode: 'CULTURE003',
  },
  {
    id: 4,
    name: '을지로 노포식당 시니어 할인',
    roadAddress: '서울 중구 을지로3가',
    lat: 37.561,
    lng: 126.983,
    phone: '02-777-0000',
    minAge: 65,
    discountPercent: 10,
    discountAmount: null,
    serviceType: '식사 할인',
    extraInfo: '점심시간 제외',
    weekday: { start: '11:00', end: '21:00' },
    saturday: { start: '11:00', end: '21:00' },
    weekend: { start: '11:00', end: '21:00' },
    categoryCode: 'FNB002',
  },
  {
    id: 5,
    name: '종로 건강복지센터',
    roadAddress: '서울 종로구 종로 45',
    lat: 37.569,
    lng: 126.986,
    phone: '02-123-1234',
    minAge: 65,
    discountPercent: null,
    discountAmount: null,
    serviceType: '무료 건강검진',
    extraInfo: '사전 예약 필요',
    weekday: { start: '09:00', end: '17:00' },
    saturday: { start: null, end: null },
    weekend: { start: null, end: null },
    categoryCode: 'HEALTH004',
  },
  {
    id: 6,
    name: '중구 실버 스포츠센터',
    roadAddress: '서울 중구 퇴계로 200',
    lat: 37.558,
    lng: 126.98,
    phone: '02-555-1212',
    minAge: 60,
    discountPercent: 50,
    discountAmount: null,
    serviceType: '헬스장 이용료 할인',
    extraInfo: '오전 9시~12시 적용',
    weekday: { start: '06:00', end: '22:00' },
    saturday: { start: '06:00', end: '20:00' },
    weekend: { start: '08:00', end: '18:00' },
    categoryCode: 'SPORT005',
  },
  {
    id: 7,
    name: '을지로 장난감 박물관',
    roadAddress: '서울 중구 을지로 5길',
    lat: 37.563,
    lng: 126.984,
    phone: '02-444-9898',
    minAge: 65,
    discountPercent: null,
    discountAmount: 3000,
    serviceType: '입장료 할인',
    extraInfo: '주말 동일 적용',
    weekday: { start: '10:00', end: '18:00' },
    saturday: { start: '10:00', end: '19:00' },
    weekend: { start: '10:00', end: '19:00' },
    categoryCode: 'MUSEUM006',
  },
  {
    id: 8,
    name: '서울 북창동 미용실 시니어데이',
    roadAddress: '서울 중구 남대문로 78',
    lat: 37.5635,
    lng: 126.9786,
    phone: '02-333-8888',
    minAge: 65,
    discountPercent: 40,
    discountAmount: null,
    serviceType: '커트 할인',
    extraInfo: '매주 화요일 한정',
    weekday: { start: '10:00', end: '20:00' },
    saturday: { start: '10:00', end: '20:00' },
    weekend: { start: '11:00', end: '18:00' },
    categoryCode: 'BEAUTY007',
  },
];
export default function Map() {
  const [filteredStores, setFilteredStores] = useState(mockStores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeSheetOpen, setStoreSheetOpen] = useState(false);
  const [favoriteSheetOpen, setFavoriteSheetOpen] = useState(false);
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredStores(mockStores);
      return;
    }

    const filtered = mockStores.filter((store) => store.name.includes(keyword));
    setFilteredStores(filtered);
  };
  return (
    <div className="animate-fadeIn w-full h-full relative">
      <SearchBar
        onSearch={handleSearch}
        results={filteredStores}
        onSelect={(store) => setSelectedStore(store)} // 🔥 선택된 가게 저장
      />

      {/* 즐겨찾기 버튼 */}
      <button
        className="absolute top-70 right-4 z-50"
        onClick={() => setFavoriteSheetOpen(true)}
      >
        <CircleButton icon="⭐" />
      </button>

      {/* AI 추천 버튼 */}
      <CircleButton icon="🤖" className="absolute top-90 right-4 z-50" />

      <KakaoMap
        stores={filteredStores}
        selectedStore={selectedStore}
        onMarkerSelect={(store) => setSelectedStore(store)} // 🔥 전달
      />
      {/* 하단 상세 정보 */}
      <StoreDetailBottomSheet
        store={selectedStore}
        open={storeSheetOpen}
        onClose={() => setSelectedStore(null)}
      />

      <FavoriteBottomSheet
        open={favoriteSheetOpen}
        onClose={() => setFavoriteSheetOpen(false)}
      />
    </div>
  );
}
