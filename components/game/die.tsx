/*
 * Mặt xúc xắc. Như xúc xắc quen thuộc ở Việt Nam, chấm của mặt 1 và mặt 4
 * màu đỏ (mặt 1 chấm to hơn). `value` null: chưa gieo.
 */
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 26],
    [72, 26],
    [28, 50],
    [72, 50],
    [28, 74],
    [72, 74],
  ],
};

export function Die({
  value,
  size,
  className = "",
}: {
  value: number | null;
  size: number;
  className?: string;
}) {
  const red = value === 1 || value === 4;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="6" width="92" height="92" rx="20" fill="#c9cfe2" />
      <rect x="4" y="2" width="92" height="92" rx="20" fill="#ffffff" />
      {value === null ? (
        <text
          x="50"
          y="66"
          textAnchor="middle"
          fontSize="50"
          fontWeight="800"
          fill="#b9c0da"
        >
          ?
        </text>
      ) : (
        PIPS[value].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy - 2}
            r={value === 1 ? 14 : 9}
            fill={red ? "#c4161c" : "#1c2553"}
          />
        ))
      )}
    </svg>
  );
}
