"use client";

import { createContext, use } from "react";

type StepState = {
  /** Bước hiện tại trong slide (bắt đầu từ 0). */
  step: number;
  setStep: (step: number) => void;
};

export const StepContext = createContext<StepState>({
  step: 0,
  setStep: () => {},
});

/** Slide có nhiều bước (ví dụ các tab) đọc và đổi bước qua hook này. */
export function useSlideStep() {
  return use(StepContext);
}
