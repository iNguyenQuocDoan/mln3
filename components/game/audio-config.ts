/**
 * Toàn bộ âm thanh của /tro-choi ở một chỗ: nhạc nền và hiệu ứng (SFX).
 * Âm lượng là mức gốc của từng file; SFX được nhân thêm `SFX_MASTER_VOLUME`
 * để nhạc nền + hiệu ứng luôn nhẹ, không át giọng người thuyết trình.
 * Thay âm thanh: đặt file mp3 khác cùng tên vào public/assets/game/sounds/.
 */
export const GAME_AUDIO = {
  background: {
    src: "/assets/game/musics/background.mp3",
    volume: 0.15,
    /** Thanh âm lượng nhạc nền không cho vượt mức này khi trình chiếu. */
    maxVolume: 0.3,
    loop: true,
    /** Nhạc nền hạ xuống mức này trong màn chiến thắng. */
    winnerVolume: 0.05,
    /** Hệ số hạ nhạc nền tạm thời khi có SFX mạnh (về đích, tấn công, đổi chỗ). */
    duckFactor: 0.5,
  },
  sfx: {
    moveStep: { src: "/assets/game/sounds/move-step.mp3", volume: 0.2, duck: false },
    moveForward: { src: "/assets/game/sounds/move-forward.mp3", volume: 0.35, duck: false },
    moveBackward: { src: "/assets/game/sounds/move-backward.mp3", volume: 0.4, duck: false },
    attack: { src: "/assets/game/sounds/attack.mp3", volume: 0.45, duck: true },
    swap: { src: "/assets/game/sounds/swap.mp3", volume: 0.4, duck: true },
    cardFlip: { src: "/assets/game/sounds/card-flip.mp3", volume: 0.35, duck: false },
    correct: { src: "/assets/game/sounds/correct.mp3", volume: 0.35, duck: false },
    wrong: { src: "/assets/game/sounds/wrong.mp3", volume: 0.3, duck: false },
    gift: { src: "/assets/game/sounds/gift.mp3", volume: 0.35, duck: false },
    finish: { src: "/assets/game/sounds/finish.mp3", volume: 0.45, duck: true },
    victory: { src: "/assets/game/sounds/victory.mp3", volume: 0.55, duck: false },
  },
} as const;

export type SfxName = keyof typeof GAME_AUDIO.sfx;

/** Hệ số chung cho mọi SFX: âm lượng thực = volume của file × hệ số này. */
export const SFX_MASTER_VOLUME = 0.8;

export function clampMusicVolume(volume: number): number {
  if (!Number.isFinite(volume)) return GAME_AUDIO.background.volume;
  return Math.min(Math.max(volume, 0), GAME_AUDIO.background.maxVolume);
}
