export const isStoreOpen = (store) => {
  const now = new Date();
  const day = now.getDay(); // 0=일, 6=토
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 현재 요일별 시간 선택
  let hours;
  if (day === 0) {
    hours = store.weekend;
  } else if (day === 6) {
    hours = store.saturday;
  } else {
    hours = store.weekday;
  }

  // 운영정보가 없는 경우
  if (!hours || !hours.start || !hours.end) return false;

  const [startH, startM] = hours.start.split(':').map(Number);
  const [endH, endM] = hours.end.split(':').map(Number);

  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  return currentMinutes >= start && currentMinutes <= end;
};
