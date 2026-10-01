import type { ReactNode } from "react";

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export type DeckSlide = {
  id: string;
  kind: "cover" | "divider" | "content" | "closing";
  tone: "light" | "dark";
  /** Phần (1–3) mà slide mở đầu (với slide chuyển phần). */
  part?: number;
  /**
   * Số thứ tự slide theo bản Word (1–15), mỗi bước một số. Slide có nhiều
   * bước (ví dụ slide 7–9) giữ nguyên bố cục, chỉ đổi nội dung theo bước.
   */
  docSlides?: number[];
  /** Tên slide, đọc cho trình đọc màn hình. */
  label: string;
  content: ReactNode;
};

export function stepCountOf(slide: DeckSlide) {
  return slide.docSlides?.length ?? 1;
}
