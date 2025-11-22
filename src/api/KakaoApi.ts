import axios from 'axios';

const BASE_URL = 'https://apis-navi.kakaomobility.com/v1/directions';

export interface RouteParams {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export async function fetchKakaoRoute({ origin, destination }: RouteParams) {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY;

  const originStr = `${origin.lng},${origin.lat}`;
  const destStr = `${destination.lng},${destination.lat}`;

  const res = await axios.get(BASE_URL, {
    headers: {
      Authorization: `KakaoAK ${key}`,
    },
    params: {
      origin: originStr,
      destination: destStr,
    },
  });
  console.log('Kakao Route API Response:', res.data);

  return res.data;
}
