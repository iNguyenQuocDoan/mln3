import type { CardCategory } from "./game-cards.ts";

/**
 * Thông số cân bằng của "Đường đua đại đoàn kết": gom về một chỗ để chỉnh
 * độ dài ván và mức "nâng đỡ" đội đang bị bỏ xa mà không phải sửa luật.
 */

/** Số xúc xắc mỗi lượt: trả lời đúng được lắc 2 con, sai vẫn được lắc 1 con. */
export const DICE_WHEN_CORRECT = 2;
export const DICE_WHEN_WRONG = 1;

/** Thời gian trả lời mỗi câu hỏi (giây). Hết giờ mà chưa chọn thì tính như trả lời sai. */
export const ANSWER_SECONDS = 15;

/** Mấy giây cuối đồng hồ chuyển đỏ và kêu tích tắc. */
export const ANSWER_WARNING_SECONDS = 5;

/** 🎁 Số hộp quà luôn có trên bàn cờ (mở hộp nào thì hộp mới hiện ở ô khác). */
export const GIFT_BOX_COUNT = 7;

/**
 * Cân bằng ngầm (chỉ nhóm biết, màn hình không hiện): khi một đội mở hộp quà,
 * tỉ lệ các nhóm thẻ đổi theo thế của đội đó so với các đội còn lại, để không
 * đội nào hên quá mà bỏ xa cả lớp.
 * - "leading": bỏ xa mọi đội khác từ BALANCE_GAP ô trở lên.
 * - "trailing": đứng cuối và kém đội dẫn đầu từ BALANCE_GAP ô trở lên.
 * - "even": các trường hợp còn lại.
 */
export type Standing = "leading" | "even" | "trailing";
export const BALANCE_GAP = 5;

/**
 * Tỉ lệ (phần trăm) của từng nhóm thẻ khi mở hộp quà, theo thế của đội.
 * Trong một nhóm, các thẻ chia nhau theo `weight` của thẻ
 * (content/game-cards.ts); hàng "even" đúng bằng tỉ lệ gốc của bộ thẻ.
 */
export const CARD_ODDS: Record<Standing, Record<CardCategory, number>> = {
  even: { forward: 40, attack: 40, penalty: 20 },
  leading: { forward: 20, attack: 40, penalty: 40 },
  trailing: { forward: 60, attack: 40, penalty: 0 },
};
