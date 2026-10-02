"use client";

import { Photo, PhotoCaption } from "@/components/art/photo";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import { PHOTOS, type DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";
import { NumberedTitle, SlideFrame } from "./frame";

/*
 * 05. Sáu đặc điểm dân tộc Việt Nam, năm màn hình:
 * 1–3 (slide FeaturesSteps): tổng quan, dân cư & địa bàn, phát triển &
 *     đoàn kết; chỉ có chữ, bố cục giữ nguyên giữa ba màn.
 * 4 (CultureSlide): 06 Bản sắc văn hóa riêng, hai ảnh thêu và nhạc cụ.
 * 5 (DiversitySlide): đa dạng về bản sắc, thống nhất trong cộng đồng
 *   quốc gia; ảnh chân dung là hình chính.
 */
type Feature = {
  number: string;
  /** Từ khóa ở màn tổng quan. */
  keyword: string;
  title: string;
  text: string;
};

const FEATURES: Feature[] = [
  {
    number: "01",
    keyword: "Số dân",
    title: "Chênh lệch số dân",
    text: "Quy mô dân số giữa các tộc người không giống nhau.",
  },
  {
    number: "02",
    keyword: "Cư trú",
    title: "Cư trú xen kẽ",
    text: "Nhiều cộng đồng dân tộc cùng sinh sống trên một địa bàn.",
  },
  {
    number: "03",
    keyword: "Địa bàn",
    title: "Địa bàn chiến lược",
    text: "Các dân tộc thiểu số phân bố chủ yếu tại các địa bàn có vị trí chiến lược quan trọng.",
  },
  {
    number: "04",
    keyword: "Phát triển",
    title: "Phát triển không đồng đều",
    text: "Trình độ phát triển giữa các dân tộc có sự khác nhau.",
  },
  {
    number: "05",
    keyword: "Đoàn kết",
    title: "Đoàn kết lâu đời",
    text: "Các dân tộc gắn bó trong cộng đồng dân tộc – quốc gia thống nhất.",
  },
  {
    number: "06",
    keyword: "Văn hóa",
    title: "Bản sắc văn hóa riêng",
    text: "Mỗi dân tộc có bản sắc riêng và cùng góp phần tạo nên sự đa dạng của văn hóa Việt Nam.",
  },
];

const STEPS = [
  { title: "Sáu đặc điểm dân tộc Việt Nam", features: FEATURES },
  { title: "Dân cư & địa bàn", features: FEATURES.slice(0, 3) },
  { title: "Phát triển & đoàn kết", features: FEATURES.slice(3, 5) },
];

export function FeaturesSteps() {
  const { step } = useSlideStep();
  const current = STEPS[step] ?? STEPS[0];

  return (
    <SlideFrame
      title={current.title}
      className="flex flex-col justify-center"
      swapTitle
    >
      <div key={step} className="anim-swap">
        {step === 0 ? (
          <Overview />
        ) : (
          <FeatureList features={current.features} />
        )}
      </div>
    </SlideFrame>
  );
}

/** Màn tổng quan: sáu từ khóa, hai cột. */
function Overview() {
  return (
    <div className="grid grid-cols-2 gap-x-14">
      {[FEATURES.slice(0, 3), FEATURES.slice(3)].map((column, c) => (
        <ol
          key={column[0].number}
          className="anim-rise border-t-2 border-cham-line"
          style={stagger(c)}
        >
          {column.map((feature) => (
            <li
              key={feature.number}
              className="flex items-baseline gap-6 border-b-2 border-cham-line py-6"
            >
              <span className="w-24 text-banner leading-none font-extrabold text-son tabular-nums">
                {feature.number}
              </span>
              <span className="text-banner leading-none font-bold">
                {keepWords(feature.keyword)}
              </span>
            </li>
          ))}
        </ol>
      ))}
    </div>
  );
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ol className="flex flex-col gap-12">
      {features.map((feature, i) => (
        <li
          key={feature.number}
          className="anim-rise grid grid-cols-[120px_1fr] items-baseline"
          style={stagger(i)}
        >
          <span className="text-banner leading-none font-extrabold text-son tabular-nums">
            {feature.number}
          </span>
          <div>
            <h3 className="text-sub font-bold">{keepWords(feature.title)}</h3>
            <p className="mt-2 text-body leading-[1.4] text-pretty text-cham-soft">
              {keepWords(feature.text)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- 06 Bản sắc văn hóa riêng ---------- */

const CULTURE = FEATURES[5];

export function CultureSlide() {
  return (
    <SlideFrame
      kicker="Sáu đặc điểm dân tộc Việt Nam"
      title={
        <NumberedTitle number={CULTURE.number}>{CULTURE.title}</NumberedTitle>
      }
      className="flex flex-col"
    >
      <p
        className="anim-rise max-w-380 text-sub font-semibold text-pretty"
        style={stagger(0)}
      >
        {keepWords(CULTURE.text)}
      </p>
      <div
        className="anim-rise mt-10 grid grid-cols-2 gap-12"
        style={stagger(1)}
      >
        <Figure photo={PHOTOS.embroidery} />
        <Figure photo={PHOTOS.music} />
      </div>
    </SlideFrame>
  );
}

function Figure({ photo }: { photo: DeckPhoto }) {
  return (
    <figure>
      <Photo photo={photo} className="h-110 w-full" />
      <PhotoCaption photo={photo} className="mt-3" />
    </figure>
  );
}

/* ---------- Đa dạng về bản sắc, thống nhất trong cộng đồng quốc gia ---------- */

export function DiversitySlide() {
  return (
    <div className="absolute inset-0 grid grid-cols-[740px_1fr] items-center gap-20 px-32 pt-20 pb-36">
      <figure className="anim-fade">
        <Photo photo={PHOTOS.redScarf} className="h-150 w-full" />
        <PhotoCaption photo={PHOTOS.redScarf} className="mt-3" />
      </figure>
      <div className="anim-rise" style={stagger(1)}>
        <p className="text-label font-semibold text-son">
          Sáu đặc điểm dân tộc Việt Nam
        </p>
        <h2 className="mt-6 text-title leading-[1.2] font-extrabold uppercase">
          {keepWords("Đa dạng về bản sắc")}
        </h2>
        <p className="my-6 text-lead font-semibold text-cham-soft">nhưng</p>
        <p className="text-title leading-[1.2] font-extrabold text-son uppercase">
          {keepWords("Thống nhất trong cộng đồng quốc gia")}
        </p>
      </div>
    </div>
  );
}
