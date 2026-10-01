import type { ReactNode } from "react";
import { keepWords } from "@/content/typography";

/**
 * Khung chung cho slide nội dung: dòng dẫn nhỏ (tùy chọn), tiêu đề lớn,
 * dòng phụ (tùy chọn), rồi nội dung. Chân slide do SlideFooter vẽ.
 */
export function SlideFrame({
  kicker,
  title,
  subtitle,
  children,
  className = "",
  swapTitle = false,
}: {
  /** Dòng dẫn phía trên tiêu đề, ví dụ "Cương lĩnh dân tộc · Nội dung thứ hai". */
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Slide nhiều bước: tiêu đề đổi theo bước thì hiện lại nhẹ nhàng. */
  swapTitle?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-32 pt-20 pb-36">
      <header
        key={swapTitle && typeof title === "string" ? title : undefined}
        className={swapTitle ? "anim-swap" : undefined}
      >
        {kicker ? (
          <p className="mb-5 text-label font-semibold text-son">{kicker}</p>
        ) : null}
        <h2 className="text-title leading-[1.15] font-bold text-balance">
          {typeof title === "string" ? keepWords(title) : title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-lead text-cham-soft">{keepWords(subtitle)}</p>
        ) : null}
      </header>
      <div className={`mt-12 min-h-0 flex-1 ${className}`}>{children}</div>
    </div>
  );
}

/** Tiêu đề dạng "01 — BÌNH ĐẲNG": số thứ tự màu son, từ khóa viết hoa. */
export function NumberedTitle({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <>
      <span className="text-son tabular-nums">{number}</span>
      <span className="text-cham-soft"> — </span>
      {keepWords(children)}
    </>
  );
}
