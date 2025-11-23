// src/components/LoginBottomSheet.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useLogin } from '../hooks/useLogin'; // React Query mutation

type LoginBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onSignupOpen?: () => void; // 회원가입 띄우기
};

export default function LoginBottomSheet({
  open,
  onClose,
  onSignupOpen,
}: LoginBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const setToken = useAuthStore((state) => state.setToken);

  // 로그인 Mutation
  const { mutate, isPending } = useLogin();

  /** ▶️ 바깥 클릭 시 닫기 */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  /** ▶️ 로그인 버튼 */
  const handleLogin = () => {
    const payload = {
      userPhone: phone,
      password,
    };

    mutate(payload, {
      onSuccess: (res) => {
        const { accessToken, userName, userPhone } = res;

        useAuthStore.getState().setAuth(accessToken, userName, userPhone);
        alert('환영합니다! ');
        onClose();
      },
      onError: () => {
        alert('로그인 실패! 전화번호 또는 비밀번호를 확인해주세요.');
      },
    });
  };

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
            key="login-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-6 z-50
              max-h-[85vh] overflow-y-auto
            "
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">로그인</h2>
              <button className="text-gray-500 text-xl" onClick={onClose}>
                ✕
              </button>
            </div>

            {/* 전화번호 */}
            <div className="mt-4">
              <label className="text-sm font-semibold">전화번호</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="01012345678"
              />
            </div>

            {/* 비밀번호 */}
            <div className="mt-4">
              <label className="text-sm font-semibold">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border rounded-lg"
                placeholder="비밀번호 입력"
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              className="
                w-full mt-5 bg-green-600 text-white py-3 rounded-xl
                shadow-md hover:bg-green-700 transition flex items-center justify-center
              "
              disabled={isPending || !phone || !password}
              onClick={handleLogin}
            >
              {isPending ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                '로그인'
              )}
            </button>

            {/* 회원가입 이동 */}
            <button
              className="w-full mt-4 py-2 text-green-600 font-semibold"
              onClick={() => {
                onClose(); // 1) 로그인 바텀시트를 닫음
                if (onSignupOpen) {
                  onSignupOpen(); // 2) 회원가입 바텀시트를 오픈
                }
              }}
            >
              아직 계정이 없나요? 회원가입하기 →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
