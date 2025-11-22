// src/utils/parsePolyline.ts

export function parseKakaoPolyline(roads, kakao) {
  if (!roads || roads.length === 0) return [];

  const path = [];

  roads.forEach((road) => {
    const { vertexes } = road; // [lng1, lat1, lng2, lat2, ...]

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
