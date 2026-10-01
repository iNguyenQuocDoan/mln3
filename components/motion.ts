import type { CSSProperties } from "react";

/**
 * Độ trễ cho các lớp hiệu ứng trong globals.css (anim-rise, anim-fade,
 * anim-pop, anim-draw, anim-move...). Mọi slide dùng chung nhịp này để chuyển động nhất quán.
 */
export function delay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}

/** Nhịp chung: phần tử đầu tiên bắt đầu sau khi slide đã hiện. */
export const FIRST_DELAY_MS = 350;
export const STEP_MS = 160;

/** Độ trễ của phần tử thứ `index` (từ 0) trong một chuỗi hiện lần lượt. */
export function stagger(index: number, start = FIRST_DELAY_MS): CSSProperties {
  return delay(start + index * STEP_MS);
}

/** Dùng với anim-move: hình bắt đầu lệch (dx, dy) rồi trượt về chỗ. */
export function moveFrom(dx: number, dy: number, ms: number): CSSProperties {
  return {
    "--from-x": `${dx}px`,
    "--from-y": `${dy}px`,
    "--delay": `${ms}ms`,
  } as CSSProperties;
}
