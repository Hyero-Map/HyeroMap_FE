import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

// 🔥 바텀시트 내부에서 사용할 즐겨찾기 mock 데이터 3개
const favoriteMock = [
  {
    id: 1,
    name: '서울 시청 어르신 할인식당',
    roadAddress: '서울특별시 중구 세종대로 110',
    serviceType: '식사 할인',
  },
  {
    id: 3,
    name: '광화문 교보문고 문화센터',
    roadAddress: '서울 종로구 종로 1',
    serviceType: '문화 강좌 할인',
  },
  {
    id: 6,
    name: '중구 실버 스포츠센터',
    roadAddress: '서울 중구 퇴계로 200',
    serviceType: '헬스장 이용료 할인',
  },
];

export default function FavoriteBottomSheet({ open, onClose }) {
  const sheetRef = useRef(null);

  // 바깥 클릭 시 닫힘
  useEffect(() => {
    function handleClickOutside(e) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
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
            key="favorite-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-5 z-50
              h-4/5 overflow-y-auto
            "
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">즐겨찾기 목록</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {favoriteMock.map((item) => (
                <div
                  key={item.id}
                  className="
                    p-4 border rounded-xl shadow-sm 
                    hover:bg-gray-50 transition
                  "
                >
                  <p className="font-semibold text-base">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.roadAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    혜택: {item.serviceType}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
