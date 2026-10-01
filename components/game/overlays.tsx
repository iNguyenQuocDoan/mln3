"use client";

import { useEffect, useEffectEvent, type CSSProperties } from "react";
import { TEAM_COLORS } from "./palette";

/** Băng báo lượt chạy ngang màn hình khi tới lượt một đội. */
export function TurnBanner({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-40 flex justify-center"
      style={{ top: 330 }}
      aria-hidden="true"
    >
      <p
        className="turn-pass rounded-4xl px-20 py-8 text-center text-cham"
        style={{ background: color }}
      >
        <span className="block text-lead font-bold">Tới lượt</span>
        <span className="block text-display font-extrabold">{name}</span>
      </p>
    </div>
  );
}

const START_MS = 3700;

/** Ba đèn đỏ lần lượt sáng rồi cùng chuyển xanh: xuất phát. */
export function StartLights({ onDone }: { onDone: () => void }) {
  const done = useEffectEvent(onDone);
  useEffect(() => {
    const timer = window.setTimeout(() => done(), START_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="start-overlay absolute inset-0 z-50 grid place-items-center bg-dem/70">
      <div className="flex flex-col items-center gap-12">
        <div className="flex gap-10 rounded-[48px] bg-dem px-14 py-12 ring-4 ring-cham-soft">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="start-light size-36 rounded-full"
              style={{ "--on-at": `${300 + i * 800}ms` } as CSSProperties}
            />
          ))}
        </div>
        <p className="start-go text-display font-extrabold text-la-sang">
          Xuất phát!
        </p>
      </div>
    </div>
  );
}

/* Pháo giấy: vị trí giả ngẫu nhiên tính sẵn theo chỉ số, mỗi lần như nhau. */
function noise(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = [...TEAM_COLORS, "#e3b44b", "#ffffff", "#c4161c"];

const PIECES = Array.from({ length: 96 }, (_, i) => ({
  left: noise(i, 1) * 100,
  delay: noise(i, 2) * 1.8,
  duration: 2.6 + noise(i, 3) * 1.8,
  drift: (noise(i, 4) - 0.5) * 260,
  spin: (noise(i, 5) - 0.5) * 1440,
  width: 12 + noise(i, 6) * 12,
  height: 18 + noise(i, 7) * 14,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export function Confetti() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {PIECES.map((piece, i) => (
        <span
          key={i}
          className="confetti absolute top-0"
          style={
            {
              left: `${piece.left}%`,
              width: piece.width,
              height: piece.height,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--drift": `${piece.drift}px`,
              "--spin": `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Đội đầu tiên chạm vạch đích. */
export function FinishOverlay({
  name,
  color,
  onShowResults,
}: {
  name: string;
  color: string;
  onShowResults: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40">
      <Confetti />
      <div className="absolute inset-x-0 flex justify-center" style={{ top: 250 }}>
        <div
          className="panel-in flex flex-col items-center rounded-[40px] bg-dem/92 px-24 py-14 text-center ring-6"
          style={{ "--tw-ring-color": color } as CSSProperties}
        >
          <CheckeredFlag />
          <p className="mt-6 text-display font-extrabold text-vang">Về đích!</p>
          <p className="mt-2 text-heading font-bold">
            <span style={{ color }}>{name}</span> về nhất
          </p>
          <button
            type="button"
            autoFocus
            onClick={onShowResults}
            className="mt-10 cursor-pointer rounded-2xl bg-vang px-14 py-5 text-lead font-bold text-cham transition-colors hover:bg-on-cham focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
          >
            Xem kết quả
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckeredFlag() {
  return (
    <svg
      viewBox="0 0 120 90"
      width="160"
      height="120"
      aria-hidden="true"
      className="flag-wave"
    >
      <rect x="6" y="4" width="6" height="84" rx="3" fill="#c9cfe2" />
      <g transform="translate(12 6)">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 7 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 14}
              y={row * 11}
              width="14"
              height="11"
              fill={(row + col) % 2 === 0 ? "#ffffff" : "#0b0f26"}
            />
          )),
        )}
      </g>
    </svg>
  );
}
