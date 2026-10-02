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
import { SCRIPT, type ScreenScript } from "./script";

/** Lời nói và câu chuyển người của một màn hình (content/script.ts). */
function speak(script: ScreenScript): Pick<DeckStep, "notes" | "handoff"> {
  return { notes: script.speech, handoff: script.handoff };
}

function divider(
  part: number,
  script: ScreenScript,
  photo?: DeckPhoto,
): DeckSlide {
  return {
    id: `phan-${part}`,
    kind: "divider",
    tone: "dark",
    part,
    steps: [
      { title: `Phần ${part}: ${getPart(part).title}`, ...speak(script) },
    ],
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
 * Mỗi màn hình mang lời nói của chính nó (content/script.ts), cùng thứ tự
 * với kịch bản content/kich-ban-thuyet-trinh.md.
 */
export const slides: DeckSlide[] = [
  {
    id: "bia",
    kind: "cover",
    tone: "light",
    steps: [
      {
        title: "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội",
        ...speak(SCRIPT.cover),
      },
    ],
    content: <CoverSlide />,
    backdrop: <CoverBackdrop />,
  },
  {
    id: "noi-dung",
    kind: "cover",
    tone: "light",
    steps: [{ title: "Nội dung", ...speak(SCRIPT.agenda) }],
    content: <AgendaSlide />,
  },

  divider(1, SCRIPT.part1, PHOTOS.tayNung),
  content(
    "hinh-thanh",
    1,
    [{ title: "Sự hình thành dân tộc", ...speak(SCRIPT.formation) }],
    <FormationSlide />,
  ),
  content(
    "hai-nghia",
    2,
    [
      {
        title: "Hai nghĩa của dân tộc: quốc gia – dân tộc",
        ...speak(SCRIPT.nation),
      },
      {
        title: "Hai nghĩa của dân tộc: dân tộc – tộc người",
        ...speak(SCRIPT.ethnie),
      },
    ],
    <MeaningsSlide />,
  ),

  divider(2, SCRIPT.part2),
  content(
    "hai-xu-huong",
    3,
    [{ title: "Hai xu hướng khách quan", ...speak(SCRIPT.trends) }],
    <TrendsSlide />,
  ),
  content(
    "binh-dang",
    4,
    [{ title: "Cương lĩnh dân tộc: bình đẳng", ...speak(SCRIPT.equality) }],
    <EqualitySlide />,
  ),
  content(
    "tu-quyet",
    4,
    [
      {
        title: "Cương lĩnh dân tộc: quyền tự quyết",
        ...speak(SCRIPT.selfDetermination),
      },
    ],
    <SelfDeterminationSlide />,
  ),
  content(
    "lien-hiep",
    4,
    [
      {
        title: "Cương lĩnh dân tộc: liên hiệp công nhân",
        ...speak(SCRIPT.workersUnion),
      },
    ],
    <WorkersUnionSlide />,
  ),

  // Mở đầu phần về các dân tộc ở Việt Nam bằng một con người cụ thể.
  divider(3, SCRIPT.part3, PHOTOS.man),
  content(
    "dac-diem",
    5,
    [
      {
        title: "Sáu đặc điểm dân tộc Việt Nam",
        ...speak(SCRIPT.featuresOverview),
      },
      { title: "Dân cư và địa bàn", ...speak(SCRIPT.featuresPopulation) },
      { title: "Phát triển và đoàn kết", ...speak(SCRIPT.featuresUnity) },
    ],
    <FeaturesSteps />,
  ),
  content(
    "ban-sac-van-hoa",
    5,
    [{ title: "Bản sắc văn hóa riêng", ...speak(SCRIPT.culture) }],
    <CultureSlide />,
  ),
  content(
    "da-dang-thong-nhat",
    5,
    [
      {
        title: "Đa dạng về bản sắc, thống nhất trong cộng đồng quốc gia",
        ...speak(SCRIPT.diversity),
      },
    ],
    <DiversitySlide />,
  ),
  content(
    "van-de-chien-luoc",
    6,
    [
      {
        title: "Vấn đề dân tộc là vấn đề chiến lược",
        ...speak(SCRIPT.strategic),
      },
    ],
    <StrategicSlide />,
  ),
  content(
    "quan-he-dan-toc",
    6,
    [{ title: "Quan hệ giữa các dân tộc", ...speak(SCRIPT.relations) }],
    <RelationsSlide />,
  ),
  content(
    "ba-huong",
    6,
    [{ title: "Ba hướng thực hiện", ...speak(SCRIPT.directions) }],
    <DirectionsSlide />,
  ),
  content(
    "chinh-sach",
    7,
    [
      {
        title: "Chính sách dân tộc: chính trị",
        ...speak(SCRIPT.policyPolitics),
      },
      { title: "Chính sách dân tộc: kinh tế", ...speak(SCRIPT.policyEconomy) },
      { title: "Chính sách dân tộc: văn hóa", ...speak(SCRIPT.policyCulture) },
      { title: "Chính sách dân tộc: xã hội", ...speak(SCRIPT.policySociety) },
      {
        title: "Chính sách dân tộc: an ninh – quốc phòng",
        ...speak(SCRIPT.policySecurity),
      },
    ],
    <PolicySteps />,
  ),

  {
    id: "tro-choi",
    kind: "game",
    tone: "dark",
    steps: [
      { title: "Trò chơi: Đường đua đại đoàn kết", ...speak(SCRIPT.game) },
    ],
    content: <GameIntroSlide />,
  },

  {
    id: "cam-on",
    kind: "closing",
    tone: "dark",
    steps: [
      {
        title: "Cảm ơn thầy cô và các bạn đã lắng nghe",
        ...speak(SCRIPT.closing),
      },
    ],
    content: <ClosingSlide />,
  },
];
