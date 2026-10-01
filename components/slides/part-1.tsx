import { DiagramArrow } from "@/components/art/arrows";
import { delay, moveFrom, stagger } from "@/components/motion";
import { SCRIPT } from "@/content/script";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

/* ---------- Slide 1: Sự hình thành dân tộc ---------- */

export function FormationSlide() {
  return (
    <SlideFrame
      title={SCRIPT[1].title}
      className="grid grid-cols-[1fr_2px_1fr] gap-x-20"
    >
      <section className="anim-rise" style={stagger(0)}>
        <h3 className="text-heading font-bold">Ở phương Tây</h3>

        {/* Phương thức sản xuất phong kiến → tư bản chủ nghĩa */}
        <div className="mt-10 flex h-56 items-center gap-4">
          <p
            className="anim-fade flex-1 border-2 border-cham-line px-7 py-6 text-body text-cham-soft"
            style={delay(550)}
          >
            {keepWords("Phương thức sản xuất phong kiến")}
          </p>
          <svg
            viewBox="0 0 96 40"
            className="anim-fade w-24 shrink-0"
            style={delay(750)}
            aria-hidden="true"
          >
            <DiagramArrow x1={6} x2={88} y={20} />
          </svg>
          <p
            className="anim-rise flex-1 bg-cham px-7 py-6 text-body font-semibold text-on-cham"
            style={delay(900)}
          >
            {keepWords("Phương thức sản xuất tư bản chủ nghĩa")}
          </p>
        </div>

        <p className="mt-10 text-lead text-pretty">
          {keepWords(
            "Dân tộc xuất hiện khi phương thức sản xuất tư bản chủ nghĩa thay thế phương thức sản xuất phong kiến.",
          )}
        </p>
      </section>

      <div className="anim-fade bg-cham-line" style={stagger(1)} />

      <section className="anim-rise" style={stagger(2)}>
        <h3 className="text-heading font-bold">Ở phương Đông</h3>

        {/* Dân tộc hình thành trên nền tảng văn hóa và tâm lý dân tộc */}
        <div className="mt-10 flex h-56 flex-col items-center justify-center">
          <p
            className="anim-move border-4 border-son px-12 py-3 text-lead font-bold text-son"
            style={moveFrom(0, -28, 1150)}
          >
            Dân tộc
          </p>
          <p
            className="anim-rise mt-3 w-full bg-cham px-7 py-6 text-center text-body font-semibold text-on-cham"
            style={delay(950)}
          >
            {keepWords("Văn hóa và tâm lý dân tộc tương đối chín muồi")}
          </p>
        </div>

        <p className="mt-10 text-lead text-pretty">
          {keepWords(
            "Dân tộc hình thành trên nền tảng văn hóa và tâm lý dân tộc tương đối chín muồi.",
          )}
        </p>
        <p className="mt-6 text-body text-pretty text-cham-soft">
          {keepWords(
            "Cộng đồng kinh tế đạt mức độ nhất định nhưng nhìn chung còn kém phát triển và phân tán.",
          )}
        </p>
      </section>
    </SlideFrame>
  );
}

/* ---------- Slide 2: Dân tộc theo nghĩa quốc gia dân tộc ---------- */

/* Từ khóa lấy theo cách ghi nhớ trong lời thuyết trình. */
const NATION_TRAITS = [
  { key: "Kinh tế", text: "Có chung phương thức sinh hoạt kinh tế" },
  { key: "Lãnh thổ", text: "Có lãnh thổ chung ổn định" },
  { key: "Nhà nước", text: "Có sự quản lý của một nhà nước dân tộc độc lập" },
  { key: "Ngôn ngữ", text: "Có ngôn ngữ chung của quốc gia" },
  {
    key: "Bản sắc văn hóa",
    text: "Có nét tâm lý và văn hóa tạo nên bản sắc dân tộc",
  },
];

export function NationSlide() {
  return (
    <SlideFrame
      title={SCRIPT[2].title}
      subtitle="Cộng đồng chính trị – xã hội"
      className="flex flex-col justify-center"
    >
      <dl className="border-t-2 border-cham-line">
        {NATION_TRAITS.map((trait, i) => (
          <div
            key={trait.key}
            className="anim-rise grid grid-cols-[420px_1fr] items-baseline border-b-2 border-cham-line py-5"
            style={stagger(i)}
          >
            <dt className="text-heading font-bold">{keepWords(trait.key)}</dt>
            <dd className="text-lead text-cham-soft">
              {keepWords(trait.text)}
            </dd>
          </div>
        ))}
      </dl>
    </SlideFrame>
  );
}

/* ---------- Slide 3: Dân tộc theo nghĩa tộc người ---------- */

const ETHNIC_TRAITS = [
  {
    label: "Ngôn ngữ",
    text: "Cộng đồng về ngôn ngữ",
    color: "var(--color-cham)",
    circle: { x: 290, y: 230 },
    labelAt: { x: 196, y: 186 },
  },
  {
    label: "Văn hóa",
    text: "Cộng đồng về văn hóa",
    color: "var(--color-son)",
    circle: { x: 470, y: 230 },
    labelAt: { x: 566, y: 186 },
  },
  {
    label: "Ý thức tự giác",
    text: "Ý thức tự giác tộc người",
    color: "var(--color-vang-dam)",
    circle: { x: 380, y: 386 },
    labelAt: { x: 380, y: 500 },
  },
];

const VENN_R = 180;
const VENN_MS = 450;
const VENN_STEP_MS = 220;

export function EthnicSlide() {
  return (
    <SlideFrame
      title={SCRIPT[3].title}
      className="grid grid-cols-[760px_1fr] items-center gap-24"
    >
      <svg
        viewBox="0 0 760 600"
        className="w-190"
        role="img"
        aria-label="Sơ đồ ba đặc trưng của tộc người: ngôn ngữ, văn hóa, ý thức tự giác"
      >
        {ETHNIC_TRAITS.map((trait, i) => (
          <g
            key={trait.label}
            className="anim-pop"
            style={delay(VENN_MS + i * VENN_STEP_MS)}
          >
            <circle
              cx={trait.circle.x}
              cy={trait.circle.y}
              r={VENN_R}
              fill={trait.color}
              fillOpacity={0.09}
              stroke={trait.color}
              strokeWidth={4}
            />
          </g>
        ))}
        {ETHNIC_TRAITS.map((trait, i) => (
          <text
            key={trait.label}
            x={trait.labelAt.x}
            y={trait.labelAt.y}
            textAnchor="middle"
            fontSize={34}
            fontWeight={700}
            fill={trait.color}
            stroke="var(--color-paper)"
            strokeWidth={10}
            strokeLinejoin="round"
            paintOrder="stroke"
            className="anim-fade"
            style={delay(VENN_MS + i * VENN_STEP_MS + 150)}
          >
            {trait.label}
          </text>
        ))}
        <text
          x={380}
          y={302}
          textAnchor="middle"
          fontSize={30}
          fontWeight={800}
          fill="var(--color-cham)"
          stroke="var(--color-paper)"
          strokeWidth={10}
          strokeLinejoin="round"
          paintOrder="stroke"
          className="anim-fade"
          style={delay(VENN_MS + 3 * VENN_STEP_MS + 200)}
        >
          Tộc người
        </text>
      </svg>

      <ul className="space-y-12">
        {ETHNIC_TRAITS.map((trait, i) => (
          <li
            key={trait.label}
            className="anim-rise flex items-baseline gap-6"
            style={delay(VENN_MS + i * VENN_STEP_MS + 100)}
          >
            <span
              aria-hidden="true"
              className="size-6 shrink-0 translate-y-1"
              style={{ background: trait.color }}
            />
            <span className="text-heading font-bold">
              {keepWords(trait.text)}
            </span>
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
