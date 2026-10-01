"use client";

import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { SCRIPT } from "@/content/script";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * Slide 5–6: Cương lĩnh dân tộc. Ba ô nội dung luôn ở nguyên chỗ;
 * bước 1 (slide 5) làm nổi nội dung thứ nhất, bước 2 (slide 6) làm nổi
 * nội dung thứ hai và hiện nội dung thứ ba.
 */
const PROGRAM = [
  {
    label: "Nội dung thứ nhất",
    keyword: "Bình đẳng",
    text: "Các dân tộc hoàn toàn bình đẳng",
  },
  {
    label: "Nội dung thứ hai",
    keyword: "Tự quyết",
    text: "Các dân tộc được quyền tự quyết",
  },
  {
    label: "Nội dung thứ ba",
    keyword: "Liên hiệp",
    // Bản Word ghi: cần bổ sung nguyên văn nội dung thứ ba sau khi đối chiếu
    // tài liệu gốc. Tạm dùng cách diễn đạt trong giáo trình — kiểm tra lại.
    text: "Liên hiệp công nhân tất cả các dân tộc",
  },
];

const DOC_SLIDES = [5, 6];

type CardState = "active" | "done" | "shown" | "upcoming";

/* Trạng thái từng ô ở mỗi bước. */
const STATES: CardState[][] = [
  ["active", "upcoming", "upcoming"],
  ["done", "active", "shown"],
];

const CARD_STYLE: Record<CardState, string> = {
  active: "border-son bg-cham text-on-cham",
  done: "border-cham bg-cham-tint text-cham",
  shown: "border-cham bg-cham-tint text-cham",
  upcoming: "border-cham-line bg-paper text-cham-soft",
};

export function ProgramSteps() {
  const { step } = useSlideStep();
  const docSlide = DOC_SLIDES[step] ?? DOC_SLIDES[0];
  const states = STATES[step] ?? STATES[0];

  return (
    <SlideFrame
      title={SCRIPT[docSlide].title}
      subtitle="Cương lĩnh dân tộc được trình bày thành ba nội dung."
      className="grid grid-cols-3 content-center items-stretch gap-10"
      swapTitle
    >
      {PROGRAM.map((item, i) => {
        const state = states[i];
        const revealed = state !== "upcoming";
        return (
          <section
            key={item.label}
            className={`anim-rise flex min-h-118 flex-col border-t-8 px-12 pt-10 pb-12 transition-colors duration-500 ${CARD_STYLE[state]}`}
            style={stagger(i)}
          >
            <p
              className={`text-body font-semibold transition-colors duration-500 ${
                state === "active" ? "text-vang" : "text-son"
              }`}
            >
              {item.label}
            </p>
            {revealed ? (
              <div className="anim-swap flex flex-1 flex-col">
                <h3 className="mt-6 text-keyword font-extrabold">
                  {item.keyword}
                </h3>
                <p
                  className={`mt-auto border-t-2 pt-8 text-lead text-balance ${
                    state === "active"
                      ? "border-on-cham-soft/40"
                      : "border-cham-line"
                  }`}
                >
                  {keepWords(item.text)}
                </p>
              </div>
            ) : null}
          </section>
        );
      })}
    </SlideFrame>
  );
}
