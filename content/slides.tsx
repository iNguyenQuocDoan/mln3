import type { DeckSlide } from "@/components/deck/deck";
import { AgendaSlide } from "@/components/slides/agenda";
import { CoverSlide } from "@/components/slides/cover";
import { PartDivider } from "@/components/slides/divider";
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
  divider(2),
  divider(3),
  divider(4),
  divider(5),
];
