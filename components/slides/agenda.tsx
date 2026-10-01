import { stagger } from "@/components/motion";
import { PARTS, sectionsOfPart } from "@/content/parts";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* Mục lục: ba phần của bài, dưới mỗi phần là nội dung từng người phụ trách. */
export function AgendaSlide() {
  return (
    <SlideFrame title="Nội dung" className="flex flex-col justify-center">
      <ol className="border-t-2 border-cham-line">
        {PARTS.map((part, i) => (
          <li
            key={part.number}
            className="anim-rise grid grid-cols-[96px_1fr] items-baseline border-b-2 border-cham-line py-10"
            style={stagger(i)}
          >
            <span className="text-keyword leading-none font-extrabold text-son tabular-nums">
              {part.number}
            </span>
            <div>
              <h3 className="text-heading font-bold">{keepWords(part.title)}</h3>
              <ul className="mt-4 flex flex-wrap text-body text-cham-soft">
                {sectionsOfPart(part.number).map((section) => (
                  <li
                    key={section.member}
                    className="border-cham-line pr-6 not-first:border-l-2 not-first:pl-6"
                  >
                    {keepWords(section.title)}
                    {section.presenter ? (
                      <span className="font-semibold text-cham">
                        {" "}
                        ({section.presenter})
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}
