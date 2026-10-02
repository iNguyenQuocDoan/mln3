"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createGame, isGameState, type GameState } from "./engine";
import { clampMusicVolume, GAME_AUDIO } from "./audio-config";

/*
 * Ván chơi được giữ trong bộ nhớ của trang và chép sang localStorage: lỡ
 * tải lại trang vẫn chơi tiếp được. Nếu trình duyệt chặn localStorage thì
 * vẫn chơi bình thường, chỉ không giữ được qua lần tải lại.
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

const gameStore = createStore<GameState>("mln131-board-game-v5", (value) =>
  isGameState(value) ? value : null,
);

export type Settings = {
  /** Hiệu ứng âm thanh (xúc xắc, đúng/sai, lật thẻ…). */
  sound: boolean;
  /** Nhạc nền — bật/tắt riêng với hiệu ứng. */
  music: boolean;
  musicVolume: number;
};
const DEFAULT_SETTINGS: Settings = { sound: true, music: true, musicVolume: GAME_AUDIO.background.volume };

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

export function saveGame(state: GameState | null) {
  gameStore.set(state);
}

/** Mở /tro-choi lần đầu: tạo sẵn ván "chưa bắt đầu"; có ván đang dở thì giữ. */
export function ensureGame() {
  if (!gameStore.get()) gameStore.set(createGame());
}

export function updateSettings(change: Partial<Settings>) {
  settingsStore.set({ ...(settingsStore.get() ?? DEFAULT_SETTINGS), ...change });
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
