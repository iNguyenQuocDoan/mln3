"use client";

import { pad2 } from "@/content/parts";
import type { DeckStep, ScreenPosition } from "./types";

/** Lời thuyết trình của một màn hình: các đoạn lời nói, rồi câu chuyển người. */
export function NotesBody({ step }: { step: DeckStep }) {
  const empty = !step.notes?.length && !step.handoff;
  return (
    <div className="space-y-4">
      {step.notes?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {step.handoff ? (
        <p className="border-l-6 border-vang bg-on-cham/10 py-3 pl-5">
          <span className="font-semibold text-vang">Câu chuyển người: </span>
          {step.handoff}
        </p>
      ) : null}
      {empty ? (
        <p className="text-on-cham-soft">Màn hình này không có lời riêng.</p>
      ) : null}
    </div>
  );
}

/**
 * Ghi chú người trình bày ngay trên màn hình chiếu (phím N). Mặc định ẩn.
 * Nằm đè lên phần dưới khung hình, không làm khung slide co lại.
 */
export function SpeakerNotes({
  step,
  position,
  onClose,
}: {
  step: DeckStep;
  position: ScreenPosition;
  onClose: () => void;
}) {
  return (
    <aside
      aria-label="Ghi chú người trình bày"
      className="fade-in fixed inset-x-0 bottom-0 z-10 max-h-[45vh] overflow-y-auto border-t-4 border-vang bg-dem px-10 pt-5 pb-20 text-label leading-normal text-on-cham"
    >
      <header className="mb-3 flex items-baseline justify-between gap-6">
        <p className="font-semibold">
          <span className="text-vang tabular-nums">
            {pad2(position.number)} / {pad2(position.total)}
          </span>
          <span className="ml-4">{step.title}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-on-cham-soft underline underline-offset-4 hover:text-on-cham focus-visible:outline-3 focus-visible:outline-vang"
        >
          Ẩn ghi chú (N)
        </button>
      </header>
      <NotesBody step={step} />
    </aside>
  );
}
