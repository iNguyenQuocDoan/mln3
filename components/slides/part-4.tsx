import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* Câu nguồn: "Vấn đề dân tộc và đoàn kết dân tộc được xác định là vấn đề
 * chiến lược cơ bản, lâu dài, đồng thời cũng là vấn đề cấp bách hiện nay." */
export function PositionSlide() {
  return (
    <SlideFrame
      title="Vấn đề dân tộc và đoàn kết dân tộc"
      subtitle="được xác định là"
      className="flex flex-col justify-center"
    >
      <p
        className="anim-rise border-l-8 border-cham py-2 pl-10 text-keyword font-extrabold"
        style={stagger(0)}
      >
        Vấn đề chiến lược cơ bản, lâu dài
      </p>

      <p
        className="anim-fade my-10 pl-12 text-lead text-cham-soft"
        style={stagger(2)}
      >
        đồng thời cũng là
      </p>

      <p
        className="anim-rise border-l-8 border-son py-2 pl-10 text-keyword font-extrabold text-son"
        style={stagger(3)}
      >
        Vấn đề cấp bách hiện nay
      </p>
    </SlideFrame>
  );
}

const PRINCIPLES = ["BÌNH ĐẲNG", "ĐOÀN KẾT", "TƯƠNG TRỢ", "CÙNG PHÁT TRIỂN"];

const FIELDS = [
  "Chính trị",
  "Kinh tế",
  "Văn hóa",
  "Xã hội",
  "An ninh – quốc phòng",
];

export function ViewpointSlide() {
  const blocksStart = PRINCIPLES.length + 1;

  return (
    <SlideFrame title="Quan điểm giải quyết vấn đề dân tộc">
      <p className="anim-fade text-body text-cham-soft" style={stagger(0)}>
        Các dân tộc trong đại gia đình Việt Nam
      </p>
      <ul className="mt-5 flex justify-between border-y-2 border-cham-line py-9">
        {PRINCIPLES.map((word, i) => (
          <li
            key={word}
            className="anim-rise text-banner font-extrabold"
            style={stagger(i + 1)}
          >
            {word}
          </li>
        ))}
      </ul>

      <div className="mt-20 grid grid-cols-3 gap-16">
        <section
          className="anim-rise border-t-4 border-cham pt-6"
          style={stagger(blocksStart)}
        >
          <h3 className="text-lead font-bold">Ưu tiên đầu tư</h3>
          <p className="mt-4 text-body text-pretty text-cham-soft">
            {keepWords(
              "Phát triển kinh tế – xã hội các vùng dân tộc và miền núi.",
            )}
          </p>
        </section>

        <section
          className="anim-rise border-t-4 border-cham pt-6"
          style={stagger(blocksStart + 1)}
        >
          <h3 className="text-lead font-bold">Phát triển toàn diện</h3>
          <ul className="mt-4 space-y-1 text-body text-cham-soft">
            {FIELDS.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </section>

        <section
          className="anim-rise border-t-4 border-cham pt-6"
          style={stagger(blocksStart + 2)}
        >
          <h3 className="text-lead font-bold">Trách nhiệm chung</h3>
          <p className="mt-4 text-body text-pretty text-cham-soft">
            {keepWords(
              "Toàn Đảng, toàn dân, toàn quân, các cấp, các ngành và toàn bộ hệ thống chính trị.",
            )}
          </p>
        </section>
      </div>
    </SlideFrame>
  );
}
