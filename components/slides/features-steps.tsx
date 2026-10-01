"use client";

import Image from "next/image";
import { preload } from "react-dom";
import { VietnamMap } from "@/components/art/vietnam-map";
import { useSlideStep } from "@/components/deck/step-context";
import { stagger } from "@/components/motion";
import photo from "@/content/photos/trang-phuc-ba-be.jpg";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/*
 * 05. Sáu đặc điểm dân tộc Việt Nam, ba màn hình: tổng quan sáu đặc điểm,
 * rồi hai nhóm mỗi nhóm ba đặc điểm. Cột trái là hình minh họa: bản đồ
 * (đứng yên giữa màn 1 và 2, vì hai màn này nói về dân cư và địa bàn),
 * sang màn 3 (văn hóa) đổi thành ảnh trang phục truyền thống.
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

const GROUPS = [
  { title: "Dân cư & địa bàn", features: FEATURES.slice(0, 3) },
  { title: "Phát triển & văn hóa", features: FEATURES.slice(3) },
];

const TITLES = ["Sáu đặc điểm dân tộc Việt Nam", ...GROUPS.map((g) => g.title)];

export function FeaturesSteps() {
  const { step } = useSlideStep();
  const culture = step === 2;
  // Tải ảnh ngay khi vào slide, để sang màn 3 là ảnh đã sẵn sàng.
  preload(photo.src, { as: "image" });

  return (
    <SlideFrame
      title={TITLES[step] ?? TITLES[0]}
      className="flex flex-col"
      swapTitle
    >
      <div className="grid min-h-0 flex-1 grid-cols-[600px_1fr] gap-20">
        <div className="flex min-h-0 items-center justify-center">
          {culture ? (
            <CulturePhoto />
          ) : (
            <VietnamMap className="anim-fade h-full max-h-180" labelSize={40} />
          )}
        </div>

        <div
          key={step}
          className="anim-swap flex min-h-0 flex-col justify-center"
        >
          {step === 0 ? <Overview /> : <FeatureList group={GROUPS[step - 1]} />}
        </div>
      </div>

      {culture ? (
        <p className="anim-swap mt-8 border-l-8 border-son bg-cham-tint px-10 py-5 text-sub leading-[1.35] font-extrabold uppercase">
          {keepWords("Đa dạng về bản sắc")}
          <br />
          <span className="font-semibold text-son normal-case">nhưng </span>
          {keepWords("thống nhất trong cộng đồng quốc gia")}
        </p>
      ) : null}
    </SlideFrame>
  );
}

/** Màn tổng quan: sáu từ khóa, chia sẵn theo hai nhóm của hai màn sau. */
function Overview() {
  return (
    <div className="grid grid-cols-2 gap-x-16">
      {GROUPS.map((group, g) => (
        <section key={group.title} className="anim-rise" style={stagger(g)}>
          <p className="text-label font-semibold text-cham-soft">
            {keepWords(group.title)}
          </p>
          <ol className="mt-3 border-t-2 border-cham-line">
            {group.features.map((feature) => (
              <li
                key={feature.number}
                className="flex items-baseline gap-6 border-b-2 border-cham-line py-5"
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
        </section>
      ))}
    </div>
  );
}

function FeatureList({ group }: { group: (typeof GROUPS)[number] }) {
  return (
    <ol className="flex flex-col gap-10">
      {group.features.map((feature, i) => (
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

/** Ảnh thật minh họa "bản sắc văn hóa riêng", kèm chú thích và nguồn ảnh. */
function CulturePhoto() {
  return (
    <figure className="anim-swap w-full">
      <Image
        src={photo}
        alt="Ba phụ nữ dân tộc thiểu số mặc trang phục truyền thống nhiều màu, ngồi trước hiên nhà gỗ"
        // Ảnh đã nén sẵn (1200px, ~165KB): dùng nguyên tệp, tải ngay.
        unoptimized
        loading="eager"
        className="h-auto w-full"
      />
      <figcaption className="mt-3 text-label text-cham-soft">
        <span className="text-cham">
          {keepWords("Trang phục truyền thống ở hồ Ba Bể (Bắc Kạn)")}
        </span>
        <br />
        Ảnh: AlbMem, CC BY-SA 4.0, Wikimedia Commons
      </figcaption>
    </figure>
  );
}
