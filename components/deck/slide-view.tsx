"use client";

import { getSection, pad2 } from "@/content/parts";
import { StepContext } from "./step-context";
import type { DeckSlide, ScreenPosition } from "./types";

/** Nội dung một slide kèm chân slide, vẽ trên khung 1920x1080. */
export function SlideBody({
  slide,
  step,
  setStep,
  position,
}: {
  slide: DeckSlide;
  step: number;
  setStep: (step: number) => void;
  position: ScreenPosition;
}) {
  return (
    <>
      <StepContext value={{ step, setStep }}>{slide.content}</StepContext>
      {slide.section ? (
        <SlideFooter section={slide.section} position={position} />
      ) : null}
    </>
  );
}

/**
 * Chân slide nội dung: thanh tiến độ mảnh, mục đang trình bày và số màn
 * hình (ví dụ 12 / 29). Nhỏ và nhạt để không tranh chỗ với nội dung.
 */
export function SlideFooter({
  section,
  position,
}: {
  section: number;
  position: ScreenPosition;
}) {
  const { title } = getSection(section);
  const progress = position.total ? position.number / position.total : 0;
  return (
    <footer className="absolute inset-x-32 bottom-10 text-label text-cham-soft">
      <div className="h-1 bg-cham-tint" aria-hidden="true">
        <div
          className="h-full bg-son transition-[width] duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="flex items-baseline gap-4">
          <span className="font-semibold text-son tabular-nums">
            {pad2(section)}
          </span>
          <span>{title}</span>
        </p>
        <p className="tabular-nums">
          {pad2(position.number)} / {pad2(position.total)}
        </p>
      </div>
    </footer>
  );
}
