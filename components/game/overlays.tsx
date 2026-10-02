"use client";

import { type CSSProperties } from "react";
import { TEAM_DEFS } from "@/content/game-teams";

/* Pháo giấy: vị trí giả ngẫu nhiên tính sẵn theo chỉ số, mỗi lần như nhau. */
function noise(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = [...TEAM_DEFS.map((t) => t.color), "#e3b44b", "#ffffff"];

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
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
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
