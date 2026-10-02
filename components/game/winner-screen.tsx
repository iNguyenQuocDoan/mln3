"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { tileAt } from "@/content/game-board";
import { teamOf, type GameState, type TeamId } from "./engine";
import { GameHistory } from "./game-history";
import { Confetti } from "./overlays";
import type { GameRecord } from "./stores";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

const RANK_COLORS = ["#e3b44b", "#c9cfe2", "#d08a52"];

/**
 * Màn ăn mừng toàn màn hình khi đội đầu tiên về đích. Đã chơi từ hai ván trở
 * lên thì bên cạnh có bảng kết quả các ván, ván vừa xong được đánh dấu.
 */
export function WinnerScreen({
  game,
  winnerId,
  order,
  history,
  onPlayAgain,
  onShowRanking,
}: {
  game: GameState;
  winnerId: TeamId;
  order: TeamId[];
  history: GameRecord[];
  onPlayAgain: () => void;
  onShowRanking: () => void;
}) {
  const winner = teamDef(winnerId);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-dem/94">
      <Confetti />
      <div className="relative flex items-stretch gap-12">
        <div
          className="panel-in relative flex w-[1000px] flex-col items-center gap-4 rounded-[40px] bg-dem px-16 py-10 text-center ring-6"
          style={{ "--tw-ring-color": winner.color } as CSSProperties}
        >
          <p className="text-lead font-bold text-vang">Đường đua đại đoàn kết</p>
          <p className="text-heading font-bold text-on-cham-soft">
            {game.phase.kind === "game-over" && game.phase.reason === "questions-exhausted"
              ? "Hết câu hỏi, đội dẫn đầu thắng"
              : "Đội về đích đầu tiên"}
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
            {winner.name}
          </h2>

          <ol className="mt-2 flex w-full flex-col gap-1.5 text-left">
            {order.map((id, index) => {
              const def = teamDef(id);
              const team = teamOf(game, id);
              return (
                <li key={id} className="flex items-center gap-4 rounded-2xl bg-on-cham/5 px-5 py-1.5">
                  <span
                    className="grid size-11 place-items-center rounded-full text-body font-extrabold tabular-nums"
                    style={{
                      background: RANK_COLORS[index] ?? "rgb(255 255 255 / 0.12)",
                      color: index < 3 ? "#1c2553" : "#ffffff",
                    }}
                  >
                    {index + 1}
                  </span>
                  <TeamAvatar teamId={id} size={40} />
                  <span className="w-32 text-body font-extrabold" style={{ color: def.color }}>
                    {def.name}
                  </span>
                  <span className="flex-1 text-label text-on-cham-soft">{tileAt(team.position).name}</span>
                  <span className="text-label text-on-cham-soft">{team.correctAnswers} câu đúng</span>
                  <span className="w-24 text-right text-body font-extrabold text-vang tabular-nums">
                    ô {team.position}
                  </span>
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
              Xem bảng xếp hạng
            </button>
            <button
              type="button"
              autoFocus
              onClick={onPlayAgain}
              className="cursor-pointer rounded-2xl bg-vang px-10 py-4 text-lead font-extrabold text-cham hover:bg-on-cham"
            >
              Chơi ván mới
            </button>
          </div>
        </div>
        {history.length > 1 ? (
          <GameHistory
            records={history}
            limit={7}
            currentId={game.id}
            className="panel-in relative w-[620px]"
          />
        ) : null}
      </div>
    </div>
  );
}
