"use client";

import {
  useEffect,
  useEffectEvent,
  useState,
  type CSSProperties,
} from "react";
import { PUMP_LITERS, type Phase, type Question } from "./engine";
import { LETTERS, pumpInfo } from "./palette";
import { sfx } from "./sound";

type QuestionPhase = Extract<Phase, { kind: "question" | "answered" }>;

/**
 * Câu hỏi hiện trên "màn hình cột bơm": viền mang màu cây xăng đã chọn.
 * Trả lời xong, phần đồng hồ ở chân thẻ đổi thành kết quả và lời giải thích.
 */
export function QuestionPanel({
  phase,
  question,
  teamName,
  seconds,
  onAnswer,
  onTimeout,
  onContinue,
}: {
  phase: QuestionPhase;
  question: Question;
  teamName: string;
  seconds: number | null;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
  onContinue: () => void;
}) {
  const pump = pumpInfo(phase.pump);
  const liters = PUMP_LITERS[phase.pump];
  const answered = phase.kind === "answered" ? phase : null;
  // Đáp án đã được xáo cho lượt này: ô i hiện đáp án gốc options[i].
  const shown = phase.options.map((original) => question.answers[original]);
  const rightSlot = phase.options.indexOf(question.correct);
  const singleColumn = shown.some((text) => text.length > 30);

  return (
    <div className="fade-in absolute inset-0 z-30 grid place-items-center bg-dem/70 backdrop-blur-[3px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-text"
        className="panel-in w-410 rounded-[40px] bg-(--pump) p-5"
        style={{ "--pump": pump.color } as CSSProperties}
      >
        <header
          className="flex items-baseline justify-between px-7 pt-2 pb-5"
          style={{ color: pump.ink }}
        >
          <p className="text-lead font-extrabold">{pump.station}</p>
          <p className="text-body font-semibold">
            {teamName} trả lời, đúng được {liters} lít
          </p>
        </header>

        <div className="rounded-[28px] bg-paper px-14 pt-10 pb-9 text-cham">
          <h2 id="question-text" className="text-heading font-bold text-pretty">
            {question.question}
          </h2>

          <div
            className={`mt-8 grid gap-4 ${singleColumn ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {shown.map((text, i) => (
              <AnswerButton
                key={i}
                index={i}
                text={text}
                state={
                  !answered
                    ? "open"
                    : i === rightSlot
                      ? "right"
                      : i === answered.picked
                        ? "wrong"
                        : "faded"
                }
                onPick={() => onAnswer(i)}
              />
            ))}
          </div>

          <footer className="mt-8 flex min-h-36 items-center gap-10 border-t-2 border-cham-line pt-7">
            {answered ? (
              <Verdict
                correct={answered.correct}
                timedOut={answered.picked === null}
                liters={liters}
                rightLetter={LETTERS[rightSlot]}
                question={question}
                onContinue={onContinue}
              />
            ) : seconds ? (
              <Countdown seconds={seconds} onTimeout={onTimeout} />
            ) : (
              <p className="text-body text-cham-soft">
                Không giới hạn thời gian. Bấm vào đáp án bạn chọn.
              </p>
            )}
          </footer>
        </div>
      </section>
    </div>
  );
}

const ANSWER_STYLES = {
  open: "cursor-pointer border-transparent bg-cham-tint hover:border-cham",
  right: "border-la bg-la text-paper",
  wrong: "border-son bg-son text-paper",
  faded: "border-transparent bg-cham-tint opacity-40",
};

const LETTER_STYLES = {
  open: "bg-cham text-paper",
  right: "bg-paper text-la",
  wrong: "bg-paper text-son",
  faded: "bg-cham text-paper",
};

function AnswerButton({
  index,
  text,
  state,
  onPick,
}: {
  index: number;
  text: string;
  state: keyof typeof ANSWER_STYLES;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={state !== "open"}
      onClick={onPick}
      className={`flex items-center gap-6 rounded-2xl border-4 px-6 py-4 text-left text-lead font-semibold transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cham ${ANSWER_STYLES[state]}`}
    >
      <span
        className={`grid size-15 shrink-0 place-items-center rounded-xl text-heading font-extrabold ${LETTER_STYLES[state]}`}
      >
        {LETTERS[index]}
      </span>
      <span>{text}</span>
    </button>
  );
}

function Countdown({
  seconds,
  onTimeout,
}: {
  seconds: number;
  onTimeout: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  const expire = useEffectEvent(onTimeout);

  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const remaining = seconds - Math.round((Date.now() - started) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        expire();
      } else if (remaining <= 5) {
        sfx.tick();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const urgent = left <= 5;
  return (
    <div className="flex flex-1 items-center gap-10">
      <div
        className="relative h-7 flex-1 overflow-hidden rounded-full bg-cham-tint"
        role="timer"
        aria-label={`Còn ${Math.max(left, 0)} giây`}
      >
        <div
          className={`timer-drain absolute inset-0 origin-left rounded-full ${urgent ? "bg-son" : "bg-(--pump)"}`}
          style={{ animationDuration: `${seconds}s` }}
        />
      </div>
      <p
        className={`w-56 text-right text-banner font-extrabold tabular-nums ${urgent ? "text-son" : ""}`}
      >
        {Math.max(left, 0)}
        <span className="text-lead font-bold"> giây</span>
      </p>
    </div>
  );
}

function Verdict({
  correct,
  timedOut,
  liters,
  rightLetter,
  question,
  onContinue,
}: {
  correct: boolean;
  timedOut: boolean;
  liters: number;
  /** Chữ cái của ô đang chứa đáp án đúng (sau khi xáo). */
  rightLetter: string;
  question: Question;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="anim-swap min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-6">
          <span
            className={`text-banner font-extrabold ${correct ? "text-la" : "text-son"}`}
          >
            {correct ? "Chính xác!" : timedOut ? "Hết giờ!" : "Chưa đúng"}
          </span>
          <span className="text-lead font-bold">
            {correct
              ? `+${liters} lít xăng`
              : `Đáp án đúng: ${rightLetter}`}
          </span>
        </p>
        <p className="mt-2 text-body text-cham-soft">
          {question.explain}{" "}
          <span className="whitespace-nowrap">({question.source})</span>
        </p>
      </div>
      <button
        type="button"
        autoFocus
        onClick={onContinue}
        className="shrink-0 cursor-pointer rounded-2xl bg-cham px-12 py-5 text-lead font-bold text-paper transition-colors hover:bg-cham-soft focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-cham"
      >
        {correct ? "Đổ xăng" : "Lượt sau"}
      </button>
    </>
  );
}
