import { BrocadeBand } from "@/components/art/brocade-band";
import { VietnamMap } from "@/components/art/vietnam-map";
import { delay } from "@/components/motion";
import { DECK_INFO } from "@/content/parts";

export function CoverSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-24 left-32 flex w-270 flex-col">
        <p className="anim-fade text-lead font-bold" style={delay(150)}>
          {DECK_INFO.course}
        </p>

        <h1
          className="anim-rise mt-40 text-display font-extrabold"
          style={delay(300)}
        >
          Dân tộc
          <br />
          trong thời kỳ quá độ
          <br />
          lên chủ nghĩa xã hội
        </h1>

        {DECK_INFO.group || DECK_INFO.instructor ? (
          <div
            className="anim-fade mt-16 space-y-2 text-lead text-cham-soft"
            style={delay(700)}
          >
            {DECK_INFO.group ? <p>{DECK_INFO.group}</p> : null}
            {DECK_INFO.instructor ? (
              <p>Giảng viên: {DECK_INFO.instructor}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className="anim-fade absolute top-14 right-24"
        style={delay(550)}
      >
        <VietnamMap className="h-218" labelSize={30} />
      </div>

      <BrocadeBand id="band-cover" className="absolute inset-x-0 bottom-0" />
    </div>
  );
}
