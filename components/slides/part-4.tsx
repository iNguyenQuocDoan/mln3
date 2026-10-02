import { Photo, PhotoCaption } from "@/components/art/photo";
import { stagger } from "@/components/motion";
import { PHOTOS, type DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * 06. Quan điểm của Đảng, Nhà nước Việt Nam về vấn đề dân tộc: năm quan
 * điểm trên ba màn hình. Dòng dẫn đánh số quan điểm để khớp với màn tổng
 * kết ("5 — Năm quan điểm lớn").
 */
const KICKER = "Quan điểm của Đảng, Nhà nước";

/* ---------- Quan điểm 1: vấn đề chiến lược ---------- */

/*
 * Ba từ khóa trải hết chiều ngang; bên dưới là câu đầy đủ bên trái và ảnh
 * đồng bào các dân tộc bên phải.
 */
const STRATEGY_PHOTO = PHOTOS.parade;

export function StrategicSlide() {
  return (
    <SlideFrame
      kicker={`${KICKER} · Quan điểm 1`}
      title="Vấn đề dân tộc là vấn đề chiến lược"
      className="flex flex-col justify-center"
    >
      <div className="anim-rise flex items-end gap-12" style={stagger(0)}>
        {["CƠ BẢN", "LÂU DÀI"].map((word) => (
          <p
            key={word}
            className="flex-auto border-t-8 border-cham pt-6 text-keyword leading-none font-extrabold"
          >
            {keepWords(word)}
          </p>
        ))}
        <p className="pb-2 text-lead font-semibold text-cham-soft italic">
          {keepWords("đồng thời")}
        </p>
        <p className="flex-auto border-t-8 border-son pt-6 text-keyword leading-none font-extrabold text-son">
          {keepWords("CẤP BÁCH")}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-[1fr_720px] items-start gap-16">
        <p
          className="anim-rise text-lead leading-[1.4] text-pretty text-cham-soft"
          style={stagger(1)}
        >
          {keepWords(
            "Vấn đề dân tộc và đoàn kết dân tộc là vấn đề chiến lược cơ bản, lâu dài, đồng thời cũng là vấn đề cấp bách của cách mạng Việt Nam.",
          )}
        </p>
        <figure className="anim-rise" style={stagger(2)}>
          <Photo photo={STRATEGY_PHOTO} className="h-110 w-full" />
          <PhotoCaption photo={STRATEGY_PHOTO} className="mt-3" />
        </figure>
      </div>
    </SlideFrame>
  );
}

/* ---------- Quan điểm 2: quan hệ giữa các dân tộc ---------- */

const RELATIONS = ["BÌNH ĐẲNG", "ĐOÀN KẾT", "TƯƠNG TRỢ", "CÙNG PHÁT TRIỂN"];

/*
 * Bốn từ khóa xếp 2 × 2 bên trái, ảnh lớn bên phải: Ngày hội văn hóa của
 * các dân tộc rất ít người, tổ chức để thực hiện chính sách đoàn kết,
 * bình đẳng giữa các dân tộc.
 */
const RELATIONS_PHOTO = PHOTOS.smallGroupsFestival;

export function RelationsSlide() {
  return (
    <SlideFrame
      kicker={`${KICKER} · Quan điểm 2`}
      title="Quan hệ giữa các dân tộc"
      className="grid grid-cols-[1fr_760px] items-center gap-16"
    >
      <div>
        <ol
          className="anim-rise grid grid-cols-2 gap-x-12 gap-y-10"
          style={stagger(0)}
        >
          {RELATIONS.map((word, i) => (
            <li key={word} className="border-t-2 border-cham-line pt-5">
              <p className="text-banner leading-none font-extrabold text-son tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-banner leading-[1.15] font-extrabold">
                {keepWords(word)}
              </p>
            </li>
          ))}
        </ol>
        <p
          className="anim-rise mt-12 text-lead text-pretty text-cham-soft"
          style={stagger(1)}
        >
          {keepWords(
            "Các dân tộc bình đẳng, đoàn kết, tương trợ và giúp nhau cùng phát triển.",
          )}
        </p>
      </div>
      <figure className="anim-fade" style={stagger(2)}>
        <Photo photo={RELATIONS_PHOTO} className="h-146 w-full" />
        <PhotoCaption photo={RELATIONS_PHOTO} className="mt-3" />
      </figure>
    </SlideFrame>
  );
}

/* ---------- Quan điểm 3–5: ba hướng thực hiện ---------- */

/*
 * Thứ tự theo giáo trình và lời thuyết trình bản Word: phát triển toàn
 * diện (quan điểm 3), ưu tiên đầu tư (4), trách nhiệm chung (5). Ba quan
 * điểm xếp dọc bên trái; bên phải là hai ảnh đứng lớn minh họa quan điểm 4
 * và 5, mỗi ảnh có nhãn quan điểm phía trên.
 */
const DIRECTIONS: {
  number: number;
  title: string;
  body: string;
  photo?: DeckPhoto;
}[] = [
  {
    number: 3,
    title: "Phát triển toàn diện",
    body: "Chính trị · Kinh tế · Văn hóa · Xã hội · An ninh – Quốc phòng",
  },
  {
    number: 4,
    title: "Ưu tiên đầu tư",
    body: "Phát triển kinh tế – xã hội vùng dân tộc và miền núi.",
    photo: PHOTOS.highlandVillage,
  },
  {
    number: 5,
    title: "Trách nhiệm chung",
    body: "Là nhiệm vụ của toàn bộ hệ thống chính trị.",
    photo: PHOTOS.minorityYouth,
  },
];

export function DirectionsSlide() {
  const withPhoto = DIRECTIONS.filter((direction) => direction.photo);
  return (
    <SlideFrame
      kicker={`${KICKER} · Quan điểm 3, 4, 5`}
      title="Ba hướng thực hiện"
      className="grid grid-cols-[1fr_1000px] gap-16"
    >
      <div className="flex flex-col justify-between">
        {DIRECTIONS.map((direction, i) => (
          <section
            key={direction.title}
            className="anim-rise border-t-4 border-cham pt-4"
            style={stagger(i)}
          >
            <p className="text-label font-semibold text-son">
              Quan điểm {direction.number}
            </p>
            <h3 className="mt-1 text-heading leading-[1.15] font-extrabold">
              {keepWords(direction.title)}
            </h3>
            <p className="mt-3 text-body leading-[1.4] text-pretty text-cham-soft">
              {keepWords(direction.body)}
            </p>
          </section>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-8">
        {withPhoto.map((direction, i) =>
          direction.photo ? (
            <figure
              key={direction.title}
              className="anim-fade"
              style={stagger(i + 1)}
            >
              <p className="mb-2 text-label font-semibold text-son">
                Quan điểm {direction.number} · {keepWords(direction.title)}
              </p>
              <Photo photo={direction.photo} className="h-140 w-full" />
              <PhotoCaption photo={direction.photo} className="mt-3" />
            </figure>
          ) : null,
        )}
      </div>
    </SlideFrame>
  );
}
