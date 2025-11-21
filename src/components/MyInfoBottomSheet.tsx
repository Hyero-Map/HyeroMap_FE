import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function MyInfoBottomSheet({ open, onClose }) {
  const sheetRef = useRef(null);

  // 🔥 mock data (나중에 API로 대체)
  const mockUser = {
    name: '홍길동',
    phone: '010-1234-5678',
    password: 'mySecretPassword',
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState(mockUser.password);

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
            key="myinfo-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full
              bg-white rounded-t-3xl shadow-xl p-5 z-50
              h-2/3 overflow-y-auto
            "
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">내 정보</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* 입력 폼 */}
            <div className="flex flex-col gap-5">
              {/* 이름 */}
              <div>
                <label className="text-sm text-gray-700">이름</label>
                <input
                  type="text"
                  value={mockUser.name}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl border bg-gray-100"
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label className="text-sm text-gray-700">전화번호</label>
                <input
                  type="text"
                  value={mockUser.phone}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl border bg-gray-100"
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="text-sm text-gray-700">비밀번호</label>

                <div className="relative mt-1">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-12 rounded-xl border"
                  />

                  <button
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {passwordVisible ? '숨기기' : '보기'}
                  </button>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <hr className="my-6" />

            {/* 로그아웃 & 탈퇴 버튼 */}
            <div className="flex flex-col gap-3">
              <button className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
                로그아웃
              </button>

              <button className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200">
                회원탈퇴
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
