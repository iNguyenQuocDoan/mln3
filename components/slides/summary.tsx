"use client";

import { Fragment } from "react";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * 08. Tổng kết: màn 1 chỉ có dãy số 2 → 2 → 3 → 6 → 5 → 5; màn 2 giải
 * nghĩa từng số theo thứ tự, cột số đọc từ trên xuống vẫn là dãy số đó.
 */
const RECAP = [
  { count: 2, text: "Hai nghĩa của dân tộc" },
  { count: 2, text: "Hai xu hướng khách quan" },
  { count: 3, text: "Ba nội dung Cương lĩnh dân tộc" },
  { count: 6, text: "Sáu đặc điểm dân tộc Việt Nam" },
  { count: 5, text: "Năm quan điểm lớn" },
  { count: 5, text: "Năm lĩnh vực chính sách" },
];

export function SummarySlide() {
  const { step } = useSlideStep();
  return (
    <SlideFrame
      title="Tổng kết"
      kicker={
        // Luôn giữ chỗ dòng dẫn để tiêu đề không nhảy khi sang màn 2.
        <span className={step > 0 ? undefined : "invisible"}>
          <NumberChain size="small" />
        </span>
      }
      className="flex flex-col justify-center"
    >
      {step === 0 ? (
        <div key="chain" className="anim-swap flex justify-center pb-16">
          <NumberChain size="large" />
        </div>
      ) : (
        <ol key="list" className="flex flex-col">
          {RECAP.map((item, i) => (
            <li
              key={item.text}
              className="anim-rise grid grid-cols-[120px_1fr] items-baseline border-b-2 border-cham-line py-3 first:border-t-2"
              style={stagger(i, 60)}
            >
              <span className="text-banner leading-none font-extrabold text-son tabular-nums">
                {item.count}
              </span>
              <span className="text-sub font-semibold">
                {keepWords(item.text)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </SlideFrame>
  );
}

/** Dãy số 2 → 2 → 3 → 6 → 5 → 5, mũi tên vẽ bằng SVG (font không có ký tự →). */
function NumberChain({ size }: { size: "large" | "small" }) {
  const large = size === "large";
  return (
    <span
      role="img"
      aria-label="2, 2, 3, 6, 5, 5"
      className={`inline-flex items-center tabular-nums ${large ? "gap-8 font-extrabold" : "gap-3"}`}
      style={large ? { fontSize: 180, lineHeight: 1 } : undefined}
    >
      {RECAP.map((item, i) => (
        <Fragment key={item.text}>
          {i > 0 ? (
            <svg
              viewBox="0 0 48 24"
              aria-hidden="true"
              className={large ? "w-20 text-son" : "w-6 text-son"}
            >
              <path
                d="M2 12h40M32 3l10 9-10 9"
                fill="none"
                stroke="currentColor"
                strokeWidth={large ? 4 : 4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
          <span>{item.count}</span>
        </Fragment>
      ))}
    </span>
  );
}
