"use client";

import { useMemo, useSyncExternalStore } from "react";
import { QUESTION_POOL } from "@/content/game-questions";
import { createGame, isGameState, teamOf, type GameState, type TeamId } from "./engine";
import { clampMusicVolume, GAME_AUDIO } from "./audio-config";

/*
 * Ván chơi được giữ trong bộ nhớ của trang và chép sang localStorage: lỡ
 * tải lại trang vẫn chơi tiếp được. Cũng lưu ở localStorage: các câu đã hỏi
 * qua nhiều ván (ván mới hỏi câu chưa ra trước) và kết quả các ván đã chơi.
 * Nếu trình duyệt chặn localStorage thì vẫn chơi bình thường, chỉ không giữ
 * được qua lần tải lại.
 */

type Store<T> = {
  subscribe(listener: () => void): () => void;
  snapshot(): string | null;
  decode(text: string | null): T | null;
  get(): T | null;
  set(value: T | null): void;
};

function createStore<T>(key: string, parse: (value: unknown) => T | null): Store<T> {
  let raw: string | null | undefined;
  const listeners = new Set<() => void>();

  function snapshot(): string | null {
    if (raw === undefined) {
      try {
        raw = window.localStorage.getItem(key);
      } catch {
        raw = null;
      }
    }
    return raw;
  }

  function decode(text: string | null): T | null {
    if (text === null) return null;
    try {
      return parse(JSON.parse(text));
    } catch {
      return null;
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    snapshot,
    decode,
    get: () => decode(snapshot()),
    set(value) {
      raw = value === null ? null : JSON.stringify(value);
      try {
        if (raw === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, raw);
      } catch {
        // Bộ nhớ trình duyệt bị chặn: vẫn giữ trong phiên hiện tại.
      }
      listeners.forEach((listener) => listener());
    },
  };
}

function useStore<T>(store: Store<T>): T | null {
  const text = useSyncExternalStore(store.subscribe, store.snapshot, () => null);
  return useMemo(() => store.decode(text), [store, text]);
}

// v7: thêm mã ván và thứ tự câu hỏi trộn sẵn — ván lưu theo bản cũ bị bỏ qua.
const gameStore = createStore<GameState>("mln131-board-game-v7", (value) =>
  isGameState(value) ? value : null,
);

/** Câu đã hỏi ở các ván trước (chưa hết một vòng ngân hàng câu hỏi). */
const askedStore = createStore<string[]>("mln131-asked-questions", (value) =>
  Array.isArray(value) && value.every((id) => typeof id === "string") ? value : null,
);

/** Kết quả một ván đã kết thúc, lưu lại để xem sau khi chơi ván mới. */
export type GameRecord = {
  id: string;
  /** Thời điểm kết thúc (ms kể từ 1/1/1970). */
  finishedAt: number;
  reason: "finish" | "questions-exhausted";
  /** Số lượt (số câu hỏi đã ra) của ván. */
  turns: number;
  /** Thứ hạng chung cuộc, đội thắng đứng đầu. */
  ranking: { teamId: TeamId; position: number; correct: number }[];
};

/** Giữ kết quả của chừng này ván gần nhất. */
export const HISTORY_LIMIT = 50;
const NO_RECORDS: GameRecord[] = [];

function isRecordList(value: unknown): value is GameRecord[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.finishedAt === "number" &&
        typeof item.turns === "number" &&
        Array.isArray(item.ranking) &&
        item.ranking.length > 0,
    )
  );
}

const historyStore = createStore<GameRecord[]>("mln131-game-history", (value) =>
  isRecordList(value) ? value : null,
);

export type Settings = {
  /** Hiệu ứng âm thanh (xúc xắc, đúng/sai, lật thẻ…). */
  sound: boolean;
  /** Nhạc nền — bật/tắt riêng với hiệu ứng. */
  music: boolean;
  musicVolume: number;
};
const DEFAULT_SETTINGS: Settings = {
  sound: true,
  music: true,
  musicVolume: GAME_AUDIO.background.volume,
};

function parseSettings(value: unknown): Settings | null {
  if (typeof value !== "object" || value === null) return null;
  const input = value as Record<string, unknown>;
  return {
    sound: typeof input.sound === "boolean" ? input.sound : DEFAULT_SETTINGS.sound,
    music: typeof input.music === "boolean" ? input.music : DEFAULT_SETTINGS.music,
    musicVolume:
      typeof input.musicVolume === "number"
        ? clampMusicVolume(input.musicVolume)
        : DEFAULT_SETTINGS.musicVolume,
  };
}

const settingsStore = createStore<Settings>("mln131-board-settings", parseSettings);

export function useGame(): GameState | null {
  return useStore(gameStore);
}

export function useSettings(): Settings {
  return useStore(settingsStore) ?? DEFAULT_SETTINGS;
}

/** Kết quả các ván đã chơi, ván cũ nhất đứng đầu. */
export function useGameHistory(): GameRecord[] {
  return useStore(historyStore) ?? NO_RECORDS;
}

/**
 * Mở /tro-choi lần đầu: tạo sẵn ván "chưa bắt đầu" (câu hỏi trộn, hộp quà
 * rải ngẫu nhiên); có ván đang dở thì giữ.
 */
export function ensureGame() {
  if (!gameStore.get()) gameStore.set(createGame(undefined, Math.random, askedStore.get() ?? []));
}

/**
 * Chơi ván mới (cùng số đội): câu hỏi được trộn lại, câu đã hỏi ở các ván
 * trước xếp xuống cuối. Hỏi hết cả ngân hàng thì sang vòng mới, chỉ còn
 * tránh các câu của ván vừa chơi.
 */
export function startNewGame(teamCount?: number) {
  const previous = gameStore.get();
  const justAsked = previous?.usedQuestionIds ?? [];
  const asked = [...new Set([...(askedStore.get() ?? []), ...justAsked])];
  const roundDone = QUESTION_POOL.every((question) => asked.includes(question.id));
  const avoid = roundDone ? justAsked : asked;
  askedStore.set(avoid);
  gameStore.set(createGame(teamCount ?? previous?.teams.length, Math.random, avoid));
  clearUndoHistory();
}

/** Xóa kết quả các ván đã chơi và danh sách câu đã hỏi (ván đang chơi giữ nguyên). */
export function clearGameHistory() {
  historyStore.set(null);
  askedStore.set(null);
}

/** Ván vừa kết thúc: ghi vào lịch sử (hoàn tác rồi kết thúc lại thì ghi đè đúng ván đó). */
function recordFinishedGame(state: GameState) {
  if (state.phase.kind !== "game-over") return;
  const record: GameRecord = {
    id: state.id,
    finishedAt: Date.now(),
    reason: state.phase.reason,
    turns: state.usedQuestionIds.length,
    ranking: state.phase.ranking.map((teamId) => {
      const team = teamOf(state, teamId);
      return { teamId, position: team.position, correct: team.correctAnswers };
    }),
  };
  const others = (historyStore.get() ?? []).filter((item) => item.id !== state.id);
  historyStore.set([...others, record].slice(-HISTORY_LIMIT));
}

export function updateSettings(change: Partial<Settings>) {
  settingsStore.set({
    ...(settingsStore.get() ?? DEFAULT_SETTINGS),
    ...change,
  });
}

/*
 * Hoàn tác: giữ một ngăn xếp các trạng thái trước đó trong bộ nhớ của tab
 * (không cần lưu localStorage — chỉ dùng để sửa thao tác bấm nhầm vừa rồi).
 */
const UNDO_LIMIT = 20;
let undoStack: GameState[] = [];

/**
 * Áp một bước luật chơi lên ván đang lưu; trả về trạng thái mới. Các bước
 * tự động (xúc xắc dừng, hoạt ảnh chạy xong) gọi với `record: false` để
 * không chiếm chỗ trong lịch sử hoàn tác — Undo luôn quay về trước một
 * thao tác thật của MC (đổ xúc xắc, chọn đáp án, chọn thẻ, chọn mục tiêu).
 */
export function updateGame(
  step: (state: GameState) => GameState,
  { record = true }: { record?: boolean } = {},
): GameState | null {
  const current = gameStore.get();
  if (!current) return null;
  const next = step(current);
  if (next === current) return next;
  if (record) undoStack = [...undoStack.slice(-(UNDO_LIMIT - 1)), current];
  gameStore.set(next);
  if (next.phase.kind === "game-over" && current.phase.kind !== "game-over") recordFinishedGame(next);
  return next;
}

export function hasUndo(): boolean {
  return undoStack.length > 0;
}

/**
 * Khôi phục trạng thái ngay trước thao tác gần nhất. Danh sách câu đã dùng
 * thì giữ nguyên (hợp với trạng thái hiện tại): câu nào đã lộ ra màn hình
 * thì không bao giờ được hỏi lại, kể cả sau khi hoàn tác.
 */
export function undo(): GameState | null {
  const previous = undoStack.pop();
  if (!previous) return null;
  const current = gameStore.get();
  const used = new Set([...previous.usedQuestionIds, ...(current?.usedQuestionIds ?? [])]);
  const restored = { ...previous, usedQuestionIds: [...used] };
  gameStore.set(restored);
  return restored;
}

export function clearUndoHistory() {
  undoStack = [];
}
