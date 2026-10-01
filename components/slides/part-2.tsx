import { DiagramArrow, DoubleArrow, InlineArrow } from "@/components/art/arrows";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* Tách ra: một cộng đồng trong khối chung tách ra thành cộng đồng độc lập. */
function SeparationDiagram() {
  return (
    <svg
      viewBox="0 0 720 260"
      className="w-180"
      role="img"
      aria-label="Sơ đồ: một cộng đồng dân cư tách ra thành cộng đồng dân tộc độc lập"
    >
      <circle
        cx={130}
        cy={130}
        r={110}
        fill="var(--color-cham-tint)"
        stroke="var(--color-cham)"
        strokeWidth={4}
      />
      <circle cx={168} cy={168} r={40} fill="var(--color-son)" />

      <DiagramArrow x1={270} x2={380} y={130} />

      <circle
        cx={490}
        cy={130}
        r={100}
        fill="var(--color-cham-tint)"
        stroke="var(--color-cham)"
        strokeWidth={4}
      />
      <circle
        cx={655}
        cy={130}
        r={54}
        fill="none"
        stroke="var(--color-son)"
        strokeWidth={4}
      />
      <circle cx={655} cy={130} r={40} fill="var(--color-son)" />
    </svg>
  );
}

/* Liên hiệp: các cộng đồng riêng rẽ gắn kết trong một khối chung. */
function UnionDiagram() {
  const apart = [
    [70, 80],
    [190, 80],
    [130, 190],
  ];
  const together = [
    [565, 78],
    [610, 156],
    [520, 156],
  ];
  return (
    <svg
      viewBox="0 0 720 260"
      className="w-180"
      role="img"
      aria-label="Sơ đồ: các dân tộc riêng rẽ liên hiệp lại với nhau"
    >
      {apart.map(([x, y]) => (
        <circle
          key={`a-${x}-${y}`}
          cx={x}
          cy={y}
          r={44}
          fill="var(--color-cham-tint)"
          stroke="var(--color-cham)"
          strokeWidth={4}
        />
      ))}

      <DiagramArrow x1={280} x2={390} y={130} />

      <circle
        cx={565}
        cy={130}
        r={120}
        fill="none"
        stroke="var(--color-cham)"
        strokeWidth={6}
      />
      {together.map(([x, y]) => (
        <circle
          key={`t-${x}-${y}`}
          cx={x}
          cy={y}
          r={44}
          fill="var(--color-cham-tint)"
          stroke="var(--color-cham)"
          strokeWidth={4}
        />
      ))}
    </svg>
  );
}

export function TrendsSlide() {
  return (
    <SlideFrame
      title="Hai xu hướng khách quan"
      subtitle="của sự phát triển quan hệ dân tộc"
      className="grid grid-cols-[1fr_120px_1fr]"
    >
      <section>
        <p className="text-body text-cham-soft">Xu hướng thứ nhất</p>
        <h3 className="mt-3 text-keyword font-extrabold text-son">TÁCH RA</h3>
        <div className="mt-8">
          <SeparationDiagram />
        </div>
        <p className="mt-8 text-lead font-semibold text-balance">
          Cộng đồng dân cư <InlineArrow className="mx-2 text-son" /> cộng đồng
          dân tộc độc lập
        </p>
      </section>

      <div className="relative flex justify-center" aria-hidden="true">
        <div className="h-full w-0.5 bg-cham-line" />
        <div className="absolute top-60 grid size-24 place-items-center rounded-full border-2 border-cham-line bg-paper text-cham">
          <DoubleArrow className="w-14" />
        </div>
      </div>

      <section>
        <p className="text-body text-cham-soft">Xu hướng thứ hai</p>
        <h3 className="mt-3 text-keyword font-extrabold">LIÊN HIỆP</h3>
        <div className="mt-8">
          <UnionDiagram />
        </div>
        <p className="mt-8 text-lead font-semibold text-balance">
          Các dân tộc <InlineArrow className="mx-2" /> liên hiệp với nhau
        </p>
        <p className="mt-3 text-body text-cham-soft">
          {keepWords("Trong từng quốc gia, thậm chí ở nhiều quốc gia")}
        </p>
      </section>
    </SlideFrame>
  );
}

const PROGRAM = [
  {
    number: "01",
    keyword: "Bình đẳng",
    text: "Các dân tộc hoàn toàn bình đẳng",
  },
  {
    number: "02",
    keyword: "Tự quyết",
    text: "Các dân tộc được quyền tự quyết",
  },
  {
    number: "03",
    keyword: "Liên hiệp",
    text: "Liên hiệp công nhân tất cả các dân tộc",
  },
];

export function ProgramSlide() {
  return (
    <SlideFrame
      title="Cương lĩnh dân tộc"
      subtitle="của chủ nghĩa Mác – Lênin"
      className="grid grid-cols-3 content-center items-start gap-10"
    >
      {PROGRAM.map((item) => (
        <section
          key={item.number}
          className="border-t-8 border-cham bg-cham-tint px-12 pt-12 pb-14"
        >
          <p className="text-heading font-extrabold text-son tabular-nums">
            {item.number}
          </p>
          <h3 className="mt-6 text-keyword font-extrabold">{item.keyword}</h3>
          <p className="mt-10 border-t-2 border-cham-line pt-8 text-lead text-balance">
            {keepWords(item.text)}
          </p>
        </section>
      ))}
    </SlideFrame>
  );
}
