export interface Road {
  vertexes: number[];
}

export type KakaoLatLng = object;

export interface Kakao {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
  };
}

export function parseKakaoPolyline(
  roads: Road[] | null | undefined,
  kakao: Kakao
): KakaoLatLng[] {
  if (!roads || roads.length === 0) return [];

  const path: KakaoLatLng[] = [];

  roads.forEach((road) => {
    const { vertexes } = road;

    for (let i = 0; i < vertexes.length; i += 2) {
      const lng = vertexes[i];
      const lat = vertexes[i + 1];

      if (lat && lng) {
        path.push(new kakao.maps.LatLng(lat, lng));
      }
    }
  });

  return path;
}
