import { BrocadeBand } from "@/components/art/brocade-band";
import { stagger } from "@/components/motion";
import { DECK_INFO } from "@/content/parts";

export function ClosingSlide() {
  return (
    <div className="absolute inset-0 bg-cham text-on-cham">
      <div className="absolute top-24 left-32">
        <p className="text-lead font-bold text-on-cham-soft">
          {DECK_INFO.course}
        </p>
      </div>

      <h2
        className="anim-rise absolute top-80 left-32 text-display font-extrabold"
        style={stagger(0)}
      >
        Cảm ơn thầy cô và các bạn
        <br />
        đã lắng nghe
      </h2>

      <p
        className="anim-fade absolute bottom-36 left-32 text-label text-on-cham-soft"
        style={stagger(3)}
      >
        Nguồn nội dung: {DECK_INFO.source}
      </p>

      <BrocadeBand id="band-closing" className="absolute inset-x-0 bottom-0" />
    </div>
  );
}
