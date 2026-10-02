import type { ReactNode } from "react";
import type { DeckSlide, DeckStep } from "@/components/deck/types";
import { AgendaSlide } from "@/components/slides/agenda";
import { ClosingSlide } from "@/components/slides/closing";
import { CoverBackdrop, CoverSlide } from "@/components/slides/cover";
import { PartDivider } from "@/components/slides/divider";
import {
  CultureSlide,
  DiversitySlide,
  FeaturesSteps,
} from "@/components/slides/features-steps";
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
  SelfDeterminationSlide,
  WorkersUnionSlide,
} from "@/components/slides/program";
import { getPart } from "./parts";
import { PHOTOS, type DeckPhoto } from "./photos";
import { HINTS, SCRIPT } from "./script";

/** Đoạn thứ `paragraph` (từ 0) trong lời slide `slide` của bản Word. */
function say(slide: number, paragraph: number) {
  return SCRIPT[slide].speech[paragraph];
}

/** Cả lời của slide `slide` trong bản Word. */
function sayAll(slide: number) {
  return SCRIPT[slide].speech;
}

/** Tách một đoạn lời làm hai, tại câu bắt đầu bằng `marker`. */
function splitAt(text: string, marker: string): [string, string] {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`Không thấy "${marker}" trong lời thuyết trình`);
  return [text.slice(0, at).trim(), text.slice(at)];
}

/* Slide 9, đoạn 2: câu về bản sắc văn hóa, rồi câu điểm lại sáu đặc điểm. */
const [CULTURE_SPEECH, FEATURES_RECAP] = splitAt(say(9, 1), "Như vậy");

function divider(part: number, photo?: DeckPhoto): DeckSlide {
  return {
    id: `phan-${part}`,
    kind: "divider",
    tone: "dark",
    part,
    steps: [{ title: `Phần ${part}: ${getPart(part).title}` }],
    content: <PartDivider part={part} photo={photo} />,
  };
}

/** Slide nội dung thuộc mục `section` (1–7); mỗi phần tử của `steps` là một màn hình. */
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
    backdrop: <CoverBackdrop />,
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
        title: "Cương lĩnh dân tộc: 02 — Quyền tự quyết",
        notes: sayAll(6),
        hint: HINTS.selfDetermination,
      },
    ],
    <SelfDeterminationSlide />,
  ),
  content(
    "lien-hiep",
    4,
    [
      {
        title: "Cương lĩnh dân tộc: 03 — Liên hiệp",
        hint: HINTS.workersUnion,
        handoff: SCRIPT[6].handoff,
      },
    ],
    <WorkersUnionSlide />,
  ),

  // Mở đầu phần về các dân tộc ở Việt Nam bằng một con người cụ thể.
  divider(3, PHOTOS.man),
  content(
    "dac-diem",
    5,
    [
      { title: "Sáu đặc điểm dân tộc Việt Nam", notes: [say(7, 0)] },
      { title: "Dân cư & địa bàn", notes: [say(7, 1), say(8, 0)] },
      { title: "Phát triển & đoàn kết", notes: [say(8, 1), say(9, 0)] },
    ],
    <FeaturesSteps />,
  ),
  content(
    "ban-sac-van-hoa",
    5,
    [{ title: "06 — Bản sắc văn hóa riêng", notes: [CULTURE_SPEECH] }],
    <CultureSlide />,
  ),
  content(
    "da-dang-thong-nhat",
    5,
    [
      {
        title: "Đa dạng về bản sắc, thống nhất trong cộng đồng quốc gia",
        notes: [FEATURES_RECAP],
        hint: HINTS.diversityUnity,
        handoff: SCRIPT[9].handoff,
      },
    ],
    <DiversitySlide />,
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
        // Slide 15 bản Word gồm cả lời kết của bài.
        notes: sayAll(15),
      },
    ],
    <PolicySteps />,
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
