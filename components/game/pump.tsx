import type { CSSProperties } from "react";
import type { PumpInfo } from "./palette";

/*
 * Cột bơm xăng: đầu cột mang tên loại xăng, màn hình số lít, vòi bơm treo
 * bên phải. Đây là thứ người chơi bấm vào, nên trông phải giống cột bơm
 * thật chứ không phải một tấm thẻ.
 */
export function PumpButton({
  pump,
  disabled,
  onChoose,
}: {
  pump: PumpInfo;
  disabled: boolean;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChoose}
      aria-label={`Cây xăng ${pump.name === "???" ? "bí ẩn" : pump.name}: ${pump.note}`}
      className="pump group relative flex w-80 cursor-pointer flex-col items-start pr-11 outline-none disabled:cursor-default"
      style={{ "--pump": pump.color, "--pump-ink": pump.ink } as CSSProperties}
    >
      <span className="pump-shell flex w-69 flex-col overflow-hidden rounded-t-[28px] bg-cham-tint">
        <span className="bg-(--pump) py-2 text-center text-title font-extrabold text-(--pump-ink)">
          {pump.name}
        </span>
        <span className="flex flex-col items-center gap-3 px-6 pt-5 pb-6">
          <span className="w-full rounded-md bg-dem py-2 text-center text-heading font-bold text-vang tabular-nums">
            {pump.liters}
          </span>
          <span className="text-label font-semibold text-cham">
            {pump.note}
          </span>
        </span>
      </span>
      <span className="h-5 w-77 -translate-x-4 rounded-sm bg-cham-line" />
      <PumpHose className="absolute top-26 right-0" />
    </button>
  );
}

function PumpHose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 200"
      width="60"
      height="200"
      className={className}
      aria-hidden="true"
    >
      {/* Ống dẫn từ thân cột xuống rồi vòng lên móc treo vòi */}
      <path
        d="M4 150 C30 160 44 140 44 110 L44 48"
        fill="none"
        stroke="#0b0f26"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="36" y="12" width="20" height="40" rx="5" fill="#0b0f26" />
      <path d="M38 14 L18 6 L16 14 L36 22 Z" fill="#0b0f26" />
      <rect
        x="40"
        y="18"
        width="12"
        height="20"
        rx="3"
        fill="var(--pump)"
      />
    </svg>
  );
}

/** Cột bơm thu nhỏ (không bấm được) cho phần luật chơi và slide giới thiệu. */
export function PumpGlyph({
  pump,
  size = 64,
}: {
  pump: PumpInfo;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={(size * 80) / 64}
      aria-hidden="true"
    >
      <path
        d="M44 52 C56 54 58 44 58 36 L58 20"
        fill="none"
        stroke="#c9cfe2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="52" y="12" width="10" height="14" rx="3" fill="#c9cfe2" />
      <rect x="6" y="4" width="40" height="66" rx="8" fill="#e8ebf4" />
      <path d="M6 12 a8 8 0 0 1 8 -8 h24 a8 8 0 0 1 8 8 v12 h-40 Z" fill={pump.color} />
      <rect x="12" y="30" width="28" height="12" rx="2" fill="#0b0f26" />
      <rect x="16" y="34" width="14" height="4" rx="1" fill="#e3b44b" />
      <rect x="2" y="70" width="48" height="6" rx="2" fill="#c9cfe2" />
    </svg>
  );
}
