import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * 06. Quan điểm của Đảng, Nhà nước Việt Nam về vấn đề dân tộc: năm quan
 * điểm trên ba màn hình. Dòng dẫn đánh số quan điểm để khớp với màn tổng
 * kết ("5 — Năm quan điểm lớn").
 */
const KICKER = "Quan điểm của Đảng, Nhà nước";

/* ---------- Quan điểm 1: vấn đề chiến lược ---------- */

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
      <p
        className="anim-rise mt-16 max-w-380 text-lead leading-[1.4] text-pretty text-cham-soft"
        style={stagger(1)}
      >
        {keepWords(
          "Vấn đề dân tộc và đoàn kết dân tộc là vấn đề chiến lược cơ bản, lâu dài, đồng thời cũng là vấn đề cấp bách của cách mạng Việt Nam.",
        )}
      </p>
    </SlideFrame>
  );
}

/* ---------- Quan điểm 2: quan hệ giữa các dân tộc ---------- */

const RELATIONS = ["BÌNH ĐẲNG", "ĐOÀN KẾT", "TƯƠNG TRỢ", "CÙNG PHÁT TRIỂN"];

export function RelationsSlide() {
  return (
    <SlideFrame
      kicker={`${KICKER} · Quan điểm 2`}
      title="Quan hệ giữa các dân tộc"
      className="flex flex-col justify-center"
    >
      <ol className="anim-rise grid grid-cols-4" style={stagger(0)}>
        {RELATIONS.map((word, i) => (
          <li
            key={word}
            className="border-l-2 border-cham-line px-8 first:border-l-0 first:pl-0"
          >
            <p className="text-banner leading-none font-extrabold text-son tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-8 text-banner leading-[1.15] font-extrabold">
              {keepWords(word)}
            </p>
          </li>
        ))}
      </ol>
      <p
        className="anim-rise mt-20 border-t-2 border-cham-line pt-8 text-lead text-cham-soft"
        style={stagger(1)}
      >
        {keepWords(
          "Các dân tộc bình đẳng, đoàn kết, tương trợ và giúp nhau cùng phát triển.",
        )}
      </p>
    </SlideFrame>
  );
}

/* ---------- Quan điểm 3–5: ba hướng thực hiện ---------- */

/*
 * Thứ tự theo giáo trình và lời thuyết trình bản Word: phát triển toàn
 * diện (quan điểm 3), ưu tiên đầu tư (4), trách nhiệm chung (5).
 */
const DIRECTIONS: { number: number; title: string; body: string | string[] }[] =
  [
    {
      number: 3,
      title: "Phát triển toàn diện",
      body: [
        "Chính trị",
        "Kinh tế",
        "Văn hóa",
        "Xã hội",
        "An ninh – Quốc phòng",
      ],
    },
    {
      number: 4,
      title: "Ưu tiên đầu tư",
      body: "Phát triển kinh tế – xã hội vùng dân tộc và miền núi.",
    },
    {
      number: 5,
      title: "Trách nhiệm chung",
      body: "Là nhiệm vụ của toàn bộ hệ thống chính trị.",
    },
  ];

export function DirectionsSlide() {
  return (
    <SlideFrame
      kicker={`${KICKER} · Quan điểm 3, 4, 5`}
      title="Ba hướng thực hiện"
      className="grid grid-cols-3 gap-14"
    >
      {DIRECTIONS.map((direction, i) => (
        <section
          key={direction.title}
          className="anim-rise border-t-8 border-cham pt-6"
          style={stagger(i)}
        >
          <p className="text-label font-semibold text-son">
            Quan điểm {direction.number}
          </p>
          <h3 className="mt-2 min-h-[2.3em] text-heading leading-[1.15] font-extrabold">
            {keepWords(direction.title)}
          </h3>
          {typeof direction.body === "string" ? (
            <p className="mt-8 text-lead leading-[1.4] text-pretty">
              {keepWords(direction.body)}
            </p>
          ) : (
            <ul className="mt-6 border-t-2 border-cham-line">
              {direction.body.map((field) => (
                <li
                  key={field}
                  className="border-b-2 border-cham-line py-2.5 text-lead font-semibold"
                >
                  {keepWords(field)}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </SlideFrame>
  );
}
