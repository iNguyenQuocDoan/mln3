"use client";

import { FINISH_POSITION, tileAt } from "@/content/game-board";
import { ranking, type GameState, type TeamId } from "./engine";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

/** Màu huy hiệu hạng 1–3 (vàng, bạc, đồng); các hạng sau dùng nền trung tính. */
const RANK_COLORS = ["#e3b44b", "#c9cfe2", "#d08a52"];

/**
 * Bảng xếp hạng nằm giữa bàn cờ: hạng, vị trí và thanh tiến độ về đích.
 * `order`: thứ tự đã chốt khi ván kết thúc; mặc định tính theo vị trí hiện tại.
 */
export function Leaderboard({
  game,
  activeTeamId,
  order,
}: {
  game: GameState;
  activeTeamId: TeamId | null;
  order?: TeamId[];
}) {
  const rows = order ?? ranking(game);

  return (
    <section className="flex size-full flex-col rounded-[28px] bg-dem/85 px-7 py-6 ring-1 ring-on-cham-soft/15">
      <h2 className="text-lead font-extrabold">Xếp hạng</h2>

      <ol className="mt-3 flex flex-col gap-2">
        {rows.map((id, index) => {
          const def = teamDef(id);
          const team = game.teams.find((t) => t.id === id);
          if (!team) return null;
          const active = id === activeTeamId;
          return (
            <li
              key={id}
              className="grid grid-cols-[40px_52px_1fr_auto] items-center gap-x-3.5 rounded-2xl px-3 py-2"
              style={{
                background: active ? `${def.color}24` : "rgb(255 255 255 / 0.035)",
                boxShadow: active ? `inset 0 0 0 3px ${def.color}` : undefined,
              }}
            >
              <span
                className="grid size-10 place-items-center rounded-full text-[24px] font-extrabold tabular-nums"
                style={{
                  background: RANK_COLORS[index] ?? "rgb(255 255 255 / 0.12)",
                  color: index < 3 ? "#1c2553" : "#ffffff",
                }}
              >
                {index + 1}
              </span>
              <TeamAvatar teamId={id} size={52} />
              <div className="min-w-0">
                <p className="text-[32px] leading-[1.15] font-extrabold" style={{ color: def.color }}>
                  {def.name}
                </p>
                <p className="truncate text-[24px] leading-tight text-on-cham-soft">
                  {tileAt(team.position).name}
                </p>
              </div>
              <p className="text-right leading-none">
                <span className="text-[44px] font-extrabold text-vang tabular-nums">{team.position}</span>
                <span className="ml-1 text-[24px] text-on-cham-soft">ô</span>
              </p>
              <div
                className="col-start-3 col-end-5 mt-1.5 h-2 overflow-hidden rounded-full bg-on-cham/10"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${(team.position / FINISH_POSITION) * 100}%`, background: def.color }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
