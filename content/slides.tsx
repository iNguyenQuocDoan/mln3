import type { ReactNode } from "react";
import type { DeckSlide } from "@/components/deck/types";
import { AgendaSlide } from "@/components/slides/agenda";
import { ClosingSlide } from "@/components/slides/closing";
import { CoverSlide } from "@/components/slides/cover";
import { PartDivider } from "@/components/slides/divider";
import { FeaturesSteps } from "@/components/slides/features-steps";
import {
  EthnicSlide,
  FormationSlide,
  NationSlide,
} from "@/components/slides/part-1";
import { TrendsSlide } from "@/components/slides/part-2";
import {
  DevelopmentSlide,
  PositionSlide,
  ResponsibilitySlide,
} from "@/components/slides/part-4";
import { PolicySteps } from "@/components/slides/policy-steps";
import { ProgramSteps } from "@/components/slides/program-steps";
import { getPart } from "./parts";
import { SCRIPT } from "./script";

function divider(part: number): DeckSlide {
  return {
    id: `phan-${part}`,
    kind: "divider",
    tone: "dark",
    part,
    label: `Phần ${part}: ${getPart(part).title}`,
    content: <PartDivider part={part} />,
  };
}

/**
 * Slide nội dung theo bản Word. `docSlides` là số slide trong bản Word;
 * một slide trên web có thể gồm nhiều slide liên tiếp (mỗi slide một bước).
 */
function content(
  id: string,
  docSlides: number[],
  node: ReactNode,
): DeckSlide {
  return {
    id,
    kind: "content",
    tone: "light",
    docSlides,
    label: docSlides.map((n) => SCRIPT[n].title).join("; "),
    content: node,
  };
}

/** Thứ tự slide của cả bài. id dùng làm địa chỉ #id trên URL. */
export const slides: DeckSlide[] = [
  {
    id: "bia",
    kind: "cover",
    tone: "light",
    label: "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội",
    content: <CoverSlide />,
  },
  {
    id: "noi-dung",
    kind: "cover",
    tone: "light",
    label: "Nội dung",
    content: <AgendaSlide />,
  },

  divider(1),
  content("hinh-thanh", [1], <FormationSlide />),
  content("quoc-gia-dan-toc", [2], <NationSlide />),
  content("toc-nguoi", [3], <EthnicSlide />),

  divider(2),
  content("hai-xu-huong", [4], <TrendsSlide />),
  content("cuong-linh", [5, 6], <ProgramSteps />),

  divider(3),
  content("dac-diem", [7, 8, 9], <FeaturesSteps />),
  content("vi-tri", [10], <PositionSlide />),
  content("phat-trien", [11], <DevelopmentSlide />),
  content("trach-nhiem", [12], <ResponsibilitySlide />),
  content("chinh-sach", [13, 14, 15], <PolicySteps />),

  {
    id: "cam-on",
    kind: "closing",
    tone: "dark",
    label: "Cảm ơn thầy cô và các bạn đã lắng nghe",
    content: <ClosingSlide />,
  },
];
