"use client";

import { ranking, teamOf, type GameState, type TeamId } from "./engine";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

const MEDAL = ["🥇", "🥈", "🥉"];

/**
 * Bảng xếp hạng gọn đặt trong vùng giữa bàn cờ: chỉ hạng, tên đội và ô
 * đang đứng. `order`: thứ tự đã chốt (khi game kết thúc), mặc định tính
 * theo vị trí hiện tại.
 */
export function CompactRanking({ game, order }: { game: GameState; order?: TeamId[] }) {
  const rows = order ?? ranking(game);
  return (
    <section className="w-[260px] rounded-2xl bg-dem/70 p-3 ring-1 ring-on-cham-soft/20">
      <h2 className="px-1 text-label font-extrabold">🏆 XẾP HẠNG</h2>
      <ol className="mt-1.5 flex flex-col gap-1">
        {rows.map((id, index) => {
          const def = teamDef(id);
          return (
            <li
              // Key theo cả thứ tự để dòng trượt vào lại khi bảng đảo hạng.
              key={`${id}-${index}`}
              className="anim-swap flex items-center gap-2 rounded-xl px-1.5 py-0.5"
            >
              <span className="w-7 text-center text-label font-extrabold">{MEDAL[index] ?? index + 1}</span>
              <TeamAvatar teamId={id} size={28} />
              <span className="flex-1 truncate text-label font-bold" style={{ color: def.color }}>
                {def.name}
              </span>
              <span className="text-label font-extrabold text-vang tabular-nums">
                {teamOf(game, id).position}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
