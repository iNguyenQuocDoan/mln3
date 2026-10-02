"use client";

/** Vị trí các chấm trên mặt xúc xắc 1–6 (toạ độ trong khung 100×100). */
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [26, 26],
    [50, 50],
    [74, 74],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [26, 26],
    [74, 26],
    [50, 50],
    [26, 74],
    [74, 74],
  ],
  6: [
    [28, 24],
    [72, 24],
    [28, 50],
    [72, 50],
    [28, 76],
    [72, 76],
  ],
};

/**
 * Một viên xúc xắc D6. `rolling`: đang lăn (lộn vòng, mờ chuyển động);
 * `value` null: chưa đổ ở lượt này.
 */
export function Dice({
  value,
  rolling,
  size = 120,
  color,
}: {
  value: number | null;
  rolling: boolean;
  size?: number;
  color: string;
}) {
  const face = value ?? 6;
  return (
    <svg
      key={rolling ? `roll-${value}` : `face-${value}`}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={rolling ? "die-tumble" : undefined}
      role="img"
      aria-label={value ? `Xúc xắc: ${value}` : "Xúc xắc"}
    >
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#ffffff" stroke={color} strokeWidth="6" />
      {PIPS[face].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8.5" fill={value ? "#1c2553" : "#c9cfe2"} />
      ))}
    </svg>
  );
}

/**
 * Hàng xúc xắc của một lượt (1–3 viên). `values` null: chưa đổ, hiện số viên
 * sẽ đổ với mặt mờ.
 */
export function DiceRow({
  count,
  values,
  rolling,
  color,
  size = 104,
}: {
  count: number;
  values: number[] | null;
  rolling: boolean;
  color: string;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: count }, (_, i) => (
        <Dice key={i} value={values?.[i] ?? null} rolling={rolling} color={color} size={size} />
      ))}
    </div>
  );
}
