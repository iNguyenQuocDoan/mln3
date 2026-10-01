/*
 * Kích thước đường đua trên khung 1920x1080 (px).
 *
 *   ┌ cột tên đội ┐┌──────────── mặt đường ────────────────────┐
 *   │             ││ (xe)  |xuất phát      ...       đích|     │
 *
 * Đầu xe ở ô `position` nằm tại START_X + position × bề rộng một ô, tính
 * từ mép trái mặt đường. Ô 0 là vạch xuất phát, ô cuối là vạch đích.
 */
export const TRACK = { left: 48, top: 120, width: 1824, height: 584 };
/** Dải thổ cẩm ở mép trên và mép dưới đường đua. */
export const KERB = 32;
/** Dải số ô ở dưới cùng. */
export const RULER = 40;
export const LABEL_WIDTH = 300;
export const ROAD_WIDTH = TRACK.width - LABEL_WIDTH;
export const START_X = 196;
const FINISH_GAP = 96;
export const FINISH_X = ROAD_WIDTH - FINISH_GAP;
export const LANES_HEIGHT = TRACK.height - 2 * KERB - RULER;

export function laneHeight(teams: number) {
  return LANES_HEIGHT / teams;
}

export function cellWidth(trackLength: number) {
  return (FINISH_X - START_X) / trackLength;
}

/** Vị trí đầu xe (tính từ mép trái mặt đường) khi xe ở ô `position`. */
export function frontX(position: number, trackLength: number) {
  return START_X + position * cellWidth(trackLength);
}

/** Kích thước xe, nhỏ lại khi có nhiều làn. Tỉ lệ khung xe 200 × 90. */
export function carSize(teams: number) {
  const height = Math.min(80, laneHeight(teams) - 18);
  return { width: (height * 200) / 90, height };
}
