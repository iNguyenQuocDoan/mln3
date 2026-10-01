"use client";

import type { CSSProperties } from "react";
import { BrocadeBand } from "@/components/art/brocade-band";
import { Car } from "./car";
import { stealTargets, type GameState, type Team } from "./engine";
import {
  carSize,
  cellWidth,
  FINISH_X,
  frontX,
  KERB,
  LABEL_WIDTH,
  LANES_HEIGHT,
  laneHeight,
  ROAD_WIDTH,
  RULER,
  START_X,
  TRACK,
} from "./geometry";
import { driveMs } from "./motion";
import { EVENTS, TEAM_COLORS } from "./palette";

/**
 * Đường đua: mỗi đội một làn, lề trên và lề dưới là dải thổ cẩm của bộ
 * slide. Khi đang chọn đội để cướp xăng, các làn chọn được thành nút bấm.
 */
export function Track({
  game,
  stealing,
  onSteal,
}: {
  game: GameState;
  stealing: boolean;
  onSteal: (team: number) => void;
}) {
  const count = game.teams.length;
  const lane = laneHeight(count);
  const car = carSize(count);
  const move = game.phase.kind === "moving" ? game.phase.move : null;
  const targets = stealing ? stealTargets(game) : [];
  const racing = game.phase.kind !== "finished";

  return (
    <div
      className="absolute"
      style={{
        left: TRACK.left,
        top: TRACK.top,
        width: TRACK.width,
        height: TRACK.height,
      }}
    >
      <BrocadeBand
        id="kerb-top"
        height={KERB}
        className="absolute inset-x-0 top-0"
      />
      <Road game={game} lane={lane} />

      <div
        className="absolute inset-x-0"
        style={{ top: KERB, height: LANES_HEIGHT }}
      >
        {game.teams.map((team, i) => {
          const color = TEAM_COLORS[i];
          const shift = move?.shifts.find((item) => item.team === i);
          const isActor = move?.actor === i;
          const shaken =
            shift !== undefined &&
            (move?.kind === "flat" || (move?.kind === "steal" && !isActor));
          const slotStyle: CSSProperties = {
            top: (lane - car.height) / 2,
            transform: `translateX(${frontX(team.position, game.trackLength) - car.width}px)`,
            transitionDuration:
              move && shift ? `${driveMs(move.kind, shift.cells)}ms` : "0ms",
          };

          return (
            <div
              key={i}
              className="absolute inset-x-0"
              style={{ top: i * lane, height: lane }}
            >
              <LaneLabel
                team={team}
                color={color}
                active={racing && i === game.current}
                trackLength={game.trackLength}
              />

              <div
                className="absolute inset-y-0 right-0"
                style={{ left: LABEL_WIDTH }}
              >
                {move?.kind === "police" && isActor ? (
                  <span className="lane-siren absolute inset-0" />
                ) : null}
                <div className="car-slot absolute left-0" style={slotStyle}>
                  <Car
                    color={color}
                    width={car.width}
                    driving={shift !== undefined}
                    nitro={move?.kind === "nitro" && isActor}
                    className={shaken ? "anim-shake" : ""}
                  />
                  {shift ? (
                    <span
                      key={game.turn}
                      className={`anim-float absolute -top-12 left-1/2 -translate-x-1/2 text-heading font-extrabold tabular-nums ${shift.cells > 0 ? "text-vang" : "text-[#ff8a80]"}`}
                    >
                      {shift.cells > 0 ? `+${shift.cells}` : `−${-shift.cells}`}
                    </span>
                  ) : null}
                  {move?.kind === "police" && isActor ? (
                    <span className="absolute -top-9 left-1/2 flex -translate-x-1/2 gap-3">
                      <span className="siren-red size-8 rounded-full" />
                      <span className="siren-blue size-8 rounded-full" />
                    </span>
                  ) : null}
                </div>
              </div>

              {stealing ? (
                targets.includes(i) ? (
                  <button
                    type="button"
                    onClick={() => onSteal(i)}
                    aria-label={`Cướp xăng của ${team.name}`}
                    className="steal-target absolute inset-0 cursor-pointer outline-none"
                    style={{ "--ring": EVENTS.steal.color } as CSSProperties}
                  />
                ) : (
                  <span className="absolute inset-0 bg-dem/60" />
                )
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        className="absolute inset-x-0"
        style={{ top: KERB + LANES_HEIGHT }}
      >
        <BrocadeBand id="kerb-bottom" height={KERB} className="block" />
      </div>
      <Ruler trackLength={game.trackLength} />
    </div>
  );
}

function LaneLabel({
  team,
  color,
  active,
  trackLength,
}: {
  team: Team;
  color: string;
  active: boolean;
  trackLength: number;
}) {
  return (
    <div
      className={`absolute inset-y-0 left-0 flex items-center gap-5 pr-6 ${active ? "bg-nhua-sang" : ""}`}
      style={{ width: LABEL_WIDTH }}
    >
      <span className="h-full w-3 shrink-0" style={{ background: color }} />
      <span className="min-w-0 flex-1 truncate text-body font-bold">
        {team.name}
      </span>
      <span className="shrink-0 text-lead font-extrabold text-vang tabular-nums">
        {team.position}
        <span className="text-label font-semibold text-on-cham-soft">
          /{trackLength}
        </span>
      </span>
    </div>
  );
}

/** Mặt đường, vạch phân làn, vạch xuất phát và vạch đích ô cờ. */
function Road({ game, lane }: { game: GameState; lane: number }) {
  const count = game.teams.length;
  const cell = cellWidth(game.trackLength);
  const active = game.phase.kind === "finished" ? -1 : game.current;

  return (
    <svg
      className="absolute"
      style={{ left: LABEL_WIDTH, top: KERB }}
      width={ROAD_WIDTH}
      height={LANES_HEIGHT}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="race-checker"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <rect width="24" height="24" fill="#ffffff" />
          <rect width="12" height="12" fill="#0b0f26" />
          <rect x="12" y="12" width="12" height="12" fill="#0b0f26" />
        </pattern>
      </defs>
      <rect width={ROAD_WIDTH} height={LANES_HEIGHT} fill="var(--color-nhua)" />
      {active >= 0 ? (
        <rect
          y={active * lane}
          width={ROAD_WIDTH}
          height={lane}
          fill="var(--color-nhua-sang)"
        />
      ) : null}
      {Array.from({ length: game.trackLength - 1 }, (_, k) => {
        const x = START_X + (k + 1) * cell;
        return (
          <line
            key={k}
            x1={x}
            x2={x}
            y1={0}
            y2={LANES_HEIGHT}
            stroke="rgb(255 255 255 / 0.08)"
            strokeWidth="2"
          />
        );
      })}
      {Array.from({ length: count - 1 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={ROAD_WIDTH}
          y1={(i + 1) * lane}
          y2={(i + 1) * lane}
          stroke="var(--color-vang)"
          strokeOpacity="0.6"
          strokeWidth="3"
          strokeDasharray="28 20"
        />
      ))}
      <rect
        x={START_X - 3}
        width="6"
        height={LANES_HEIGHT}
        fill="#ffffff"
        opacity="0.85"
      />
      <rect
        x={FINISH_X}
        width="24"
        height={LANES_HEIGHT}
        fill="url(#race-checker)"
      />
    </svg>
  );
}

function Ruler({ trackLength }: { trackLength: number }) {
  const cell = cellWidth(trackLength);
  const at = (x: number): CSSProperties => ({ left: LABEL_WIDTH + x });
  return (
    <div
      className="absolute inset-x-0 bottom-0 text-label text-on-cham-soft"
      style={{ height: RULER }}
      aria-hidden="true"
    >
      <span className="absolute top-1 -translate-x-1/2" style={at(START_X)}>
        Xuất phát
      </span>
      {Array.from({ length: trackLength - 1 }, (_, k) => (
        <span
          key={k}
          className="absolute top-1 -translate-x-1/2 tabular-nums"
          style={at(START_X + (k + 1) * cell)}
        >
          {k + 1}
        </span>
      ))}
      <span
        className="absolute top-1 font-bold text-vang"
        style={at(FINISH_X)}
      >
        Đích
      </span>
    </div>
  );
}
