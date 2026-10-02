import { stagger } from "@/components/motion";
import { PARTS, pad2, sectionsOfPart, type Part } from "@/content/parts";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * Mục lục: bảy mục của bài, chia theo ba phần. Cột trái là phần 1 và 2
 * (mỗi phần hai mục), cột phải là phần 3 (ba mục).
 */
const COLUMNS: Part["number"][][] = [[1, 2], [3]];

export function AgendaSlide() {
  return (
    <SlideFrame
      title="Nội dung"
      className="grid grid-cols-2 content-center gap-x-24 pb-12"
    >
      {COLUMNS.map((parts, c) => (
        <div
          key={parts.join()}
          className="anim-rise flex flex-col gap-10"
          style={stagger(c)}
        >
          {parts.map((number) => (
            <PartGroup key={number} number={number} />
          ))}
        </div>
      ))}
    </SlideFrame>
  );
}

function PartGroup({ number }: { number: Part["number"] }) {
  const part = PARTS.find((p) => p.number === number);
  return (
    <section>
      <p className="text-label font-semibold text-cham-soft">
        Phần {number} · {part ? keepWords(part.title) : null}
      </p>
      <ol className="mt-3 border-t-2 border-cham-line">
        {sectionsOfPart(number).map((section) => (
          <li
            key={section.number}
            className="grid grid-cols-[96px_1fr] items-baseline border-b-2 border-cham-line py-4"
          >
            <span className="text-heading leading-none font-extrabold text-son tabular-nums">
              {pad2(section.number)}
            </span>
            <span className="text-sub font-semibold">
              {keepWords(section.title)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
