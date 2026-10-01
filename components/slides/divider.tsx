import { BrocadeBand } from "@/components/art/brocade-band";
import { stagger } from "@/components/motion";
import {
  PARTS,
  getMember,
  getPart,
  pad2,
  sectionsOfPart,
} from "@/content/parts";
import { keepWords } from "@/content/typography";

/** Slide mở đầu mỗi phần: số phần, tên phần, các mục và dải vị trí trong bài. */
export function PartDivider({ part }: { part: number }) {
  const { title } = getPart(part);
  const sections = sectionsOfPart(part);
  const presenters = [
    ...new Set(sections.map((s) => getMember(s.member).presenter)),
  ].filter(Boolean);

  return (
    <div className="absolute inset-0 bg-cham text-on-cham">
      <BrocadeBand
        id={`band-part-${part}`}
        className="absolute inset-x-0 top-0"
      />

      <div className="absolute top-50 left-32 flex items-start gap-20">
        <div className="anim-fade w-75 shrink-0" style={stagger(0)}>
          <p className="text-lead font-semibold text-on-cham-soft">Phần</p>
          <p
            className="text-vang font-extrabold tabular-nums"
            style={{ fontSize: 320, lineHeight: 0.9 }}
          >
            {part}
          </p>
        </div>
        <div className="anim-rise w-305 pt-10" style={stagger(1)}>
          <h2 className="text-display font-extrabold text-balance">
            {keepWords(title)}
          </h2>
          <ol className="mt-10 space-y-2 border-l-4 border-vang pl-8 text-lead">
            {sections.map((section) => (
              <li key={section.number} className="flex gap-5">
                <span className="font-bold text-vang tabular-nums">
                  {pad2(section.number)}
                </span>
                <span>{keepWords(section.title)}</span>
              </li>
            ))}
          </ol>
          {presenters.length > 0 ? (
            <p className="mt-6 text-lead text-on-cham-soft">
              Trình bày: {presenters.join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      <ol
        className="anim-fade absolute inset-x-32 bottom-20 grid grid-cols-3 gap-10"
        style={stagger(2)}
      >
        {PARTS.map((p) => {
          const current = p.number === part;
          return (
            <li
              key={p.number}
              aria-current={current ? "step" : undefined}
              className={`border-t-4 pt-4 text-label ${
                current
                  ? "border-vang font-semibold text-on-cham"
                  : "border-on-cham-soft/35 text-on-cham-soft"
              }`}
            >
              <span className="tabular-nums">{p.number}</span>
              <span className="ml-3">{keepWords(p.title)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
