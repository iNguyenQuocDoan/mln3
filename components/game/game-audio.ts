"use client";

import { GAME_AUDIO, SFX_MASTER_VOLUME, type SfxName } from "./audio-config";

/*
 * Hiệu ứng âm thanh (SFX) của /tro-choi — độc lập với nhạc nền.
 *
 * - Mỗi hiệu ứng đúng MỘT phần tử audio, tạo một lần rồi dùng lại (phát lại
 *   từ đầu nếu đang kêu); không bao giờ tạo audio mới trong lúc render.
 * - `preloadSfx()` nạp sẵn khi mở route để lần đổ xúc xắc đầu không bị trễ.
 * - File thiếu / lỗi: chỉ console.warn một lần, game vẫn chạy bình thường.
 * - SFX CHỈ LÀ PHẢN HỒI: không có trình nghe "ended" nào đụng tới ván chơi.
 */

const cache = new Map<SfxName, HTMLAudioElement>();
const warned = new Set<SfxName>();
let muted = false;

export function setSfxMuted(value: boolean) {
  muted = value;
  if (value) stopAllSfx();
}

function warnOnce(name: SfxName, reason: unknown) {
  if (warned.has(name)) return;
  warned.add(name);
  console.warn(`[game-audio] Không phát được "${GAME_AUDIO.sfx[name].src}":`, reason);
}

function element(name: SfxName): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;
  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(GAME_AUDIO.sfx[name].src);
    audio.preload = "auto";
    audio.addEventListener("error", () => warnOnce(name, audio?.error?.message || "tải file thất bại"));
    cache.set(name, audio);
  }
  return audio;
}

/** Nạp sẵn mọi file SFX (không phát). */
export function preloadSfx() {
  for (const name of Object.keys(GAME_AUDIO.sfx) as SfxName[]) element(name);
}

/** Dừng mọi SFX đang kêu (tắt SFX, rời route). */
export function stopAllSfx() {
  for (const audio of cache.values()) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function playSfx(name: SfxName) {
  if (muted) return;
  const audio = element(name);
  if (!audio) return;
  const config = GAME_AUDIO.sfx[name];
  audio.volume = Math.min(1, config.volume * SFX_MASTER_VOLUME);
  audio.currentTime = 0;
  audio.play().then(
    () => {
      if (config.duck) duckMusicFor(Number.isFinite(audio.duration) ? audio.duration * 1000 : 1200);
    },
    (error: unknown) => {
      // Trình duyệt chưa cho phát (chưa có thao tác người dùng): bỏ qua lặng lẽ.
      if (error instanceof DOMException && error.name === "NotAllowedError") return;
      warnOnce(name, error);
    },
  );
}

/** Các hành động chính → hiệu ứng tương ứng (xem SOUND EVENT MAP). */
export const sfx = {
  dice: () => playSfx("diceRoll"),
  moveStep: () => playSfx("moveStep"),
  forward: () => playSfx("moveForward"),
  backward: () => playSfx("moveBackward"),
  attack: () => playSfx("attack"),
  swap: () => playSfx("swap"),
  cardFlip: () => playSfx("cardFlip"),
  correct: () => playSfx("correct"),
  wrong: () => playSfx("wrong"),
  gift: () => playSfx("gift"),
  finish: () => playSfx("finish"),
  victory: () => playSfx("victory"),
};

/* ---------------- Hạ nhạc nền tạm thời khi có SFX mạnh ---------------- */

let duckCount = 0;
const duckListeners = new Set<() => void>();

function duckMusicFor(ms: number) {
  duckCount++;
  duckListeners.forEach((listener) => listener());
  window.setTimeout(() => {
    duckCount--;
    duckListeners.forEach((listener) => listener());
  }, ms);
}

export function isMusicDucked(): boolean {
  return duckCount > 0;
}

export function subscribeMusicDuck(listener: () => void): () => void {
  duckListeners.add(listener);
  return () => {
    duckListeners.delete(listener);
  };
}
