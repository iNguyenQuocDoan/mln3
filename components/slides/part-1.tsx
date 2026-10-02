"use client";

import { ArrowDown, FlowBox, SumRow } from "@/components/art/flow";
import { Photo, PhotoCaption } from "@/components/art/photo";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { PHOTOS, type DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* ---------- 01. Sự hình thành dân tộc ---------- */

/*
 * Hai cột so sánh. Ô kết quả "Dân tộc hình thành" ở hai cột nằm cùng một
 * hàng, nên người xem đọc ngang là thấy hai con đường khác nhau:
 * phương Tây đi từ thay đổi phương thức sản xuất, phương Đông dựa trên
 * văn hóa và tâm lý, còn cộng đồng kinh tế yếu (ô viền đứt).
 */
const DIAGRAM_HEIGHT = "h-108";

export function FormationSlide() {
  return (
    <SlideFrame
      title="Sự hình thành dân tộc"
      className="grid grid-cols-[1fr_2px_1fr] gap-x-20"
    >
      <section className="anim-rise flex flex-col" style={stagger(0)}>
        <h3 className="text-banner font-extrabold">PHƯƠNG TÂY</h3>
        <div className={`mt-8 flex flex-col items-center ${DIAGRAM_HEIGHT}`}>
          <FlowBox tone="muted" className="w-150 text-lead">
            Phong kiến
          </FlowBox>
          <ArrowDown grow length={48} />
          <FlowBox className="w-150 text-lead">
            {keepWords("Phương thức sản xuất tư bản chủ nghĩa")}
          </FlowBox>
          <ArrowDown grow length={48} />
          <FlowBox tone="solid" className="w-150 text-lead">
            {keepWords("Dân tộc hình thành")}
          </FlowBox>
        </div>
        <p className="mt-10 text-body leading-[1.45] text-pretty">
          {keepWords(
            "",
          )}
        </p>
      </section>

      <div className="anim-fade bg-cham-line" style={stagger(1)} />

      <section className="anim-rise flex flex-col" style={stagger(1)}>
        <h3 className="text-banner font-extrabold">PHƯƠNG ĐÔNG</h3>
        <div className={`mt-8 flex flex-col ${DIAGRAM_HEIGHT}`}>
          <SumRow
            grow
            arrowLength={48}
            boxPadding="px-3 py-3"
            boxClassName="h-40 text-body leading-tight"
            items={[
              { label: "Văn hóa" },
              { label: keepWords("Tâm lý dân tộc") },
              {
                tone: "weak",
                label: (
                  <>
                    {keepWords("Cộng đồng kinh tế")}
                    <span className="mt-1 block text-label font-normal">
                      {keepWords("kém phát triển")}
                    </span>
                  </>
                ),
              },
            ]}
          />
          <FlowBox tone="solid" className="mx-auto w-150 text-lead">
            {keepWords("Dân tộc hình thành")}
          </FlowBox>
        </div>
        <p className="mt-10 text-body leading-[1.45] text-pretty">
          {keepWords(
            "",
          )}
        </p>
      </section>
    </SlideFrame>
  );
}

/* ---------- 02. Hai nghĩa của dân tộc ---------- */

type Meaning = {
  heading: string;
  term: string;
  traits: string[];
  /** Ảnh đặt cạnh danh sách đặc trưng. */
  photo?: DeckPhoto;
};

const NATION: Meaning = {
  heading: "Quốc gia – dân tộc",
  term: "Nation",
  traits: ["Kinh tế", "Lãnh thổ", "Nhà nước", "Ngôn ngữ", "Văn hóa"],
};

const ETHNIE: Meaning = {
  heading: "Dân tộc – tộc người",
  term: "Ethnies",
  traits: ["Ngôn ngữ", "Văn hóa", "Ý thức tự giác tộc người"],
  // Tộc người là cộng đồng con người cụ thể: chân dung đặt ngay cạnh ba
  // đặc trưng ngôn ngữ, văn hóa, ý thức tự giác.
  photo: PHOTOS.highland,
};

/*
 * Một màn hình so sánh, hai bước: bước 1 nói nghĩa quốc gia – dân tộc
 * (cột phải chỉ hiện tên, mờ); bước 2 hiện đủ cột tộc người và câu kết
 * luận. Bố cục giữ nguyên giữa hai bước để không nhảy chữ.
 */
export function MeaningsSlide() {
  const { step } = useSlideStep();
  const both = step >= 1;

  return (
    <SlideFrame title="Hai nghĩa của dân tộc" className="flex flex-col">
      <div className="grid flex-1 grid-cols-[1fr_2px_1fr] gap-x-20">
        <MeaningColumn meaning={NATION} shown />
        <div className="bg-cham-line" />
        <MeaningColumn meaning={ETHNIE} shown={both} />
      </div>
      <p
        key={both ? "shown" : "hidden"}
        className={`mt-8 border-l-8 border-son bg-cham-tint px-10 py-5 text-sub font-bold ${both ? "anim-swap" : "invisible"}`}
      >
        {keepWords("Hai khái niệm có liên quan nhưng không đồng nhất.")}
      </p>
    </SlideFrame>
  );
}

function MeaningColumn({
  meaning,
  shown,
}: {
  meaning: Meaning;
  shown: boolean;
}) {
  return (
    <section
      className={`transition-opacity duration-300 ${shown ? "" : "opacity-35"}`}
    >
      <h3 className="text-banner font-extrabold uppercase">
        {keepWords(meaning.heading)}
      </h3>
      <p className="mt-1 text-lead text-cham-soft italic">{meaning.term}</p>
      <div
        key={shown ? "shown" : "hidden"}
        className={`mt-6 ${shown ? "anim-swap" : "invisible"} ${meaning.photo ? "grid grid-cols-[1fr_300px] gap-10" : ""}`}
      >
        <div>
          <p className="text-body font-semibold text-son">
            {meaning.traits.length} đặc trưng
          </p>
          <ol className="mt-3 border-t-2 border-cham-line">
            {meaning.traits.map((trait, i) => (
              <li
                key={trait}
                className="flex items-baseline gap-6 border-b-2 border-cham-line py-2.5"
              >
                <span className="w-8 shrink-0 text-label text-cham-soft tabular-nums">
                  {i + 1}
                </span>
                <span className="text-sub font-semibold">
                  {keepWords(trait)}
                </span>
              </li>
            ))}
          </ol>
        </div>
        {meaning.photo ? (
          <figure className="flex flex-col">
            <Photo photo={meaning.photo} className="min-h-90 flex-1" />
            <PhotoCaption photo={meaning.photo} className="mt-3" />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
