import type { ReactNode } from "react";
import { DoubleArrow } from "@/components/art/arrows";
import { stagger } from "@/components/motion";
import { PARTS } from "@/content/parts";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* Các ý cần nhớ của từng phần, lấy theo phần "cách nhớ" của tài liệu. */
const KEYWORDS: Record<number, ReactNode[]> = {
  1: ["Quốc gia – dân tộc", "Dân tộc – tộc người"],
  2: [
    <span key="xu-huong" className="inline-flex items-center gap-3">
      Tách ra <DoubleArrow className="h-[0.6em] w-[1.6em]" /> Liên hiệp
    </span>,
    "Bình đẳng – Tự quyết – Liên hiệp",
  ],
  3: ["Số dân", "Cư trú", "Địa bàn", "Phát triển", "Đoàn kết", "Văn hóa"],
  4: ["Bình đẳng", "Đoàn kết", "Tương trợ", "Phát triển"],
  5: ["Chính trị", "Kinh tế", "Xã hội", "Văn hóa", "An ninh – quốc phòng"],
};

export function RecapSlide() {
  return (
    <SlideFrame title="Tổng kết">
      <ol className="border-t-2 border-cham-line">
        {PARTS.map((part, i) => (
          <li
            key={part.number}
            className="anim-rise grid grid-cols-[80px_520px_1fr] items-baseline gap-x-8 border-b-2 border-cham-line py-5"
            style={stagger(i)}
          >
            <span className="text-heading leading-none font-extrabold text-son tabular-nums">
              {part.number}
            </span>
            <span className="text-lead font-bold text-balance">
              {keepWords(part.short)}
            </span>
            <ul className="flex flex-wrap items-baseline text-body text-cham-soft">
              {KEYWORDS[part.number].map((keyword, k) => (
                <li
                  key={k}
                  className="border-cham-line pr-6 not-first:border-l-2 not-first:pl-6"
                >
                  {typeof keyword === "string" ? keepWords(keyword) : keyword}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}
