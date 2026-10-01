/*
 * Mũi tên vẽ bằng SVG: font Be Vietnam Pro không có ký tự → và ↔,
 * nên dùng hình để nét luôn đồng nhất. Mũi tên trong sơ đồ luồng nằm ở
 * components/art/flow.tsx.
 */

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
