/** Xúc xắc lăn (CSS `die-tumble`) rồi mới dừng ở mặt vừa đổ. */
export const ROLL_MS = 950;

/** Thời gian (ms) giữa mỗi bước khi quân cờ chạy qua từng ô — không teleport. */
export const TILE_STEP_MS = 280;

/** Quân cờ dừng ở ô vừa đến một lúc để khán giả đọc tên ô và biết có 🎁 không. */
export const LAND_PAUSE_MS = 1400;

/** Các ô quân cờ đi qua khi dời từ `from` tới `to` (không gồm `from`). */
export function buildSteps(from: number, to: number): number[] {
  if (from === to) return [to];
  const dir = to > from ? 1 : -1;
  const steps: number[] = [];
  for (let p = from + dir; dir > 0 ? p <= to : p >= to; p += dir) steps.push(p);
  return steps;
}
