"use client";

import { useState, type ReactNode } from "react";
import { BOARD_TILES, type BoardTile } from "@/content/game-board";
import type { GameState, TeamId } from "./engine";
import { teamDef } from "./palette";
import { TeamPiece } from "./team-piece";

/*
 * Bàn cờ vuông 8×8 kiểu Cờ Tỷ Phú: 28 ô chạy quanh viền (8 + 7 + 7 + 6),
 * vùng 6×6 ở giữa để trống cho bảng xếp hạng và khay xúc xắc (`children`).
 * Ô 0 ở góc trên bên trái, đi theo chiều kim đồng hồ: hàng trên, cột phải,
 * hàng dưới, cột trái, kết thúc ở ô 27 (ĐÍCH ĐẾN) ngay dưới KHỞI HÀNH.
 */
const GRID = 8;
export const TILE = 124;
const GAP = 4;
export const STEP = TILE + GAP;
export const BOARD_SIZE = GRID * STEP - GAP;
/** Cạnh vùng trống giữa bàn cờ. */
export const CENTER_SIZE = (GRID - 2) * STEP - GAP;

const LAST = GRID - 1;

function gridPos(id: number): { row: number; col: number } {
  if (id <= LAST) return { row: 0, col: id };
  if (id <= 2 * LAST) return { row: id - LAST, col: LAST };
  if (id <= 3 * LAST) return { row: LAST, col: LAST - (id - 2 * LAST) };
  return { row: LAST - (id - 3 * LAST), col: 0 };
}

/**
 * Bố cục cụm quân cờ trong một ô theo số đội đứng chung: [dx, dy] và cỡ.
 * Tâm cụm nằm ở dải dưới của ô (dưới tên tỉnh/thành) nên không che chữ.
 */
function cluster(count: number): { offsets: [number, number][]; size: number } {
  switch (count) {
    case 1:
      return { offsets: [[0, 0]], size: 54 };
    case 2:
      return {
        offsets: [
          [-23, 0],
          [23, 0],
        ],
        size: 44,
      };
    case 3:
      return {
        offsets: [
          [-37, 0],
          [0, 0],
          [37, 0],
        ],
        size: 36,
      };
    case 4:
      return {
        offsets: [
          [-17, -16],
          [17, -16],
          [-17, 16],
          [17, 16],
        ],
        size: 31,
      };
    default:
      return {
        offsets: [
          [-16, -16],
          [16, -16],
          [-32, 16],
          [0, 16],
          [32, 16],
        ],
        size: 30,
      };
  }
}

/** Tâm cụm quân cờ, tính từ mép trên của ô. */
const PIECE_Y = 86;

export function GameBoard({
  game,
  positions,
  movingTeamIds,
  activeTeamId,
  track,
  children,
}: {
  game: GameState;
  /** Vị trí *hiển thị* của các đội đang chạy hoạt ảnh (xem board-game.tsx). */
  positions: Record<TeamId, number>;
  movingTeamIds: ReadonlySet<TeamId>;
  activeTeamId: TeamId | null;
  /**
   * Lượt đi bằng xúc xắc: các ô sẽ đi qua được đánh số 1, 2, 3… theo màu đội
   * (số biến mất khi quân đã đi qua), ô sẽ dừng có viền màu đội.
   */
  track: { from: number; to: number; taken: number; color: string; ink: string } | null;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shownAt = (teamId: TeamId, fallback: number) => positions[teamId] ?? fallback;
  const gifts = new Set(game.gifts);

  const byTile = new Map<number, TeamId[]>();
  for (const team of game.teams) {
    const pos = shownAt(team.id, team.position);
    byTile.set(pos, [...(byTile.get(pos) ?? []), team.id]);
  }

  return (
    <div
      className="relative"
      style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
      role="group"
      aria-label="Bàn cờ hành trình xuyên Việt"
    >
      {BOARD_TILES.map((tile) => {
        const { row, col } = gridPos(tile.id);
        const here = byTile.get(tile.id) ?? [];
        const isFinish = tile.type === "finish";
        const gift = gifts.has(tile.id);
        const stepNo = track && tile.id > track.from && tile.id <= track.to ? tile.id - track.from : 0;
        const isStop = track !== null && stepNo > 0 && tile.id === track.to;
        return (
          <div
            // Đổi key khi có đội bước vào đích để chạy lại hiệu ứng "về đích".
            key={isFinish ? `finish-${here.length}` : tile.id}
            onMouseEnter={() => setHovered(tile.id)}
            onMouseLeave={() => setHovered((h) => (h === tile.id ? null : h))}
            className={`absolute flex flex-col items-center overflow-visible rounded-2xl px-1.5 pt-2.5 ${tileClass(tile, gift)} ${
              isFinish ? (here.length > 0 ? "finish-arrive z-[5]" : "finish-glow z-[5]") : ""
            }`}
            style={{
              left: col * STEP,
              top: row * STEP,
              width: TILE,
              height: TILE,
              boxShadow: isStop && track ? `0 0 0 5px ${track.color}, 0 0 28px ${track.color}99` : undefined,
            }}
          >
            <TileLabel tile={tile} />
            {track && stepNo > track.taken ? (
              <span
                className={`gift-pop absolute bottom-1.5 left-1.5 z-[3] grid place-items-center rounded-full font-extrabold tabular-nums shadow-[0_0_0_3px_#0b0f26] ${
                  isStop ? "size-13 text-[28px]" : "size-10 text-[22px]"
                }`}
                style={{ background: track.color, color: track.ink, animationDelay: `${stepNo * 35}ms` }}
                aria-hidden="true"
              >
                {stepNo}
              </span>
            ) : null}
            {gift ? (
              <span
                key={`gift-${tile.id}`}
                className="gift-pop absolute right-1.5 bottom-1.5 z-[2] grid size-11 place-items-center rounded-full bg-vang"
                aria-label="Ô có hộp quà"
              >
                <GiftIcon className="size-7" />
              </span>
            ) : null}

            {hovered === tile.id && here.length > 0 ? (
              <div className="panel-in pointer-events-none absolute -top-3 left-1/2 z-30 w-max -translate-x-1/2 -translate-y-full rounded-xl bg-dem px-5 py-3 text-label text-on-cham ring-1 ring-on-cham-soft/30">
                <p className="font-extrabold">{tile.name}</p>
                {here.map((id) => (
                  <p key={id} style={{ color: teamDef(id).color }}>
                    {teamDef(id).name}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="absolute" style={{ left: STEP, top: STEP, width: CENTER_SIZE, height: CENTER_SIZE }}>
        {children}
      </div>

      {/* Lớp quân cờ riêng, nằm trên các ô: dời bằng transition qua từng ô. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {game.teams.map((team) => {
          const pos = shownAt(team.id, team.position);
          const group = byTile.get(pos) ?? [team.id];
          const { offsets, size } = cluster(group.length);
          const [dx, dy] = offsets[group.indexOf(team.id)] ?? [0, 0];
          const { row, col } = gridPos(pos);
          return (
            <div
              key={team.id}
              className="absolute"
              style={{
                left: col * STEP + TILE / 2 + dx,
                top: row * STEP + PIECE_Y + dy,
                transform: "translate(-50%, -50%)",
                transition: "left 200ms ease-out, top 200ms ease-out",
              }}
            >
              <TeamPiece
                teamId={team.id}
                size={size}
                isMoving={movingTeamIds.has(team.id)}
                highlight={team.id === activeTeamId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Hộp quà vẽ nét: thân hộp, nắp, ruy băng và nơ. */
export function GiftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M5 13h22v15H5z" fill="#c4161c" />
      <path d="M3 9h26v5H3z" fill="#e8343a" />
      <path d="M14 9h4v19h-4z" fill="#fff4cf" />
      <path
        d="M16 9c-2-5-8-6-8-2.5S13 9 16 9Zm0 0c2-5 8-6 8-2.5S19 9 16 9Z"
        fill="none"
        stroke="#fff4cf"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function tileClass(tile: BoardTile, gift: boolean): string {
  if (tile.type === "start") return "bg-gradient-to-br from-son to-[#7e0f13] ring-2 ring-vang";
  if (tile.type === "finish") return "bg-gradient-to-br from-[#5c4a16] to-[#3a2f0f] ring-2 ring-vang";
  if (gift) return "bg-[#2f2b63] ring-2 ring-vang/70";
  return "bg-nhua-sang ring-1 ring-on-cham-soft/20";
}

function TileLabel({ tile }: { tile: BoardTile }) {
  if (tile.type === "start") {
    return (
      <p className="text-center text-[22px] leading-tight font-extrabold whitespace-nowrap text-paper">
        Khởi hành
      </p>
    );
  }
  if (tile.type === "finish") {
    return (
      <div className="text-center">
        <p className="text-[22px] leading-tight font-extrabold whitespace-nowrap text-vang">Đích đến</p>
        <p className="mt-1.5 text-[16px] leading-tight font-semibold text-paper/90">{tile.subtitle}</p>
      </div>
    );
  }
  return (
    <>
      <p className="w-full text-center text-[22px] leading-[1.1] font-bold text-on-cham">{tile.name}</p>
      <span className="absolute bottom-1.5 left-2.5 text-[15px] font-semibold text-on-cham-soft/70 tabular-nums">
        {tile.id}
      </span>
    </>
  );
}
