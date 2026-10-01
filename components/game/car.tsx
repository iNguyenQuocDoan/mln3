import type { CSSProperties } from "react";

/*
 * Xe đua nhìn ngang, đầu xe quay sang phải. Khung vẽ 200 × 90, đầu xe ở
 * x = 200 nên đặt xe theo mép phải là đặt theo đầu xe.
 */
const BODY =
  "M8 64 C8 56 12 50 22 48 L60 44 C68 30 84 22 104 21 L122 22 C136 23 146 30 154 38 L186 45 C194 47 198 54 197 62 L196 66 L175 68 A22 22 0 0 0 131 68 L73 68 A22 22 0 0 0 29 68 L12 68 C9 68 8 66 8 64 Z";
const SILL =
  "M9 60 L197 60 L196 66 L175 68 A22 22 0 0 0 131 68 L73 68 A22 22 0 0 0 29 68 L12 68 C9 68 8 66 8 64 Z";
const GLASS =
  "M70 44 C78 32 90 27 104 27 L118 28 C128 29 136 34 142 40 L143 44 Z";

export function Car({
  color,
  width,
  driving = false,
  nitro = false,
  className = "",
  style,
}: {
  color: string;
  width: number;
  /** Đang chạy: bánh quay, có khói xả. */
  driving?: boolean;
  /** Đang bật nitro: có lửa phía sau. */
  nitro?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 90"
      width={width}
      height={(width * 90) / 200}
      overflow="visible"
      aria-hidden="true"
      className={`${driving ? "car-driving" : ""} ${className}`}
      style={style}
    >
      <ellipse cx="102" cy="87" rx="94" ry="4.5" fill="rgb(0 0 0 / 0.4)" />

      {nitro ? (
        <g className="car-flame">
          <path
            d="M10 54 C-12 48 -38 54 -58 60 C-38 66 -12 72 10 66 Z"
            fill="#ff8a1f"
          />
          <path
            d="M10 57 C-6 54 -22 57 -34 60 C-22 63 -6 66 10 63 Z"
            fill="#ffe27a"
          />
        </g>
      ) : null}

      {driving ? (
        <g fill="rgb(201 207 226 / 0.75)">
          <circle className="car-puff" cx="-2" cy="62" r="6" />
          <circle
            className="car-puff"
            cx="-2"
            cy="62"
            r="6"
            style={{ animationDelay: "230ms" }}
          />
          <circle
            className="car-puff"
            cx="-2"
            cy="62"
            r="6"
            style={{ animationDelay: "460ms" }}
          />
        </g>
      ) : null}

      {/* Cánh gió sau */}
      <path d="M14 40 L19 40 L24 48 L17 48 Z" fill="rgb(11 15 38)" />
      <rect x="1" y="33" width="31" height="7" rx="2" fill={color} />
      <rect x="1" y="37" width="31" height="3" fill="rgb(0 0 0 / 0.22)" />

      <path d={BODY} fill={color} />
      <path d={SILL} fill="rgb(0 0 0 / 0.22)" />
      <path
        d="M30 53 L184 53"
        stroke="rgb(255 255 255 / 0.5)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d={GLASS} fill="#0e1430" />
      <path d="M100 30 L110 30 L98 43 L88 43 Z" fill="rgb(255 255 255 / 0.25)" />
      <path d="M185 47 L195 50.5 L195.5 55 L186 55 Z" fill="#fff4c7" />
      <rect x="7" y="49" width="5" height="7" rx="1" fill="#c4161c" />

      <Wheel cx={51} />
      <Wheel cx={153} />
    </svg>
  );
}

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy="70" r="17" fill="#0b0f26" />
      <g className="car-wheel">
        <circle cx={cx} cy="70" r="9.5" fill="#c9cfe2" />
        <path
          d={`M${cx - 9} 70 H${cx + 9} M${cx} 61 V79`}
          stroke="#5b6386"
          strokeWidth="2.5"
        />
        <circle cx={cx} cy="70" r="3" fill="#5b6386" />
      </g>
    </g>
  );
}
