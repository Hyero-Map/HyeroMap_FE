import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

interface RouteBottomSheetProps {
  open: boolean;
  onClose: () => void;
  routeInfo: any;
}

// ⭐ Kakao Mobility guide.type → 아이콘 매핑
function getDirectionIcon(type: number) {
  if (type === 10) return '⬆️'; // 직진
  if (type === 11) return '⬅️'; // 좌회전
  if (type === 12) return '➡️'; // 우회전
  if (type === 13) return '↩️'; // 유턴
  if (type === 14) return '↖️'; // 분기점 좌측
  if (type === 15) return '↗️'; // 분기점 우측
  if (type === 16) return '🚩'; // 출발
  if (type === 17) return '🏁'; // 도착
  return '📍'; // 기타
}

export default function RouteBottomSheet({
  open,
  onClose,
  routeInfo,
}: RouteBottomSheetProps) {
  const sheetRef = useRef(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay (닫히지 않도록 onClick 제거) */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
          />

          {/* bottom sheet */}
          <motion.div
            key="route-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="
              absolute bottom-0 left-0 w-full z-50
              bg-white rounded-t-3xl shadow-xl p-5
              h-1/3 overflow-y-auto
            "
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">길찾기 결과</h2>

              {/* X 버튼으로만 닫힘 */}
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {!routeInfo ? (
              <p className="text-gray-500">경로 정보를 불러오는 중입니다...</p>
            ) : (
              <div className="text-sm space-y-4">
                <p>
                  <strong>예상 시간:</strong> {routeInfo.duration}분
                </p>
                <p>
                  <strong>거리:</strong> {routeInfo.distance}m
                </p>

                {/* 🔥 turn-by-turn 안내 */}
                <div>
                  <p className="font-semibold mb-2">이동 안내</p>

                  {routeInfo.guides?.length > 0 ? (
                    <div className="space-y-2">
                      {routeInfo.guides.map((g, index) => (
                        <div
                          key={index}
                          className="
                            flex items-center gap-3 p-3
                            bg-gray-50 rounded-xl border border-gray-200
                          "
                        >
                          <div className="text-2xl min-w-[32px] text-center">
                            {getDirectionIcon(g.type)}
                          </div>

                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {g.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {g.distance}m 이동
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">안내 정보가 없습니다.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
