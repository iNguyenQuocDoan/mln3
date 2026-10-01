import type { DeckSlide } from "@/components/deck/deck";
import { AgendaSlide } from "@/components/slides/agenda";
import { CoverSlide } from "@/components/slides/cover";
import { PartDivider } from "@/components/slides/divider";
import { ConceptSlide, DistinctionSlide } from "@/components/slides/part-1";
import { ProgramSlide, TrendsSlide } from "@/components/slides/part-2";
import { FeaturesSlide } from "@/components/slides/part-3";
import { PositionSlide, ViewpointSlide } from "@/components/slides/part-4";
import { POLICIES, PolicySlide } from "@/components/slides/part-5";
import { getPart } from "./parts";

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
    kind: "content",
    tone: "light",
    label: "Nội dung",
    content: <AgendaSlide />,
  },
  divider(1),
  {
    id: "khai-niem",
    kind: "content",
    tone: "light",
    part: 1,
    label: "Khái niệm dân tộc",
    content: <ConceptSlide />,
  },
  {
    id: "phan-biet",
    kind: "content",
    tone: "light",
    part: 1,
    label: "Phân biệt hai nghĩa của khái niệm dân tộc",
    content: <DistinctionSlide />,
  },
  divider(2),
  {
    id: "hai-xu-huong",
    kind: "content",
    tone: "light",
    part: 2,
    label: "Hai xu hướng khách quan của sự phát triển quan hệ dân tộc",
    content: <TrendsSlide />,
  },
  {
    id: "cuong-linh",
    kind: "content",
    tone: "light",
    part: 2,
    label: "Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin",
    content: <ProgramSlide />,
  },
  divider(3),
  {
    id: "dac-diem",
    kind: "content",
    tone: "light",
    part: 3,
    label: "Sáu đặc điểm dân tộc ở Việt Nam",
    content: <FeaturesSlide />,
  },
  divider(4),
  {
    id: "vi-tri",
    kind: "content",
    tone: "light",
    part: 4,
    label:
      "Vấn đề dân tộc và đoàn kết dân tộc: vấn đề chiến lược cơ bản, lâu dài, đồng thời là vấn đề cấp bách hiện nay",
    content: <PositionSlide />,
  },
  {
    id: "quan-diem",
    kind: "content",
    tone: "light",
    part: 4,
    label: "Quan điểm giải quyết vấn đề dân tộc",
    content: <ViewpointSlide />,
  },
  divider(5),
  {
    id: "chinh-sach",
    kind: "content",
    tone: "light",
    part: 5,
    steps: POLICIES.length,
    label: "Chính sách dân tộc của Đảng và Nhà nước Việt Nam",
    content: <PolicySlide />,
  },
];
