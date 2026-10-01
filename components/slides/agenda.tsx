import { PARTS } from "@/content/parts";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

export function AgendaSlide() {
  return (
    <SlideFrame title="Nội dung">
      <ol className="border-t-2 border-cham-line">
        {PARTS.map((part) => (
          <li
            key={part.number}
            className="flex items-baseline gap-10 border-b-2 border-cham-line py-9"
          >
            <span className="w-16 text-heading font-extrabold text-son tabular-nums">
              {part.number}
            </span>
            <span className="flex-1 text-lead font-semibold">{keepWords(part.title)}</span>
            {part.presenter ? (
              <span className="text-body text-cham-soft">{part.presenter}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}
