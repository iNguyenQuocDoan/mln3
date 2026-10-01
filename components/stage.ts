"use client";

import { useSyncExternalStore } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH } from "./deck/types";

/*
 * Khung 1920x1080 dùng chung cho bộ slide và trò chơi: tỉ lệ co giãn theo
 * cửa sổ, và bật/tắt toàn màn hình.
 */

function subscribeResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function readScale() {
  return Math.min(
    window.innerWidth / STAGE_WIDTH,
    window.innerHeight / STAGE_HEIGHT,
  );
}

/** Tỉ lệ co giãn khung; bằng 0 khi chưa chạy trên trình duyệt. */
export function useStageScale() {
  return useSyncExternalStore(subscribeResize, readScale, () => 0);
}

export function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen?.().catch(() => {});
  }
}
