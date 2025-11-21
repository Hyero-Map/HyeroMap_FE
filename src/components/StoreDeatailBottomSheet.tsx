import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { isStoreOpen } from '../utils/isStoreOpen';

export default function StoreDetailBottomSheet({ store, onClose, onFavorite }) {
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

  const open = !!store; // 변경

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 배경 오버레이 */}
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
              absolute  bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-5 z-50
              h-2/5 overflow-y-auto
            "
          >
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

            {/* 영업 여부 */}
            <p
              className={`
                text-sm font-semibold mb-2
                ${isStoreOpen(store) ? 'text-green-600' : 'text-red-500'}
              `}
            >
              {isStoreOpen(store) ? '영업 중' : '영업 종료'}
            </p>

            <p className="text-sm text-gray-700 mb-3">{store.roadAddress}</p>

            <div className="text-sm">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
