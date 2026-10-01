/*
 * Mũi tên vẽ bằng SVG: font Be Vietnam Pro không có ký tự → và ↔
 * trong bộ ký tự tải về, nên dùng hình để nét luôn đồng nhất.
 */

/** Mũi tên ngang nằm trong dòng chữ, cao theo cỡ chữ. */
export function InlineArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      className={`inline-block h-[0.7em] w-[1.4em] align-[0.05em] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 12h40M32 3l10 9-10 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mũi tên hai chiều, dùng giữa hai xu hướng. */
export function DoubleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden="true">
      <path
        d="M4 12h56M14 3L4 12l10 9M50 3l10 9-10 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mũi tên dùng bên trong một sơ đồ SVG khác. */
export function DiagramArrow({
  x1,
  x2,
  y,
  color = "var(--color-cham-soft)",
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
}) {
  return (
    <path
      d={`M${x1} ${y}H${x2}M${x2 - 16} ${y - 14}L${x2} ${y}l-16 14`}
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
