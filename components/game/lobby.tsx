"use client";

import type { ReactNode } from "react";
import { BrocadeBand } from "@/components/art/brocade-band";
import { DeckLink } from "./deck-link";
import {
  estimateMinutes,
  MAX_TEAMS,
  MIN_TEAMS,
  roundOf,
  type GameState,
  type PumpId,
} from "./engine";
import { PumpGlyph } from "./pump";
import { PUMPS, TEAM_COLORS } from "./palette";
import {
  ANSWER_SECONDS,
  MAX_NAME_LENGTH,
  TRACK_LENGTHS,
  updateSettings,
  type Settings,
} from "./stores";

/* Khoảng trắng không ngắt (U+00A0) giữ số đi liền với đơn vị khi xuống dòng. */
const RULES: Record<PumpId, string> = {
  e5: "Đúng thì nhận 1 lít, tiến 1 ô.",
  ron95: "Đúng thì nhận 2 lít, tiến 2 ô. Câu hỏi khó hơn.",
  mystery:
    "May rủi: câu hỏi khó (+3 ô), Nitro, cướp xăng, nổ lốp hoặc gặp cảnh sát.",
};

/** Sảnh chờ: MC chia đội, chọn độ dài đường đua rồi bấm bắt đầu. */
export function Lobby({
  settings,
  saved,
  onStart,
  onResume,
  onReview,
}: {
  settings: Settings;
  saved: GameState | null;
  onStart: () => void;
  onResume: () => void;
  onReview: () => void;
}) {
  const names = settings.teamNames;
  const resumable = saved !== null && saved.phase.kind !== "finished";
  const reviewable = saved !== null && saved.phase.kind === "finished";

  function setCount(count: number) {
    const next = Array.from(
      { length: count },
      (_, i) => names[i] ?? `Đội ${i + 1}`,
    );
    updateSettings({ teamNames: next });
  }

  return (
    <div className="absolute inset-0 bg-cham">
      <BrocadeBand id="band-lobby" className="absolute inset-x-0 top-0" />

      <section className="absolute top-36 left-32 w-220">
        <p className="text-lead font-bold text-on-cham-soft">
          Trò chơi ôn tập MLN131
        </p>
        <h1 className="mt-6 text-display font-extrabold">
          Đường đua
          <br />
          tiếp nhiên liệu
        </h1>
        <p className="mt-8 text-lead text-on-cham-soft">
          Gieo xúc xắc chọn thứ tự, rồi mỗi lượt một bạn của đội lên chọn cây
          xăng và trả lời câu hỏi. Đội về đích trước thắng.
        </p>
        <dl className="mt-12 space-y-6">
          {PUMPS.map((pump) => (
            <div key={pump.id} className="flex items-center gap-6">
              <span className="shrink-0">
                <PumpGlyph pump={pump} size={52} />
              </span>
              <dt className="w-36 shrink-0 text-lead font-extrabold">
                {pump.name}
              </dt>
              <dd className="text-body text-pretty">{RULES[pump.id]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <DeckLink className="absolute bottom-10 left-32 text-label text-on-cham-soft underline underline-offset-4 hover:text-on-cham">
        Quay lại bài thuyết trình
      </DeckLink>

      <section
        aria-label="Cài đặt ván chơi"
        className="absolute top-36 right-32 flex w-180 flex-col rounded-4xl bg-nhua p-10"
      >
        <Row label="Số đội">
          <div className="flex items-center gap-5">
            <RoundButton
              label="Bớt một đội"
              disabled={names.length <= MIN_TEAMS}
              onClick={() => setCount(names.length - 1)}
            >
              −
            </RoundButton>
            <span className="w-10 text-center text-lead font-extrabold tabular-nums">
              {names.length}
            </span>
            <RoundButton
              label="Thêm một đội"
              disabled={names.length >= MAX_TEAMS}
              onClick={() => setCount(names.length + 1)}
            >
              +
            </RoundButton>
          </div>
        </Row>

        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
          {names.map((name, i) => (
            <label key={i} className="flex items-center gap-3">
              <span
                className="h-12 w-3 shrink-0 rounded-full"
                style={{ background: TEAM_COLORS[i] }}
              />
              <span className="sr-only">Tên đội {i + 1}</span>
              <input
                name={`team-${i + 1}`}
                value={name}
                maxLength={MAX_NAME_LENGTH}
                placeholder={`Đội ${i + 1}`}
                onChange={(event) =>
                  updateSettings({
                    teamNames: names.map((item, j) =>
                      j === i ? event.target.value : item,
                    ),
                  })
                }
                className="w-full min-w-0 rounded-xl bg-dem px-4 py-2 text-body font-semibold text-on-cham select-text outline-none placeholder:text-on-cham-soft/60 focus:ring-3 focus:ring-vang"
              />
            </label>
          ))}
        </div>

        <Row label="Đường đua" className="mt-8">
          <Segmented
            options={TRACK_LENGTHS.map((length) => ({
              value: length,
              label: `${length} ô`,
            }))}
            value={settings.trackLength}
            onChange={(trackLength) => updateSettings({ trackLength })}
          />
        </Row>
        <p className="mt-2 text-right text-label text-on-cham-soft">
          Khoảng {estimateMinutes(names.length, settings.trackLength)} phút với{" "}
          {names.length} đội
        </p>

        <Row label="Đếm giờ" className="mt-5">
          <Segmented
            options={ANSWER_SECONDS.map((seconds) => ({
              value: seconds,
              label: seconds === null ? "Tắt" : `${seconds} giây`,
            }))}
            value={settings.answerSeconds}
            onChange={(answerSeconds) => updateSettings({ answerSeconds })}
          />
        </Row>

        <Row label="Âm thanh" className="mt-6">
          <button
            type="button"
            role="switch"
            aria-checked={settings.sound}
            aria-label="Âm thanh"
            onClick={() => updateSettings({ sound: !settings.sound })}
            className={`relative h-12 w-22 cursor-pointer rounded-full transition-colors focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-vang ${settings.sound ? "bg-vang" : "bg-dem"}`}
          >
            <span
              className={`absolute top-1 left-1 size-10 rounded-full bg-paper transition-transform ${settings.sound ? "translate-x-10" : ""}`}
            />
          </button>
        </Row>

        <div className="mt-12 space-y-4">
          {resumable ? (
            <>
              <BigButton onClick={onResume} primary>
                {saved.phase.kind === "dice"
                  ? "Chơi tiếp: đang gieo xúc xắc"
                  : `Chơi tiếp ván đang dở (vòng ${roundOf(saved)})`}
              </BigButton>
              <BigButton onClick={onStart}>Bắt đầu ván mới</BigButton>
            </>
          ) : (
            <BigButton onClick={onStart} primary>
              Bắt đầu đua
            </BigButton>
          )}
          {reviewable ? (
            <button
              type="button"
              onClick={onReview}
              className="w-full cursor-pointer text-center text-label text-on-cham-soft underline underline-offset-4 hover:text-on-cham"
            >
              Xem lại kết quả ván trước
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      <p className="text-body font-bold">{label}</p>
      {children}
    </div>
  );
}

function Segmented<T>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" className="flex gap-1 rounded-2xl bg-dem p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-xl px-4 py-2 text-label font-bold whitespace-nowrap transition-colors focus-visible:outline-3 focus-visible:outline-vang ${selected ? "bg-vang text-cham" : "text-on-cham hover:bg-cham"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function RoundButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-14 cursor-pointer place-items-center rounded-full border-3 border-on-cham-soft/50 text-heading leading-none font-bold transition-colors hover:bg-cham disabled:cursor-default disabled:opacity-30 focus-visible:outline-3 focus-visible:outline-vang"
    >
      {children}
    </button>
  );
}

function BigButton({
  primary = false,
  onClick,
  children,
}: {
  primary?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-2xl font-extrabold transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang ${
        primary
          ? "bg-son py-6 text-heading text-paper hover:bg-[#a51217]"
          : "border-3 border-on-cham-soft/50 py-4 text-lead hover:bg-cham"
      }`}
    >
      {children}
    </button>
  );
}
