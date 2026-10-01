"use client";

import { BrocadeBand } from "@/components/art/brocade-band";
import { Die } from "./die";
import { teamsToRoll, type GameState } from "./engine";
import { TEAM_COLORS } from "./palette";

/**
 * Trước khi đua: mỗi đội cử một bạn lên bấm gieo xúc xắc. Số lớn hơn đi
 * trước; các đội ra trùng số gieo lại cho tới khi phân được thứ tự.
 * Kết quả gieo nằm trong trạng thái ván, nên được lưu ngay sau mỗi lần gieo.
 */
export function DiceScreen({
  game,
  onRoll,
  onRollRest,
  onStart,
}: {
  game: GameState;
  onRoll: (team: number) => void;
  onRollRest: () => void;
  onStart: () => void;
}) {
  const waiting = teamsToRoll(game);
  const settled = game.order.length === game.teams.length;
  const count = game.teams.length;
  const columns = count === 4 ? 2 : Math.min(count, 3);
  const notRolled = game.rolls.filter((rolls) => rolls.length === 0).length;
  const tied = waiting.filter((team) => game.rolls[team].length > 0);

  let status: string;
  if (settled) status = "Đã có thứ tự xuất phát.";
  else if (notRolled > 0) status = `Còn ${notRolled} đội chưa gieo.`;
  else
    status = `${tied.map((team) => game.teams[team].name).join(", ")} ra trùng số, gieo lại để phân thứ tự.`;

  return (
    <div className="absolute inset-0 bg-cham">
      <BrocadeBand id="band-dice" className="absolute inset-x-0 top-0" />

      <header className="absolute top-32 left-32 w-300">
        <p className="text-lead font-bold text-on-cham-soft">
          Trước khi xuất phát
        </p>
        <h1 className="mt-3 text-title font-extrabold">
          Gieo xúc xắc chọn thứ tự
        </h1>
        <p className="mt-4 text-lead text-on-cham-soft">
          Mỗi đội cử một bạn lên bấm gieo. Số lớn hơn được đi trước; trùng số
          thì gieo lại.
        </p>
      </header>

      <div
        className="absolute inset-x-32 grid gap-8"
        style={{ top: 410, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {game.teams.map((team, i) => {
          const rolls = game.rolls[i];
          const last = rolls.at(-1) ?? null;
          const mustRoll = waiting.includes(i);
          const place = game.order.indexOf(i);
          return (
            <section
              key={i}
              aria-label={team.name}
              className="flex h-55 items-center gap-8 overflow-hidden rounded-4xl bg-nhua pr-8"
            >
              <span
                className="h-full w-3 shrink-0"
                style={{ background: TEAM_COLORS[i] }}
              />
              <Die
                key={rolls.length}
                value={last}
                size={150}
                className={`shrink-0 ${last !== null ? "die-tumble" : ""}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-heading font-extrabold">
                  {team.name}
                </p>
                <p className="mt-1 text-label text-on-cham-soft" aria-live="polite">
                  {rolls.length === 0
                    ? "Chưa gieo"
                    : `Đã gieo: ${rolls.join(", rồi ")}`}
                </p>
                <div className="mt-4 h-16">
                  {mustRoll ? (
                    <button
                      type="button"
                      onClick={() => onRoll(i)}
                      className="h-16 cursor-pointer rounded-2xl bg-vang px-10 text-lead font-extrabold text-cham transition-transform hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-on-cham"
                    >
                      {rolls.length === 0 ? "Gieo" : "Gieo lại"}
                    </button>
                  ) : place >= 0 ? (
                    <p className="text-heading font-extrabold text-vang">
                      Đi thứ {place + 1}
                    </p>
                  ) : (
                    <p className="pt-4 text-label text-on-cham-soft">
                      Chờ các đội khác
                    </p>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="absolute inset-x-32 bottom-14 flex items-center justify-between gap-10">
        <p className="text-lead font-semibold" aria-live="polite">
          {status}
        </p>
        {settled ? (
          <button
            type="button"
            autoFocus
            onClick={onStart}
            className="shrink-0 cursor-pointer rounded-2xl bg-son px-16 py-5 text-heading font-extrabold text-paper transition-colors hover:bg-[#a51217] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
          >
            Xuất phát
          </button>
        ) : (
          <button
            type="button"
            onClick={onRollRest}
            className="shrink-0 cursor-pointer rounded-2xl border-3 border-on-cham-soft/50 px-10 py-4 text-lead font-bold transition-colors hover:bg-on-cham/10 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
          >
            Gieo giúp các đội còn lại
          </button>
        )}
      </footer>
    </div>
  );
}
