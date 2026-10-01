"use client";

import { useSlideStep } from "@/components/deck/step-context";
import { keepWords } from "@/content/typography";

export type Policy = {
  /** Nhãn trên tab. */
  tab: string;
  /** Nhãn nhỏ phía trên câu giải thích, theo đề mục gốc ("Về chính trị"). */
  heading: string;
  text: string;
};

/*
 * Mỗi tab là một bước của slide: bút trình chiếu (→, PageDown) chuyển
 * sang tab kế tiếp, hết tab cuối mới sang slide sau. Bấm chuột cũng được.
 */
export function PolicyTabs({ policies }: { policies: Policy[] }) {
  const { step, setStep } = useSlideStep();
  const active = policies[step] ?? policies[0];

  return (
    <div className="grid h-full grid-cols-[600px_1fr] gap-20">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Các lĩnh vực của chính sách dân tộc"
        className="flex flex-col border-t-2 border-cham-line"
      >
        {policies.map((policy, i) => {
          const selected = i === step;
          return (
            <button
              key={policy.tab}
              type="button"
              role="tab"
              id={`policy-tab-${i}`}
              aria-selected={selected}
              aria-controls="policy-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setStep(i)}
              className={`border-b-2 border-cham-line px-10 py-6 text-left text-lead font-bold transition-colors duration-300 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-son ${
                selected
                  ? "bg-cham text-on-cham"
                  : "text-cham hover:bg-cham-tint"
              }`}
            >
              {policy.tab}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="policy-panel"
        aria-labelledby={`policy-tab-${step}`}
        className="self-center"
      >
        <div key={step} className="anim-swap">
          <p className="text-body font-semibold text-son">{active.heading}</p>
          <p className="mt-6 text-heading leading-15 font-semibold text-balance">
            {keepWords(active.text)}
          </p>
        </div>
      </div>
    </div>
  );
}
