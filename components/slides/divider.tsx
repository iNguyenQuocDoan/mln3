import { BrocadeBand } from "@/components/art/brocade-band";
import { Photo, PhotoCaption } from "@/components/art/photo";
import { stagger } from "@/components/motion";
import {
  PARTS,
  getMember,
  getPart,
  pad2,
  sectionsOfPart,
} from "@/content/parts";
import type { DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";

/**
 * Slide mở đầu mỗi phần: số phần, tên phần, các mục và dải vị trí trong
 * bài. Có `photo` thì ảnh đứng bên phải, chữ thu hẹp lại cho vừa.
 */
export function PartDivider({
  part,
  photo,
}: {
  part: number;
  photo?: DeckPhoto;
}) {
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

      <div
        className={`absolute top-50 left-32 flex items-start ${photo ? "right-32 gap-16" : "gap-20"}`}
      >
        <div
          className={`anim-fade shrink-0 ${photo ? "w-60" : "w-75"}`}
          style={stagger(0)}
        >
          <p className="text-lead font-semibold text-on-cham-soft">Phần</p>
          <p
            className="text-vang font-extrabold tabular-nums"
            style={{ fontSize: 320, lineHeight: 0.9 }}
          >
            {part}
          </p>
        </div>
        <div
          className={`anim-rise pt-10 ${photo ? "min-w-0 flex-1" : "w-305"}`}
          style={stagger(1)}
        >
          <h2
            className={`font-extrabold text-balance ${photo ? "text-[88px] leading-[1.12]" : "text-display"}`}
          >
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
        {photo ? (
          <figure className="anim-fade w-120 shrink-0">
            <Photo photo={photo} className="h-150 w-full" />
            <PhotoCaption photo={photo} dark className="mt-3" />
          </figure>
        ) : null}
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
