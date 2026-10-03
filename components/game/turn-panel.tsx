"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { tileAt, type BoardTile } from "@/content/game-board";
import { ANSWER_SECONDS, DICE_WHEN_CORRECT, DICE_WHEN_WRONG } from "@/content/game-balance";
import { cardById, type CardId } from "@/content/game-cards";
import { questionById, type OptionId } from "@/content/game-questions";
import { CARD_BACK_SRC, MAX_TEAMS, MIN_TEAMS } from "@/content/game-teams";
import { DiceRow } from "./dice";
import {
  currentTeam,
  diceMove,
  nextTeam,
  shownLetter,
  type GameState,
  type TeamId,
  type TurnOutcome,
} from "./engine";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

/*
 * Cột "lượt chơi" bên trái màn hình: thanh tên đội đang chơi (màu đội) và
 * thẻ nội dung nền giấy trắng — chữ chàm trên nền sáng đọc rõ nhất khi chiếu
 * lên TV. Thẻ đổi nội dung theo pha của ván; mọi nút bấm đều gọi về
 * board-game.tsx (nơi duy nhất cập nhật ván chơi).
 */

export type TurnActions = {
  onSetTeamCount: (count: number) => void;
  onStart: () => void;
  onShowIntro: () => void;
  onPick: (option: OptionId) => void;
  /** Hết giờ trả lời mà chưa chọn: tính như trả lời sai. */
  onTimeUp: () => void;
  /** Mở lại màn câu hỏi (trước khi ném). */
  onShowQuestion: () => void;
  onPickCard: (index: number) => void;
  onApplyCard: () => void;
  onChooseTarget: (teamId: TeamId) => void;
  onContinue: () => void;
  onPlayAgain: () => void;
  onShowWinner: () => void;
};

const PRIMARY =
  "cursor-pointer rounded-2xl bg-son px-9 py-4 text-[32px] leading-none font-extrabold text-paper transition-colors hover:bg-[#a51217] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-4 focus-visible:outline-offset-3 focus-visible:outline-cham";
const SECONDARY =
  "cursor-pointer rounded-2xl px-7 py-4 text-[28px] leading-none font-bold text-cham ring-2 ring-cham-line transition-colors hover:bg-cham-tint focus-visible:outline-4 focus-visible:outline-offset-3 focus-visible:outline-cham";

/** Thanh trên cùng: đội đang chơi (hoặc tên trò chơi khi chưa vào lượt). */
export function TurnBanner({ game, winnerId }: { game: GameState; winnerId: TeamId | null }) {
  if (game.phase.kind === "not-started") {
    return (
      <header className="flex h-24 items-center rounded-[28px] bg-nhua-sang px-8">
        <p className="text-[44px] leading-none font-extrabold text-on-cham">Đường đua đại đoàn kết</p>
      </header>
    );
  }
  const teamId = winnerId ?? currentTeam(game).id;
  const def = teamDef(teamId);
  return (
    <header
      className="flex h-24 items-center gap-5 rounded-[28px] pr-8 pl-3"
      style={{ background: def.color, color: def.ink }}
    >
      <TeamAvatar teamId={teamId} size={76} />
      <div className="flex-1">
        <p className="text-[24px] leading-none font-semibold opacity-85">
          {winnerId ? "Về đích đầu tiên" : "Đến lượt"}
        </p>
        <p className="mt-1 text-[52px] leading-none font-extrabold">{def.name}</p>
      </div>
      {winnerId ? null : (
        <p className="text-right text-[26px] leading-tight font-bold opacity-85">
          Lượt {game.usedQuestionIds.length}
        </p>
      )}
    </header>
  );
}

/** Thẻ nội dung theo pha của ván. `busy`: đang chờ xúc xắc 3D lăn xong. */
export function TurnCard({
  game,
  landed,
  stepsTaken,
  busy,
  winnerDismissed,
  actions,
}: {
  game: GameState;
  landed: boolean;
  /** Số ô quân cờ đã đi trong lượt đang chạy hoạt ảnh. */
  stepsTaken: number;
  busy: boolean;
  winnerDismissed: boolean;
  actions: TurnActions;
}) {
  const phase = game.phase;
  let content: ReactNode;
  switch (phase.kind) {
    case "not-started":
      content = <SetupContent game={game} actions={actions} />;
      break;
    case "question":
    case "waiting-roll":
      content = <AnswerContent game={game} busy={busy} actions={actions} />;
      break;
    case "rolling":
    case "moving":
      content = <MoveContent game={game} landed={landed} stepsTaken={stepsTaken} />;
      break;
    case "card-selection":
    case "card-result":
      content = (
        <CardContent
          cards={phase.cards}
          chosenIndex={phase.kind === "card-result" ? phase.cardIndex : null}
          actions={actions}
        />
      );
      break;
    case "target-selection":
      content = (
        <TargetContent game={game} cardId={phase.cardId} candidates={phase.candidates} actions={actions} />
      );
      break;
    case "turn-complete":
      content = <SummaryContent game={game} outcome={phase.outcome} actions={actions} />;
      break;
    case "game-over":
      content = <GameOverContent game={game} winnerDismissed={winnerDismissed} actions={actions} />;
      break;
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[28px] bg-paper px-8 py-7 text-cham shadow-[0_24px_60px_-20px_rgb(0_0_0_/_0.6)]">
      {content}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chuẩn bị ván                                                        */
/* ------------------------------------------------------------------ */

function SetupContent({ game, actions }: { game: GameState; actions: TurnActions }) {
  const counts = Array.from({ length: MAX_TEAMS - MIN_TEAMS + 1 }, (_, i) => MIN_TEAMS + i);
  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[40px] leading-tight font-extrabold">Số đội chơi</h2>
      <div className="mt-4 grid grid-cols-4 gap-3" role="radiogroup" aria-label="Số đội chơi">
        {counts.map((count) => {
          const selected = game.teams.length === count;
          return (
            <button
              key={count}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => actions.onSetTeamCount(count)}
              className={`cursor-pointer rounded-2xl py-4 text-[34px] leading-none font-extrabold transition-colors focus-visible:outline-4 focus-visible:outline-offset-3 focus-visible:outline-cham ${
                selected ? "bg-cham text-paper" : "bg-cham-tint text-cham hover:bg-cham-line"
              }`}
            >
              {count} đội
            </button>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-3">
        {game.teams.map((team) => {
          const def = teamDef(team.id);
          return (
            <li
              key={team.id}
              className="flex items-center gap-2 rounded-full py-1.5 pr-5 pl-1.5 text-[28px] font-extrabold"
              style={{ background: def.color, color: def.ink }}
            >
              <TeamAvatar teamId={team.id} size={46} />
              {def.name}
            </li>
          );
        })}
      </ul>

      <ol className="mt-7 flex flex-col gap-2.5 text-[28px] leading-snug">
        <Step n={1}>{teamDef(game.teams[0].id).name} đi trước, các đội đi lần lượt.</Step>
        <Step n={2}>
          Mỗi câu có {ANSWER_SECONDS} giây. Đúng được lắc {DICE_WHEN_CORRECT} xúc xắc, sai hoặc hết giờ vẫn
          được lắc {DICE_WHEN_WRONG}.
        </Step>
        <Step n={3}>Dừng ở ô có hộp quà thì được mở một thẻ.</Step>
        <Step n={4}>Đội về đích đầu tiên thắng.</Step>
      </ol>

      <div className="mt-auto flex items-center gap-4 pt-6">
        <button type="button" autoFocus onClick={actions.onStart} className={PRIMARY}>
          Bắt đầu
        </button>
        <button type="button" onClick={actions.onShowIntro} className={SECONDARY}>
          Xem luật chơi
        </button>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cham text-[24px] font-extrabold text-paper tabular-nums">
        {n}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Đã trả lời, chờ ném                                                 */
/* ------------------------------------------------------------------ */

/**
 * Câu hỏi hiện toàn màn hình (question-screen.tsx). Thẻ này chỉ lộ ra khi
 * màn câu hỏi đóng lại để đội tự ném xúc xắc trên bàn cờ.
 */
function AnswerContent({ game, busy, actions }: { game: GameState; busy: boolean; actions: TurnActions }) {
  const phase = game.phase;
  const name = teamDef(currentTeam(game).id).name;
  if (phase.kind !== "waiting-roll") {
    return (
      <div className="panel-in flex h-full flex-col">
        <h2 className="text-[44px] leading-tight font-extrabold">{name} đang trả lời</h2>
      </div>
    );
  }
  const question = questionById(phase.questionId);
  const answer = question ? shownLetter(game, question.id, question.correctAnswer) : "";
  const rolling = busy || phase.thrown === true;
  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[44px] leading-tight font-extrabold">
        {rolling ? `${name} đang ném` : `${name} ném ${phase.plan.dice} xúc xắc`}
      </h2>
      <p className="mt-2 text-[30px] leading-snug text-cham-soft">
        {phase.correct
          ? "Trả lời đúng."
          : phase.picked === null
            ? `Hết giờ, đáp án đúng là ${answer}.`
            : `Chưa đúng, đáp án đúng là ${answer}.`}
      </p>
      <div className="mt-auto flex flex-col items-start gap-4 pt-6">
        <ThrowPrompt name={name} rolling={rolling} />
        {rolling ? null : (
          <button type="button" onClick={actions.onShowQuestion} className={SECONDARY}>
            Xem lại câu hỏi
          </button>
        )}
      </div>
    </div>
  );
}

/** Lời nhắc ném xúc xắc trên bàn cờ (người chơi tự ném, không có nút lắc hộ). */
function ThrowPrompt({ name, rolling }: { name: string; rolling: boolean }) {
  return (
    <p className="rounded-2xl bg-cham-tint px-6 py-4 text-[30px] leading-snug font-bold">
      {rolling
        ? `${name} đang ném`
        : `Mời ${name} ném xúc xắc trên bàn cờ: nhấn giữ để lắc, kéo rồi thả tay.`}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Đang lắc / đang đi                                                  */
/* ------------------------------------------------------------------ */

function MoveContent({ game, landed, stepsTaken }: { game: GameState; landed: boolean; stepsTaken: number }) {
  const phase = game.phase;
  const def = teamDef(currentTeam(game).id);
  const roll = game.lastRoll;
  const rolling = phase.kind === "rolling" && !phase.physical;
  const total = roll ? roll.values.reduce((sum, v) => sum + v, 0) : 0;
  const move = rolling ? null : diceMove(game);

  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[44px] leading-tight font-extrabold">
        {rolling ? "Đang lắc xúc xắc" : headline(game, landed, total)}
      </h2>
      {roll ? (
        <div className="mt-6">
          <DiceRow
            count={roll.values.length}
            values={roll.values}
            rolling={rolling}
            color={def.color}
            size={110}
          />
        </div>
      ) : null}
      {roll && move ? (
        <MoveDistance
          values={roll.values}
          total={move.total}
          steps={move.to - move.from}
          taken={stepsTaken}
          stop={tileAt(move.to)}
          color={def.color}
        />
      ) : null}
    </div>
  );
}

/** Tiêu đề lúc quân cờ di chuyển: theo nước đi bằng xúc xắc hay bằng thẻ. */
function headline(game: GameState, landed: boolean, total: number): string {
  const phase = game.phase;
  const actor = teamDef(currentTeam(game).id).name;
  if (phase.kind !== "moving") return `${actor} tiến ${total} ô`;
  if (phase.moves.length === 2) {
    const [a, b] = phase.moves.map((m) => teamDef(m.teamId).name);
    return `${a} và ${b} đổi chỗ`;
  }
  const move = phase.moves[0];
  const tile = tileAt(move.to);
  if (phase.cause === "dice") {
    if (!landed) return `${actor} tiến ${total} ô`;
    if (tile.type === "finish") return `${actor} về đích`;
    return phase.next.kind === "card-selection" ? `Dừng ở ${tile.name}, mở hộp quà` : `Dừng ở ${tile.name}`;
  }
  const delta = move.to - move.from;
  const mover = teamDef(move.teamId).name;
  return `${mover} ${delta > 0 ? "tiến" : "lùi"} ${Math.abs(delta)} ô`;
}

/** "Lắc được 4 và 5: đi 9 ô." */
function rollSentence(values: number[]): string {
  const faces =
    values.length === 1 ? `${values[0]}` : `${values.slice(0, -1).join(", ")} và ${values.at(-1)}`;
  const total = values.reduce((sum, v) => sum + v, 0);
  return `Lắc được ${faces}: đi ${total} ô.`;
}

/** "4 + 5": các số chấm cộng lại thành quãng đường của lượt. */
export function moveEquation(values: number[]): string {
  return values.join(" + ");
}

/**
 * Quãng đường của lượt: tổng số ô thật to, phép cộng từ các viên xúc xắc,
 * ô sẽ dừng và thanh tiến độ "đã đi 3 / 10 ô" trong lúc quân cờ đi.
 */
function MoveDistance({
  values,
  total,
  steps,
  taken,
  stop,
  color,
}: {
  values: number[];
  total: number;
  /** Số ô thật sự đi (ít hơn `total` khi về đích sớm). */
  steps: number;
  taken: number;
  stop: BoardTile;
  color: string;
}) {
  const done = Math.min(taken, steps);
  return (
    <section className="mt-6 rounded-2xl bg-cham-tint px-6 py-5" aria-label="Quãng đường lượt này">
      <div className="flex items-baseline gap-3">
        <p className="text-[96px] leading-none font-extrabold tabular-nums">{total}</p>
        <p className="text-[40px] font-extrabold">ô</p>
        {values.length > 1 ? (
          <p className="ml-auto text-right text-[30px] font-semibold text-cham-soft">{moveEquation(values)}</p>
        ) : null}
      </div>
      <p className="mt-3 text-[28px] leading-snug font-semibold">
        {stop.type === "finish"
          ? steps < total
            ? `Về đích sau ${steps} ô`
            : "Dừng ở Đích đến"
          : `Dừng ở ${stop.name}, ô ${stop.id}`}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <div
          className="h-4 flex-1 overflow-hidden rounded-full bg-paper ring-1 ring-cham-line"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full transition-[width] duration-200"
            style={{ width: `${steps ? (done / steps) * 100 : 0}%`, background: color }}
          />
        </div>
        <p className="text-[26px] font-bold text-cham-soft tabular-nums">
          Đã đi {done} / {steps} ô
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Hộp quà: chọn một trong ba thẻ                                      */
/* ------------------------------------------------------------------ */

const CATEGORY_COLOR = {
  attack: "#c4161c",
  penalty: "#3b64c4",
  forward: "#16753f",
} as const;
const CATEGORY_LABEL = {
  attack: "Tấn công",
  penalty: "Rủi ro",
  forward: "May mắn",
} as const;

/* Tỉ lệ khung theo đúng ảnh card-back.png (442×668). */
const CARD_W = 196;
const CARD_H = Math.round((CARD_W * 668) / 442);

/** Hoạt ảnh trộn ba thẻ úp trước khi cho chọn (xem .card-shuffle trong globals.css). */
const SHUFFLE_MS = 1300;

function CardContent({
  cards,
  chosenIndex,
  actions,
}: {
  cards: readonly CardId[];
  chosenIndex: number | null;
  actions: TurnActions;
}) {
  const chosen = chosenIndex === null ? null : cardById(cards[chosenIndex]);
  // Vừa mở hộp: trộn thẻ trước mắt mọi người rồi mới cho chọn.
  const [shuffling, setShuffling] = useState(chosenIndex === null);
  useEffect(() => {
    if (!shuffling) return;
    const timer = window.setTimeout(() => setShuffling(false), SHUFFLE_MS);
    return () => window.clearTimeout(timer);
  }, [shuffling]);

  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[40px] leading-tight font-extrabold">Mở hộp quà</h2>
      <p className="mt-2 text-[28px] text-cham-soft">
        {shuffling ? "Đang trộn thẻ…" : "Chọn một trong ba thẻ úp."}
      </p>

      <div className="mt-6 flex justify-center gap-7">
        {cards.map((cardId, i) => {
          const isChosen = chosenIndex === i;
          return (
            <div key={i} className={shuffling ? `card-shuffle card-shuffle-${i}` : undefined}>
              <button
                type="button"
                disabled={chosenIndex !== null || shuffling}
                onClick={() => actions.onPickCard(i)}
                className={`flip-card cursor-pointer rounded-[20px] transition-opacity disabled:cursor-default ${
                  chosenIndex !== null && !isChosen ? "opacity-30" : ""
                }`}
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  boxShadow: isChosen
                    ? "0 0 0 4px #e3b44b, 0 18px 40px -12px rgb(28 37 83 / 0.6)"
                    : undefined,
                }}
                aria-label={`Thẻ ${i + 1}`}
              >
                <div
                  className="flip-inner relative size-full"
                  style={isChosen ? undefined : { animation: "none" }}
                >
                  <div className="flip-face absolute inset-0 overflow-hidden rounded-[20px]">
                    <Image
                      src={CARD_BACK_SRC}
                      alt="Mặt sau thẻ"
                      fill
                      unoptimized
                      loading="eager"
                      className="object-cover"
                    />
                  </div>
                  <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[20px] bg-paper p-3 text-center text-cham ring-2 ring-cham-line">
                    {isChosen ? <CardFace cardId={cardId} /> : null}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {chosen ? (
        <div className="fade-in mt-auto flex items-end justify-between gap-6 pt-6">
          <p className="text-[30px] leading-snug text-pretty">
            <span className="font-extrabold" style={{ color: CATEGORY_COLOR[chosen.category] }}>
              {chosen.name}.
            </span>{" "}
            {chosen.description}
          </p>
          <button type="button" autoFocus onClick={actions.onApplyCard} className={`${PRIMARY} shrink-0`}>
            {chosen.category === "attack" && chosen.swap !== "leader" ? "Chọn đội" : "Áp dụng"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CardFace({ cardId }: { cardId: CardId }) {
  const card = cardById(cardId);
  return (
    <>
      <span className="text-[60px] leading-none" aria-hidden="true">
        {card.icon}
      </span>
      <p className={`${card.name.length > 16 ? "text-[26px]" : "text-[32px]"} leading-tight font-extrabold`}>
        {card.name}
      </p>
      <p className="text-[26px] font-bold" style={{ color: CATEGORY_COLOR[card.category] }}>
        {card.swap ? "Đổi vị trí" : `${card.cells > 0 ? `+${card.cells}` : card.cells} ô`}
      </p>
      <p className="text-[22px] font-semibold text-cham-soft">{CATEGORY_LABEL[card.category]}</p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Chọn đội cho thẻ tấn công / đổi chỗ                                 */
/* ------------------------------------------------------------------ */

function TargetContent({
  game,
  cardId,
  candidates,
  actions,
}: {
  game: GameState;
  cardId: CardId;
  candidates: TeamId[];
  actions: TurnActions;
}) {
  const card = cardById(cardId);
  const attacker = teamDef(currentTeam(game).id).name;
  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[40px] leading-tight font-extrabold">
        {card.swap ? "Chọn đội để đổi chỗ" : `Chọn đội phải lùi ${Math.abs(card.cells)} ô`}
      </h2>
      {card.targetAheadOnly || card.swap === "leader" ? (
        <p className="mt-2 text-[28px] text-cham-soft">
          {card.targetAheadOnly
            ? `Chỉ chọn được đội đang đứng trước ${attacker}.`
            : "Có nhiều đội cùng dẫn đầu, chọn một đội."}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3">
        {game.teams
          .filter((team) => team.id !== currentTeam(game).id)
          .map((team) => {
            const def = teamDef(team.id);
            const allowed = candidates.includes(team.id);
            return (
              <button
                key={team.id}
                type="button"
                disabled={!allowed}
                onClick={() => actions.onChooseTarget(team.id)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cham"
                style={{ background: def.color, color: def.ink }}
              >
                <TeamAvatar teamId={team.id} size={52} />
                <span className="flex-1 text-[32px] font-extrabold">{def.name}</span>
                <span className="text-[26px] font-semibold opacity-85">
                  {tileAt(team.position).name}, ô {team.position}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hết lượt                                                            */
/* ------------------------------------------------------------------ */

function SummaryContent({
  game,
  outcome,
  actions,
}: {
  game: GameState;
  outcome: TurnOutcome;
  actions: TurnActions;
}) {
  const team = currentTeam(game);
  const tile = tileAt(team.position);
  const next = teamDef(nextTeam(game).id);
  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[44px] leading-tight font-extrabold">Dừng ở {tile.name}</h2>
      <p className="mt-1 text-[28px] text-cham-soft">Ô {tile.id}</p>
      <ul className="mt-6 flex flex-col gap-3 text-[30px] leading-snug">
        <li>
          {outcome.correct ? "Trả lời đúng." : outcome.timedOut ? "Hết giờ trả lời." : "Trả lời chưa đúng."}{" "}
          {rollSentence(outcome.dice)}
        </li>
        {outcome.cardId ? <li>{cardSentence(outcome)}</li> : null}
      </ul>
      <div className="mt-auto pt-6">
        <button type="button" autoFocus onClick={actions.onContinue} className={PRIMARY}>
          Đến lượt {next.name}
        </button>
      </div>
    </div>
  );
}

function cardSentence(outcome: TurnOutcome): string {
  if (!outcome.cardId) return "";
  const card = cardById(outcome.cardId);
  const target = outcome.targetId ? teamDef(outcome.targetId).name : null;
  if (card.swap)
    return target ? `Mở hộp quà: ${card.name}, đổi chỗ với ${target}.` : `Mở hộp quà: ${card.name}.`;
  if (card.category === "attack") {
    return target
      ? `Mở hộp quà: ${card.name}, ${target} lùi ${Math.abs(card.cells)} ô.`
      : `Mở hộp quà: ${card.name}, nhưng không có đội nào để chọn.`;
  }
  return `Mở hộp quà: ${card.name}, ${card.cells > 0 ? "tiến" : "lùi"} ${Math.abs(card.cells)} ô.`;
}

/* ------------------------------------------------------------------ */
/* Kết thúc ván                                                        */
/* ------------------------------------------------------------------ */

function GameOverContent({
  game,
  winnerDismissed,
  actions,
}: {
  game: GameState;
  winnerDismissed: boolean;
  actions: TurnActions;
}) {
  const phase = game.phase;
  if (phase.kind !== "game-over") return null;
  const winner = teamDef(phase.winnerId);
  return (
    <div className="panel-in flex h-full flex-col">
      <h2 className="text-[48px] leading-tight font-extrabold" style={{ color: winner.color }}>
        {winner.name} chiến thắng
      </h2>
      <p className="mt-2 text-[30px] leading-snug text-cham-soft">
        {phase.reason === "questions-exhausted"
          ? "Đã dùng hết câu hỏi. Đội đang dẫn đầu được tính là đội thắng."
          : `${winner.name} về đích đầu tiên sau ${game.usedQuestionIds.length} lượt.`}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-6">
        <button type="button" autoFocus onClick={actions.onPlayAgain} className={PRIMARY}>
          Chơi ván mới
        </button>
        {winnerDismissed ? (
          <button type="button" onClick={actions.onShowWinner} className={SECONDARY}>
            Xem màn chiến thắng
          </button>
        ) : null}
      </div>
    </div>
  );
}
