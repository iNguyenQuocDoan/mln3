import { DoubleArrow } from "@/components/art/arrows";
import { ArrowRight, FlowBox, Joiner } from "@/components/art/flow";
import { Photo, PhotoCaption } from "@/components/art/photo";
import { stagger } from "@/components/motion";
import { PHOTOS, type DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";
import type { ReactNode } from "react";
import { SlideFrame } from "./frame";

/* ---------- 03. Hai xu hướng khách quan ---------- */

/*
 * Hai cột đối xứng: ảnh minh họa, từ khóa, sơ đồ ngang.
 * Màu son cho "tách ra" (nhân dân Ba Đình nghe Tuyên ngôn Độc lập), màu
 * chàm cho "liên hiệp" (lễ thượng cờ ASEAN); mũi tên hai chiều ở giữa nhắc
 * rằng hai xu hướng cùng tồn tại.
 */
export function TrendsSlide() {
  return (
    <SlideFrame
      title="Hai xu hướng khách quan"
      subtitle="Trong sự phát triển quan hệ dân tộc"
      className="grid grid-cols-[1fr_128px_1fr]"
    >
      <Trend
        order={0}
        label="Xu hướng thứ nhất"
        word="TÁCH RA"
        wordClassName="text-son"
        photo={PHOTOS.independence}
        flow={
          <div className="flex items-stretch">
            <FlowBox padding="px-4 py-3" className="flex-1 text-body">
              {keepWords("Cộng đồng dân cư")}
            </FlowBox>
            <Joiner>
              <ArrowRight />
            </Joiner>
            <FlowBox
              tone="accent"
              border="border-4"
              weight="font-bold"
              padding="px-4 py-3"
              className="flex-1 text-body"
            >
              {keepWords("Dân tộc độc lập")}
            </FlowBox>
          </div>
        }
      />

      <div
        className="anim-fade relative flex justify-center"
        style={stagger(1)}
        aria-hidden="true"
      >
        <div className="h-full w-0.5 bg-cham-line" />
        <div className="absolute top-28 grid size-24 place-items-center rounded-full border-2 border-cham-line bg-paper text-cham">
          <DoubleArrow className="w-14" />
        </div>
      </div>

      <Trend
        order={1}
        label="Xu hướng thứ hai"
        word="LIÊN HIỆP"
        photo={PHOTOS.aseanFlag}
        flow={
          // Từ khóa "LIÊN HIỆP" ngay trên đã là kết quả, nên sơ đồ chỉ còn
          // ba dân tộc cộng lại, mỗi ô một dòng.
          <div className="flex items-stretch">
            {["A", "B", "C"].map((letter, i) => (
              <div key={letter} className="flex flex-1 items-stretch">
                {i > 0 ? <Joiner padding="px-2">+</Joiner> : null}
                <FlowBox padding="px-2 py-3" className="flex-1 text-body">
                  {keepWords(`Dân tộc ${letter}`)}
                </FlowBox>
              </div>
            ))}
          </div>
        }
      />
    </SlideFrame>
  );
}

function Trend({
  order,
  label,
  word,
  wordClassName = "",
  photo,
  flow,
}: {
  order: number;
  label: string;
  word: string;
  wordClassName?: string;
  photo: DeckPhoto;
  flow: ReactNode;
}) {
  return (
    <section className="anim-rise flex flex-col" style={stagger(order)}>
      <figure>
        <Photo photo={photo} className="h-76 w-full" />
        <PhotoCaption photo={photo} className="mt-3" />
      </figure>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h3
          className={`text-title leading-none font-extrabold ${wordClassName}`}
        >
          {word}
        </h3>
        <p className="text-label font-semibold text-cham-soft">{label}</p>
      </div>
      <div className="mt-5">{flow}</div>
    </section>
  );
}
