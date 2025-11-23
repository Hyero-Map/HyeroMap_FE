export interface DailyHours {
  start: string;
  end: string;
}

export interface OperatingHours {
  weekday?: DailyHours | null;
  saturday?: DailyHours | null;
  holiday?: DailyHours | null;
}

export interface Store {
  operatingHours?: OperatingHours | null;
}

export const isStoreOpen = (store: Store | null | undefined): boolean => {
  if (!store?.operatingHours) return false;

  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let hours: DailyHours | null | undefined;

  if (day === 0) {
    hours = store.operatingHours.holiday;
  } else if (day === 6) {
    hours = store.operatingHours.saturday;
  } else {
    hours = store.operatingHours.weekday;
  }

  if (!hours || !hours.start || !hours.end) return false;

  const [startH, startM] = hours.start.split(':').map(Number);
  const [endH, endM] = hours.end.split(':').map(Number);

  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  return currentMinutes >= start && currentMinutes <= end;
};
