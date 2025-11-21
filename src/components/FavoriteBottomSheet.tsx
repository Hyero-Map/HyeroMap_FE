import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const favoriteMock = [
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
];

export default function FavoriteBottomSheet({ open, onClose, onSelect }) {
  const sheetRef = useRef(null);

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
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

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
              <h2 className="text-lg font-bold">
                즐겨찾기 목록 {favoriteMock.length}개
              </h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {favoriteMock.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="
                    p-4 border rounded-xl shadow-sm cursor-pointer
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
