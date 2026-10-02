"use client";

import { useState, type ReactNode } from "react";
import { BOARD_TILES, type BoardTile } from "@/content/game-board";
import type { GameState, TeamId } from "./engine";
import { teamDef } from "./palette";
import { TeamPiece } from "./team-piece";

/*
 * Bàn cờ vuông 8×8 kiểu Cờ Tỷ Phú: 28 ô chạy quanh viền (8 + 7 + 7 + 6),
 * vùng 6×6 ở giữa để trống cho thông tin trận đấu (`children`). Ô 0 ở góc
 * trên bên trái, đi theo chiều kim đồng hồ: hàng trên → cột phải → hàng
 * dưới → cột trái, kết thúc ở ô 27 (ĐÍCH ĐẾN) ngay dưới KHỞI HÀNH.
 */
const GRID = 8;
export const TILE = 124;
const GAP = 4;
const STEP = TILE + GAP;
export const BOARD_SIZE = GRID * STEP - GAP;

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
      return { offsets: [[0, 0]], size: 46 };
    case 2:
      return { offsets: [[-21, 0], [21, 0]], size: 40 };
    case 3:
      return { offsets: [[-36, 0], [0, 0], [36, 0]], size: 34 };
    case 4:
      return { offsets: [[-16, -15], [16, -15], [-16, 15], [16, 15]], size: 29 };
    default:
      return { offsets: [[-15, -15], [15, -15], [-30, 15], [0, 15], [30, 15]], size: 29 };
  }
}

/** Tâm cụm quân cờ, tính từ mép trên của ô. */
const PIECE_Y = 90;

export function GameBoard({
  game,
  positions,
  movingTeamIds,
  activeTeamId,
  children,
}: {
  game: GameState;
  /** Vị trí *hiển thị* của các đội đang chạy hoạt ảnh (xem board-game.tsx). */
  positions: Record<TeamId, number>;
  movingTeamIds: ReadonlySet<TeamId>;
  activeTeamId: TeamId | null;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shownAt = (teamId: TeamId, fallback: number) => positions[teamId] ?? fallback;

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
        return (
          <div
            // Đổi key khi có đội bước vào đích để chạy lại hiệu ứng "về đích".
            key={isFinish ? `finish-${here.length}` : tile.id}
            onMouseEnter={() => setHovered(tile.id)}
            onMouseLeave={() => setHovered((h) => (h === tile.id ? null : h))}
            className={`absolute flex flex-col items-center overflow-visible rounded-xl px-1.5 pt-2 ${tileClass(tile)} ${
              isFinish ? (here.length > 0 ? "finish-arrive z-[5]" : "finish-glow z-[5]") : ""
            }`}
            style={{ left: col * STEP, top: row * STEP, width: TILE, height: TILE }}
          >
            <TileLabel tile={tile} />
            {tile.hasGift ? (
              <span
                className="absolute -right-1.5 -bottom-1.5 z-[1] grid size-9 place-items-center rounded-full bg-son text-xl ring-2 ring-vang"
                aria-label="Ô may mắn"
              >
                🎁
              </span>
            ) : null}

            {hovered === tile.id && here.length > 0 ? (
              <div className="panel-in pointer-events-none absolute -top-3 left-1/2 z-30 w-max -translate-x-1/2 -translate-y-full rounded-xl bg-dem px-5 py-3 text-label text-on-cham ring-1 ring-on-cham-soft/30">
                <p className="font-extrabold uppercase">{tile.name}</p>
                {here.map((id) => (
                  <p key={id} style={{ color: teamDef(id).color }}>
                    • {teamDef(id).name}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <div
        className="absolute flex items-center justify-center"
        style={{ left: STEP, top: STEP, width: (GRID - 2) * STEP - GAP, height: (GRID - 2) * STEP - GAP }}
      >
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

function tileClass(tile: BoardTile): string {
  if (tile.type === "start") return "bg-gradient-to-br from-son to-[#7e0f13] ring-2 ring-vang";
  if (tile.type === "finish") return "bg-gradient-to-br from-[#5c4a16] to-[#3a2f0f] ring-2 ring-vang";
  if (tile.hasGift) return "bg-[#2c2a5c] ring-2 ring-vang/60";
  return "bg-nhua-sang ring-1 ring-on-cham-soft/25";
}

function TileLabel({ tile }: { tile: BoardTile }) {
  if (tile.type === "start") {
    return (
      <div className="text-center">
        <p className="text-[16px] leading-tight font-extrabold whitespace-nowrap text-paper">
          🇻🇳 KHỞI HÀNH
        </p>
        <p className="mt-0.5 text-[12px] leading-none text-paper/85">{tile.subtitle}</p>
      </div>
    );
  }
  if (tile.type === "finish") {
    return (
      <div className="text-center">
        <p className="text-[18px] leading-tight font-extrabold whitespace-nowrap text-vang">
          <span className="flag-wave" aria-hidden="true">
            🏁
          </span>{" "}
          ĐÍCH ĐẾN
        </p>
        <p className="mt-0.5 text-[13px] leading-tight font-bold text-paper/90">{tile.subtitle}</p>
      </div>
    );
  }
  return (
    <>
      <p className="w-full text-center text-[21px] leading-tight font-extrabold text-on-cham">
        {tile.name}
      </p>
      <span className="absolute bottom-1 left-2 text-[15px] font-bold text-on-cham-soft/70">
        {tile.id}
      </span>
    </>
  );
}
