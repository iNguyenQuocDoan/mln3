import { VietnamMap } from "@/components/art/vietnam-map";
import { stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

type Feature = { number: string; title: string; text: string };

const FEATURES: Feature[] = [
  {
    number: "01",
    title: "Chênh lệch số dân",
    text: "Quy mô dân số giữa các tộc người không giống nhau.",
  },
  {
    number: "02",
    title: "Cư trú xen kẽ",
    text: "Các dân tộc không hoàn toàn sống tách biệt mà có sự cư trú xen kẽ.",
  },
  {
    number: "03",
    title: "Địa bàn chiến lược",
    text: "Các dân tộc thiểu số phân bố chủ yếu ở địa bàn có vị trí chiến lược quan trọng.",
  },
  {
    number: "04",
    title: "Phát triển không đồng đều",
    text: "Giữa các dân tộc còn tồn tại sự khác nhau về trình độ phát triển.",
  },
  {
    number: "05",
    title: "Truyền thống đoàn kết",
    text: "Đoàn kết, gắn bó lâu đời trong cộng đồng dân tộc – quốc gia thống nhất.",
  },
  {
    number: "06",
    title: "Bản sắc văn hóa riêng",
    text: "Góp phần tạo nên sự phong phú, đa dạng của nền văn hóa Việt Nam thống nhất.",
  },
];

/*
 * Hai cột đặc điểm dùng chung một lưới 3 hàng để các cặp
 * 01–04, 02–05, 03–06 luôn thẳng hàng với nhau.
 */
function FeatureList({
  items,
  start,
  column,
}: {
  items: Feature[];
  start: number;
  column: 1 | 3;
}) {
  return (
    <ol start={start} className="contents">
      {items.map((item, i) => (
        <li
          key={item.number}
          className="anim-rise grid grid-cols-[72px_1fr] gap-x-4 self-start"
          // Các mục hiện lần lượt 01 → 06 trong lúc bản đồ đang được vẽ.
          style={{
            gridColumn: column,
            gridRow: i + 1,
            ...stagger(start - 1 + i),
          }}
        >
          <span className="text-heading leading-none font-extrabold text-son tabular-nums">
            {item.number}
          </span>
          <div>
            <h3 className="text-lead font-bold text-balance">{keepWords(item.title)}</h3>
            <p className="mt-2 text-body text-pretty text-cham-soft">
              {keepWords(item.text)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FeaturesSlide() {
  return (
    <SlideFrame
      title="Đặc điểm dân tộc ở Việt Nam"
      className="grid grid-cols-[1fr_500px_1fr] grid-rows-[auto_auto_auto] content-between gap-x-12"
    >
      <FeatureList items={FEATURES.slice(0, 3)} start={1} column={1} />
      <div className="col-start-2 row-span-3 row-start-1 flex items-center justify-center">
        <VietnamMap className="h-full max-h-180" labelSize={40} animated />
      </div>
      <FeatureList items={FEATURES.slice(3)} start={4} column={3} />
    </SlideFrame>
  );
}
