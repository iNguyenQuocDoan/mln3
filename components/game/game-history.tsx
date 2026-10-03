"use client";

import { HISTORY_LIMIT, type GameRecord } from "./stores";
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

const RANK_COLORS = ["#e3b44b", "#c9cfe2", "#d08a52"];

/**
 * Kết quả đầy đủ các ván đã chơi (mở từ menu người dẫn): thứ hạng, ô đứng
 * và số câu đúng của mọi đội, kèm nút tải tệp CSV để lưu ra ngoài trình duyệt.
 */
export function ResultsDialog({ records, onClose }: { records: GameRecord[]; onClose: () => void }) {
  const rows = records.map((record, index) => ({ record, number: index + 1 })).reverse();
  return (
    <div className="fade-in absolute inset-0 z-60 grid place-items-center bg-dem/80">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
        className="panel-in flex max-h-[980px] w-[1240px] flex-col rounded-4xl bg-paper p-12 text-cham"
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 id="results-title" className="text-heading font-extrabold">
              Kết quả các ván
            </h2>
            <p className="mt-1 text-label text-cham-soft">
              Tự động lưu trên máy này mỗi khi một ván kết thúc (giữ tối đa {HISTORY_LIMIT} ván gần nhất).
            </p>
          </div>
          <div className="flex shrink-0 gap-4">
            <button
              type="button"
              disabled={records.length === 0}
              onClick={() => downloadResults(records)}
              className="cursor-pointer rounded-2xl bg-cham px-8 py-4 text-lead font-bold text-paper transition-colors hover:bg-son disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-son"
            >
              Tải tệp kết quả
            </button>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="cursor-pointer rounded-2xl border-3 border-cham-line px-8 py-4 text-lead font-bold transition-colors hover:bg-cham-tint focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cham"
            >
              Đóng
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 text-body text-cham-soft">
            Chưa có ván nào kết thúc. Khi một đội về đích, kết quả ván đó được lưu ở đây.
          </p>
        ) : (
          <ol className="mt-8 flex min-h-0 flex-col gap-5 overflow-y-auto pr-3">
            {rows.map(({ record, number }) => (
              <li key={record.id} className="rounded-3xl bg-cham-tint px-8 py-5">
                <p className="text-lead font-extrabold">
                  Ván {number}
                  <span className="ml-4 text-body font-semibold text-cham-soft">
                    {dateTimeLabel(record.finishedAt)}, {record.ranking.length} đội, {record.turns} lượt
                    {record.reason === "questions-exhausted" ? ", hết câu hỏi" : ""}
                  </span>
                </p>
                <ol className="mt-3 flex flex-col gap-1.5">
                  {record.ranking.map((row, rank) => {
                    const def = teamDef(row.teamId);
                    return (
                      <li
                        key={row.teamId}
                        className="grid grid-cols-[44px_44px_1fr_120px_200px] items-center gap-x-4"
                      >
                        <span
                          className="grid size-10 place-items-center rounded-full text-[22px] font-extrabold tabular-nums"
                          style={{
                            background: RANK_COLORS[rank] ?? "#ffffff",
                            color: "#1c2553",
                          }}
                        >
                          {rank + 1}
                        </span>
                        <TeamAvatar teamId={row.teamId} size={44} />
                        <span className="text-[28px] font-extrabold" style={{ color: def.color }}>
                          {def.name}
                        </span>
                        <span className="text-right text-[26px] font-bold tabular-nums">
                          ô {row.position}
                        </span>
                        <span className="text-right text-[26px] text-cham-soft tabular-nums">
                          {row.correct} câu đúng
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/** Tải kết quả các ván thành tệp CSV (UTF-8 có BOM để Excel đọc đúng tiếng Việt). */
function downloadResults(records: GameRecord[]) {
  const lines: string[][] = [
    ["Ván", "Kết thúc lúc", "Số đội", "Số lượt", "Kết thúc vì", "Hạng", "Đội", "Ô đứng", "Số câu đúng"],
  ];
  records.forEach((record, index) => {
    record.ranking.forEach((row, rank) => {
      lines.push([
        String(index + 1),
        dateTimeLabel(record.finishedAt),
        String(record.ranking.length),
        String(record.turns),
        record.reason === "finish" ? "Có đội về đích" : "Hết câu hỏi",
        String(rank + 1),
        teamDef(row.teamId).name,
        String(row.position),
        String(row.correct),
      ]);
    });
  });
  const csv = "\uFEFF" + lines.map((cells) => cells.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  const today = new Date();
  link.href = url;
  link.download = `ket-qua-duong-dua-${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "14:32 02/10/2026". */
function dateTimeLabel(time: number): string {
  const date = new Date(time);
  return `${date.getHours()}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** "14:32"; ván của ngày khác với ván gần nhất thì thêm ngày: "14:32, 1/10". */
function finishedLabel(time: number, newest: number): string {
  const date = new Date(time);
  const clock = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  return new Date(newest).toDateString() === date.toDateString()
    ? clock
    : `${clock}, ${date.getDate()}/${date.getMonth() + 1}`;
}
