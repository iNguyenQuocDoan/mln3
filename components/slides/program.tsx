import { FlowBox, Joiner, SumRow } from "@/components/art/flow";
import { Photo, PhotoCaption } from "@/components/art/photo";
import { stagger } from "@/components/motion";
import { PHOTOS, type DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";
import { NumberedTitle, SlideFrame } from "./frame";

/*
 * 04. Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin: mỗi nội dung một màn
 * hình. Nội dung và sơ đồ bên trái, ảnh minh họa lớn bên phải.
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
  "Nội dung thứ nhất của Cương lĩnh dân tộc",
  "Nội dung thứ hai của Cương lĩnh dân tộc",
  "Nội dung thứ ba của Cương lĩnh dân tộc",
];

/** Ảnh lớn bên phải, cao kín vùng nội dung. */
function SidePhoto({ photo }: { photo: DeckPhoto }) {
  return (
    <figure className="anim-fade" style={stagger(2)}>
      <Photo photo={photo} className="h-135 w-full" />
      <PhotoCaption photo={photo} className="mt-3" />
    </figure>
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
      className="grid grid-cols-[1fr_680px] gap-16"
    >
      <div className="flex flex-col">
        {/* Ba ô bằng nhau đứng trên cùng một đường nền. */}
        <div
          className="anim-rise flex flex-1 flex-col items-center justify-center"
          style={stagger(0)}
          role="img"
          aria-label="Dân tộc A bằng dân tộc B bằng dân tộc C"
        >
          <div className="flex items-end">
            {PEOPLES.map((people, i) => (
              <div key={people} className="flex items-end">
                {i > 0 ? (
                  <Joiner padding="px-4" className="h-28 text-keyword text-son">
                    =
                  </Joiner>
                ) : null}
                <FlowBox padding="px-4 py-4" className="h-28 w-56 text-lead">
                  {keepWords(people)}
                </FlowBox>
              </div>
            ))}
          </div>
          <div className="h-2 w-full bg-cham" />
        </div>
      </div>
      <SidePhoto photo={PHOTOS.delegates} />
    </SlideFrame>
  );
}

/* ---------- Nội dung thứ hai: quyền tự quyết ---------- */

/*
 * Một màn hình: sơ đồ hai nhánh của quyền tự quyết, và điều cần nhớ: tự
 * quyết không chỉ có tách ra.
 */
export function SelfDeterminationSlide() {
  const item = PROGRAM[1];
  return (
    <SlideFrame
      kicker={KICKERS[1]}
      title={<NumberedTitle number={item.number}>{item.keyword}</NumberedTitle>}
      subtitle={item.statement}
      className="grid grid-cols-[1fr_560px] gap-12"
    >
      <div className="flex flex-col">
        <div
          className="anim-rise flex w-full flex-1 flex-col items-center justify-center"
          style={stagger(0)}
        >
          <FlowBox
            tone="solid"
            weight="font-extrabold"
            padding="px-8 py-3"
            className="w-120 text-lead"
          >
            {keepWords("QUYỀN TỰ QUYẾT")}
          </FlowBox>
          {/* Nhánh đôi: từ giữa ô trên xuống tâm hai ô dưới. */}
          <svg viewBox="0 0 1280 64" className="w-full" aria-hidden="true">
            <path
              d="M640 0V22M300 22H980M300 22V58M980 22V58M286 42l14 16 14-16M966 42l14 16 14-16"
              fill="none"
              stroke="var(--color-cham-soft)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="grid w-full grid-cols-2 gap-x-10">
            <Branch tone="accent" label="TÁCH RA ĐỘC LẬP" />
            <Branch tone="strong" label="TỰ NGUYỆN LIÊN HIỆP" />
          </div>
        </div>

        <div
          className="anim-rise flex flex-col border-l-8 border-son bg-cham-tint px-6 py-3"
          style={stagger(1)}
        >
          <p className="text-lead font-extrabold">
            {keepWords("Tự quyết")}{" "}
            <span className="text-son">{keepWords("không chỉ có")}</span>{" "}
            {keepWords("tách ra")}
          </p>
          <p className="text-body text-pretty text-cham-soft">
            <span className="font-semibold text-cham">Mà là: </span>
            {keepWords(
              "tự quyết định vận mệnh và tự lựa chọn con đường phát triển.",
            )}
          </p>
        </div>
      </div>
      <SidePhoto photo={PHOTOS.election1946} />
    </SlideFrame>
  );
}

function Branch({
  tone,
  label,
}: {
  tone: "accent" | "strong";
  label: string;
}) {
  return (
    <FlowBox
      tone={tone}
      border="border-4"
      weight="font-bold"
      padding="px-4 py-4"
      className="w-full text-lead"
    >
      {keepWords(label)}
    </FlowBox>
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
      className="grid grid-cols-[1fr_640px] gap-16"
    >
      <div className="flex flex-col">
        <div
          className="anim-rise flex flex-1 items-center justify-center"
          style={stagger(0)}
        >
          <div className="flex w-full flex-col">
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
      </div>
      <SidePhoto photo={PHOTOS.mayDay} />
    </SlideFrame>
  );
}
