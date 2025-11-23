import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import CheckboxField from './CheckboxField';
import { useRecommendation } from '../hooks/useRecommendation';

type RecommendBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onResult: (data: any) => void;
};

export default function RecomendBottomSheet({
  open,
  onClose,
  onResult,
}: RecommendBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  type FormState = {
    name: string;
    age: string;
    gender: string;
    allergy: string;
    disease: string;
    hardFood: boolean;
    spicy: boolean;
    sugarSaltRestriction: boolean;
  };

  const initialForm: FormState = {
    name: '',
    age: '',
    gender: '',
    allergy: '',
    disease: '',
    hardFood: false,
    spicy: false,
    sugarSaltRestriction: false,
  };

  const [form, setForm] = useState<FormState>(initialForm);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value } as FormState));
  };

  const { mutate, isPending } = useRecommendation();
  const [isLocating, setIsLocating] = useState(false);

  /** 입력값 유효성 검사 */
  const isFormValid =
    form.name.trim() !== '' &&
    form.age.trim() !== '' &&
    form.gender.trim() !== '';

  /** 닫을 때 폼 초기화 */
  const handleCloseWithReset = () => {
    setForm(initialForm);
    onClose();
  };

  /** 시트 밖 클릭하면 닫기 */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        handleCloseWithReset();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** 제출 */
  const handleSubmit = () => {
    if (!isFormValid) return;

    setIsLocating(true);

    if (!navigator.geolocation) {
      alert('현재 위치 조회가 불가능한 브라우저입니다.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);

        const payload = {
          userName: form.name,
          userAge: Number(form.age),
          gender: form.gender,
          allergies: form.allergy,
          diseases: form.disease,
          canEatHardFood: form.hardFood,
          likesSpicyFood: form.spicy,
          needsLowSaltSweet: form.sugarSaltRestriction,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };

        mutate(payload, {
          onSuccess: (res) => {
            onResult(res);
            handleCloseWithReset();
          },
        });
      },
      () => {
        setIsLocating(false);
        alert('현재 위치 조회 실패. 권한을 확인하세요.');
      }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseWithReset}
          />

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
              max-h-[90vh] overflow-y-auto
            "
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">
                건강에 맞는 메뉴를 추천해드립니다!
              </h2>
              <button
                onClick={handleCloseWithReset}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

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
                <div className="flex gap-4 mt-2">
                  {['남성', '여성'].map((g) => (
                    <label
                      key={g}
                      onClick={() => handleChange('gender', g)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border
                        transition-all duration-150
                        ${
                          form.gender === g
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      {g}
                    </label>
                  ))}
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

              {/* 질환 */}
              <div>
                <label className="text-sm font-semibold">질환</label>
                <input
                  type="text"
                  value={form.disease}
                  onChange={(e) => handleChange('disease', e.target.value)}
                  className="mt-1 w-full p-2 border rounded-lg"
                  placeholder="예: 고혈압, 당뇨, 관절염 등"
                />
              </div>

              <CheckboxField
                label="딱딱한 음식 섭취 가능"
                value={form.hardFood}
                onToggle={(v) => handleChange('hardFood', v)}
              />
              <CheckboxField
                label="매운 음식 선호"
                value={form.spicy}
                onToggle={(v) => handleChange('spicy', v)}
              />
              <CheckboxField
                label="단·짠 음식 제한 필요"
                value={form.sugarSaltRestriction}
                onToggle={(v) => handleChange('sugarSaltRestriction', v)}
              />

              {/* 제출 버튼 */}
              <button
                className={`
                  mt-4 py-3 rounded-xl shadow-md transition flex items-center justify-center 
                  text-white
                  ${
                    isFormValid
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
                onClick={handleSubmit}
                disabled={!isFormValid || isLocating || isPending}
              >
                {(isLocating || isPending) && (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                )}

                {!isFormValid
                  ? '모든 항목을 입력하세요'
                  : isLocating
                  ? '현재 위치 가져오는 중...'
                  : isPending
                  ? '추천 요청 중...'
                  : '추천 받기'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
