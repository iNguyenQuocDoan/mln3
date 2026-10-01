"use client";

import { ArrowDown, FlowBox, Joiner, SumRow } from "@/components/art/flow";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { NumberedTitle, SlideFrame } from "./frame";

/*
 * 04. Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin: mỗi nội dung một màn
 * hình (quyền tự quyết hai màn hình), sau đó một màn hình tóm tắt.
 */

export const PROGRAM = [
  {
    number: "01",
    keyword: "BÌNH ĐẲNG",
    statement: "Các dân tộc hoàn toàn bình đẳng",
  },
  {
    number: "02",
    keyword: "QUYỀN TỰ QUYẾT",
    statement: "Các dân tộc được quyền tự quyết",
  },
  {
    number: "03",
    keyword: "LIÊN HIỆP",
    statement: "Liên hiệp công nhân tất cả các dân tộc",
  },
];

const KICKERS = [
  "Cương lĩnh dân tộc · Nội dung thứ nhất",
  "Cương lĩnh dân tộc · Nội dung thứ hai",
  "Cương lĩnh dân tộc · Nội dung thứ ba",
];

/** Câu ý chính, cỡ tiêu đề phụ. */
function Statement({ children }: { children: string }) {
  return (
    <p className="max-w-380 text-sub font-semibold text-pretty">
      {keepWords(children)}
    </p>
  );
}

/* ---------- Nội dung thứ nhất: bình đẳng ---------- */

const PEOPLES = ["Dân tộc A", "Dân tộc B", "Dân tộc C"];

export function EqualitySlide() {
  const item = PROGRAM[0];
  return (
    <SlideFrame
      kicker={KICKERS[0]}
      title={<NumberedTitle number={item.number}>{item.keyword}</NumberedTitle>}
      subtitle={item.statement}
      className="flex flex-col"
    >
      <div className="anim-rise" style={stagger(0)}>
        <Statement>
          Không có dân tộc nào được đặt ở vị trí cao hơn hoặc thấp hơn dân tộc
          khác.
        </Statement>
      </div>

      {/* Ba ô bằng nhau đứng trên cùng một đường nền. */}
      <div
        className="anim-rise flex flex-1 flex-col items-center justify-center"
        style={stagger(1)}
        role="img"
        aria-label="Dân tộc A bằng dân tộc B bằng dân tộc C"
      >
        <div className="flex items-end">
          {PEOPLES.map((people, i) => (
            <div key={people} className="flex items-end">
              {i > 0 ? (
                <Joiner padding="px-8" className="h-36 text-keyword text-son">
                  =
                </Joiner>
              ) : null}
              <FlowBox className="h-36 w-90 text-sub">
                {keepWords(people)}
              </FlowBox>
            </div>
          ))}
        </div>
        <div className="h-2 w-full max-w-360 bg-cham" />
      </div>
    </SlideFrame>
  );
}

/* ---------- Nội dung thứ hai: quyền tự quyết (hai màn hình) ---------- */

export function SelfDeterminationSlide() {
  const { step } = useSlideStep();
  const item = PROGRAM[1];
  return (
    <SlideFrame
      kicker={KICKERS[1]}
      title={<NumberedTitle number={item.number}>{item.keyword}</NumberedTitle>}
      subtitle={item.statement}
      className="flex flex-col"
    >
      {step === 0 ? (
        <SelfDeterminationMeaning />
      ) : (
        <SelfDeterminationBranches />
      )}
    </SlideFrame>
  );
}

/** Màn hình 1: quyền tự quyết là gì. */
function SelfDeterminationMeaning() {
  return (
    <div key="meaning" className="anim-swap flex flex-1 flex-col">
      <p className="max-w-400 text-sub font-semibold text-pretty">
        {keepWords("Quyền tự quyết là quyền một dân tộc ")}
        <span className="text-son">{keepWords("tự quyết định vận mệnh")}</span>
        {keepWords(" của mình và ")}
        <span className="text-son">
          {keepWords("lựa chọn con đường phát triển")}
        </span>
        {keepWords(" của mình.")}
      </p>

      <div
        className="flex flex-1 items-center justify-center"
        role="img"
        aria-label="Tự quyết bằng tự quyết định vận mệnh cộng tự lựa chọn con đường phát triển"
      >
        <div className="flex items-stretch">
          <FlowBox
            tone="solid"
            weight="font-extrabold"
            className="w-80 text-sub"
          >
            {keepWords("TỰ QUYẾT")}
          </FlowBox>
          <Joiner className="text-keyword text-son">=</Joiner>
          <FlowBox className="w-110 text-sub">
            {keepWords("Tự quyết định vận mệnh")}
          </FlowBox>
          <Joiner className="text-keyword text-cham-soft">+</Joiner>
          <FlowBox className="w-130 text-sub">
            {keepWords("Tự lựa chọn con đường phát triển")}
          </FlowBox>
        </div>
      </div>
    </div>
  );
}

/** Màn hình 2: hai nhánh của quyền tự quyết và điều cần nhớ. */
function SelfDeterminationBranches() {
  return (
    <div key="branches" className="anim-swap flex flex-1 flex-col">
      <div className="mx-auto flex w-320 flex-col items-center">
        <FlowBox
          tone="solid"
          weight="font-extrabold"
          className="w-120 text-sub"
        >
          {keepWords("QUYỀN TỰ QUYẾT")}
        </FlowBox>
        {/* Nhánh đôi: từ giữa ô trên xuống tâm hai ô dưới. */}
        <svg viewBox="0 0 1280 84" className="w-320" aria-hidden="true">
          <path
            d="M640 0V30M300 30H980M300 30V78M980 30V78M286 62l14 16 14-16M966 62l14 16 14-16"
            fill="none"
            stroke="var(--color-cham-soft)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="grid w-full grid-cols-2 gap-x-20">
          <Branch
            tone="accent"
            label="TÁCH RA ĐỘC LẬP"
            text="Có quyền tách ra để thành lập quốc gia dân tộc độc lập."
          />
          <Branch
            tone="strong"
            label="TỰ NGUYỆN LIÊN HIỆP"
            text="Có quyền tự nguyện liên hiệp với dân tộc khác trên cơ sở bình đẳng."
          />
        </div>
      </div>

      <div className="mt-auto flex items-center gap-10 border-l-8 border-son bg-cham-tint px-10 py-5">
        <p className="shrink-0 text-sub font-extrabold">
          {keepWords("Tự quyết")} <span className="text-son">≠</span>{" "}
          {keepWords("chỉ có tách ra")}
        </p>
        <p className="text-body text-pretty text-cham-soft">
          <span className="font-semibold text-cham">Mà là: </span>
          {keepWords(
            "tự quyết định vận mệnh + tự lựa chọn con đường phát triển",
          )}
        </p>
      </div>
    </div>
  );
}

function Branch({
  tone,
  label,
  text,
}: {
  tone: "accent" | "strong";
  label: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <FlowBox
        tone={tone}
        border="border-4"
        weight="font-bold"
        className="w-full text-lead"
      >
        {keepWords(label)}
      </FlowBox>
      <p className="mt-4 text-center text-body leading-[1.4] text-pretty">
        {keepWords(text)}
      </p>
    </div>
  );
}

/* ---------- Nội dung thứ ba: liên hiệp công nhân ---------- */

export function WorkersUnionSlide() {
  const item = PROGRAM[2];
  return (
    <SlideFrame
      kicker={KICKERS[2]}
      title={<NumberedTitle number={item.number}>{item.keyword}</NumberedTitle>}
      subtitle={item.statement}
      className="flex flex-col"
    >
      <div className="anim-rise" style={stagger(0)}>
        <Statement>
          Nhấn mạnh sự đoàn kết và liên hiệp giữa công nhân thuộc các dân tộc
          khác nhau.
        </Statement>
      </div>

      <div
        className="anim-rise flex flex-1 items-center justify-center"
        style={stagger(1)}
      >
        <div className="flex w-330 flex-col">
          <SumRow
            arrowLength={56}
            boxClassName="text-lead leading-tight"
            items={["A", "B", "C"].map((letter) => ({
              label: keepWords(`Công nhân dân tộc ${letter}`),
            }))}
          />
          <FlowBox
            tone="solid"
            weight="font-extrabold"
            className="mx-auto w-120 text-sub"
          >
            {keepWords("LIÊN HIỆP")}
          </FlowBox>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ---------- Tóm tắt ba nội dung ---------- */

export function ProgramSummarySlide() {
  return (
    <SlideFrame
      title="Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin"
      className="flex flex-col justify-center"
    >
      <ol className="flex flex-col">
        {PROGRAM.map((item, i) => (
          <li
            key={item.keyword}
            className="anim-rise flex flex-col"
            style={stagger(i)}
          >
            {i > 0 ? <ArrowDown length={52} className="w-120" /> : null}
            <div className="grid grid-cols-[480px_1fr] items-center gap-14">
              <FlowBox weight="font-extrabold" className="h-28 text-banner">
                {keepWords(item.keyword.replace("QUYỀN ", ""))}
              </FlowBox>
              <p className="text-lead text-cham-soft">
                <span className="mr-4 font-bold text-son tabular-nums">
                  {item.number}
                </span>
                {keepWords(item.statement)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}
