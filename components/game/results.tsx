"use client";

import { BrocadeBand } from "@/components/art/brocade-band";
import { Car } from "./car";
import { DeckLink } from "./deck-link";
import { ranking, type GameState } from "./engine";
import { Confetti } from "./overlays";
import { TEAM_COLORS } from "./palette";

const MEDALS = ["#e3b44b", "#c9cfe2", "#cd8a4f"];

/** Bảng kết quả: đội nhất bên trái, bảng xếp hạng đầy đủ bên phải. */
export function Results({
  game,
  onNewGame,
}: {
  game: GameState;
  onNewGame: () => void;
}) {
  const order = ranking(game);
  const leaders = order.filter((row) => row.rank === 1);
  const finisher =
    game.phase.kind === "finished" ? game.phase.winner : null;
  const winner =
    finisher ?? (leaders.length === 1 ? leaders[0].team : null);

  return (
    <div className="absolute inset-0 bg-cham">
      <Confetti />

      <section className="absolute top-24 left-32 w-190">
        <p className="text-lead font-bold text-on-cham-soft">
          Kết quả cuộc đua
        </p>
        {winner !== null ? (
          <>
            <p className="mt-14 text-heading font-bold">
              {finisher !== null ? "Về đích đầu tiên" : "Dẫn đầu khi dừng đua"}
            </p>
            <p
              className="mt-2 text-display font-extrabold break-words"
              style={{ color: TEAM_COLORS[winner] }}
            >
              {game.teams[winner].name}
            </p>
            <Car
              color={TEAM_COLORS[winner]}
              width={540}
              className="mt-16"
            />
          </>
        ) : (
          <>
            <p className="mt-14 text-heading font-bold">Đồng hạng nhất</p>
            <p className="mt-2 text-title font-extrabold">
              {leaders.map((row) => game.teams[row.team].name).join(", ")}
            </p>
          </>
        )}
      </section>

      <table className="absolute top-24 right-32 w-220 border-collapse">
        <caption className="sr-only">Bảng xếp hạng</caption>
        <thead>
          <tr className="text-left text-label text-on-cham-soft">
            <th scope="col" className="w-28 pb-4 font-semibold">
              Hạng
            </th>
            <th scope="col" className="pb-4 font-semibold">
              Đội
            </th>
            <th scope="col" className="pb-4 text-right font-semibold">
              Quãng đường
            </th>
            <th scope="col" className="pb-4 text-right font-semibold">
              Câu đúng
            </th>
            <th scope="col" className="pb-4 text-right font-semibold">
              Xăng đã đổ
            </th>
          </tr>
        </thead>
        <tbody>
          {order.map(({ team, rank }) => {
            const row = game.teams[team];
            return (
              <tr key={team} className="border-t-2 border-on-cham-soft/20">
                <td className="py-5">
                  <Medal rank={rank} />
                </td>
                <th scope="row" className="py-5 text-left">
                  <span className="flex items-center gap-4">
                    <span
                      className="h-11 w-3 shrink-0 rounded-full"
                      style={{ background: TEAM_COLORS[team] }}
                    />
                    <span className="truncate text-lead font-bold">
                      {row.name}
                    </span>
                  </span>
                </th>
                <td className="py-5 text-right text-lead font-extrabold tabular-nums">
                  {row.position}
                  <span className="text-body font-medium text-on-cham-soft">
                    /{game.trackLength} ô
                  </span>
                </td>
                <td className="py-5 text-right text-lead font-extrabold tabular-nums">
                  {row.correct}
                </td>
                <td className="py-5 text-right text-lead font-extrabold tabular-nums">
                  {row.fuel}
                  <span className="text-body font-medium text-on-cham-soft">
                    {" "}
                    lít
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="absolute right-32 bottom-36 flex gap-6">
        <button
          type="button"
          onClick={onNewGame}
          className="cursor-pointer rounded-2xl border-3 border-on-cham-soft/50 px-10 py-4 text-lead font-bold transition-colors hover:bg-on-cham/10 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
        >
          Ván mới
        </button>
        <DeckLink className="rounded-2xl bg-vang px-10 py-4 text-lead font-bold text-cham transition-colors hover:bg-on-cham focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang">
          Về bài thuyết trình
        </DeckLink>
      </div>

      <BrocadeBand id="band-results" className="absolute inset-x-0 bottom-0" />
    </div>
  );
}

function Medal({ rank }: { rank: number }) {
  const color = MEDALS[rank - 1];
  return (
    <span
      className={`grid size-16 place-items-center rounded-full text-lead font-extrabold tabular-nums ${color ? "text-cham" : "border-3 border-on-cham-soft/50"}`}
      style={color ? { background: color } : undefined}
      aria-label={`Hạng ${rank}`}
    >
      {rank}
    </span>
  );
}
