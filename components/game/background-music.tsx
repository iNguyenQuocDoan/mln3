"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { clampMusicVolume, GAME_AUDIO } from "./audio-config";
import { isMusicDucked, subscribeMusicDuck } from "./game-audio";

/** Thao tác hợp lệ đầu tiên của người dùng — đủ để trình duyệt cho phát tiếng. */
const GESTURES = ["pointerdown", "keydown", "touchstart"] as const;

const MUSIC = GAME_AUDIO.background;

/**
 * Nhạc nền của /tro-choi: đúng MỘT phần tử audio trong suốt vòng đời route
 * (tạo khi mount, không phụ thuộc pha / lượt / ván), phát lặp, âm lượng nhẹ.
 * Trình duyệt chặn autoplay thì không báo lỗi — chờ cú bấm/phím đầu tiên rồi
 * phát. Tắt nhạc là tạm dừng, bật lại phát tiếp từ chỗ cũ. Rời route thì dừng
 * và tua về đầu. Nhạc tự hạ khi có SFX mạnh và trong màn chiến thắng.
 *
 * Kèm cụm điều khiển nhỏ ở góc: 🎵 nhạc nền (+ thanh âm lượng) và 🔊 SFX.
 */
export function GameBackgroundMusic({
  on,
  volume,
  winnerShown,
  sfxOn,
  onToggle,
  onVolumeChange,
  onToggleSfx,
}: {
  on: boolean;
  volume: number;
  /** Màn chiến thắng đang mở: nhạc nền hạ xuống thật nhỏ cho tiếng chiến thắng. */
  winnerShown: boolean;
  sfxOn: boolean;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleSfx: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** Giá trị mới nhất của `on`, cho trình nghe thao tác người dùng đọc. */
  const wantPlay = useRef(on);
  const ducked = useSyncExternalStore(subscribeMusicDuck, isMusicDucked, () => false);

  useEffect(() => {
    const audio = new Audio(MUSIC.src);
    audio.loop = MUSIC.loop;
    audio.preload = "auto";
    audioRef.current = audio;

    const removeGestureListeners = () => {
      for (const name of GESTURES) window.removeEventListener(name, playOnGesture, true);
    };
    function playOnGesture() {
      if (!wantPlay.current || !audio.paused) return;
      audio.play().then(removeGestureListeners, () => {});
    }
    for (const name of GESTURES) window.addEventListener(name, playOnGesture, true);

    return () => {
      removeGestureListeners();
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let level = clampMusicVolume(volume);
    if (winnerShown) level = Math.min(level, MUSIC.winnerVolume);
    else if (ducked) level *= MUSIC.duckFactor;
    audio.volume = level;
  }, [volume, winnerShown, ducked]);

  useEffect(() => {
    wantPlay.current = on;
    const audio = audioRef.current;
    if (!audio) return;
    if (!on) {
      audio.pause();
      return;
    }
    // Có thể bị chặn autoplay: bỏ qua, trình nghe thao tác sẽ phát lại sau.
    audio.play().catch(() => {});
  }, [on]);

  const toggle =
    "grid h-11 cursor-pointer place-items-center rounded-full px-2 text-[26px] transition-colors hover:bg-on-cham/10 focus-visible:outline-3 focus-visible:outline-vang";

  return (
    <div className="absolute top-9 right-36 z-[60] flex items-center gap-2 rounded-full bg-nhua/80 py-1.5 pr-3 pl-1.5 ring-1 ring-on-cham-soft/30">
      <button
        type="button"
        onClick={onToggle}
        aria-label={on ? "Tắt nhạc nền" : "Bật nhạc nền"}
        title={on ? "Tắt nhạc nền" : "Bật nhạc nền"}
        className={`${toggle} ${on ? "" : "opacity-40 grayscale"}`}
      >
        🎵
      </button>
      <input
        type="range"
        min={0}
        max={MUSIC.maxVolume}
        step={0.01}
        value={clampMusicVolume(volume)}
        disabled={!on}
        onChange={(event) => onVolumeChange(clampMusicVolume(Number(event.target.value)))}
        aria-label="Âm lượng nhạc nền"
        className="w-24 cursor-pointer accent-vang disabled:cursor-not-allowed disabled:opacity-40"
      />
      <span className="h-7 w-px bg-on-cham-soft/30" aria-hidden="true" />
      <button
        type="button"
        onClick={onToggleSfx}
        aria-label={sfxOn ? "Tắt hiệu ứng âm thanh" : "Bật hiệu ứng âm thanh"}
        title={sfxOn ? "Tắt hiệu ứng âm thanh (M)" : "Bật hiệu ứng âm thanh (M)"}
        className={toggle}
      >
        {sfxOn ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
