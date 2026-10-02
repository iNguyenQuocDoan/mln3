import { TEAM_DEFS, type TeamDef } from "@/content/game-teams";

/*
 * Màu và chữ dùng chung cho trò chơi "Đường đua đại đoàn kết". Màu năm đội
 * luôn chọn sáng để nổi trên nền bàn cờ màu chàm; chữ đặt trên màu đội là
 * `ink` của chính đội đó.
 */

export function teamDef(id: string): TeamDef {
  const def = TEAM_DEFS.find((team) => team.id === id);
  if (!def) throw new Error(`Không tìm thấy đội "${id}"`);
  return def;
}
