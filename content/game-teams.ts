/**
 * Các đội chơi của "Đường đua đại đoàn kết" (MC chọn 2–5 đội trước khi bắt
 * đầu; ván dùng các đội đầu danh sách). Tên hiển thị luôn là "Đội 1".."Đội 5" — không hiện tên dân tộc hay bất kỳ nhãn nào khác trên
 * giao diện chính. Mỗi đội có một nhân vật chibi riêng (ảnh do người dùng
 * cung cấp, đặt tại public/assets/game/teams/team-N/).
 */
export type TeamDef = {
  id: string;
  name: string;
  /** Màu nhận diện riêng, luôn nổi hơn màu nền bàn cờ. */
  color: string;
  ink: string;
  idle: string;
  move: string;
};

export const TEAM_DEFS: TeamDef[] = [
  {
    id: "team-1",
    name: "Đội 1",
    color: "#ff5a52",
    ink: "#ffffff",
    idle: "/assets/game/teams/team-1/idle.png",
    move: "/assets/game/teams/team-1/move.png",
  },
  {
    id: "team-2",
    name: "Đội 2",
    color: "#4f9dff",
    ink: "#ffffff",
    idle: "/assets/game/teams/team-2/idle.png",
    move: "/assets/game/teams/team-2/move.png",
  },
  {
    id: "team-3",
    name: "Đội 3",
    color: "#e3b44b",
    ink: "#1c2553",
    idle: "/assets/game/teams/team-3/idle.png",
    move: "/assets/game/teams/team-3/move.png",
  },
  {
    id: "team-4",
    name: "Đội 4",
    color: "#b56cf0",
    ink: "#ffffff",
    idle: "/assets/game/teams/team-4/idle.png",
    move: "/assets/game/teams/team-4/move.png",
  },
  {
    id: "team-5",
    name: "Đội 5",
    color: "#3fcf72",
    ink: "#1c2553",
    idle: "/assets/game/teams/team-5/idle.png",
    move: "/assets/game/teams/team-5/move.png",
  },
];

export const TEAM_COUNT = TEAM_DEFS.length;

/** Số đội tối thiểu / tối đa trong một ván (tối đa = số nhân vật có sẵn). */
export const MIN_TEAMS = 2;
export const MAX_TEAMS = TEAM_DEFS.length;

export const CARD_BACK_SRC = "/assets/game/cards/card-back.png";
