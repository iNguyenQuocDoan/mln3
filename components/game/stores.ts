"use client";

import { useMemo, useSyncExternalStore } from "react";
import { isGameState, MAX_TEAMS, MIN_TEAMS, type GameState } from "./engine";

/*
 * Ván chơi và cài đặt được giữ trong bộ nhớ của trang và chép sang
 * localStorage: lỡ tải lại trang hoặc quay về slide rồi vào lại vẫn chơi
 * tiếp được. Nếu trình duyệt chặn localStorage thì vẫn chơi bình thường,
 * chỉ không giữ được qua lần tải lại.
 */

type Store<T> = {
  subscribe(listener: () => void): () => void;
  /** Chuỗi JSON đang lưu; giữ nguyên tham chiếu khi dữ liệu không đổi. */
  snapshot(): string | null;
  decode(text: string | null): T | null;
  get(): T | null;
  set(value: T | null): void;
};

function createStore<T>(
  key: string,
  parse: (value: unknown) => T | null,
): Store<T> {
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

export type Settings = {
  teamNames: string[];
  trackLength: number;
  /** null: không đếm giờ. */
  answerSeconds: number | null;
  sound: boolean;
};

export const TRACK_LENGTHS = [6, 8, 10, 12];
export const ANSWER_SECONDS: (number | null)[] = [15, 20, 30, null];
export const MAX_NAME_LENGTH = 16;

export const DEFAULT_SETTINGS: Settings = {
  teamNames: ["Đội 1", "Đội 2", "Đội 3", "Đội 4"],
  trackLength: 10,
  answerSeconds: 20,
  sound: true,
};

function parseSettings(value: unknown): Settings | null {
  if (typeof value !== "object" || value === null) return null;
  const input = value as Record<string, unknown>;
  const names = input.teamNames;
  return {
    teamNames:
      Array.isArray(names) &&
      names.length >= MIN_TEAMS &&
      names.length <= MAX_TEAMS &&
      names.every((name) => typeof name === "string")
        ? names.map((name) => name.slice(0, MAX_NAME_LENGTH))
        : DEFAULT_SETTINGS.teamNames,
    trackLength: TRACK_LENGTHS.includes(input.trackLength as number)
      ? (input.trackLength as number)
      : DEFAULT_SETTINGS.trackLength,
    answerSeconds: ANSWER_SECONDS.includes(input.answerSeconds as number | null)
      ? (input.answerSeconds as number | null)
      : DEFAULT_SETTINGS.answerSeconds,
    sound: typeof input.sound === "boolean" ? input.sound : true,
  };
}

const gameStore = createStore<GameState>("mln131-race-game", (value) =>
  isGameState(value) ? value : null,
);

const settingsStore = createStore<Settings>(
  "mln131-race-settings",
  parseSettings,
);

/*
 * Những câu đã hỏi ở các ván trước (câu mới nhất ở cuối), để ván sau hỏi
 * trước những câu chưa gặp. Nhớ khoảng nửa ngân hàng câu hỏi.
 */
const RECENT_LIMIT = 50;

const recentStore = createStore<string[]>("mln131-race-recent", (value) =>
  Array.isArray(value) && value.every((id) => typeof id === "string")
    ? value
    : null,
);

export function readRecent(): string[] {
  return recentStore.get() ?? [];
}

export function rememberAsked(questionId: string) {
  const list = readRecent().filter((id) => id !== questionId);
  list.push(questionId);
  recentStore.set(list.slice(-RECENT_LIMIT));
}

/** Ván đang lưu (null nếu chưa có hoặc dữ liệu hỏng). */
export function useGame(): GameState | null {
  return useStore(gameStore);
}

export function useSettings(): Settings {
  return useStore(settingsStore) ?? DEFAULT_SETTINGS;
}

export function readGame(): GameState | null {
  return gameStore.get();
}

export function saveGame(state: GameState | null) {
  gameStore.set(state);
}

/** Áp một bước luật chơi lên ván đang lưu; trả về trạng thái mới. */
export function updateGame(
  step: (state: GameState) => GameState,
): GameState | null {
  const current = gameStore.get();
  if (!current) return null;
  const next = step(current);
  if (next !== current) gameStore.set(next);
  return next;
}

export function updateSettings(change: Partial<Settings>) {
  settingsStore.set({
    ...(settingsStore.get() ?? DEFAULT_SETTINGS),
    ...change,
  });
}
