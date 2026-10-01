import type { Move } from "./engine";

/** Thời gian (ms) để xe chạy hết `cells` ô. */
export function driveMs(kind: Move["kind"], cells: number) {
  const perCell = kind === "nitro" ? 280 : 420;
  return Math.min(2000, Math.max(700, Math.abs(cells) * perCell + 260));
}

/** Thời gian của cả bước chạy; hết bước này mới sang lượt đội kế tiếp. */
export function moveMs(move: Move) {
  if (move.kind === "police") return 1800;
  if (move.shifts.length === 0) return 500;
  return (
    Math.max(...move.shifts.map((shift) => driveMs(move.kind, shift.cells))) +
    450
  );
}
