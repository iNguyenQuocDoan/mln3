import type { ReactNode } from "react";
import type { DeckSlide, DeckStep } from "@/components/deck/types";
import { AgendaSlide } from "@/components/slides/agenda";
import { ClosingSlide } from "@/components/slides/closing";
import { CoverSlide } from "@/components/slides/cover";
import { PartDivider } from "@/components/slides/divider";
import { FeaturesSteps } from "@/components/slides/features-steps";
import { GameIntroSlide } from "@/components/slides/game-intro";
import { FormationSlide, MeaningsSlide } from "@/components/slides/part-1";
import { TrendsSlide } from "@/components/slides/part-2";
import {
  DirectionsSlide,
  RelationsSlide,
  StrategicSlide,
} from "@/components/slides/part-4";
import { PolicySteps } from "@/components/slides/policy-steps";
import {
  EqualitySlide,
  ProgramSummarySlide,
  SelfDeterminationSlide,
  WorkersUnionSlide,
} from "@/components/slides/program";
import { SummarySlide } from "@/components/slides/summary";
import { getPart } from "./parts";
import { HINTS, SCRIPT } from "./script";

/** Đoạn thứ `paragraph` (từ 0) trong lời slide `slide` của bản Word. */
function say(slide: number, paragraph: number) {
  return SCRIPT[slide].speech[paragraph];
}

/** Cả lời của slide `slide` trong bản Word. */
function sayAll(slide: number) {
  return SCRIPT[slide].speech;
}

function divider(part: number): DeckSlide {
  return {
    id: `phan-${part}`,
    kind: "divider",
    tone: "dark",
    part,
    steps: [{ title: `Phần ${part}: ${getPart(part).title}` }],
    content: <PartDivider part={part} />,
  };
}

/** Slide nội dung thuộc mục `section` (1–8); mỗi phần tử của `steps` là một màn hình. */
function content(
  id: string,
  section: number,
  steps: DeckStep[],
  node: ReactNode,
): DeckSlide {
  return { id, kind: "content", tone: "light", section, steps, content: node };
}

/*
 * Thứ tự màn hình của cả bài. id dùng làm địa chỉ #id trên URL.
 * Lời thuyết trình lấy nguyên văn từ bản Word (content/script.ts) và gắn
 * vào màn hình đang nói tới; màn hình mới chưa có lời thì có gợi ý (HINTS).
 */
export const slides: DeckSlide[] = [
  {
    id: "bia",
    kind: "cover",
    tone: "light",
    steps: [{ title: "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội" }],
    content: <CoverSlide />,
  },
  {
    id: "noi-dung",
    kind: "cover",
    tone: "light",
    steps: [{ title: "Nội dung", notes: [say(1, 0)] }],
    content: <AgendaSlide />,
  },

  divider(1),
  content(
    "hinh-thanh",
    1,
    [{ title: "Sự hình thành dân tộc", notes: [say(1, 1)] }],
    <FormationSlide />,
  ),
  content(
    "hai-nghia",
    2,
    [
      { title: "Hai nghĩa của dân tộc: quốc gia – dân tộc", notes: sayAll(2) },
      {
        title: "Hai nghĩa của dân tộc: dân tộc – tộc người",
        notes: sayAll(3),
        handoff: SCRIPT[3].handoff,
      },
    ],
    <MeaningsSlide />,
  ),

  divider(2),
  content(
    "hai-xu-huong",
    3,
    [{ title: "Hai xu hướng khách quan", notes: sayAll(4) }],
    <TrendsSlide />,
  ),
  content(
    "binh-dang",
    4,
    [{ title: "Cương lĩnh dân tộc: 01 — Bình đẳng", notes: sayAll(5) }],
    <EqualitySlide />,
  ),
  content(
    "tu-quyet",
    4,
    [
      {
        title: "Cương lĩnh dân tộc: 02 — Quyền tự quyết là gì",
        notes: sayAll(6),
        hint: HINTS.selfDeterminationMeaning,
      },
      {
        title: "Cương lĩnh dân tộc: 02 — Hai nhánh của quyền tự quyết",
        hint: HINTS.selfDeterminationBranches,
      },
    ],
    <SelfDeterminationSlide />,
  ),
  content(
    "lien-hiep",
    4,
    [{ title: "Cương lĩnh dân tộc: 03 — Liên hiệp", hint: HINTS.workersUnion }],
    <WorkersUnionSlide />,
  ),
  content(
    "cuong-linh",
    4,
    [
      {
        title: "Cương lĩnh dân tộc: tóm tắt ba nội dung",
        hint: HINTS.programSummary,
        handoff: SCRIPT[6].handoff,
      },
    ],
    <ProgramSummarySlide />,
  ),

  divider(3),
  content(
    "dac-diem",
    5,
    [
      { title: "Sáu đặc điểm dân tộc Việt Nam", notes: [say(7, 0)] },
      { title: "Dân cư & địa bàn", notes: [say(7, 1), say(8, 0)] },
      {
        title: "Phát triển & văn hóa",
        notes: [say(8, 1), ...sayAll(9)],
        handoff: SCRIPT[9].handoff,
      },
    ],
    <FeaturesSteps />,
  ),
  content(
    "van-de-chien-luoc",
    6,
    [{ title: "Vấn đề dân tộc là vấn đề chiến lược", notes: [say(10, 0)] }],
    <StrategicSlide />,
  ),
  content(
    "quan-he-dan-toc",
    6,
    [
      {
        title: "Bình đẳng — Đoàn kết — Tương trợ — Cùng phát triển",
        notes: [say(10, 1)],
      },
    ],
    <RelationsSlide />,
  ),
  content(
    "ba-huong",
    6,
    [
      {
        title: "Ba hướng thực hiện",
        notes: [...sayAll(11), ...sayAll(12)],
      },
    ],
    <DirectionsSlide />,
  ),
  content(
    "chinh-sach",
    7,
    [
      { title: "Chính sách dân tộc: chính trị", notes: [say(13, 0)] },
      { title: "Chính sách dân tộc: kinh tế", notes: [say(13, 1)] },
      { title: "Chính sách dân tộc: văn hóa", notes: [say(14, 0)] },
      { title: "Chính sách dân tộc: xã hội", notes: [say(14, 1)] },
      {
        title: "Chính sách dân tộc: an ninh – quốc phòng",
        notes: [say(15, 0)],
      },
    ],
    <PolicySteps />,
  ),
  content(
    "tong-ket",
    8,
    [
      { title: "Tổng kết: dãy số 2, 2, 3, 6, 5, 5", hint: HINTS.recapNumbers },
      {
        title: "Tổng kết: ý nghĩa từng con số",
        hint: HINTS.recapList,
        hintFirst: true,
        notes: [say(15, 1)],
      },
    ],
    <SummarySlide />,
  ),

  {
    id: "tro-choi",
    kind: "game",
    tone: "dark",
    steps: [{ title: "Trò chơi: Đường đua tiếp nhiên liệu" }],
    content: <GameIntroSlide />,
  },

  {
    id: "cam-on",
    kind: "closing",
    tone: "dark",
    steps: [{ title: "Cảm ơn thầy cô và các bạn đã lắng nghe" }],
    content: <ClosingSlide />,
  },
];
