"use client";

import { cardById, type CardId } from "@/content/game-cards";
import { TEAM_DEFS } from "@/content/game-teams";
import type { TeamId } from "./engine";
import { TeamAvatar } from "./team-piece";

/**
 * "CHỌN ĐỘI MUỐN TẤN CÔNG" (hoặc đội để đổi vị trí): chọn đúng một đội;
 * không có cửa sổ phòng thủ. Chính đội đang chơi luôn bị khóa.
 */
export function TargetSelector({
  cardId,
  attackerName,
  candidates,
  positions,
  onChoose,
}: {
  cardId: CardId;
  attackerName: string;
  candidates: TeamId[];
  /** Ô đang đứng của từng đội — để chọn đổi vị trí cho dễ. */
  positions: Record<TeamId, number>;
  onChoose: (teamId: TeamId) => void;
}) {
  const card = cardById(cardId);
  return (
    <div className="panel-in flex w-[700px] flex-col items-center gap-5 rounded-[28px] bg-dem/96 p-8 text-center shadow-2xl ring-2 ring-son">
      <p className="text-lead font-bold text-on-cham-soft">
        {card.icon} {card.name}
        {card.swap ? "" : ` · lùi ${Math.abs(card.cells)} ô`}
      </p>
      <h2 className="text-heading leading-tight font-extrabold whitespace-nowrap">
        {card.swap ? "CHỌN ĐỘI ĐỂ ĐỔI VỊ TRÍ" : "CHỌN ĐỘI MUỐN TẤN CÔNG"}
      </h2>
      {card.targetAheadOnly ? (
        <p className="text-label text-on-cham-soft">Chỉ chọn được đội đang đứng trước {attackerName}.</p>
      ) : null}
      {card.swap === "leader" ? (
        <p className="text-label text-on-cham-soft">Có nhiều đội đồng hạng dẫn đầu: chọn một đội.</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        {TEAM_DEFS.map((team) => {
          const allowed = candidates.includes(team.id);
          return (
            <button
              key={team.id}
              type="button"
              disabled={!allowed}
              onClick={() => onChoose(team.id)}
              className="flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-5 pl-1.5 text-body font-extrabold transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100"
              style={{ background: team.color, color: team.ink }}
            >
              <TeamAvatar teamId={team.id} size={40} />
              {team.name}
              {card.swap ? <span className="font-bold opacity-80">· ô {positions[team.id]}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
