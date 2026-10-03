/**
 * Bộ thẻ của "Đường đua đại đoàn kết": chỉ ba nhóm, dùng ngay khi lật,
 * không giữ thẻ trên tay, không có thẻ phòng thủ hay liên minh.
 *
 * - "attack": chọn một đội khác, đội đó lùi ô — hoặc thẻ hiếm "đổi vị trí"
 *   (hoán đổi ô đứng với một đội khác / với đội dẫn đầu).
 * - "penalty": bất lợi cho chính đội lật thẻ.
 * - "forward": may mắn, đội lật thẻ tiến ô.
 */
export type CardCategory = "attack" | "penalty" | "forward";

export type CardId =
  | "headwind"
  | "pushback"
  | "pullback"
  | "swap"
  | "swapLeader"
  | "slip"
  | "slippery"
  | "step"
  | "speed"
  | "breakthrough";

export type CardDef = {
  id: CardId;
  name: string;
  icon: string;
  category: CardCategory;
  /** Số ô dời: âm là lùi. Với thẻ tấn công là số ô đội bị chọn phải lùi. */
  cells: number;
  /** Chỉ được nhắm đội đang đứng trước mình. */
  targetAheadOnly?: boolean;
  /** Thẻ đổi vị trí: "any" — với một đội bất kỳ khác; "leader" — với đội dẫn đầu. */
  swap?: "any" | "leader";
  /** Trọng số khi rút thẻ (tổng cả bộ = 100, tức là phần trăm). */
  weight: number;
  description: string;
};

export const CARDS: CardDef[] = [
  {
    id: "headwind",
    weight: 9,
    name: "Gió Ngược",
    icon: "🌪️",
    category: "attack",
    cells: -2,
    description: "Chọn một đội khác. Đội đó lùi 2 ô.",
  },
  {
    id: "pushback",
    weight: 9,
    name: "Đẩy Lùi",
    icon: "💥",
    category: "attack",
    cells: -3,
    description: "Chọn một đội khác. Đội đó lùi 3 ô.",
  },
  {
    id: "pullback",
    weight: 9,
    name: "Kéo Lại",
    icon: "🎯",
    category: "attack",
    cells: -2,
    targetAheadOnly: true,
    description: "Chọn một đội đang đứng trước mình. Đội đó lùi 2 ô.",
  },
  {
    id: "swap",
    weight: 8,
    name: "Hoán Đổi Vị Trí",
    icon: "🔄",
    category: "attack",
    cells: 0,
    swap: "any",
    description: "Chọn một đội khác. Hai đội đổi ô đứng cho nhau.",
  },
  {
    id: "swapLeader",
    weight: 5,
    name: "Đổi Chỗ Với Đội Dẫn Đầu",
    icon: "🔀",
    category: "attack",
    cells: 0,
    swap: "leader",
    description: "Đổi ô đứng với đội dẫn đầu (bạn đang dẫn đầu thì đổi với đội thứ hai).",
  },
  {
    id: "slip",
    weight: 10,
    name: "Trượt Chân",
    icon: "🍌",
    category: "penalty",
    cells: -1,
    description: "Đội của bạn lùi 1 ô.",
  },
  {
    id: "slippery",
    weight: 10,
    name: "Đường Trơn",
    icon: "🌧️",
    category: "penalty",
    cells: -2,
    description: "Đội của bạn lùi 2 ô.",
  },
  {
    id: "step",
    weight: 14,
    name: "Tiến Bước",
    icon: "⚡",
    category: "forward",
    cells: 1,
    description: "Đội của bạn tiến 1 ô.",
  },
  {
    id: "speed",
    weight: 14,
    name: "Tăng Tốc",
    icon: "🚀",
    category: "forward",
    cells: 2,
    description: "Đội của bạn tiến 2 ô.",
  },
  {
    id: "breakthrough",
    weight: 12,
    name: "Bứt Phá",
    icon: "🔥",
    category: "forward",
    cells: 3,
    description: "Đội của bạn tiến 3 ô.",
  },
];

export function cardById(id: CardId): CardDef {
  const card = CARDS.find((item) => item.id === id);
  if (!card) throw new Error(`Không tìm thấy thẻ "${id}"`);
  return card;
}

/** Một lần lật thẻ có tối đa bao nhiêu thẻ đổi vị trí trong ba thẻ úp. */
export const MAX_SWAP_CARDS_IN_SELECTION = 1;

/**
 * Rút 3 thẻ khác nhau theo trọng số (≈ tấn công 27% + đổi vị trí 13%,
 * tiến 40%, tự lùi 20%), tối đa một thẻ đổi vị trí. `excluded`: thẻ không
 * dùng được lúc này (ví dụ "Kéo Lại" khi không có đội nào đứng trước) —
 * được thay bằng thẻ khác ngay khi rút, để lật ra thẻ nào cũng áp dụng được.
 *
 * Ba thẻ được đảo vị trí ngẫu nhiên sau khi rút: rút theo trọng số làm thẻ
 * phổ biến hay ra trước, nếu giữ nguyên thứ tự thì người chơi đoán được nên
 * chọn ô nào.
 */
export function drawThreeCards(rng: () => number, excluded: CardId[] = []): CardId[] {
  const drawn: CardId[] = [];
  let guard = 0;
  while (drawn.length < 3 && guard < 500) {
    guard++;
    const card = drawOneCard(rng);
    if (drawn.includes(card.id) || excluded.includes(card.id)) continue;
    const swaps = drawn.filter((id) => cardById(id).swap).length;
    if (card.swap && swaps >= MAX_SWAP_CARDS_IN_SELECTION) continue;
    drawn.push(card.id);
  }
  for (let i = drawn.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [drawn[i], drawn[j]] = [drawn[j], drawn[i]];
  }
  return drawn;
}

function drawOneCard(rng: () => number): CardDef {
  const total = CARDS.reduce((sum, card) => sum + card.weight, 0);
  let roll = rng() * total;
  for (const card of CARDS) {
    if (roll < card.weight) return card;
    roll -= card.weight;
  }
  return CARDS[CARDS.length - 1];
}
