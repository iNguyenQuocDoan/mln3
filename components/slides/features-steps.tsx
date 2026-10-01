"use client";

import { VietnamMap } from "@/components/art/vietnam-map";
import { useSlideStep } from "@/components/deck/step-context";
import { delay, stagger } from "@/components/motion";
import { SCRIPT } from "@/content/script";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * Slide 7–9: sáu đặc điểm dân tộc ở Việt Nam, mỗi slide hai đặc điểm.
 * Bản đồ đứng yên bên trái (chỉ vẽ một lần khi vào slide 7); bên phải đổi
 * nội dung theo bước. Dải sáu ô phía trên cho biết đang ở đặc điểm nào.
 */
type Feature = {
  number: string;
  /** Từ khóa theo cách ghi nhớ trong lời thuyết trình. */
  keyword: string;
  text: string;
  note?: string;
};

const FEATURES: Feature[] = [
  {
    number: "01",
    keyword: "Số dân",
    text: "Có sự chênh lệch về số dân giữa các tộc người.",
  },
  {
    number: "02",
    keyword: "Cư trú",
    text: "Các dân tộc cư trú xen kẽ nhau.",
  },
  {
    number: "03",
    keyword: "Địa bàn",
    text: "Các dân tộc thiểu số phân bố chủ yếu ở địa bàn có vị trí chiến lược quan trọng.",
  },
  {
    number: "04",
    keyword: "Phát triển",
    text: "Các dân tộc ở Việt Nam có trình độ phát triển không đồng đều.",
  },
  {
    number: "05",
    keyword: "Đoàn kết",
    text: "Các dân tộc có truyền thống đoàn kết, gắn bó lâu đời trong cộng đồng quốc gia thống nhất.",
  },
  {
    number: "06",
    keyword: "Văn hóa",
    text: "Mỗi dân tộc có bản sắc văn hóa riêng.",
    note: "Các bản sắc góp phần tạo nên sự phong phú, đa dạng của văn hóa Việt Nam thống nhất.",
  },
];

const DOC_SLIDES = [7, 8, 9];

export function FeaturesSteps() {
  const { step } = useSlideStep();
  const docSlide = DOC_SLIDES[step] ?? DOC_SLIDES[0];
  const shown = FEATURES.slice(step * 2, step * 2 + 2);

  return (
    <SlideFrame
      title={SCRIPT[docSlide].title}
      className="grid grid-cols-[600px_1fr] gap-20"
      swapTitle
    >
      <div className="flex items-center justify-center">
        <VietnamMap className="h-full max-h-182" labelSize={40} animated />
      </div>

      <div className="flex flex-col">
        <ol
          className="anim-fade grid grid-cols-6 gap-3"
          style={stagger(0)}
          aria-label="Sáu đặc điểm"
        >
          {FEATURES.map((feature, i) => {
            const current = Math.floor(i / 2) === step;
            const done = Math.floor(i / 2) < step;
            return (
              <li
                key={feature.number}
                aria-current={current ? "step" : undefined}
                className={`border-t-6 pt-3 text-label transition-colors duration-500 ${
                  current
                    ? "border-son font-semibold text-cham"
                    : done
                      ? "border-cham text-cham-soft"
                      : "border-cham-line text-cham-soft"
                }`}
              >
                {feature.keyword}
              </li>
            );
          })}
        </ol>

        <div key={step} className="mt-14 flex flex-1 flex-col gap-14">
          {shown.map((feature, i) => (
            <section
              key={feature.number}
              className="anim-rise grid grid-cols-[150px_1fr] items-baseline"
              style={delay(step === 0 ? 450 + i * 160 : 80 + i * 140)}
            >
              <span className="text-keyword leading-none font-extrabold text-son tabular-nums">
                {feature.number}
              </span>
              <div>
                <p className="text-heading leading-15 font-semibold text-pretty">
                  {keepWords(feature.text)}
                </p>
                {feature.note ? (
                  <p className="mt-5 text-lead text-pretty text-cham-soft">
                    {keepWords(feature.note)}
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
