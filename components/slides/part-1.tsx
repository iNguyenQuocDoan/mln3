import { delay, stagger } from "@/components/motion";
import { keepWords } from "@/content/typography";
import { SlideFrame } from "./frame";

type Trait = { key: string; text: string };

const NATION_TRAITS: Trait[] = [
  { key: "Kinh tế", text: "Chung phương thức sinh hoạt kinh tế" },
  { key: "Lãnh thổ", text: "Chung, ổn định, không bị chia cắt" },
  { key: "Nhà nước", text: "Sự quản lý của một nhà nước độc lập" },
  { key: "Ngôn ngữ", text: "Ngôn ngữ chung của quốc gia" },
  {
    key: "Văn hóa",
    text: "Nét tâm lý biểu hiện qua văn hóa dân tộc, tạo nên bản sắc riêng",
  },
];

const ETHNIC_TRAITS: Trait[] = [
  { key: "Ngôn ngữ", text: "Cộng đồng về ngôn ngữ" },
  { key: "Văn hóa", text: "Cộng đồng về văn hóa" },
  { key: "Ý thức", text: "Ý thức tự giác tộc người" },
];

function MeaningColumn({
  term,
  english,
  summary,
  traits,
  accent,
  order,
}: {
  term: string;
  english: string;
  summary: string;
  traits: Trait[];
  accent: "cham" | "son";
  /** Thứ tự xuất hiện trên slide. */
  order: number;
}) {
  return (
    <section
      className={`anim-rise border-t-8 pt-8 ${accent === "son" ? "border-son" : "border-cham"}`}
      style={stagger(order)}
    >
      <h3
        className={`text-heading font-bold ${accent === "son" ? "text-son" : "text-cham"}`}
      >
        {term}
        <span className="ml-5 text-body font-normal text-cham-soft">
          {english}
        </span>
      </h3>
      <p className="mt-3 text-body text-cham-soft">{summary}</p>

      <dl className="mt-8">
        {traits.map((trait) => (
          <div
            key={trait.key}
            className="grid grid-cols-[200px_1fr] gap-x-6 border-t-2 border-cham-line py-5"
          >
            <dt className="text-lead font-bold">{trait.key}</dt>
            <dd className="pt-1 text-body text-pretty text-cham-soft">
              {keepWords(trait.text)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ConceptSlide() {
  return (
    <SlideFrame title="Khái niệm dân tộc" className="grid grid-cols-2 gap-16">
      <MeaningColumn
        term="Quốc gia – dân tộc"
        english="nation"
        summary="Cộng đồng chính trị – xã hội"
        traits={NATION_TRAITS}
        accent="cham"
        order={0}
      />
      <MeaningColumn
        term="Dân tộc – tộc người"
        english="ethnies"
        summary="Ba đặc trưng cơ bản"
        traits={ETHNIC_TRAITS}
        accent="son"
        order={2}
      />
    </SlideFrame>
  );
}

/*
 * Sơ đồ: một vòng lớn (quốc gia) bao gồm nhiều vòng nhỏ (tộc người).
 * Hiệu ứng: vẽ vòng quốc gia trước, các tộc người lần lượt hiện bên trong,
 * sau cùng là câu giải thích.
 */
const NATION_MS = 350;
const GROUPS_MS = 900;
const GROUP_STEP_MS = 110;
const STATEMENT_MS = 1550;

const NATION = { x: 430, y: 370, r: 330 };
const ETHNIC_R = 86;
const ETHNIC_GROUPS = [
  [430, 370],
  [430, 170],
  [620, 308],
  [548, 532],
  [312, 532],
  [240, 308],
];

function NationDiagram() {
  return (
    <svg
      viewBox="0 0 860 800"
      className="h-full max-h-185 w-auto"
      role="img"
      aria-label="Sơ đồ: một quốc gia bao gồm nhiều tộc người"
    >
      <circle
        cx={NATION.x}
        cy={NATION.y}
        r={NATION.r}
        fill="var(--color-cham-tint)"
        className="anim-fade"
        style={delay(NATION_MS)}
      />
      <circle
        cx={NATION.x}
        cy={NATION.y}
        r={NATION.r}
        pathLength={1}
        fill="none"
        stroke="var(--color-cham)"
        strokeWidth={6}
        className="anim-draw"
        style={delay(NATION_MS)}
      />
      {ETHNIC_GROUPS.map(([x, y], i) => (
        <g
          key={`${x}-${y}`}
          className="anim-pop"
          style={delay(GROUPS_MS + i * GROUP_STEP_MS)}
        >
          <circle
            cx={x}
            cy={y}
            r={ETHNIC_R}
            fill="var(--color-paper)"
            stroke="var(--color-son)"
            strokeWidth={4}
          />
          <text
            x={x}
            y={y + 10}
            textAnchor="middle"
            fontSize={28}
            fontWeight={600}
            fill="var(--color-son)"
          >
            Tộc người
          </text>
        </g>
      ))}
      <text
        x={NATION.x}
        y={NATION.y + NATION.r + 64}
        textAnchor="middle"
        fontSize={36}
        fontWeight={700}
        fill="var(--color-cham)"
        className="anim-fade"
        style={delay(GROUPS_MS)}
      >
        Quốc gia – dân tộc
      </text>
    </svg>
  );
}

export function DistinctionSlide() {
  return (
    <SlideFrame
      title="Phân biệt hai nghĩa của khái niệm dân tộc"
      className="grid grid-cols-[860px_1fr] items-center gap-26"
    >
      <NationDiagram />
      <div>
        <p
          className="anim-rise text-heading font-bold text-balance"
          style={delay(STATEMENT_MS)}
        >
          {keepWords("Dân tộc theo nghĩa tộc người không đồng nhất với quốc gia.")}
        </p>
        <p
          className="anim-rise mt-10 text-lead text-cham-soft text-balance"
          style={stagger(1, STATEMENT_MS)}
        >
          {keepWords("Một quốc gia có thể bao gồm nhiều tộc người khác nhau.")}
        </p>
      </div>
    </SlideFrame>
  );
}
