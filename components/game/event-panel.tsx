"use client";

import type { CSSProperties, ReactNode } from "react";
import type { MysteryEvent } from "./engine";
import { EVENTS } from "./palette";

/**
 * Bình ???: tấm thẻ lật lại để lộ sự kiện. Nút ở mặt sau nói đúng việc sẽ
 * xảy ra khi bấm (mở câu hỏi, tăng tốc, chọn đội để cướp...).
 */
export function EventPanel({
  event,
  onProceed,
}: {
  event: MysteryEvent;
  onProceed: () => void;
}) {
  const info = EVENTS[event];
  return (
    <div className="fade-in absolute inset-0 z-30 grid place-items-center bg-dem/70 backdrop-blur-[3px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        className="flip-card relative h-175 w-270"
        style={{ "--event": info.color } as CSSProperties}
      >
        <div className="flip-inner relative size-full">
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-[40px] bg-son text-paper">
            <span className="text-display font-extrabold">???</span>
            <span className="text-lead font-semibold">Đang mở bình xăng lạ</span>
          </div>
          <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center rounded-[40px] border-6 border-(--event) bg-nhua px-24 text-center">
            <EventIcon event={event} />
            <h2
              id="event-title"
              className="mt-6 text-display font-extrabold text-(--event)"
            >
              {info.title}
            </h2>
            <p className="mt-4 max-w-195 text-lead">{info.text}</p>
            <button
              type="button"
              autoFocus
              onClick={onProceed}
              className="mt-10 cursor-pointer rounded-2xl bg-(--event) px-14 py-5 text-lead font-bold text-cham transition-transform hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-on-cham"
            >
              {info.action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventIcon({ event }: { event: MysteryEvent }) {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
      {ICONS[event]}
    </svg>
  );
}

const JERRYCAN =
  "M48 44 H122 L152 74 V172 A10 10 0 0 1 142 182 H48 A10 10 0 0 1 38 172 V54 A10 10 0 0 1 48 44 Z";

const ICONS: Record<MysteryEvent, ReactNode> = {
  hard: (
    <>
      <rect x="60" y="24" width="40" height="26" rx="7" fill="var(--event)" />
      <rect x="70" y="31" width="20" height="11" rx="4" fill="#121836" />
      <path d="M126 34 L150 18 L160 30 L138 48 Z" fill="#c9cfe2" />
      <path d={JERRYCAN} fill="var(--event)" />
      <path
        d="M70 96 C70 76 88 68 100 68 C116 68 128 78 128 94 C128 116 102 114 102 136"
        fill="none"
        stroke="#121836"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <circle cx="102" cy="162" r="9" fill="#121836" />
    </>
  ),
  nitro: (
    <>
      <rect x="82" y="12" width="36" height="24" rx="6" fill="#c9cfe2" />
      <rect x="66" y="30" width="68" height="158" rx="28" fill="var(--event)" />
      <path
        d="M110 58 L78 116 L100 116 L88 166 L126 98 L104 98 L118 58 Z"
        fill="#121836"
      />
    </>
  ),
  steal: (
    <>
      <path
        d="M24 74 H84 L104 94 V172 A8 8 0 0 1 96 180 H32 A8 8 0 0 1 24 172 Z"
        fill="var(--event)"
      />
      <path
        d="M92 86 C120 30 172 40 172 104"
        fill="none"
        stroke="#c9cfe2"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        className="drip"
        d="M172 128 C162 142 158 150 158 158 A14 14 0 0 0 186 158 C186 150 182 142 172 128 Z"
        fill="#e3b44b"
      />
    </>
  ),
  flat: (
    <>
      <circle cx="86" cy="112" r="68" fill="#0b0f26" />
      <circle
        cx="86"
        cy="112"
        r="60"
        fill="none"
        stroke="#5b6386"
        strokeWidth="10"
        strokeDasharray="16 10"
      />
      <circle cx="86" cy="112" r="30" fill="#c9cfe2" />
      <circle cx="86" cy="112" r="9" fill="#5b6386" />
      <path
        d="M156 14 L166 44 L196 40 L174 62 L190 88 L160 78 L146 104 L142 74 L112 70 L138 54 Z"
        fill="var(--event)"
      />
    </>
  ),
  police: (
    <>
      <path
        className="siren-rays"
        d="M100 34 V10 M42 64 L24 50 M158 64 L176 50 M24 118 H4 M176 118 H196"
        stroke="#e3b44b"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M46 150 A54 54 0 0 1 100 96 V150 Z" fill="#ff4d4d" />
      <path d="M100 96 A54 54 0 0 1 154 150 H100 Z" fill="var(--event)" />
      <rect x="30" y="150" width="140" height="24" rx="7" fill="#c9cfe2" />
    </>
  ),
};
