"use client";

import type { GameQuestion, OptionId } from "@/content/game-questions";

const DIFFICULTY_LABEL = { easy: "Dễ", medium: "Vừa", hard: "Khó" } as const;

/**
 * Câu hỏi mở đầu mỗi lượt, TRƯỚC xúc xắc. Người chơi bấm thẳng A/B/C/D, hệ
 * thống tự chấm: bốn đáp án khóa lại, đáp án đã chọn và đáp án đúng được tô
 * màu. Chỉ khi đúng mới hiện nút đổ xúc xắc; sai thì đứng yên và hết lượt —
 * chờ MC bấm "TIẾP TỤC → ĐỘI n".
 */
export function QuestionPanel({
  question,
  teamName,
  teamColor,
  teamInk,
  picked,
  correct,
  continueLabel,
  onPick,
  onRoll,
  onContinue,
}: {
  question: GameQuestion;
  teamName: string;
  teamColor: string;
  teamInk: string;
  /** null: chưa chọn đáp án. */
  picked: OptionId | null;
  correct: boolean | null;
  /** Nhãn nút sang lượt sau, ví dụ "TIẾP TỤC → ĐỘI 3". */
  continueLabel: string;
  onPick: (option: OptionId) => void;
  /** Trả lời đúng: đổ xúc xắc ngay. */
  onRoll: () => void;
  /** Trả lời sai: MC bấm để sang lượt đội kế tiếp. */
  onContinue: () => void;
}) {
  const locked = picked !== null;
  const right = question.options.find((o) => o.id === question.correctAnswer);

  return (
    <div className="panel-in flex w-[730px] flex-col rounded-[28px] bg-dem/96 p-7 shadow-2xl ring-2 ring-on-cham-soft/30">
      <div className="flex items-center justify-between gap-4">
        <p
          className="rounded-full px-5 py-1 text-label font-extrabold whitespace-nowrap uppercase"
          style={{ background: teamColor, color: teamInk }}
        >
          Lượt hiện tại · {teamName}
        </p>
        <p className="text-label font-bold tracking-wide text-on-cham-soft uppercase">
          Câu hỏi · Mức {DIFFICULTY_LABEL[question.difficulty]}
        </p>
      </div>

      <h2 className="mt-3 text-body leading-snug font-extrabold text-pretty">{question.question}</h2>

      <ul className="mt-5 grid auto-rows-fr grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isPicked = picked === option.id;
          const isRight = option.id === question.correctAnswer;
          const state = !locked ? "idle" : isRight ? "right" : isPicked ? "wrong" : "dim";
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onPick(option.id)}
                className={`flex h-full w-full cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 text-left text-label leading-snug font-semibold ring-2 transition-colors disabled:cursor-default ${
                  state === "right"
                    ? "bg-la/30 text-la-sang ring-la-sang"
                    : state === "wrong"
                      ? "bg-son/30 text-[#ffb3ad] ring-son"
                      : state === "dim"
                        ? "bg-on-cham/5 text-on-cham-soft ring-transparent"
                        : "bg-on-cham/8 ring-on-cham-soft/25 hover:bg-on-cham/15 hover:ring-vang"
                }`}
              >
                <span className="font-extrabold">{option.id}.</span>
                <span>{option.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex min-h-16 items-center justify-between gap-4">
        {locked ? (
          <div>
            <p className="text-lead font-extrabold" style={{ color: correct ? "#4fd88a" : "#ff6b5e" }}>
              {correct ? "✅ CHÍNH XÁC" : "❌ CHƯA CHÍNH XÁC"}
            </p>
            {correct ? (
              <p className="text-label font-bold">{teamName.toUpperCase()} ĐƯỢC QUYỀN DI CHUYỂN</p>
            ) : right ? (
              <>
                <p className="text-label text-on-cham-soft">
                  Đáp án đúng: {right.id}. {right.text}
                </p>
                <p className="text-label font-bold">{teamName.toUpperCase()} KHÔNG ĐƯỢC DI CHUYỂN</p>
              </>
            ) : null}
          </div>
        ) : (
          <p className="text-label text-on-cham-soft">Trả lời đúng mới được đổ xúc xắc. Chọn A, B, C hoặc D.</p>
        )}
        {locked && correct ? (
          <button
            type="button"
            autoFocus
            onClick={onRoll}
            className="shrink-0 cursor-pointer rounded-2xl bg-son px-7 py-3 text-body font-extrabold text-paper transition-colors hover:bg-[#a51217]"
          >
            🎲 ĐỔ XÚC XẮC
          </button>
        ) : null}
        {locked && !correct ? (
          <button
            type="button"
            autoFocus
            onClick={onContinue}
            className="shrink-0 cursor-pointer rounded-2xl bg-vang px-7 py-3 text-body font-extrabold text-cham transition-colors hover:bg-on-cham"
          >
            {continueLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
