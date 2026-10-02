"use client";

import { toggleFullscreen } from "@/components/stage";
import { DeckLink } from "./deck-link";
import { Key } from "./mc-menu";

/**
 * Menu nhỏ của MC: hoàn tác, chơi lại, toàn màn hình, âm thanh. Không có
 * chọn đội, chấm đúng/sai hay chỉnh vị trí — hệ thống tự làm những việc đó.
 */
export function MCControls({
  soundOn,
  canUndo,
  onToggleSound,
  onUndo,
  onReset,
  onClearHistory,
  onClose,
}: {
  soundOn: boolean;
  canUndo: boolean;
  onToggleSound: () => void;
  onUndo: () => void;
  onReset: () => void;
  onClearHistory: () => void;
  onClose: () => void;
}) {
  const item =
    "flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left text-body font-semibold transition-colors hover:bg-cham disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-3 focus-visible:outline-vang";

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
        className="panel-in absolute bottom-30 left-10 z-50 w-[420px] rounded-[28px] bg-nhua p-3 ring-2 ring-on-cham-soft/30"
      >
        <p className="px-3 pb-1 text-label font-bold text-on-cham-soft">Người dẫn</p>
        <button
          type="button"
          className={item}
          disabled={!canUndo}
          onClick={() => {
            onUndo();
            onClose();
          }}
        >
          Hoàn tác thao tác vừa rồi <Key>Z</Key>
        </button>
        <button
          type="button"
          className={item}
          onClick={() => {
            toggleFullscreen();
            onClose();
          }}
        >
          Toàn màn hình <Key>F</Key>
        </button>
        <button type="button" className={item} onClick={onToggleSound}>
          {soundOn ? "Tắt âm thanh" : "Bật âm thanh"} <Key>M</Key>
        </button>
        <button type="button" className={item} onClick={onReset}>
          Chơi lại từ đầu
        </button>
        <button type="button" className={item} onClick={onClearHistory}>
          Xóa lịch sử các ván
        </button>
        <DeckLink role="menuitem" className={item}>
          Về bài thuyết trình
        </DeckLink>
      </div>
    </>
  );
}
