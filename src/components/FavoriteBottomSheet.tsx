import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const favoriteMock = [
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
