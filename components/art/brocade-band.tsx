/*
 * Dải hoa văn kiểu thổ cẩm: các hình thoi bậc thang dệt trên lưới ô vuông.
 * Mỗi ô mẫu 16x16 ô dệt; màu của ô phụ thuộc khoảng cách "bậc thang"
 * (Manhattan) tới tâm ô mẫu, nên các vòng thoi tự khớp nối khi lặp lại.
 */
const GRID = 16;

type Thread = "son" | "vang" | "paper";

// Khoảng cách (tính theo tọa độ nhân đôi) → màu chỉ.
const RINGS: Record<number, Thread> = {
  2: "paper",
  10: "son",
  16: "vang",
  26: "son",
  30: "paper",
};

const THREAD_COLORS: Record<Thread, string> = {
  son: "var(--color-son)",
  vang: "var(--color-vang)",
  paper: "var(--color-paper)",
};

const CELLS = (() => {
  const cells: { x: number; y: number; thread: Thread }[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const distance =
        Math.abs(2 * x + 1 - GRID) + Math.abs(2 * y + 1 - GRID);
      const thread = RINGS[distance];
      if (thread) cells.push({ x, y, thread });
    }
  }
  return cells;
})();

export function BrocadeBand({
  id,
  height = 72,
  className,
}: {
  /** Mã duy nhất cho pattern SVG. */
  id: string;
  height?: number;
  className?: string;
}) {
  const cell = height / GRID;
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern
          id={id}
          width={height}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <rect width={height} height={height} fill="var(--color-cham)" />
          {CELLS.map(({ x, y, thread }) => (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill={THREAD_COLORS[thread]}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}
