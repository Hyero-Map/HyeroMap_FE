import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignup } from '../hooks/useSignup';

type SignupBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function SignupBottomSheet({
  open,
  onClose,
}: SignupBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<1 | 2>(1);

  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
  });

  const [form, setForm] = useState({
    userName: '',
    userPhone: '',
    password: '',
    passwordConfirm: '',
  });

  const { mutate, isPending } = useSignup();

  /** 닫힐 때 초기화 */
  const resetAndClose = () => {
    setStep(1);
    setTerms({ all: false, service: false, privacy: false });
    setForm({
      userName: '',
      userPhone: '',
      password: '',
      passwordConfirm: '',
    });
    onClose();
  };

  /** 바깥 클릭 시 닫기 */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        resetAndClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** 약관 - 전체 토글 */
  const toggleAll = (checked: boolean) => {
    setTerms({
      all: checked,
      service: checked,
      privacy: checked,
    });
  };

  /** 약관 - 개별 토글 */
  const toggleSingle = (field: 'service' | 'privacy') => {
    const updated = {
      ...terms,
      [field]: !terms[field],
    };
    updated.all = updated.service && updated.privacy;
    setTerms(updated);
  };

  /** 회원가입 요청 */
  const handleSignup = () => {
    mutate(
      {
        userName: form.userName,
        userPhone: form.userPhone,
        password: form.password,
      },
      {
        onSuccess: () => {
          alert('회원가입이 완료되었습니다.');
          resetAndClose();
        },
      }
    );
  };

  /** 입력값 검증 상태 */
  const isFormValid =
    form.userName.trim() !== '' &&
    form.userPhone.trim() !== '' &&
    form.password.trim() !== '' &&
    form.passwordConfirm.trim() !== '' &&
    form.password === form.passwordConfirm;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 배경 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={resetAndClose}
          />

          {/* 바텀시트 */}
          <motion.div
            key="signup-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full bg-white rounded-t-3xl 
              shadow-xl z-50 p-6 max-h-[85vh] overflow-y-auto
            "
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {step === 1 ? '약관 동의' : '회원가입'}
              </h2>
              <button onClick={resetAndClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* STEP 1 - 약관 동의 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 text-lg font-semibold">
                  <input
                    type="checkbox"
                    checked={terms.all}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="w-5 h-5"
                  />
                  전체 약관에 동의합니다.
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={terms.service}
                    onChange={() => toggleSingle('service')}
                    className="w-5 h-5"
                  />
                  서비스 이용약관 동의 (필수)
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={terms.privacy}
                    onChange={() => toggleSingle('privacy')}
                    className="w-5 h-5"
                  />
                  개인정보 처리방침 동의 (필수)
                </label>

                <button
                  className={`mt-6 py-3 rounded-xl text-white font-semibold 
                  ${terms.all ? 'bg-green-600' : 'bg-gray-300'}`}
                  disabled={!terms.all}
                  onClick={() => setStep(2)}
                >
                  다음
                </button>
              </div>
            )}

            {/* STEP 2 - 정보 입력 */}
            {step === 2 && (
              <div className="flex flex-col gap-4 pb-10">
                {/* 이름 */}
                <div>
                  <label className="text-sm font-semibold">이름</label>
                  <input
                    type="text"
                    value={form.userName}
                    onChange={(e) =>
                      setForm({ ...form, userName: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-lg"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                {/* 전화번호 */}
                <div>
                  <label className="text-sm font-semibold">전화번호</label>
                  <input
                    type="text"
                    value={form.userPhone}
                    onChange={(e) =>
                      setForm({ ...form, userPhone: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-lg"
                    placeholder="01012345678"
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <label className="text-sm font-semibold">비밀번호</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-lg"
                    placeholder="비밀번호 입력"
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label className="text-sm font-semibold">비밀번호 확인</label>
                  <input
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(e) =>
                      setForm({ ...form, passwordConfirm: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-lg"
                    placeholder="비밀번호 재입력"
                  />
                </div>

                {/* 비밀번호 불일치 메시지 */}
                {form.passwordConfirm && (
                  <>
                    {form.password === form.passwordConfirm ? (
                      <p className="text-green-600 text-sm">
                        ✔ 비밀번호가 일치합니다.
                      </p>
                    ) : (
                      <p className="text-red-500 text-sm">
                        ✘ 비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                  </>
                )}

                {/* 회원가입 버튼 */}
                <button
                  className={`mt-6 py-3 rounded-xl shadow-md transition text-white
                  ${
                    isFormValid
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300'
                  }
                `}
                  disabled={!isFormValid || isPending}
                  onClick={handleSignup}
                >
                  {isPending ? '회원가입 중...' : '회원가입 완료'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
