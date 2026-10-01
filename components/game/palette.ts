import type { MysteryEvent, PumpId } from "./engine";

/*
 * Màu và chữ dùng chung cho trò chơi và slide giới thiệu trò chơi.
 * Màu xe chọn sáng để nổi trên mặt đường màu chàm; chữ đặt trên màu xe
 * luôn là màu chàm.
 */
export const TEAM_COLORS = [
  "#ff6b5e",
  "#ffcf5a",
  "#4fd88a",
  "#5cc8ff",
  "#b69cff",
  "#ff8fc8",
];

export type PumpInfo = {
  id: PumpId;
  name: string;
  /** Hiện trên màn hình của cột bơm. */
  liters: string;
  /** Một dòng giải thích ngắn dưới cột bơm. */
  note: string;
  /** Tên trạm, hiện trên thẻ câu hỏi. */
  station: string;
  color: string;
  /** Màu chữ đặt trên `color`. */
  ink: string;
};

export const PUMPS: PumpInfo[] = [
  {
    id: "e5",
    name: "E5",
    liters: "1 lít",
    note: "Đúng thì tiến 1 ô",
    station: "Trạm E5",
    color: "#23955a",
    ink: "#ffffff",
  },
  {
    id: "ron95",
    name: "RON95",
    liters: "2 lít",
    note: "Đúng thì tiến 2 ô",
    station: "Trạm RON95",
    color: "#e3b44b",
    ink: "#1c2553",
  },
  {
    id: "mystery",
    name: "???",
    liters: "? lít",
    note: "May hay rủi?",
    station: "Xăng lạ",
    color: "#c4161c",
    ink: "#ffffff",
  },
];

export function pumpInfo(id: PumpId): PumpInfo {
  return PUMPS.find((pump) => pump.id === id) ?? PUMPS[0];
}

export type EventInfo = {
  title: string;
  text: string;
  /** Chữ trên nút, nói đúng việc sẽ xảy ra. */
  action: string;
  color: string;
};

export const EVENTS: Record<MysteryEvent, EventInfo> = {
  hard: {
    title: "Câu hỏi khó",
    text: "Trả lời đúng được 3 lít xăng và tiến 3 ô.",
    action: "Mở câu hỏi",
    color: "#ff6b5e",
  },
  nitro: {
    title: "Nitro!",
    text: "Bình nitro kích nổ, xe vọt lên 2 ô.",
    action: "Tăng tốc",
    color: "#5cc8ff",
  },
  steal: {
    title: "Cướp xăng!",
    text: "Chọn một đội đang có xăng để hút của họ 1 lít.",
    action: "Chọn đội",
    color: "#b69cff",
  },
  flat: {
    title: "Nổ lốp!",
    text: "Xe cán phải đinh, phải lùi lại 1 ô.",
    action: "Lùi 1 ô",
    color: "#ffcf5a",
  },
  police: {
    title: "Cảnh sát!",
    text: "Bị thổi phạt vì chạy quá tốc độ. Đội mất lượt này.",
    action: "Nhường lượt",
    color: "#6f9bff",
  },
};

export const LETTERS = ["A", "B", "C", "D"];
