"use client";

import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { SCRIPT } from "@/content/script";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * Slide 13–15: chính sách dân tộc theo từng lĩnh vực. Danh sách năm lĩnh
 * vực đứng yên bên trái; mỗi bước làm nổi các lĩnh vực của slide đó và hiện
 * nội dung tương ứng bên phải. Bấm vào một lĩnh vực để đến slide chứa nó.
 */
type Policy = { field: string; lines: string[]; step: number };

const POLICIES: Policy[] = [
  {
    field: "Chính trị",
    step: 0,
    lines: [
      "Thực hiện bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển giữa các dân tộc.",
    ],
  },
  {
    field: "Kinh tế",
    step: 0,
    lines: [
      "Phát triển kinh tế – xã hội miền núi, vùng đồng bào các dân tộc thiểu số.",
    ],
  },
  {
    field: "Văn hóa",
    step: 1,
    lines: ["Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc."],
  },
  {
    field: "Xã hội",
    step: 1,
    lines: [
      "Thực hiện chính sách xã hội, bảo đảm an sinh xã hội vùng đồng bào dân tộc thiểu số.",
    ],
  },
  {
    field: "An ninh – quốc phòng",
    step: 2,
    lines: [
      "Tăng cường sức mạnh bảo vệ Tổ quốc.",
      "Bảo đảm ổn định chính trị.",
      "Thực hiện tốt an ninh chính trị, trật tự an toàn xã hội.",
    ],
  },
];

const DOC_SLIDES = [13, 14, 15];

export function PolicySteps() {
  const { step, setStep } = useSlideStep();
  const docSlide = DOC_SLIDES[step] ?? DOC_SLIDES[0];
  const shown = POLICIES.filter((p) => p.step === step);

  return (
    <SlideFrame
      title={SCRIPT[docSlide].title}
      className="grid grid-cols-[560px_1fr] gap-20"
      swapTitle
    >
      <ul
        aria-label="Các lĩnh vực của chính sách dân tộc"
        className="anim-fade flex flex-col self-center border-t-2 border-cham-line"
        style={stagger(0)}
      >
        {POLICIES.map((policy) => {
          const current = policy.step === step;
          return (
            <li key={policy.field}>
              <button
                type="button"
                aria-current={current ? "step" : undefined}
                onClick={() => setStep(policy.step)}
                className={`w-full border-b-2 border-cham-line px-10 py-6 text-left text-lead font-bold uppercase transition-colors duration-300 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-son ${
                  current
                    ? "bg-cham text-on-cham"
                    : "text-cham hover:bg-cham-tint"
                }`}
              >
                {policy.field}
              </button>
            </li>
          );
        })}
      </ul>

      <div key={step} className="flex flex-col justify-center gap-16">
        {shown.map((policy, i) => (
          <section
            key={policy.field}
            className="anim-rise"
            style={stagger(i, step === 0 ? 450 : 60)}
          >
            <p className="text-body font-semibold text-son">{policy.field}</p>
            {policy.lines.length === 1 ? (
              <p className="mt-4 text-heading leading-15 font-semibold text-pretty">
                {keepWords(policy.lines[0])}
              </p>
            ) : (
              <ul className="mt-4 space-y-6">
                {policy.lines.map((line) => (
                  <li
                    key={line}
                    className="border-l-8 border-cham pl-8 text-heading leading-15 font-semibold text-pretty"
                  >
                    {keepWords(line)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </SlideFrame>
  );
}
