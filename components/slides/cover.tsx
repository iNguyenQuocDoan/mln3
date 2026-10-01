import { BrocadeBand } from "@/components/art/brocade-band";
import { VietnamMap } from "@/components/art/vietnam-map";
import { DECK_INFO } from "@/content/parts";

export function CoverSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-24 left-32 flex w-[1080px] flex-col">
        <p className="text-lead font-bold">{DECK_INFO.course}</p>

        <h1 className="mt-40 text-display font-extrabold">
          Dân tộc
          <br />
          trong thời kỳ quá độ
          <br />
          lên chủ nghĩa xã hội
        </h1>

        {DECK_INFO.group || DECK_INFO.instructor ? (
          <div className="mt-16 space-y-2 text-lead text-cham-soft">
            {DECK_INFO.group ? <p>{DECK_INFO.group}</p> : null}
            {DECK_INFO.instructor ? (
              <p>Giảng viên: {DECK_INFO.instructor}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <VietnamMap
        className="absolute top-14 right-24 h-[872px]"
        labelSize={30}
      />

      <BrocadeBand id="band-cover" className="absolute inset-x-0 bottom-0" />
    </div>
  );
}
