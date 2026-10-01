import { Fragment, type ReactNode } from "react";

/*
 * Mảnh dựng sơ đồ luồng dùng chung: ô chữ, mũi tên xuống và hàng "A + B"
 * có đường gom. Mọi sơ đồ trong bài dùng cùng một kiểu nét, nên người xem
 * chỉ cần học cách đọc một lần: ô viền là yếu tố, ô tô đậm là kết quả,
 * ô viền đứt là yếu tố còn yếu.
 */

export type BoxTone = "muted" | "strong" | "solid" | "accent" | "weak";

const BOX_TONE: Record<BoxTone, string> = {
  // Trạng thái cũ hoặc yếu tố phụ.
  muted: "border-cham-line text-cham-soft",
  // Yếu tố chính.
  strong: "border-cham text-cham",
  // Kết quả.
  solid: "border-cham bg-cham text-on-cham",
  // Nhấn mạnh bằng màu son.
  accent: "border-son text-son",
  // Yếu tố còn yếu, chưa phát triển.
  weak: "border-dashed border-cham-soft/60 text-cham-soft",
};

export function FlowBox({
  tone = "strong",
  padding = "px-8 py-4",
  weight = "font-semibold",
  border = "border-3",
  className = "",
  children,
}: {
  tone?: BoxTone;
  /** Lớp padding, cỡ chữ đậm nhạt và độ dày viền tách riêng để ghi đè được. */
  padding?: string;
  weight?: string;
  border?: string;
  /** Kích thước, cỡ chữ, vị trí. */
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center text-balance ${border} ${padding} ${weight} ${BOX_TONE[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

const LINE = "var(--color-cham-soft)";

/**
 * Mũi tên chỉ xuống. Với `grow`, thân mũi tên kéo dài lấp chỗ trống để
 * các ô kết quả ở hai cột nằm cùng một hàng.
 */
export function ArrowDown({
  length = 56,
  grow = false,
  className = "",
}: {
  length?: number;
  grow?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center ${grow ? "flex-1" : ""} ${className}`}
      style={grow ? { minHeight: length } : { height: length }}
    >
      <div className="w-1 flex-1" style={{ background: LINE }} />
      <svg viewBox="0 0 32 20" className="-mt-px w-8 shrink-0">
        <path
          d="M16 0V17M3 5l13 13 13-13"
          fill="none"
          stroke={LINE}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Dấu nối giữa các ô: "+", "=", "≠" (font có sẵn các ký tự này). */
export function Joiner({
  children,
  padding = "px-4",
  className = "text-heading text-cham-soft",
}: {
  children: ReactNode;
  padding?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center leading-none font-bold ${padding} ${className}`}
    >
      {children}
    </span>
  );
}

export type SumItem = { label: ReactNode; tone?: BoxTone };

/**
 * Hàng "A + B + C" rồi đường gom về giữa và mũi tên xuống: các yếu tố
 * cùng góp lại thành ô bên dưới. Hai ô ngoài cùng rộng bằng nhau nên ô
 * giữa (và mũi tên) luôn nằm chính giữa.
 */
export function SumRow({
  items,
  joiner = "+",
  boxClassName = "",
  boxPadding = "px-4 py-4",
  arrowLength = 56,
  grow = false,
}: {
  items: SumItem[];
  joiner?: ReactNode;
  boxClassName?: string;
  boxPadding?: string;
  arrowLength?: number;
  grow?: boolean;
}) {
  const columns = items.map(() => "minmax(0,1fr)").join(" auto ");
  const last = items.length - 1;
  return (
    <div className={`flex flex-col ${grow ? "flex-1" : ""}`}>
      <div className="grid" style={{ gridTemplateColumns: columns }}>
        {items.map((item, i) => (
          <Fragment key={`box-${i}`}>
            {i > 0 ? <Joiner>{joiner}</Joiner> : null}
            <FlowBox
              tone={item.tone}
              padding={boxPadding}
              className={boxClassName}
            >
              {item.label}
            </FlowBox>
          </Fragment>
        ))}
        {items.map((_, i) => (
          <Fragment key={`line-${i}`}>
            {i > 0 ? <div className="h-8 border-b-4 border-cham-soft" /> : null}
            <div
              aria-hidden="true"
              className={`relative h-8 border-b-4 border-cham-soft ${
                i === 0
                  ? "ml-[50%] border-l-4"
                  : i === last
                    ? "mr-[50%] border-r-4"
                    : ""
              }`}
            >
              {i > 0 && i < last ? (
                <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-cham-soft" />
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
      <ArrowDown length={arrowLength} grow={grow} />
    </div>
  );
}
