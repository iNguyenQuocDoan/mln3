"use client";

import { DECK_INFO, sectionOfSlide } from "@/content/parts";
import { StepContext } from "./step-context";
import type { DeckSlide } from "./types";

/** Nội dung một slide kèm chân slide, vẽ trên khung 1920x1080. */
export function SlideBody({
  slide,
  step,
  setStep,
}: {
  slide: DeckSlide;
  step: number;
  setStep: (step: number) => void;
}) {
  const docSlide = slide.docSlides?.[step];
  return (
    <>
      <StepContext value={{ step, setStep }}>{slide.content}</StepContext>
      {docSlide ? <SlideFooter docSlide={docSlide} /> : null}
    </>
  );
}

/** Chân slide: phần, nội dung phụ trách và số slide theo bản Word. */
export function SlideFooter({ docSlide }: { docSlide: number }) {
  const section = sectionOfSlide(docSlide);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <footer className="absolute inset-x-32 bottom-12 flex items-baseline justify-between text-label text-cham-soft">
      <p className="flex items-baseline gap-4">
        <span className="font-semibold text-son">Phần {section.part}</span>
        <span>{section.title}</span>
      </p>
      <p className="tabular-nums">
        {pad(docSlide)} / {pad(DECK_INFO.totalSlides)}
      </p>
    </footer>
  );
}
