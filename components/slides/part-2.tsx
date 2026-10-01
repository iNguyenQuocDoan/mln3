import { DoubleArrow } from "@/components/art/arrows";
import { ArrowDown, FlowBox, SumRow } from "@/components/art/flow";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* ---------- 03. Hai xu hướng khách quan ---------- */

/*
 * Hai cột đối xứng: từ khóa, một câu giải thích, sơ đồ. Màu son cho
 * "tách ra", màu chàm cho "liên hiệp"; mũi tên hai chiều ở giữa nhắc rằng
 * hai xu hướng cùng tồn tại.
 */
const DIAGRAM_HEIGHT = "h-80";

export function TrendsSlide() {
  return (
    <SlideFrame
      title="Hai xu hướng khách quan"
      subtitle="Trong sự phát triển quan hệ dân tộc"
      className="grid grid-cols-[1fr_160px_1fr]"
    >
      <section className="anim-rise flex flex-col" style={stagger(0)}>
        <p className="text-label font-semibold text-cham-soft">
          Xu hướng thứ nhất
        </p>
        <h3 className="mt-4 text-keyword leading-none font-extrabold text-son">
          TÁCH RA
        </h3>
        <p className="mt-6 h-26 text-lead font-semibold text-pretty">
          {keepWords(
            "Cộng đồng dân cư muốn hình thành cộng đồng dân tộc độc lập.",
          )}
        </p>
        <div className={`mt-8 flex flex-col items-center ${DIAGRAM_HEIGHT}`}>
          <FlowBox className="w-130 text-lead">
            {keepWords("Cộng đồng dân cư")}
          </FlowBox>
          <ArrowDown grow length={48} />
          <FlowBox
            tone="accent"
            border="border-4"
            weight="font-bold"
            className="w-130 text-lead"
          >
            {keepWords("Dân tộc độc lập")}
          </FlowBox>
        </div>
      </section>

      <div
        className="anim-fade relative flex justify-center"
        style={stagger(1)}
        aria-hidden="true"
      >
        <div className="h-full w-0.5 bg-cham-line" />
        <div className="absolute top-10 grid size-24 place-items-center rounded-full border-2 border-cham-line bg-paper text-cham">
          <DoubleArrow className="w-14" />
        </div>
      </div>

      <section className="anim-rise flex flex-col" style={stagger(1)}>
        <p className="text-label font-semibold text-cham-soft">
          Xu hướng thứ hai
        </p>
        <h3 className="mt-4 text-keyword leading-none font-extrabold">
          LIÊN HIỆP
        </h3>
        <p className="mt-6 h-26 text-lead font-semibold text-pretty">
          {keepWords("Các dân tộc có nhu cầu liên hệ và liên hiệp với nhau.")}
        </p>
        <div className={`mt-8 flex flex-col ${DIAGRAM_HEIGHT}`}>
          <SumRow
            grow
            arrowLength={48}
            boxPadding="px-3 py-4"
            boxClassName="text-body"
            items={[
              { label: keepWords("Dân tộc A") },
              { label: keepWords("Dân tộc B") },
              { label: keepWords("Dân tộc C") },
            ]}
          />
          <FlowBox
            tone="solid"
            weight="font-bold"
            className="mx-auto w-130 text-lead"
          >
            {keepWords("Liên hiệp")}
          </FlowBox>
        </div>
      </section>
    </SlideFrame>
  );
}
