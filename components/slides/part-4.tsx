import { stagger } from "@/components/motion";
import { SCRIPT } from "@/content/script";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* ---------- Slide 10: Vị trí của vấn đề dân tộc và nguyên tắc quan hệ ---------- */

const RELATIONS = ["BÌNH ĐẲNG", "ĐOÀN KẾT", "TƯƠNG TRỢ", "GIÚP NHAU CÙNG PHÁT TRIỂN"];

export function PositionSlide() {
  return (
    <SlideFrame title={SCRIPT[10].title} className="flex flex-col justify-center">
      <p className="anim-fade text-lead text-cham-soft" style={stagger(0)}>
        Vấn đề dân tộc và đoàn kết dân tộc
      </p>
      <p
        className="anim-rise mt-4 border-l-8 border-cham py-1 pl-8 text-banner font-extrabold"
        style={stagger(1)}
      >
        {keepWords("Có vị trí chiến lược cơ bản, lâu dài")}
      </p>
      <p
        className="anim-rise mt-6 border-l-8 border-son py-1 pl-8 text-banner font-extrabold text-son"
        style={stagger(2)}
      >
        {keepWords("Đồng thời là vấn đề cấp bách của cách mạng Việt Nam")}
      </p>

      <p className="anim-fade mt-20 text-lead text-cham-soft" style={stagger(3)}>
        Các dân tộc
      </p>
      <ul className="mt-4 flex justify-between border-y-2 border-cham-line py-8">
        {RELATIONS.map((word, i) => (
          <li
            key={word}
            className="anim-rise text-heading font-extrabold"
            style={stagger(4 + i)}
          >
            {word}
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}

/* ---------- Slide 11: Phát triển toàn diện và ưu tiên đầu tư ---------- */

const FIELDS = ["Chính trị", "Kinh tế", "Văn hóa", "Xã hội"];

export function DevelopmentSlide() {
  return (
    <SlideFrame
      title={SCRIPT[11].title}
      className="grid grid-cols-[1fr_1fr] content-center items-start gap-24"
    >
      <section>
        <h3 className="anim-fade text-heading font-bold" style={stagger(0)}>
          Phát triển toàn diện
        </h3>
        <ul className="mt-8 grid grid-cols-2 gap-4">
          {FIELDS.map((field, i) => (
            <li
              key={field}
              className="anim-rise bg-cham-tint px-8 py-7 text-lead font-bold"
              style={stagger(1 + i)}
            >
              {field}
            </li>
          ))}
        </ul>
        <p
          className="anim-rise mt-4 border-2 border-son px-8 py-6 text-body font-semibold text-son"
          style={stagger(5)}
        >
          {keepWords("Gắn với an ninh và quốc phòng ở vùng dân tộc và miền núi")}
        </p>
      </section>

      <section className="anim-rise" style={stagger(7)}>
        <h3 className="text-heading font-bold">Ưu tiên đầu tư</h3>
        <p className="mt-8 border-l-8 border-son pl-8 text-banner font-extrabold text-balance">
          {keepWords("Phát triển kinh tế – xã hội vùng dân tộc và miền núi")}
        </p>
      </section>
    </SlideFrame>
  );
}

/* ---------- Slide 12: Trách nhiệm thực hiện công tác dân tộc ---------- */

/* Hai hàng theo đúng hai dòng của bản Word. */
const RESPONSIBLE = [
  ["Toàn Đảng", "Toàn dân"],
  ["Các cấp", "Các ngành", "Toàn bộ hệ thống chính trị"],
];

export function ResponsibilitySlide() {
  return (
    <SlideFrame title={SCRIPT[12].title} className="flex flex-col justify-center">
      <p
        className="anim-fade max-w-370 text-heading font-semibold text-balance"
        style={stagger(0)}
      >
        {keepWords(
          "Công tác dân tộc và thực hiện chính sách dân tộc là nhiệm vụ của",
        )}
      </p>
      <div className="mt-14 space-y-5">
        {RESPONSIBLE.map((row, r) => (
          <ul key={row.join()} className="flex gap-5">
            {row.map((who, i) => (
              <li
                key={who}
                className="anim-rise border-l-8 border-cham bg-cham-tint px-9 py-7 text-heading font-bold"
                style={stagger(1 + (r === 0 ? 0 : RESPONSIBLE[0].length) + i)}
              >
                {keepWords(who)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </SlideFrame>
  );
}
