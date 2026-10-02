"use client";

import type { GameRecord } from "./stores";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

/**
 * Kết quả các ván đã chơi, ván gần nhất ở trên: đội thắng, số đội, số lượt
 * và giờ kết thúc. `currentId`: ván vừa kết thúc (màn chiến thắng) được đánh
 * dấu để khán giả thấy ván này đứng đâu trong buổi chơi.
 */
export function GameHistory({
  records,
  limit,
  currentId,
  className = "",
}: {
  records: GameRecord[];
  limit: number;
  currentId?: string;
  className?: string;
}) {
  const newest = records.at(-1);
  const rows = records
    .map((record, index) => ({ record, number: index + 1 }))
    .reverse()
    .slice(0, limit);

  return (
    <section
      className={`flex flex-col rounded-[28px] bg-dem/85 px-7 py-6 ring-1 ring-on-cham-soft/15 ${className}`}
    >
      <h2 className="text-lead font-extrabold">Các ván đã chơi</h2>
      <ol className="mt-4 flex flex-col gap-2">
        {rows.map(({ record, number }) => {
          const winner = record.ranking[0];
          const def = teamDef(winner.teamId);
          const current = record.id === currentId;
          return (
            <li
              key={record.id}
              className="grid grid-cols-[96px_52px_1fr_auto] items-center gap-x-4 rounded-2xl px-4 py-2.5"
              style={{
                background: current ? "rgb(227 180 75 / 0.14)" : "rgb(255 255 255 / 0.035)",
                boxShadow: current ? "inset 0 0 0 3px #e3b44b" : undefined,
              }}
            >
              <span className="text-[26px] font-bold text-on-cham-soft tabular-nums">Ván {number}</span>
              <TeamAvatar teamId={winner.teamId} size={52} />
              <div className="min-w-0">
                <p className="text-[30px] leading-tight font-extrabold" style={{ color: def.color }}>
                  {def.name} thắng
                </p>
                <p className="text-[22px] leading-tight text-on-cham-soft">
                  {record.ranking.length} đội, {record.turns} lượt
                  {record.reason === "questions-exhausted" ? ", hết câu hỏi" : ""}
                </p>
              </div>
              <span className="text-[24px] text-on-cham-soft tabular-nums">
                {finishedLabel(record.finishedAt, newest?.finishedAt ?? record.finishedAt)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** "14:32"; ván của ngày khác với ván gần nhất thì thêm ngày: "14:32, 1/10". */
function finishedLabel(time: number, newest: number): string {
  const date = new Date(time);
  const clock = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  return new Date(newest).toDateString() === date.toDateString()
    ? clock
    : `${clock}, ${date.getDate()}/${date.getMonth() + 1}`;
}
