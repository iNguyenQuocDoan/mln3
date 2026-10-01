import { BrocadeBand } from "@/components/art/brocade-band";
import { PARTS, getPart } from "@/content/parts";

/** Slide mở đầu mỗi phần: số phần, tên phần và dải vị trí trong bài. */
export function PartDivider({ part }: { part: number }) {
  const { title, presenter } = getPart(part);

  return (
    <div className="absolute inset-0 bg-cham text-on-cham">
      <BrocadeBand id={`band-part-${part}`} className="absolute inset-x-0 top-0" />

      <div className="absolute top-58 left-32 flex items-center gap-20">
        <div className="w-75 shrink-0">
          <p className="text-lead font-semibold text-on-cham-soft">Phần</p>
          <p
            className="text-vang font-extrabold tabular-nums"
            style={{ fontSize: 320, lineHeight: 0.9 }}
          >
            {part}
          </p>
        </div>
        <div className="w-295">
          <h2 className="text-display font-extrabold text-balance">{title}</h2>
          {presenter ? (
            <p className="mt-10 text-lead text-on-cham-soft">
              Trình bày: {presenter}
            </p>
          ) : null}
        </div>
      </div>

      <ol className="absolute inset-x-32 bottom-20 grid grid-cols-5 gap-8">
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
              <span className="ml-3">{p.short}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
