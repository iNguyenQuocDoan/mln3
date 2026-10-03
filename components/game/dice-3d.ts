"use client";

/*
 * Xúc xắc 3D (thư viện @3d-dice/dice-box: BabylonJS vẽ, AmmoJS mô phỏng vật
 * lý). Xúc xắc được ném lên lớp phủ trên bàn cờ; số chấm do vật lý quyết định
 * và được trả về cho luật chơi (engine nhận đúng các số này). Người chơi tự
 * ném (throw-hand.tsx): hướng kéo, tốc độ thả tay và thời gian giữ để lắc
 * quyết định xúc xắc bay từ đâu, mạnh và xoáy tới mức nào.
 *
 * Thư viện chỉ chạy trong trình duyệt nên được nạp bằng `import()` lúc cần.
 * Máy không có WebGL hoặc nạp lỗi: `rollDice3d` trả về null và trò chơi
 * dùng xúc xắc 2D như trước — không bao giờ làm kẹt lượt chơi.
 *
 * Tệp vật lý và giao diện xúc xắc nằm ở public/assets/dice-box/ (chép từ
 * node_modules/@3d-dice/dice-box/dist/assets).
 */

type DiceRollResult = { value: number };

/** Cú ném của người chơi: hướng trên màn hình, độ mạnh và độ xoáy (0–1). */
export type ThrowAim = {
  /** Hướng ném, x sang phải, y xuống dưới (không cần chuẩn hóa). */
  dx: number;
  dy: number;
  power: number;
  spin: number;
};

type DiceBoxInstance = {
  init(): Promise<unknown>;
  roll(
    notation: string,
    options?: { themeColor?: string; newStartPoint?: boolean },
  ): Promise<DiceRollResult[]>;
  updateConfig(options: Record<string, unknown>): unknown;
  clear(): unknown;
  show(): unknown;
  hide(className?: string): unknown;
};

/** id của lớp phủ chứa canvas xúc xắc (xem DiceTray trong board-game.tsx). */
export const DICE_TRAY_ID = "dice-tray";

/** Xúc xắc nằm yên trên bàn thêm một lúc để khán giả đọc số rồi mới biến mất. */
const SHOW_RESULT_MS = 1300;

/** Quá thời gian này mà xúc xắc chưa dừng thì coi như lỗi, dùng xúc xắc 2D. */
const ROLL_TIMEOUT_MS = 9000;

/*
 * Toạ độ vật lý của dice-box: khay vuông cạnh 9,5 (mép ở ±4,75), xúc xắc thả
 * từ độ cao 8 và bay về phía tâm với vận tốc tỉ lệ `throwForce`. Muốn xúc xắc
 * bay theo hướng người chơi kéo thì cho xuất phát ở mép đối diện.
 */
const TRAY_EDGE = 4;
const DROP_HEIGHT = 8;
/** Chiều trục vật lý so với màn hình (đo thử: x vật lý ngược chiều màn hình, z cùng chiều xuống dưới). */
const WORLD_X = -1;
const WORLD_Z = 1;

/** Cấu hình dice-box cho một cú ném: điểm xuất phát trên mép khay, lực và độ xoáy. */
function throwConfig(aim: ThrowAim): Record<string, unknown> {
  const reach = Math.max(Math.abs(aim.dx), Math.abs(aim.dy)) || 1;
  return {
    startPosition: [
      (-aim.dx / reach) * TRAY_EDGE * WORLD_X,
      DROP_HEIGHT,
      (-aim.dy / reach) * TRAY_EDGE * WORLD_Z,
    ],
    throwForce: 3 + aim.power * 6,
    spinForce: 3 + aim.spin * 8,
  };
}

let boxPromise: Promise<DiceBoxInstance | null> | null = null;
let hideTimer: number | undefined;

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Nạp và khởi động dice-box một lần cho cả trang; lỗi thì trả về null. */
export function loadDiceBox(): Promise<DiceBoxInstance | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (boxPromise) return boxPromise;
  boxPromise = (async () => {
    if (!canUseWebGL() || !document.getElementById(DICE_TRAY_ID)) return null;
    try {
      const { default: DiceBox } = await import("@3d-dice/dice-box");
      const box = new DiceBox({
        container: `#${DICE_TRAY_ID}`,
        assetPath: "/assets/dice-box/",
        theme: "default",
        scale: 8,
        settleTimeout: 4000,
      }) as DiceBoxInstance;
      await box.init();
      box.hide("dice-tray--hidden");
      return box;
    } catch (error) {
      console.warn("[dice-3d] Không khởi động được xúc xắc 3D, dùng xúc xắc 2D:", error);
      return null;
    }
  })();
  return boxPromise;
}

/**
 * Ném `count` viên D6 màu `color` lên bàn theo cú ném `aim` và chờ chúng dừng
 * hẳn. Trả về số chấm từng viên; null nếu không dùng được xúc xắc 3D.
 */
export async function rollDice3d(count: number, color: string, aim: ThrowAim): Promise<number[] | null> {
  const box = await loadDiceBox();
  if (!box) return null;
  window.clearTimeout(hideTimer);
  try {
    await box.updateConfig(throwConfig(aim));
    box.show();
    const results = await Promise.race([
      box.roll(`${count}d6`, { themeColor: color, newStartPoint: false }),
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), ROLL_TIMEOUT_MS)),
    ]);
    if (!results || results.length !== count) {
      box.clear();
      box.hide("dice-tray--hidden");
      return null;
    }
    hideTimer = window.setTimeout(() => {
      box.hide("dice-tray--hidden");
      window.setTimeout(() => box.clear(), 600);
    }, SHOW_RESULT_MS);
    return results.map((die) => Math.min(6, Math.max(1, Math.round(die.value))));
  } catch (error) {
    console.warn("[dice-3d] Lỗi khi đổ xúc xắc 3D, dùng xúc xắc 2D:", error);
    return null;
  }
}
