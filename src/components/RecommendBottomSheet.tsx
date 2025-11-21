import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function RecomendBottomSheet({ open, onClose }) {
  const sheetRef = useRef(null);

  // 폼 상태
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    allergy: '',
    hardFood: false,
    spicy: false,
    sugarSaltRestriction: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    function handleClickOutside(e: any) {
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
            key="reco-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-5 z-50
              h-5/6 overflow-y-auto
            "
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">
                건강에 맞는 메뉴를 추천해드립니다!
              </h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* 입력 폼 */}
            <div className="flex flex-col gap-4 mt-4">
              {/* 이름 */}
              <div>
                <label className="text-sm font-semibold">이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg"
                  placeholder="이름을 입력하세요"
                />
              </div>

              {/* 나이 */}
              <div>
                <label className="text-sm font-semibold">나이</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg"
                  placeholder="나이를 입력하세요"
                />
              </div>

              {/* 성별 */}
              <div>
                <label className="text-sm font-semibold">성별</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="남성"
                      checked={form.gender === '남성'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    />
                    남성
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="여성"
                      checked={form.gender === '여성'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    />
                    여성
                  </label>
                </div>
              </div>

              {/* 알레르기 */}
              <div>
                <label className="text-sm font-semibold">알레르기</label>
                <input
                  type="text"
                  value={form.allergy}
                  onChange={(e) => handleChange('allergy', e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg"
                  placeholder="예: 땅콩, 해산물 등"
                />
              </div>

              {/* 딱딱한 음식 가능 여부 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  딱딱한 음식 섭취 가능
                </label>
                <input
                  type="checkbox"
                  checked={form.hardFood}
                  onChange={(e) => handleChange('hardFood', e.target.checked)}
                />
              </div>

              {/* 매운 음식 선호 여부 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">매운 음식 선호</label>
                <input
                  type="checkbox"
                  checked={form.spicy}
                  onChange={(e) => handleChange('spicy', e.target.checked)}
                />
              </div>

              {/* 단·짠 음식 제한 */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  단·짠 음식 제한 필요
                </label>
                <input
                  type="checkbox"
                  checked={form.sugarSaltRestriction}
                  onChange={(e) =>
                    handleChange('sugarSaltRestriction', e.target.checked)
                  }
                />
              </div>

              {/* 제출 버튼 */}
              <button
                className="
                  mt-4 bg-green-600 text-white py-3 rounded-xl
                  shadow-md hover:bg-green-700 transition
                "
                onClick={() => console.log('제출 데이터:', form)}
              >
                추천 받기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
