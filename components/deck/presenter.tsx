"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getMember, getSection, pad2 } from "@/content/parts";
import { useDeckController, type DeckPosition } from "./controller";
import { NotesBody } from "./notes";
import { SlideBody } from "./slide-view";
import {
  STAGE_HEIGHT,
  STAGE_WIDTH,
  screenNumber,
  screenTotal,
  type DeckSlide,
} from "./types";
import { useWarmDeckPhotos } from "./use-warm-photos";

/*
 * Màn hình người trình bày: mở trên laptop (phím P ở màn hình trình chiếu).
 * Hiện màn hình hiện tại, màn hình kế tiếp, lời thuyết trình và câu chuyển
 * người theo bản Word, cùng đồng hồ bấm giờ. Điều hướng ở đây thì màn hình
 * trình chiếu đi theo và ngược lại.
 */
export function Presenter({ slides }: { slides: DeckSlide[] }) {
  const { slide, step, upcoming, setStep, next, prev, index } =
    useDeckController(slides);
  const current = slide.steps[step];
  const total = screenTotal(slides);
  useWarmDeckPhotos();
  const position = { number: screenNumber(slides, index, step), total };
  const section = slide.section ? getSection(slide.section) : undefined;
  const presenter = section ? getMember(section.member).presenter : "";

  return (
    <main className="grid h-dvh grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 overflow-hidden bg-cham p-8 text-on-cham">
      <section className="flex min-h-0 flex-col gap-6">
        <ScaledSlide
          slide={slide}
          step={step}
          setStep={setStep}
          position={position}
        />
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-6">
          <div>
            <p className="text-label font-semibold text-on-cham-soft">
              Tiếp theo
            </p>
            <p className="mt-2 text-label">{describe(slides, upcoming)}</p>
          </div>
          {upcoming ? (
            <ScaledSlide
              slide={slides[upcoming.index]}
              step={upcoming.step}
              setStep={() => {}}
              position={{
                number: screenNumber(slides, upcoming.index, upcoming.step),
                total,
              }}
            />
          ) : (
            <p className="text-label text-on-cham-soft">Hết bài.</p>
          )}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col">
        <header className="border-b-2 border-on-cham-soft/30 pb-5">
          <p className="text-label text-on-cham-soft">
            Màn {pad2(position.number)} / {pad2(total)}
            {section
              ? ` · Mục ${pad2(section.number)} · Thành viên ${section.member}${presenter ? ` (${presenter})` : ""}`
              : ""}
          </p>
          <h1 className="mt-2 text-lead font-bold text-balance">
            {current.title}
          </h1>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto py-6 pr-2 text-label leading-relaxed">
          <NotesBody step={current} />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-on-cham-soft/30 pt-5">
          <Stopwatch />
          <div className="flex gap-3">
            <PresenterButton onClick={prev} label="Trước" />
            <PresenterButton onClick={next} label="Tiếp" primary />
          </div>
        </footer>
      </aside>
    </main>
  );
}

function describe(slides: DeckSlide[], position: DeckPosition | null) {
  if (!position) return "—";
  return slides[position.index].steps[position.step].title;
}

/** Slide thu nhỏ theo bề rộng khung chứa, không chạy hiệu ứng. */
function ScaledSlide({
  slide,
  step,
  setStep,
  position,
}: {
  slide: DeckSlide;
  step: number;
  setStep: (step: number) => void;
  position: { number: number; total: number };
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className={`no-motion relative aspect-video w-full overflow-hidden rounded-sm ${slide.tone === "dark" ? "bg-cham" : "bg-paper"} text-cham ring-2 ring-on-cham-soft/30`}
    >
      {slide.backdrop ? (
        <div className="absolute inset-0">{slide.backdrop}</div>
      ) : null}
      {width ? (
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            transform: `scale(${width / STAGE_WIDTH})`,
          }}
        >
          <SlideBody
            slide={slide}
            step={step}
            setStep={setStep}
            position={position}
          />
        </div>
      ) : null}
    </div>
  );
}

function Stopwatch() {
  const start = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    start.current = Date.now();
    const tick = () => {
      setElapsed(Date.now() - start.current);
      setClock(
        new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  return (
    <div className="flex items-baseline gap-5">
      <p className="text-lead font-bold tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
      <button
        type="button"
        onClick={() => {
          start.current = Date.now();
          setElapsed(0);
        }}
        className="text-label whitespace-nowrap text-on-cham-soft underline underline-offset-4 hover:text-on-cham"
      >
        Đặt lại
      </button>
      {clock ? (
        <p className="text-label text-on-cham-soft tabular-nums">{clock}</p>
      ) : null}
    </div>
  );
}

function PresenterButton({
  onClick,
  label,
  primary = false,
}: {
  onClick: () => void;
  label: ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm px-7 py-3 text-label font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vang ${
        primary
          ? "bg-vang text-cham hover:bg-on-cham"
          : "border-2 border-on-cham-soft/50 hover:bg-on-cham/10"
      }`}
    >
      {label}
    </button>
  );
}
