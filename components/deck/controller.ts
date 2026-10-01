"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { stepCountOf, type DeckSlide } from "./types";

/*
 * Điều hướng dùng chung cho màn hình trình chiếu và màn hình người trình
 * bày. Vị trí slide nằm trên URL (#id); hai cửa sổ cùng mở bài sẽ đồng bộ
 * với nhau qua BroadcastChannel.
 */
const CHANNEL_NAME = "mln131-deck";

type SyncMessage =
  | { type: "goto"; id: string; step: number }
  | { type: "hello" };

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

export type DeckPosition = { index: number; step: number };

export function useDeckController(slides: DeckSlide[]) {
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const index = Math.max(
    0,
    slides.findIndex((s) => s.id === hash),
  );
  const slide = slides[index];
  const stepCount = stepCountOf(slide);

  // Bước chỉ có hiệu lực với slide đã tạo ra nó; sang slide khác thì về 0.
  const [stepState, setStepState] = useState({ id: "", step: 0 });
  const step =
    stepState.id === slide.id ? Math.min(stepState.step, stepCount - 1) : 0;

  const [direction, setDirection] = useState<1 | -1>(1);
  const channel = useRef<BroadcastChannel | null>(null);

  function show(targetIndex: number, targetStep: number, announce: boolean) {
    const clamped = Math.min(Math.max(targetIndex, 0), slides.length - 1);
    const target = slides[clamped];
    const clampedStep = Math.min(
      Math.max(targetStep, 0),
      stepCountOf(target) - 1,
    );
    setDirection(clamped >= index ? 1 : -1);
    setStepState({ id: target.id, step: clampedStep });
    writeHash(target.id);
    if (announce) {
      channel.current?.postMessage({
        type: "goto",
        id: target.id,
        step: clampedStep,
      } satisfies SyncMessage);
    }
  }

  function goTo(nextIndex: number, nextStep = 0) {
    show(nextIndex, nextStep, true);
  }

  function setStep(nextStep: number) {
    show(index, nextStep, true);
  }

  function next() {
    if (step < stepCount - 1) setStep(step + 1);
    else if (index < slides.length - 1) goTo(index + 1);
  }

  function prev() {
    if (step > 0) setStep(step - 1);
    else if (index > 0) goTo(index - 1, stepCountOf(slides[index - 1]) - 1);
  }

  function goToPart(part: number) {
    const target = slides.findIndex(
      (s) => s.kind === "divider" && s.part === part,
    );
    if (target >= 0) goTo(target);
  }

  /** Vị trí kế tiếp nếu bấm "tiếp" (null nếu đang ở cuối bài). */
  const upcoming: DeckPosition | null =
    step < stepCount - 1
      ? { index, step: step + 1 }
      : index < slides.length - 1
        ? { index: index + 1, step: 0 }
        : null;

  const onMessage = useEffectEvent((message: SyncMessage) => {
    if (message.type === "hello") {
      // Một cửa sổ mới vừa mở: gửi vị trí hiện tại để nó theo kịp.
      channel.current?.postMessage({
        type: "goto",
        id: slide.id,
        step,
      } satisfies SyncMessage);
      return;
    }
    const target = slides.findIndex((s) => s.id === message.id);
    if (target >= 0) show(target, message.step, false);
  });

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL_NAME);
    channel.current = ch;
    ch.onmessage = (event: MessageEvent<SyncMessage>) => onMessage(event.data);
    ch.postMessage({ type: "hello" } satisfies SyncMessage);
    return () => {
      ch.close();
      channel.current = null;
    };
  }, []);

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
      default:
        if (/^[1-9]$/.test(event.key)) goToPart(Number(event.key));
    }
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return {
    index,
    slide,
    step,
    stepCount,
    direction,
    upcoming,
    goTo,
    setStep,
    next,
    prev,
  };
}
