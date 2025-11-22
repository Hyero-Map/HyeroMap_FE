import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { isStoreOpen } from '../utils/isStoreOpen';

export default function StoreDetailBottomSheet({
  store,
  onClose,
  onFavorite,
  onRouteRequest, // ★ 상위에게 경로 요청을 전달
}) {
  const sheetRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const openSheet = !!store; // 시트 열릴지 여부

  useEffect(() => {
    function handleClickOutside(e) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleRoute = async () => {
    setLoading(true);
    await onRouteRequest(store);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {openSheet && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

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
    h-1/2
  "
          >
            {/* 🔷 상단 고정 영역 */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{store.name}</h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onFavorite(store)}
                  className="
          w-8 h-8 rounded-full flex items-center justify-center
          bg-green-100 text-green-600 shadow
          hover:bg-green-200 transition
        "
                >
                  ⭐
                </button>
                <button onClick={onClose} className="text-gray-500 text-xl">
                  ✕
                </button>
              </div>
            </div>

            <p
              className={`
      text-sm font-semibold mb-2
      ${isStoreOpen(store) ? 'text-green-600' : 'text-red-500'}
    `}
            >
              {isStoreOpen(store) ? '영업 중' : '영업 종료'}
            </p>

            <p className="text-sm text-gray-700 mb-3">{store.roadAddress}</p>

            {/* 🔥 길찾기 버튼 */}
            <button
              onClick={handleRoute}
              className="
      w-full bg-green-500 text-white py-2 rounded-xl 
      shadow hover:bg-green-600 transition mb-4
    "
            >
              {loading ? '경로 계산 중...' : '길 찾기'}
            </button>

            {/* 🔥 여기부터 아래가 스크롤 영역 */}
            <div className="overflow-y-auto pr-1">
              <div className="text-sm mt-3  pb-5">
                <p>
                  <strong>운영 정보:</strong>
                </p>
                <p>
                  평일: {store.weekday.start} ~ {store.weekday.end}
                </p>
                <p>
                  토요일: {store.saturday.start} ~ {store.saturday.end}
                </p>
                <p>
                  일요일·공휴일: {store.weekend.start} ~ {store.weekend.end}
                </p>

                <p className="mt-3">
                  <strong>혜택 유형:</strong> {store.serviceType}
                </p>

                <p>
                  <strong>추가 정보:</strong> {store.extraInfo ?? '없음'}
                </p>

                <p className="mt-3">
                  <strong>전화번호:</strong> {store.phone}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
