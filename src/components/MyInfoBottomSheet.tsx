import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import api from '../api/axiosInstance';

export default function MyInfoBottomSheet({ open, onClose }) {
  const sheetRef = useRef(null);

  const userName = useAuthStore((state) => state.userName);
  const userPhone = useAuthStore((state) => state.userPhone);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');

  const passwordsMatch = newPw && newPwCheck && newPw === newPwCheck;

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        resetAll();
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const resetAll = () => {
    setIsEditingPassword(false);
    setIsDeletingUser(false);
    setCurrentPw('');
    setNewPw('');
    setNewPwCheck('');
  };

  /** 🔥 비밀번호 수정 API */
  const handlePasswordUpdate = async () => {
    try {
      await api.patch(
        '/api/user/password',
        {
          currentPassword: currentPw,
          newPassword: newPw,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('비밀번호가 성공적으로 변경되었습니다.');
      resetAll();
    } catch (err) {
      alert('비밀번호 변경 실패! 현재 비밀번호를 확인해주세요.');
      console.error(err);
    }
  };

  /** 🔥 회원탈퇴 API (비밀번호 필요) */
  const handleDeleteUser = async () => {
    if (!currentPw) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!confirm('정말 회원탈퇴하시겠습니까? 복구할 수 없습니다.')) return;

    try {
      await api.delete('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password: currentPw,
        },
      });

      alert('회원탈퇴가 완료되었습니다.');
      logout();
      onClose();
      resetAll();
    } catch (err) {
      alert('회원탈퇴 실패! 비밀번호를 확인해주세요.');
      console.error(err);
    }
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
            onClick={() => {
              resetAll();
              onClose();
            }}
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
              absolute bottom-0 left-0 w-full bg-white 
              rounded-t-3xl shadow-xl z-50 p-5 
              max-h-[85vh] overflow-y-auto
            "
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                {isEditingPassword
                  ? '비밀번호 변경'
                  : isDeletingUser
                  ? '회원탈퇴'
                  : '내 정보'}
              </h2>
              <button
                onClick={() => {
                  resetAll();
                  onClose();
                }}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* ================================
                🔹 회원탈퇴 모드
            ================================= */}
            {isDeletingUser ? (
              <>
                <div className="mb-4">
                  <label className="text-sm text-gray-700">비밀번호 입력</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border"
                    placeholder="본인 인증을 위해 비밀번호를 입력하세요"
                  />
                </div>

                <button
                  className={`w-full mt-6 py-3 rounded-xl text-white font-semibold ${
                    currentPw ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                  disabled={!currentPw}
                  onClick={handleDeleteUser}
                >
                  회원탈퇴 진행하기
                </button>
              </>
            ) : null}

            {/* ================================
                🔹 비밀번호 수정 모드
            ================================= */}
            {!isDeletingUser && isEditingPassword ? (
              <>
                {/* 현재 비밀번호 */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700">현재 비밀번호</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border"
                    placeholder="현재 비밀번호 입력"
                  />
                </div>

                {/* 새 비밀번호 */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700">새 비밀번호</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border"
                    placeholder="새 비밀번호 입력"
                  />
                </div>

                {/* 새 비밀번호 확인 */}
                <div className="mb-4">
                  <label className="text-sm text-gray-700">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={newPwCheck}
                    onChange={(e) => setNewPwCheck(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border"
                    placeholder="다시 한 번 입력"
                  />

                  {newPw && newPwCheck && (
                    <p
                      className={`text-sm mt-1 ${
                        passwordsMatch ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {passwordsMatch
                        ? '비밀번호가 일치합니다.'
                        : '비밀번호가 일치하지 않습니다.'}
                    </p>
                  )}
                </div>

                <button
                  className={`w-full mt-6 py-3 rounded-xl text-white font-semibold ${
                    passwordsMatch && currentPw ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={!passwordsMatch || !currentPw}
                  onClick={handlePasswordUpdate}
                >
                  비밀번호 변경하기
                </button>
              </>
            ) : null}

            {/* ================================
                🔹 일반 모드
            ================================= */}
            {!isEditingPassword && !isDeletingUser && (
              <>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-gray-700">이름</label>
                    <input
                      type="text"
                      value={userName || ''}
                      readOnly
                      className="w-full mt-1 p-3 rounded-xl border bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">전화번호</label>
                    <input
                      type="text"
                      value={userPhone || ''}
                      readOnly
                      className="w-full mt-1 p-3 rounded-xl border bg-gray-100"
                    />
                  </div>

                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="mt-3 bg-blue-500 text-white py-3 rounded-xl"
                  >
                    비밀번호 수정하기
                  </button>
                </div>

                <hr className="my-6" />

                <div className="flex flex-col gap-3">
                  <button
                    className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                    onClick={() => {
                      logout();
                      alert('성공적으로 로그아웃되었습니다.');
                      onClose();
                    }}
                  >
                    로그아웃
                  </button>

                  <button
                    className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200"
                    onClick={() => setIsDeletingUser(true)}
                  >
                    회원탈퇴
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
