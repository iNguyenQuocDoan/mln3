import { FlowBox, Joiner, SumRow } from "@/components/art/flow";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { NumberedTitle, SlideFrame } from "./frame";

/*
 * 04. Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin: mỗi nội dung một màn
 * hình.
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

/* ---------- Nội dung thứ hai: quyền tự quyết ---------- */

/*
 * Một màn hình: định nghĩa (hai ý được tô son), sơ đồ hai nhánh của quyền
 * tự quyết, và điều cần nhớ: tự quyết không chỉ có tách ra.
 */
export function SelfDeterminationSlide() {
  const item = PROGRAM[1];
  return (
    <SlideFrame
      kicker={KICKERS[1]}
      title={<NumberedTitle number={item.number}>{item.keyword}</NumberedTitle>}
      subtitle={item.statement}
      className="flex flex-col"
    >
      <p
        className="anim-rise max-w-400 text-sub font-semibold text-pretty"
        style={stagger(0)}
      >
        {keepWords("Quyền tự quyết là quyền một dân tộc ")}
        <span className="text-son">{keepWords("tự quyết định vận mệnh")}</span>
        {keepWords(" của mình và ")}
        <span className="text-son">
          {keepWords("lựa chọn con đường phát triển")}
        </span>
        {keepWords(" của mình.")}
      </p>

      <div
        className="anim-rise mx-auto mt-8 flex w-320 flex-col items-center"
        style={stagger(1)}
      >
        <FlowBox
          tone="solid"
          weight="font-extrabold"
          className="w-120 text-lead"
        >
          {keepWords("QUYỀN TỰ QUYẾT")}
        </FlowBox>
        {/* Nhánh đôi: từ giữa ô trên xuống tâm hai ô dưới. */}
        <svg viewBox="0 0 1280 64" className="w-320" aria-hidden="true">
          <path
            d="M640 0V22M300 22H980M300 22V58M980 22V58M286 42l14 16 14-16M966 42l14 16 14-16"
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

      <div
        className="anim-rise mt-auto flex items-center gap-10 border-l-8 border-son bg-cham-tint px-10 py-5"
        style={stagger(2)}
      >
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
    </SlideFrame>
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
