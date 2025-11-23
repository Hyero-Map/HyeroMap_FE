import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import KakaoMap from './components/KakaoMap';
import SearchBar from '../../components/SearchBar';
import CircleButton from '../../components/CircleButton';

import StoreDetailBottomSheet from '../../components/StoreDeatailBottomSheet';
import FavoriteBottomSheet from '../../components/FavoriteBottomSheet';
import RecomendBottomSheet from '../../components/RecommendBottomSheet';
import MyInfoBottomSheet from '../../components/MyInfoBottomSheet';
import RouteBottomSheet from '../../components/RouteBottomSheet';

import { fetchAllStores } from '../../api/StoreApi';
import { fetchKakaoRoute } from '../../api/KakaoApi';
import RecommendationResultSheet from '../../components/RecommendationResultSheet';
import { useAuthStore } from '../../stores/useAuthStore';
import LoginBottomSheet from '../../components/LoginBottomSheet';
import SignupBottomSheet from '../../components/SignupBottomSheet';

export default function Map() {
  /* ================================
     📌 UI 상태
  ================================= */
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const [RecommendSheetOpen, setRecommendSheetOpen] = useState(false);
  const [favoriteSheetOpen, setFavoriteSheetOpen] = useState(false);
  const [myinfoSheetOpen, setMyInfoSheetOpen] = useState(false);
  const [routeSheetOpen, setRouteSheetOpen] = useState(false);
  const [recommendResult, setRecommendResult] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const { isLoggedIn } = useAuthStore();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [signupSheetOpen, setSignupSheetOpen] = useState(false);

  /* ================================
     📌 현재 위치 가져오기
  ================================= */
  const [currentPos, setCurrentPos] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setCurrentPos({ lat: 37.5665, lng: 126.978 }) // Fallback
    );
  }, []);

  /* ================================
     📌 전체 store 데이터 불러오기
  ================================= */
  const { data: stores, isLoading } = useQuery({
    queryKey: ['allStores'],
    queryFn: fetchAllStores,
  });

  /* ================================
     📌 store 불러오면 검색 대상 초기화
  ================================= */
  useEffect(() => {
    if (!stores) return;
    setFilteredStores(stores.data);
  }, [stores]);

  /* ================================
     📌 검색 기능
  ================================= */
  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredStores(stores);
      return;
    }
    const lower = keyword.toLowerCase();

    const filtered = stores.data.filter(
      (s) =>
        s.storeName.toLowerCase().includes(lower) ||
        s.address.toLowerCase().includes(lower)
    );

    setFilteredStores(filtered);
  };

  /* ================================
     📌 즐겨찾기
  ================================= */
  const handleFavorite = (store) => {
    console.log('즐겨찾기 추가:', store);
  };

  /* ================================
     📌 로딩 중 처리
  ================================= */
  if (!currentPos || isLoading || !stores) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  /* ================================
     📌 화면 UI
  ================================= */
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
        icon="⭐"
        label="즐겨찾기"
        onClick={() => {
          if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            setLoginSheetOpen(true);
            return;
          }
          setFavoriteSheetOpen(true);
        }}
      />

      {/* AI 추천 */}
      <CircleButton
        className="absolute top-90 right-4 z-50"
        icon="🤖"
        label="AI 추천 메뉴"
        onClick={() => {
          if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            setLoginSheetOpen(true);
            return;
          }
          setRecommendSheetOpen(true);
        }}
      />

      {/* 내 정보 or 로그인 */}
      {isLoggedIn ? (
        // ----------- 로그인 O : 내 정보 버튼 ----------- //
        <CircleButton
          className="absolute top-110 right-4 z-50"
          icon="👤"
          label="내 정보"
          onClick={() => setMyInfoSheetOpen(true)}
        />
      ) : (
        // ----------- 로그인 X : 로그인 버튼 ----------- //
        <CircleButton
          className="absolute top-110 right-4 z-50"
          icon="🔑"
          label="로그인"
          onClick={() => setLoginSheetOpen(true)} // 로그인 바텀시트 열기
        />
      )}

      {/* ================================
          🗺️ 지도 컴포넌트 
      ================================== */}
      <KakaoMap
        stores={filteredStores}
        selectedStore={selectedStore}
        onMarkerSelect={(store) => setSelectedStore(store)}
        routePath={routePath}
      />

      {/* ================================
          🟢 가게 상세 바텀시트 
      ================================== */}
      <StoreDetailBottomSheet
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onFavorite={handleFavorite}
        onRouteRequest={async (store) => {
          const res = await fetchKakaoRoute({
            origin: currentPos,
            destination: { lat: store.latitude, lng: store.longitude },
          });

          const section = res.routes[0].sections[0];

          setRoutePath(section.roads);

          setRouteInfo({
            duration: Math.round(section.duration / 60) * 5,
            distance: section.distance,
            guides: section.guides,
          });

          setRouteSheetOpen(true);
        }}
      />

      {/* 경로 안내 바텀시트 */}
      <RouteBottomSheet
        open={routeSheetOpen}
        onClose={() => {
          setRoutePath(null);
          setRouteSheetOpen(false);
        }}
        routeInfo={routeInfo}
      />

      {/* 즐겨찾기 */}
      <FavoriteBottomSheet
        open={favoriteSheetOpen}
        onClose={() => setFavoriteSheetOpen(false)}
        onSelect={(s) => setSelectedStore(s)}
      />

      <RecomendBottomSheet
        open={RecommendSheetOpen}
        onClose={() => setRecommendSheetOpen(false)}
        onResult={(data) => setRecommendResult(data)}
      />

      {recommendResult && (
        <RecommendationResultSheet
          data={recommendResult}
          onClose={() => setRecommendResult(null)}
        />
      )}

      {/* 내 정보 */}
      <MyInfoBottomSheet
        open={myinfoSheetOpen}
        onClose={() => setMyInfoSheetOpen(false)}
      />

      <LoginBottomSheet
        open={loginSheetOpen}
        onClose={() => setLoginSheetOpen(false)}
        onSignupOpen={() => setSignupSheetOpen(true)}
      />

      <SignupBottomSheet
        open={signupSheetOpen}
        onClose={() => setSignupSheetOpen(false)}
      />
    </div>
  );
}
