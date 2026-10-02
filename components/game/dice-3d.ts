"use client";

/*
 * Xúc xắc 3D (thư viện @3d-dice/dice-box: BabylonJS vẽ, AmmoJS mô phỏng vật
 * lý). Xúc xắc được ném lên lớp phủ trên bàn cờ; số chấm do vật lý quyết định
 * và được trả về cho luật chơi (engine nhận đúng các số này).
 *
 * Thư viện chỉ chạy trong trình duyệt nên được nạp bằng `import()` lúc cần.
 * Máy không có WebGL hoặc nạp lỗi: `rollDice3d` trả về null và trò chơi
 * dùng xúc xắc 2D như trước — không bao giờ làm kẹt lượt chơi.
 *
 * Tệp vật lý và giao diện xúc xắc nằm ở public/assets/dice-box/ (chép từ
 * node_modules/@3d-dice/dice-box/dist/assets).
 */

type DiceRollResult = { value: number };

type DiceBoxInstance = {
  init(): Promise<unknown>;
  roll(notation: string, options?: { themeColor?: string }): Promise<DiceRollResult[]>;
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
 * Ném `count` viên D6 màu `color` lên bàn và chờ chúng dừng hẳn. Trả về số
 * chấm từng viên; null nếu không dùng được xúc xắc 3D.
 */
export async function rollDice3d(count: number, color: string): Promise<number[] | null> {
  const box = await loadDiceBox();
  if (!box) return null;
  window.clearTimeout(hideTimer);
  try {
    box.show();
    const results = await Promise.race([
      box.roll(`${count}d6`, { themeColor: color }),
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
