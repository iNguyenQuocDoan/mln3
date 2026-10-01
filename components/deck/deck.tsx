"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { DECK_INFO, sectionOfSlide } from "@/content/parts";
import { SCRIPT } from "@/content/script";
import { StepContext } from "./step-context";

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const IDLE_AFTER_MS = 2200;

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

/* Vị trí slide lưu trên URL (#id) để tải lại trang vẫn giữ đúng slide. */
const hashListeners = new Set<() => void>();

function subscribeHash(onChange: () => void) {
  hashListeners.add(onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    hashListeners.delete(onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

function readHash() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function writeHash(id: string) {
  window.history.replaceState(null, "", `#${id}`);
  hashListeners.forEach((listener) => listener());
}

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

function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen?.().catch(() => {});
  }
}

export function Deck({ slides }: { slides: DeckSlide[] }) {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const index = Math.max(
    0,
    slides.findIndex((s) => s.id === hash),
  );
  const slide = slides[index];
  const stepCount = slide.docSlides?.length ?? 1;

  // Bước chỉ có hiệu lực với slide đã tạo ra nó; sang slide khác thì về 0.
  const [stepState, setStepState] = useState({ id: "", step: 0 });
  const step =
    stepState.id === slide.id ? Math.min(stepState.step, stepCount - 1) : 0;

  const [direction, setDirection] = useState<1 | -1>(1);
  const scale = useSyncExternalStore(subscribeResize, readScale, () => 0);
  const [idle, setIdle] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function goTo(nextIndex: number, nextStep = 0) {
    const clamped = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    const target = slides[clamped];
    setDirection(clamped >= index ? 1 : -1);
    setStepState({ id: target.id, step: nextStep });
    writeHash(target.id);
  }

  function setStep(nextStep: number) {
    setStepState({ id: slide.id, step: nextStep });
  }

  function next() {
    if (step < stepCount - 1) setStep(step + 1);
    else if (index < slides.length - 1) goTo(index + 1);
  }

  function prev() {
    if (step > 0) {
      setStep(step - 1);
    } else if (index > 0) {
      const previous = slides[index - 1];
      goTo(index - 1, (previous.docSlides?.length ?? 1) - 1);
    }
  }

  function goToPart(part: number) {
    const target = slides.findIndex(
      (s) => s.kind === "divider" && s.part === part,
    );
    if (target >= 0) goTo(target);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
      return;
    const target = event.target as HTMLElement | null;
    const onControl = Boolean(target?.closest("button, a, input, textarea"));

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
        event.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        prev();
        break;
      case " ":
        if (onControl) return;
        event.preventDefault();
        if (event.shiftKey) prev();
        else next();
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(slides.length - 1);
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      default:
        if (/^[1-9]$/.test(event.key)) goToPart(Number(event.key));
    }
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
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
  const docSlide = slide.docSlides?.[step];
  const liveLabel = docSlide
    ? `Slide ${docSlide}: ${SCRIPT[docSlide].title}`
    : slide.label;
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
        <StepContext value={{ step, setStep }}>
          <section
            key={slide.id}
            className="slide-enter absolute inset-0"
            style={{ "--enter-x": `${direction * 28}px` } as CSSProperties}
            aria-roledescription="slide"
            aria-label={liveLabel}
          >
            {slide.content}
          </section>
        </StepContext>
        {docSlide ? <SlideFooter docSlide={docSlide} /> : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {liveLabel}
      </p>

      <DeckControls
        hidden={idle}
        dark={dark}
        canPrev={index > 0 || step > 0}
        canNext={index < slides.length - 1 || step < stepCount - 1}
        onPrev={prev}
        onNext={next}
      />
    </main>
  );
}

/** Chân slide: phần, nội dung phụ trách và số slide theo bản Word. */
function SlideFooter({ docSlide }: { docSlide: number }) {
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

function DeckControls({
  hidden,
  dark,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  hidden: boolean;
  dark: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const button = `grid size-12 place-items-center rounded-full border transition-colors disabled:opacity-30 focus-visible:outline-3 focus-visible:outline-offset-2 ${
    dark
      ? "border-on-cham-soft/40 text-on-cham hover:bg-on-cham/10 focus-visible:outline-vang"
      : "border-cham-line bg-paper text-cham hover:bg-cham-tint focus-visible:outline-son"
  }`;

  return (
    <nav
      aria-label="Điều hướng slide"
      className={`fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-3 transition-opacity duration-300 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        className={button}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Slide trước"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        className={button}
        onClick={onNext}
        disabled={!canNext}
        aria-label="Slide tiếp theo"
      >
        <Chevron direction="right" />
      </button>
      <button
        type="button"
        className={button}
        onClick={toggleFullscreen}
        aria-label="Bật hoặc tắt toàn màn hình (phím F)"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
