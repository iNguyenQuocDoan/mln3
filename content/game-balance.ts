/**
 * Thông số cân bằng của "Đường đua đại đoàn kết": gom về một chỗ để chỉnh
 * độ dài ván và mức "nâng đỡ" đội đang bị bỏ xa mà không phải sửa luật.
 *
 * Ba cơ chế giúp đội gặp xui không bị nản (đều hiện trên bảng xếp hạng):
 * - 🤝 Tiếp sức: bị đội dẫn đầu bỏ xa thì tiến thêm vài ô sau khi đổ.
 * - 🍀 Bùa may mắn: sai liên tiếp vài lượt thì lượt kế được thêm một xúc xắc.
 * - 🛡️ Bảo hộ: đội đứng cuối không bị thẻ tấn công nhắm tới; đội đang bị bỏ
 *   xa mở hộp quà thì không gặp thẻ rủi ro (tự lùi).
 */

/** Số xúc xắc mỗi lượt: trả lời đúng được lắc 2 con, sai vẫn được lắc 1 con. */
export const DICE_WHEN_CORRECT = 2;
export const DICE_WHEN_WRONG = 1;

/** Thời gian trả lời mỗi câu hỏi (giây). Hết giờ mà chưa chọn thì tính như trả lời sai. */
export const ANSWER_SECONDS = 15;

/** Mấy giây cuối đồng hồ chuyển đỏ và kêu tích tắc. */
export const ANSWER_WARNING_SECONDS = 5;

/**
 * 🤝 Tiếp sức: cách đội dẫn đầu từ `gap` ô trở lên thì được tiến thêm
 * `steps` ô (xét mức cao nhất đạt được, sắp từ lớn tới nhỏ).
 */
export const CATCH_UP: readonly { gap: number; steps: number }[] = [
  { gap: 10, steps: 2 },
  { gap: 5, steps: 1 },
];

/** 🍀 Sai liên tiếp từng này lượt thì lượt kế tiếp được thêm một xúc xắc. */
export const LUCKY_STREAK = 2;

/** 🎁 Số hộp quà luôn có trên bàn cờ (mở hộp nào thì hộp mới hiện ở ô khác). */
export const GIFT_BOX_COUNT = 7;
