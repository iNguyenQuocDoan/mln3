"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { toggleFullscreen, useStageScale } from "@/components/stage";
import { pad2 } from "@/content/parts";
import { useDeckController } from "./controller";
import { SpeakerNotes } from "./notes";
import { SlideBody } from "./slide-view";
import { screenNumber, screenTotal, type DeckSlide } from "./types";

export type { DeckSlide } from "./types";

const IDLE_AFTER_MS = 2200;

/** Mở màn hình người trình bày trong cửa sổ riêng (để trên laptop). */
function openPresenter(slideId: string) {
  window.open(
    `/presenter#${slideId}`,
    "mln131-presenter",
    "popup=yes,width=1366,height=820",
  );
}

/** Màn hình trình chiếu (đưa lên TV). */
export function Deck({ slides }: { slides: DeckSlide[] }) {
  const { index, slide, step, stepCount, setStep, next, prev } =
    useDeckController(slides);
  const scale = useStageScale();
  const [idle, setIdle] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "p":
      case "P":
        openPresenter(slide.id);
        break;
      case "n":
      case "N":
        setNotesOpen((open) => !open);
        break;
      case "Escape":
        setNotesOpen(false);
        break;
    }
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onShortcut(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Ẩn con trỏ và nút điều hướng khi không dùng chuột.
  useEffect(() => {
    let timer: number | undefined;
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_AFTER_MS);
    };
    window.addEventListener("pointermove", wake);
    return () => {
      window.removeEventListener("pointermove", wake);
      window.clearTimeout(timer);
    };
  }, []);

  const dark = slide.tone === "dark";
  const current = slide.steps[step];
  const position = {
    number: screenNumber(slides, index, step),
    total: screenTotal(slides),
  };
  const stageStyle: CSSProperties = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    visibility: scale ? "visible" : "hidden",
  };

  return (
    <main
      className={`fixed inset-0 touch-none overflow-hidden ${dark ? "bg-cham" : "bg-paper"} ${idle ? "cursor-none" : ""}`}
      onPointerDown={(event) => {
        if (event.pointerType === "touch")
          touchStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) next();
          else prev();
        }
      }}
    >
      <div className="stage" style={stageStyle}>
        <section
          key={slide.id}
          className="slide-enter absolute inset-0"
          aria-roledescription="slide"
          aria-label={current.title}
        >
          <SlideBody
            slide={slide}
            step={step}
            setStep={setStep}
            position={position}
          />
        </section>
      </div>

      <p className="sr-only" aria-live="polite">
        {current.title}
      </p>

      {notesOpen ? (
        <SpeakerNotes
          step={current}
          position={position}
          onClose={() => setNotesOpen(false)}
        />
      ) : null}

      <DeckControls
        hidden={idle}
        dark={dark || notesOpen}
        canPrev={index > 0 || step > 0}
        canNext={index < slides.length - 1 || step < stepCount - 1}
        counter={`${pad2(position.number)} / ${pad2(position.total)}`}
        notesOpen={notesOpen}
        onPrev={prev}
        onNext={next}
        onNotes={() => setNotesOpen((open) => !open)}
        onPresenter={() => openPresenter(slide.id)}
      />
    </main>
  );
}

function DeckControls({
  hidden,
  dark,
  canPrev,
  canNext,
  counter,
  notesOpen,
  onPrev,
  onNext,
  onNotes,
  onPresenter,
}: {
  hidden: boolean;
  dark: boolean;
  canPrev: boolean;
  canNext: boolean;
  counter: string;
  notesOpen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onNotes: () => void;
  onPresenter: () => void;
}) {
  const button = `grid size-11 place-items-center rounded-full border transition-colors disabled:opacity-30 focus-visible:outline-3 focus-visible:outline-offset-2 ${
    dark
      ? "border-on-cham-soft/40 text-on-cham hover:bg-on-cham/10 focus-visible:outline-vang"
      : "border-cham-line bg-paper text-cham hover:bg-cham-tint focus-visible:outline-son"
  }`;

  return (
    <nav
      aria-label="Điều hướng slide"
      className={`fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 transition-opacity duration-300 ${hidden && !notesOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        className={button}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Màn hình trước (phím ←)"
      >
        <Icon d="M15 5l-7 7 7 7" />
      </button>
      <p
        className={`min-w-24 text-center text-[18px] font-semibold tabular-nums ${dark ? "text-on-cham" : "text-cham"}`}
      >
        {counter}
      </p>
      <button
        type="button"
        className={button}
        onClick={onNext}
        disabled={!canNext}
        aria-label="Màn hình tiếp theo (phím → hoặc Space)"
      >
        <Icon d="M9 5l7 7-7 7" />
      </button>
      <span className="w-2" aria-hidden="true" />
      <button
        type="button"
        className={button}
        onClick={toggleFullscreen}
        aria-label="Bật hoặc tắt toàn màn hình (phím F)"
      >
        <Icon d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
      </button>
      <button
        type="button"
        className={button}
        onClick={onNotes}
        aria-pressed={notesOpen}
        aria-label="Bật hoặc tắt ghi chú người trình bày (phím N)"
      >
        <Icon d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h3" />
      </button>
      <button
        type="button"
        className={button}
        onClick={onPresenter}
        aria-label="Mở màn hình người trình bày (phím P)"
      >
        <Icon d="M4 5h16v10H4zM8 19h8M12 15v4" />
      </button>
    </nav>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
