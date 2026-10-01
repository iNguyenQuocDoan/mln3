"use client";

import { FlowBox, Joiner } from "@/components/art/flow";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * 07. Chính sách dân tộc: năm lĩnh vực, mỗi lĩnh vực một màn hình. Danh
 * sách năm lĩnh vực đứng yên bên trái như các thẻ; bấm vào một lĩnh vực để
 * đến màn hình của nó. Thứ tự theo giáo trình và lời thuyết trình bản Word
 * (văn hóa trước xã hội).
 */
type Policy = {
  field: string;
  content: "values" | "statement" | "security";
  text: string[];
};

export const POLICIES: Policy[] = [
  {
    field: "Chính trị",
    content: "values",
    text: ["Bình đẳng", "Đoàn kết", "Tôn trọng", "Cùng phát triển"],
  },
  {
    field: "Kinh tế",
    content: "statement",
    text: [
      "Phát triển kinh tế – xã hội miền núi và vùng đồng bào dân tộc thiểu số",
    ],
  },
  {
    field: "Văn hóa",
    content: "statement",
    text: ["Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc"],
  },
  {
    field: "Xã hội",
    content: "statement",
    text: ["Thực hiện chính sách xã hội và bảo đảm an sinh xã hội"],
  },
  {
    field: "An ninh – Quốc phòng",
    content: "security",
    text: ["Ổn định chính trị", "An ninh chính trị", "Trật tự an toàn xã hội"],
  },
];

export function PolicySteps() {
  const { step, setStep } = useSlideStep();
  const policy = POLICIES[step] ?? POLICIES[0];

  return (
    <SlideFrame
      title="Chính sách dân tộc"
      className="grid grid-cols-[600px_1fr] items-start gap-20 pt-8"
    >
      <ul
        aria-label="Năm lĩnh vực của chính sách dân tộc"
        className="anim-fade flex flex-col border-t-2 border-cham-line"
        style={stagger(0)}
      >
        {POLICIES.map((item, i) => {
          const current = i === step;
          return (
            <li key={item.field}>
              <button
                type="button"
                aria-current={current ? "step" : undefined}
                onClick={() => setStep(i)}
                className={`flex w-full items-baseline gap-5 border-b-2 border-cham-line px-8 py-5 text-left text-lead font-bold uppercase transition-colors duration-300 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-son ${
                  current
                    ? "bg-cham text-on-cham"
                    : "text-cham-soft hover:bg-cham-tint"
                }`}
              >
                <span
                  className={`text-label tabular-nums ${current ? "text-vang" : "text-son"}`}
                >
                  {i + 1}
                </span>
                {keepWords(item.field)}
              </button>
            </li>
          );
        })}
      </ul>

      <section key={step} className="anim-swap flex flex-col">
        <p className="text-label font-semibold text-son">
          Lĩnh vực {step + 1} / {POLICIES.length}
        </p>
        <h3 className="mt-2 text-banner leading-[1.15] font-extrabold uppercase">
          {keepWords(policy.field)}
        </h3>
        <div className="mt-10">
          <PolicyContent policy={policy} />
        </div>
      </section>
    </SlideFrame>
  );
}

function PolicyContent({ policy }: { policy: Policy }) {
  if (policy.content === "values") {
    return (
      <ul className="max-w-180 border-t-2 border-cham-line">
        {policy.text.map((value) => (
          <li
            key={value}
            className="border-b-2 border-cham-line py-3 text-heading leading-[1.3] font-bold"
          >
            {keepWords(value)}
          </li>
        ))}
      </ul>
    );
  }

  if (policy.content === "security") {
    return (
      <>
        <p className="text-lead text-cham-soft">
          {keepWords("Tăng cường sức mạnh bảo vệ Tổ quốc trên cơ sở:")}
        </p>
        <div className="mt-6 flex w-150 flex-col">
          {policy.text.map((item, i) => (
            <div key={item} className="flex flex-col">
              {i > 0 ? (
                <Joiner className="h-14 text-heading text-son">+</Joiner>
              ) : null}
              <FlowBox className="text-sub">{keepWords(item)}</FlowBox>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <p className="border-l-8 border-son pl-8 text-heading leading-[1.3] font-semibold text-balance">
      {keepWords(policy.text[0])}
    </p>
  );
}
