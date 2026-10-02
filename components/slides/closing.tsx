import { BrocadeBand } from "@/components/art/brocade-band";
import { Photo, PhotoCaption } from "@/components/art/photo";
import { stagger } from "@/components/motion";
import { DECK_INFO } from "@/content/parts";
import { PHOTOS } from "@/content/photos";

/*
 * Slide cảm ơn: lời cảm ơn bên trái (ba dòng để chừa chỗ), bản đồ minh
 * họa trang phục các dân tộc đứng bên phải, giữ nguyên cả tranh.
 */
const MAP = PHOTOS.ethnicMapArt;

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
        Cảm ơn thầy cô
        <br />
        và các bạn
        <br />
        đã lắng nghe
      </h2>

      <figure
        className="anim-fade absolute top-16 right-32 w-150"
        style={stagger(1)}
      >
        <Photo photo={MAP} fit="contain" className="h-210 w-full" />
        <PhotoCaption photo={MAP} dark className="mt-3" />
      </figure>

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
