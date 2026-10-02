"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { tileAt } from "@/content/game-board";
import { teamOf, type GameState, type TeamId } from "./engine";
import { Confetti } from "./overlays";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

const MEDAL = ["🥇", "🥈", "🥉"];

/** Màn ăn mừng toàn màn hình khi đội đầu tiên về đích. */
export function WinnerScreen({
  game,
  winnerId,
  order,
  onPlayAgain,
  onShowRanking,
}: {
  game: GameState;
  winnerId: TeamId;
  order: TeamId[];
  onPlayAgain: () => void;
  onShowRanking: () => void;
}) {
  const winner = teamDef(winnerId);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-dem/94">
      <Confetti />
      <div
        className="panel-in relative flex w-[1000px] flex-col items-center gap-4 rounded-[40px] bg-dem px-16 py-10 text-center ring-6"
        style={{ "--tw-ring-color": winner.color } as CSSProperties}
      >
        <p className="text-lead font-bold tracking-wide text-vang uppercase">
          🏆 Đường đua đại đoàn kết
        </p>
        <p className="text-heading font-bold text-on-cham-soft">
          {game.phase.kind === "game-over" && game.phase.reason === "questions-exhausted"
            ? "Hết câu hỏi · Đội dẫn đầu chiến thắng"
            : "Đội chiến thắng"}
        </p>
        <div
          className="grid size-44 place-items-center overflow-hidden rounded-full ring-4 ring-on-cham/40"
          style={{ background: winner.color }}
        >
          <Image
            src={winner.idle}
            alt={winner.name}
            width={176}
            height={176}
            unoptimized
            className="size-[92%] object-contain object-bottom"
          />
        </div>
        <h2 className="text-display leading-none font-extrabold" style={{ color: winner.color }}>
          {winner.name.toUpperCase()}
        </h2>

        <ol className="mt-2 flex w-full flex-col gap-1.5 text-left">
          {order.map((id, index) => {
            const def = teamDef(id);
            const team = teamOf(game, id);
            return (
              <li key={id} className="flex items-center gap-4 rounded-2xl bg-on-cham/5 px-5 py-1.5">
                <span className="w-10 text-center text-body font-extrabold">{MEDAL[index] ?? index + 1}</span>
                <TeamAvatar teamId={id} size={40} />
                <span className="w-32 text-body font-extrabold" style={{ color: def.color }}>
                  {def.name}
                </span>
                <span className="flex-1 text-label text-on-cham-soft">{tileAt(team.position).name}</span>
                <span className="text-label text-on-cham-soft">{team.correctAnswers} câu đúng</span>
                <span className="w-20 text-right text-body font-extrabold text-vang">ô {team.position}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex gap-5">
          <button
            type="button"
            onClick={onShowRanking}
            className="cursor-pointer rounded-2xl border-2 border-on-cham-soft/40 px-10 py-4 text-lead font-bold text-on-cham-soft hover:bg-on-cham/10 hover:text-on-cham"
          >
            Xem lại bảng xếp hạng
          </button>
          <button
            type="button"
            autoFocus
            onClick={onPlayAgain}
            className="cursor-pointer rounded-2xl bg-vang px-10 py-4 text-lead font-extrabold text-cham hover:bg-on-cham"
          >
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
}
