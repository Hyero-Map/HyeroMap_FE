import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { fetchStoreById } from '../api/StoreApi';
import { useFavoriteStores } from '../hooks/useFavorite';
import { isStoreOpen } from '../utils/isStoreOpen';
import { addFavoriteStore, removeFavoriteStore } from '../api/favoriteApi';
import { useAuthStore } from '../stores/useAuthStore';
export default function StoreDetailBottomSheet({
  store,
  onClose,
  onFavorite,
  onRouteRequest,
}) {
  const sheetRef = useRef(null);

  const [detailStore, setDetailStore] = useState(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { fetchFavoriteStatus } = useFavoriteStores();
  const openSheet = !!store;
  const { isLoggedIn } = useAuthStore();
  /** 📌 storeId 변경될 때마다 상세 정보 + 즐겨찾기 상태 불러오기 */
  useEffect(() => {
    if (!store) return;

    const loadStore = async () => {
      try {
        const data = await fetchStoreById(store.storeId);
        setDetailStore(data);

        // ⭐ 즐겨찾기 여부 가져오기
        const status = await fetchFavoriteStatus(store.storeId);
        setIsFavorite(status.isFavorite);
        console.log('즐겨찾기 상태:', status);
      } catch (error) {
        console.error('상세 조회 또는 즐겨찾기 상태 불러오기 실패:', error);
      }
    };

    loadStore();
  }, [store]);

  /** 바깥 클릭 시 닫기 */
  useEffect(() => {
    function handleClickOutside(e) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  /** 📌 길찾기 처리 */
  const handleRoute = async () => {
    setLoading(true);
    await onRouteRequest(detailStore ?? store);
    setLoading(false);
    onClose();
  };

  const toggleFavorite = async () => {
    if (!detailStore) return;

    // ⛔  로그인 안 되어 있으면 안내만 띄우기
    if (!isLoggedIn) {
      alert('즐겨찾기는 로그인 이후에 이용 가능합니다.');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteStore(detailStore.storeId);
        setIsFavorite(false);
      } else {
        await addFavoriteStore(detailStore.storeId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('즐겨찾기 처리 실패:', err);
    }
  };

  if (!detailStore) return null;

  const d = detailStore;

  return (
    <AnimatePresence>
      {openSheet && (
        <>
          {/* 오버레이 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 바텀시트 */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-5 z-50
              h-1/2 overflow-y-auto
            "
          >
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-5 
                text-gray-500 hover:text-gray-700
                text-2xl font-light z-50
              "
            >
              ✕
            </button>

            {/* 상단 카드 */}
            <div className="mb-4 p-4 rounded-2xl bg-gray-100 shadow-sm mt-8">
              {/* 업종 코드 */}
              <div className="text-xs inline-block bg-green-100 text-green-700 px-2 py-1 rounded-lg mb-1">
                {d.storeCode}
              </div>

              {/* 이름 + 즐겨찾기 버튼 */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-gray-900">{d.name}</h2>

                <button
                  onClick={toggleFavorite}
                  className="
                    w-8 h-8 rounded-full flex items-center justify-center
                    bg-green-100 text-green-600 shadow-sm
                    hover:bg-green-200 transition
                  "
                >
                  {isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              {/* 할인 연령 안내 */}
              <div className="mt-3 py-2 px-3 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-sm text-green-700 font-bold">
                  {d.discountInfo.discountAge}세 이상 시니어 혜택 제공
                </p>
              </div>

              {/* 영업 여부 + 주소 */}
              <div className="mt-3 flex flex-col gap-1">
                <p
                  className={`text-sm font-semibold ${
                    isStoreOpen(d) ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {isStoreOpen(d) ? '영업 중' : '영업 종료'}
                </p>

                <p className="text-sm text-gray-700">{d.address}</p>
              </div>
            </div>

            {/* 길찾기 버튼 */}
            <button
              onClick={handleRoute}
              className="
                w-full bg-green-500 text-white py-3 rounded-xl
                shadow hover:bg-green-600 transition mb-5
                text-base font-semibold
              "
            >
              {loading ? '경로 계산 중...' : '🚶 길 찾기'}
            </button>

            {/* 상세 정보 */}
            <div className="space-y-5 pb-5">
              {/* 운영 정보 */}
              <section className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">⏱</span>
                  <p className="font-semibold text-gray-800">운영 정보</p>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    평일: {d.operatingHours.weekday.start} ~{' '}
                    {d.operatingHours.weekday.end}
                  </p>
                  <p>
                    토요일: {d.operatingHours.saturday.start} ~{' '}
                    {d.operatingHours.saturday.end}
                  </p>
                  <p>
                    공휴일: {d.operatingHours.holiday.start} ~{' '}
                    {d.operatingHours.holiday.end}
                  </p>
                </div>
              </section>

              {/* 할인 정보 */}
              <section className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">💸</span>
                  <p className="font-semibold text-gray-800">할인 정보</p>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">할인율:</span>{' '}
                    {d.discountInfo.discountPercent
                      ? `${d.discountInfo.discountPercent}%`
                      : '-'}
                  </p>
                  <p>
                    <span className="font-semibold">할인 금액:</span>{' '}
                    {d.discountInfo.discountAmount
                      ? `${d.discountInfo.discountAmount}원`
                      : '-'}
                  </p>
                  <p>
                    <span className="font-semibold">서비스:</span>{' '}
                    {d.discountInfo.discountService ?? '없음'}
                  </p>
                  <p>
                    <span className="font-semibold">상세:</span>{' '}
                    {d.discountInfo.discountDetail ?? '없음'}
                  </p>
                </div>
              </section>

              {/* 전화번호 */}
              <section className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">📞</span>
                  <p className="font-semibold text-gray-800">전화번호</p>
                </div>
                <p className="text-sm text-gray-700">{d.phone}</p>
              </section>

              {/* 메뉴 */}
              <section className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">🍽️</span>
                  <p className="font-semibold text-gray-800">메뉴 정보</p>
                </div>

                {d.menus.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    등록된 메뉴가 없습니다.
                  </p>
                ) : (
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {d.menus.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
