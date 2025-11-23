import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getFavoriteStores } from '../api/favoriteApi';

export default function FavoriteBottomSheet({ open, onClose, onSelect }) {
  const sheetRef = useRef(null);
  const [favoriteList, setFavoriteList] = useState([]);
  const [loading, setLoading] = useState(false);

  /** ⭐ 바텀시트 열릴 때 API 호출 */
  useEffect(() => {
    if (!open) return;

    async function fetchFavoriteList() {
      try {
        setLoading(true);

        const raw = await getFavoriteStores();
        const list = Array.isArray(raw) ? raw : raw.data ?? [];

        console.log('즐겨찾기 응답:', list);

        setFavoriteList(list);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteList();
  }, [open]);

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
            {/* ────────────────────────────────
                헤더
            ──────────────────────────────── */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">
                즐겨찾기 목록 {favoriteList.length}개
              </h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {loading && (
              <p className="text-center text-gray-500 mt-10">불러오는 중...</p>
            )}

            {!loading && favoriteList.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                즐겨찾기한 가게가 없습니다.
              </p>
            )}

            {/* ────────────────────────────────
                즐겨찾기 리스트
            ──────────────────────────────── */}
            <div className="flex flex-col gap-3">
              {favoriteList.map((item) => {
                const address = item.address ?? '주소 정보 없음';

                const discountPercent =
                  item.discountInfo?.discountPercent ?? null;
                const discountAmount =
                  item.discountInfo?.discountAmount ?? null;
                const discountService =
                  item.discountInfo?.discountService ?? null;

                const discountText = discountPercent
                  ? `${discountPercent}% 할인`
                  : discountAmount
                  ? `${discountAmount}원 할인`
                  : discountService
                  ? discountService
                  : '할인 정보 없음';

                return (
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

                    <p className="text-sm text-gray-500 mt-1">{address}</p>

                    <p className="text-sm text-gray-700 mt-1">
                      혜택: {discountText}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
