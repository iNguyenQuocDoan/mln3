import { VIETNAM_MAINLAND_PATH } from "./vietnam-path";

/*
 * Bản đồ Việt Nam giản lược. Hai quần đảo Hoàng Sa và Trường Sa được đặt
 * gần bờ hơn thực tế để bản đồ vừa khung, theo cách các bản đồ minh họa
 * thường làm; hướng và thứ tự bắc – nam vẫn giữ đúng.
 */
const HOANG_SA = { x: 585, y: 462 };
const TRUONG_SA = { x: 640, y: 858 };

const HOANG_SA_ISLETS = [
  [0, 0],
  [22, -12],
  [40, 4],
  [16, 18],
  [-14, 12],
  [30, 26],
];

const TRUONG_SA_ISLETS = [
  [0, 0],
  [26, -20],
  [50, 6],
  [20, 28],
  [-22, 20],
  [66, 32],
  [40, 54],
  [-4, 58],
];

type VietnamMapProps = {
  className?: string;
  land?: string;
  islands?: string;
  labels?: string;
  /** Cỡ chữ nhãn tính theo đơn vị của bản đồ (cao 1000). */
  labelSize?: number;
};

export function VietnamMap({
  className,
  land = "var(--color-cham)",
  islands = "var(--color-cham)",
  labels = "var(--color-cham-soft)",
  labelSize = 34,
}: VietnamMapProps) {
  return (
    <svg
      viewBox="0 0 760 1000"
      className={className}
      role="img"
      aria-label="Bản đồ Việt Nam, gồm quần đảo Hoàng Sa và quần đảo Trường Sa"
    >
      <path d={VIETNAM_MAINLAND_PATH} fill={land} />
      <g fill={islands}>
        {HOANG_SA_ISLETS.map(([dx, dy]) => (
          <circle
            key={`hs-${dx}-${dy}`}
            cx={HOANG_SA.x + dx}
            cy={HOANG_SA.y + dy}
            r={5.5}
          />
        ))}
        {TRUONG_SA_ISLETS.map(([dx, dy]) => (
          <circle
            key={`ts-${dx}-${dy}`}
            cx={TRUONG_SA.x + dx}
            cy={TRUONG_SA.y + dy}
            r={5.5}
          />
        ))}
      </g>
      <g
        fill={labels}
        fontSize={labelSize}
        fontWeight={600}
        textAnchor="middle"
      >
        <text x={HOANG_SA.x + 13} y={HOANG_SA.y + 34 + labelSize}>
          Hoàng Sa
        </text>
        <text x={TRUONG_SA.x + 22} y={TRUONG_SA.y + 70 + labelSize}>
          Trường Sa
        </text>
      </g>
    </svg>
  );
}
