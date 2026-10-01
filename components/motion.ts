import type { CSSProperties } from "react";

/**
 * Độ trễ cho các lớp hiệu ứng trong globals.css (anim-rise, anim-fade).
 * Mọi slide dùng chung nhịp này để chuyển động nhất quán.
 */
export function delay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}

/**
 * Nhịp chung: phần tử đầu tiên hiện ngay sau khi slide vào, các nhóm sau
 * cách nhau rất ngắn. Chỉ dùng cho vài nhóm lớn, không cho từng chữ.
 */
export const FIRST_DELAY_MS = 120;
export const STEP_MS = 90;

/** Độ trễ của nhóm thứ `index` (từ 0) trong một chuỗi hiện lần lượt. */
export function stagger(index: number, start = FIRST_DELAY_MS): CSSProperties {
  return delay(start + index * STEP_MS);
}
