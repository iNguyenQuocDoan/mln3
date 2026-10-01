"use client";

import type { ReactNode } from "react";
import { toggleFullscreen } from "@/components/stage";
import { DeckLink } from "./deck-link";

/** Nút mở menu của MC, đặt ở góc phải thanh trên cùng. */
export function MenuButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Menu của người dẫn"
      aria-expanded={open}
      onClick={onClick}
      className="grid size-16 shrink-0 cursor-pointer place-items-center rounded-full border-3 border-on-cham-soft/40 text-on-cham-soft transition-colors hover:bg-on-cham/10 hover:text-on-cham focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vang"
    >
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

/** Menu của MC: các thao tác điều khiển trận, không dành cho người chơi. */
export function McMenu({
  soundOn,
  canEnd,
  onToggleSound,
  onEnd,
  onAbandon,
  onClose,
}: {
  soundOn: boolean;
  canEnd: boolean;
  onToggleSound: () => void;
  onEnd: () => void;
  onAbandon: () => void;
  onClose: () => void;
}) {
  const item =
    "flex w-full cursor-pointer items-center justify-between gap-6 rounded-2xl px-6 py-4 text-left text-body font-semibold transition-colors hover:bg-cham focus-visible:outline-3 focus-visible:outline-vang";
  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 z-50 cursor-default"
        onClick={onClose}
      />
      <div
        role="menu"
        className="panel-in absolute top-28 right-12 z-50 w-140 rounded-[28px] bg-nhua p-3 ring-2 ring-on-cham-soft/30"
      >
        <button
          type="button"
          role="menuitem"
          className={item}
          onClick={() => {
            toggleFullscreen();
            onClose();
          }}
        >
          Toàn màn hình <Key>F</Key>
        </button>
        <button
          type="button"
          role="menuitem"
          className={item}
          onClick={onToggleSound}
        >
          {soundOn ? "Tắt âm thanh" : "Bật âm thanh"} <Key>M</Key>
        </button>
        {canEnd ? (
          <button type="button" role="menuitem" className={item} onClick={onEnd}>
            Dừng đua và xếp hạng
          </button>
        ) : null}
        <button
          type="button"
          role="menuitem"
          className={item}
          onClick={onAbandon}
        >
          Bỏ ván này, về sảnh chờ
        </button>
        <DeckLink role="menuitem" className={item}>
          Về bài thuyết trình
        </DeckLink>
      </div>
    </>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-lg border-2 border-on-cham-soft/40 px-3 font-sans text-label text-on-cham-soft">
      {children}
    </kbd>
  );
}

/** Hộp xác nhận cho thao tác không hoàn tác được. */
export function ConfirmDialog({
  title,
  text,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fade-in absolute inset-0 z-60 grid place-items-center bg-dem/75">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="panel-in w-225 rounded-4xl bg-paper p-14 text-cham"
      >
        <h2 id="confirm-title" className="text-heading font-extrabold">
          {title}
        </h2>
        <p className="mt-4 text-body text-cham-soft">{text}</p>
        <div className="mt-10 flex justify-end gap-5">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="cursor-pointer rounded-2xl border-3 border-cham-line px-10 py-4 text-lead font-bold transition-colors hover:bg-cham-tint focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cham"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-2xl bg-son px-10 py-4 text-lead font-bold text-paper transition-colors hover:bg-cham focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cham"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
