"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Dice } from "./dice";
import type { ThrowAim } from "./dice-3d";

/*
 * Người chơi tự ném xúc xắc ngay trên khay giữa bàn cờ: nhấn giữ để lắc (mặt
 * xúc xắc đổi liên tục, viên xúc xắc rung trong tay), kéo rồi thả tay để ném.
 * Hướng kéo lúc thả là hướng xúc xắc bay, kéo càng nhanh ném càng mạnh, giữ
 * càng lâu xúc xắc càng xoáy. Toạ độ tính theo tỉ lệ khay nên không phụ thuộc
 * khung hình đang được phóng to hay thu nhỏ.
 */

/** Chỗ xúc xắc nằm chờ trong khay (tỉ lệ theo bề rộng, bề cao khay). */
const REST = { x: 0.5, y: 0.72 };
/** Thả tay mà gần như không kéo (dưới 4% cạnh khay) thì ném nhẹ về phía trước. */
const TAP_DISTANCE = 0.04;
/** Tốc độ kéo (cạnh khay mỗi giây) ứng với cú ném mạnh nhất. */
const FULL_SPEED = 3;
/** Giữ để lắc lâu chừng này thì xúc xắc xoáy mạnh nhất. */
const FULL_SHAKE_MS = 1500;
/** Tốc độ ném tính theo đoạn kéo trong chừng này mili giây cuối trước khi thả. */
const SPEED_WINDOW_MS = 120;
/** Cú ném bằng bàn phím (Enter, Space): thẳng về phía trước, lực vừa. */
const KEYBOARD_THROW: ThrowAim = { dx: 0, dy: -1, power: 0.6, spin: 0.5 };

type Point = { x: number; y: number; t: number };

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));

export function ThrowHand({
  count,
  color,
  label,
  onThrow,
}: {
  count: number;
  color: string;
  /** Tên cú ném cho trình đọc màn hình, ví dụ "Đội 2 ném 2 xúc xắc". */
  label: string;
  onThrow: (aim: ThrowAim) => void;
}) {
  const gesture = useRef<{ pointerId: number; start: Point; trail: Point[] } | null>(null);
  const [hold, setHold] = useState<{ x: number; y: number } | null>(null);
  const [faces, setFaces] = useState(() => Array.from({ length: count }, (_, i) => [6, 5, 3][i % 3]));

  // Đang giữ: mặt xúc xắc đổi liên tục như đang lắc trong lòng bàn tay.
  const shaking = hold !== null;
  useEffect(() => {
    if (!shaking) return;
    const timer = window.setInterval(
      () => setFaces((current) => current.map(() => 1 + Math.floor(Math.random() * 6))),
      110,
    );
    return () => window.clearInterval(timer);
  }, [shaking]);

  function pointOf(event: PointerEvent<HTMLDivElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
      t: event.timeStamp,
    };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const start = pointOf(event);
    gesture.current = { pointerId: event.pointerId, start, trail: [start] };
    setHold(start);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const point = pointOf(event);
    current.trail = [...current.trail.filter((p) => point.t - p.t <= SPEED_WINDOW_MS * 2), point];
    setHold(point);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    gesture.current = null;
    setHold(null);
    const end = pointOf(event);
    const spin = clamp((end.t - current.start.t) / FULL_SHAKE_MS, 0.15, 1);
    const total = { dx: end.x - current.start.x, dy: end.y - current.start.y };
    if (Math.hypot(total.dx, total.dy) < TAP_DISTANCE) {
      onThrow({ dx: 0, dy: -1, power: 0.35, spin });
      return;
    }
    // Hướng và tốc độ theo đoạn kéo ngay trước lúc thả; dừng tay rồi mới thả
    // thì lấy hướng cả đoạn kéo và ném nhẹ.
    const from = current.trail.find((p) => end.t - p.t <= SPEED_WINDOW_MS) ?? current.start;
    const recent = { dx: end.x - from.x, dy: end.y - from.y };
    const moving = Math.hypot(recent.dx, recent.dy) > 0.01;
    const direction = moving ? recent : total;
    const speed = moving ? Math.hypot(recent.dx, recent.dy) / (Math.max(16, end.t - from.t) / 1000) : 0;
    onThrow({ ...direction, power: clamp(0.2 + speed / FULL_SPEED, 0.2, 1), spin });
  }

  function onPointerCancel() {
    gesture.current = null;
    setHold(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!event.repeat) onThrow(KEYBOARD_THROW);
  }

  const at = hold ?? REST;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label}. Nhấn giữ để lắc, kéo rồi thả tay để ném.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      className={`absolute inset-0 touch-none rounded-[28px] focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-vang ${
        shaking ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div
        className="pointer-events-none absolute flex gap-4"
        style={{
          left: `${at.x * 100}%`,
          top: `${at.y * 100}%`,
          transform: "translate(-50%, -50%)",
          transition: shaking ? "none" : "left 260ms ease-out, top 260ms ease-out",
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            className={shaking ? "dice-shake" : "dice-bob"}
            style={{ animationDelay: `${i * (shaking ? 40 : 180)}ms` }}
          >
            <Dice value={face} rolling={false} color={color} size={shaking ? 100 : 112} />
          </div>
        ))}
      </div>
      {shaking ? null : (
        <p className="pointer-events-none absolute inset-x-10 bottom-16 text-center text-[28px] leading-snug font-semibold text-on-cham">
          Nhấn giữ để lắc, kéo rồi thả tay để ném
        </p>
      )}
    </div>
  );
}
