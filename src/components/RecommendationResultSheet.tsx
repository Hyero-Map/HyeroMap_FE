import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function RecommendationResultSheet({ data, onClose }) {
  const { gptResponse, stores } = data;
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
      {/* 🔹 오버레이 */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* 🔹 바텀시트 */}
      <motion.div
        key="result-sheet"
        ref={sheetRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="
          absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-xl p-6
          z-50 max-h-[85vh] overflow-y-auto
        "
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">추천 결과</h2>
          <button className="text-gray-500 text-xl" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 메뉴 이름 */}
        <h3 className="text-lg font-semibold">
          🍱 추천 메뉴: {gptResponse.menuName}
        </h3>

        {/* 재료 */}
        <div className="mt-4">
          <h4 className="font-semibold text-sm">🔸 사용된 주요 재료</h4>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {gptResponse.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* 분석 */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm">🧠 AI 분석</h4>
          <p className="mt-2 text-gray-700 leading-relaxed">
            {gptResponse.aiAnalysis}
          </p>
        </div>

        {/* 관련 가게 */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm">🏬 주변 판매 매장</h4>

          {stores.length === 0 ? (
            <p className="text-gray-500 mt-2">
              주변에서 판매하는 곳을 찾지 못했습니다.
            </p>
          ) : (
            <ul className="mt-2">
              {stores.map((s) => (
                <li
                  key={s.storeId}
                  className="p-3 border rounded-lg mb-2 shadow-sm"
                >
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm text-gray-600">{s.address}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
