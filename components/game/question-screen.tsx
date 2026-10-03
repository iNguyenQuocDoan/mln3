"use client";

import { useEffect, useEffectEvent, useState } from "react";
import {
  ANSWER_SECONDS,
  ANSWER_WARNING_SECONDS,
  DICE_WHEN_CORRECT,
  DICE_WHEN_WRONG,
} from "@/content/game-balance";
import { FINISH_POSITION, tileAt } from "@/content/game-board";
import type { GameQuestion, OptionId } from "@/content/game-questions";
import { currentTeam, optionOrder, shownLetter, type GameState } from "./engine";
import { sfx } from "./game-audio";
import { teamDef } from "./palette";
import { TeamAvatar } from "./team-piece";

/*
 * Câu hỏi chiếm trọn màn hình để cả lớp đọc được từ cuối phòng. Hiện khi đến
 * lượt trả lời (pha "question"), đồng hồ đếm ngược ANSWER_SECONDS giây; chấm
 * xong (pha "waiting-roll") vẫn giữ lại để mọi người thấy đáp án đúng. MC bấm
 * nút lắc thì màn này đóng, xúc xắc lăn trên bàn cờ.
 */

const DIFFICULTY_LABEL = { easy: "Dễ", medium: "Vừa", hard: "Khó" } as const;

/** Cỡ vòng đồng hồ; dấu đúng/sai hiện đúng chỗ này khi chấm xong. */
const RING = 176;
const STROKE = 14;
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Đỏ sáng cho chữ trên nền tối (màu son gốc quá tối để đọc). */
const ALERT = "#ff6b6f";

/** Xanh lá sáng cho chữ "Chính xác" trên nền tối. */
const SUCCESS = "#4fd88a";

export function QuestionScreen({
  game,
  question,
  onPick,
  onTimeUp,
  onGoThrow,
}: {
  game: GameState;
  question: GameQuestion;
  onPick: (option: OptionId) => void;
  onTimeUp: () => void;
  /** Đóng màn câu hỏi, ra bàn cờ để đội tự ném xúc xắc. */
  onGoThrow: () => void;
}) {
  const phase = game.phase;
  const answered = phase.kind === "waiting-roll" ? phase : null;
  const team = currentTeam(game);
  const def = teamDef(team.id);
  const verdict = answered
    ? answered.correct
      ? "right"
      : answered.picked === null
        ? "timeout"
        : "wrong"
    : null;

  return (
    <div className="absolute inset-0 z-[45] flex flex-col bg-dem text-on-cham">
      <header
        className="flex h-[124px] shrink-0 items-center gap-6 pr-24 pl-12"
        style={{ background: def.color, color: def.ink }}
      >
        <TeamAvatar teamId={team.id} size={92} />
        <div className="min-w-0 flex-1">
          <p className="text-[56px] leading-none font-extrabold">{def.name}</p>
          <p className="mt-2 text-[28px] leading-none font-semibold opacity-85">{whereText(team.position)}</p>
        </div>
        <p className="text-[32px] font-bold">Câu {game.usedQuestionIds.length}</p>
        <span className="rounded-full bg-black/15 px-5 py-1 text-[28px] font-bold">
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </header>

      <div key={question.id} className="panel-in flex min-h-0 flex-1 flex-col px-24 pt-12 pb-11">
        <div className="flex items-start gap-14">
          <h2
            className={`flex-1 leading-[1.14] font-extrabold text-pretty ${
              question.question.length > 80 ? "text-[62px]" : "text-[68px]"
            }`}
          >
            {question.question}
          </h2>
          {verdict ? <Verdict kind={verdict} /> : <Countdown seconds={ANSWER_SECONDS} onTimeUp={onTimeUp} />}
        </div>

        <ul className="mt-11 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-7">
          {shownOptions(game, question).map(({ letter, option }) => {
            const isRight = option.id === question.correctAnswer;
            const state = !answered
              ? "idle"
              : isRight
                ? "right"
                : answered.picked === option.id
                  ? "wrong"
                  : "dim";
            return (
              <li key={letter} className="min-h-0">
                <button
                  type="button"
                  disabled={answered !== null}
                  onClick={() => onPick(option.id)}
                  className={`flex size-full cursor-pointer items-center gap-7 rounded-[28px] px-9 py-5 text-left transition-[opacity,box-shadow] duration-300 disabled:cursor-default focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang ${OPTION_CLASS[state]}`}
                >
                  <span
                    className={`grid size-20 shrink-0 place-items-center rounded-2xl text-[46px] leading-none font-extrabold ${LETTER_CLASS[state]}`}
                  >
                    {letter}
                  </span>
                  <span className="text-[44px] leading-[1.2] font-semibold text-pretty">{option.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <footer className="mt-10 flex h-24 shrink-0 items-center justify-between gap-10">
          {answered ? (
            <>
              <div className="min-w-0">
                <p
                  className="text-[48px] leading-none font-extrabold"
                  style={{ color: answered.correct ? SUCCESS : ALERT }}
                >
                  {verdictText(verdict, shownLetter(game, question.id, question.correctAnswer))}
                </p>
                <p className="mt-3 text-[30px] leading-none text-on-cham-soft">
                  {answered.correct ? "Được lắc" : "Vẫn được lắc"} {answered.plan.dice} xúc xắc
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={onGoThrow}
                className="shrink-0 cursor-pointer rounded-[24px] bg-son px-12 py-6 text-[40px] leading-none font-extrabold text-paper transition-colors hover:bg-[#a51217] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
              >
                Lắc {answered.plan.dice} xúc xắc
              </button>
            </>
          ) : (
            <p className="text-[32px] leading-snug text-on-cham-soft">
              Đúng được lắc {DICE_WHEN_CORRECT} xúc xắc, sai hoặc hết giờ vẫn được lắc {DICE_WHEN_WRONG}.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

/** Bốn đáp án theo thứ tự đã trộn của ván này, kèm chữ cái đang hiện (A–D). */
function shownOptions(game: GameState, question: GameQuestion) {
  const letters: OptionId[] = ["A", "B", "C", "D"];
  return optionOrder(game, question.id).flatMap((id, i) => {
    const option = question.options.find((o) => o.id === id);
    return option ? [{ letter: letters[i], option }] : [];
  });
}

type OptionState = "idle" | "right" | "wrong" | "dim";

const OPTION_CLASS: Record<OptionState, string> = {
  idle: "bg-paper text-cham hover:shadow-[0_0_0_6px_#e3b44b]",
  right: "bg-la text-paper shadow-[0_0_0_6px_#4fd88a]",
  wrong: "bg-son text-paper",
  dim: "bg-paper text-cham opacity-30",
};

const LETTER_CLASS: Record<OptionState, string> = {
  idle: "bg-cham text-paper",
  right: "bg-paper text-la",
  wrong: "bg-paper text-son",
  dim: "bg-cham text-paper",
};

/** "Đang ở Huế, còn 19 ô tới đích." */
function whereText(position: number): string {
  const tile = tileAt(position);
  const place = tile.type === "start" ? "ô Khởi hành" : tile.name;
  return `Đang ở ${place}, còn ${FINISH_POSITION - position} ô tới đích`;
}

function verdictText(verdict: "right" | "wrong" | "timeout" | null, correctAnswer: OptionId): string {
  if (verdict === "right") return "Chính xác";
  if (verdict === "timeout") return `Hết giờ, đáp án đúng là ${correctAnswer}`;
  return `Chưa đúng, đáp án đúng là ${correctAnswer}`;
}

/**
 * Đồng hồ đếm ngược: vòng vàng rút dần, mấy giây cuối chuyển đỏ và kêu tích
 * tắc. Hết giờ thì gọi `onTimeUp` đúng một lần. Gắn lại (đổi câu, hoàn tác)
 * thì đếm lại từ đầu.
 */
function Countdown({ seconds, onTimeUp }: { seconds: number; onTimeUp: () => void }) {
  const total = seconds * 1000;
  const [left, setLeft] = useState(total);
  const timeUp = useEffectEvent(onTimeUp);

  useEffect(() => {
    const start = performance.now();
    let shown = Math.ceil(total / 1000);
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, total - (performance.now() - start));
      setLeft(remaining);
      const whole = Math.ceil(remaining / 1000);
      if (whole !== shown) {
        shown = whole;
        if (whole > 0 && whole <= ANSWER_WARNING_SECONDS) sfx.tick(whole === 1);
      }
      if (remaining === 0) {
        window.clearInterval(timer);
        timeUp();
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [total]);

  const whole = Math.ceil(left / 1000);
  const warning = whole <= ANSWER_WARNING_SECONDS;
  const color = warning ? ALERT : "#e3b44b";
  return (
    <div
      role="timer"
      aria-label={`Còn ${whole} giây`}
      className="relative grid shrink-0 place-items-center"
      style={{ width: RING, height: RING }}
    >
      <svg viewBox={`0 0 ${RING} ${RING}`} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          fill="none"
          stroke="rgb(255 255 255 / 0.12)"
          strokeWidth={STROKE}
        />
        <circle
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - left / total)}
          style={{ transition: "stroke-dashoffset 100ms linear, stroke 300ms" }}
        />
      </svg>
      <span
        key={warning ? whole : "calm"}
        className={`text-[76px] leading-none font-extrabold tabular-nums ${warning ? "timer-beat" : ""}`}
        style={{ color: warning ? color : undefined }}
      >
        {whole}
      </span>
    </div>
  );
}

/** Dấu chấm điểm thay chỗ đồng hồ: đúng, sai hoặc hết giờ. */
function Verdict({ kind }: { kind: "right" | "wrong" | "timeout" }) {
  const label = kind === "right" ? "Trả lời đúng" : kind === "wrong" ? "Trả lời sai" : "Hết giờ";
  return (
    <div
      role="img"
      aria-label={label}
      className={`verdict-pop grid shrink-0 place-items-center rounded-full ${kind === "right" ? "bg-la" : "bg-son"}`}
      style={{ width: RING, height: RING }}
    >
      <svg
        viewBox="0 0 48 48"
        className="size-24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {kind === "right" ? <path d="M11 25.5l8.5 8.5L37 15" /> : null}
        {kind === "wrong" ? <path d="M15 15l18 18M33 15L15 33" /> : null}
        {kind === "timeout" ? (
          <>
            <circle cx="24" cy="24" r="16" />
            <path d="M24 15v10l6 4" />
          </>
        ) : null}
      </svg>
    </div>
  );
}
