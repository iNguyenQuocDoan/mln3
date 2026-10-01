import type { ReactNode } from "react";

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/** Một màn hình: mỗi lần bấm "tiếp" là sang một màn hình. */
export type DeckStep = {
  /** Tên màn hình, dùng cho trình đọc màn hình và màn hình người trình bày. */
  title: string;
  /** Lời thuyết trình theo bản Word, mỗi phần tử một đoạn. */
  notes?: string[];
  /** Gợi ý lời nói cho màn hình mới (không có trong bản Word). */
  hint?: string;
  /** Hiện gợi ý trước lời theo bản Word (mặc định hiện sau). */
  hintFirst?: boolean;
  /** Câu chuyển người ở màn hình cuối của mỗi thành viên. */
  handoff?: string;
};

export type DeckSlide = {
  id: string;
  kind: "cover" | "divider" | "content" | "game" | "closing";
  tone: "light" | "dark";
  /** Phần (1–3) mà slide mở đầu (với slide chuyển phần). */
  part?: number;
  /** Mục nội dung (1–8) của slide nội dung, hiện ở chân slide. */
  section?: number;
  /**
   * Các màn hình của slide. Slide nhiều màn hình giữ nguyên bố cục, chỉ đổi
   * nội dung theo bước (ví dụ bản đồ đứng yên, chữ bên cạnh đổi).
   */
  steps: DeckStep[];
  content: ReactNode;
};

export function stepCountOf(slide: DeckSlide) {
  return slide.steps.length;
}

/** Tổng số màn hình của cả bài. */
export function screenTotal(slides: DeckSlide[]) {
  return slides.reduce((sum, slide) => sum + stepCountOf(slide), 0);
}

/** Số thứ tự (từ 1) của màn hình ở slide `index`, bước `step`. */
export function screenNumber(slides: DeckSlide[], index: number, step: number) {
  let number = step + 1;
  for (let i = 0; i < index; i++) number += stepCountOf(slides[i]);
  return number;
}

export type ScreenPosition = { number: number; total: number };
