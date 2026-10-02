/**
 * "Hành trình xuyên Việt": 28 ô chạy quanh viền một bàn cờ 8×8 (giống Cờ
 * Tỷ Phú), từ KHỞI HÀNH (ô 0) tới ĐÍCH ĐẾN (ô 27). 26 ô giữa là tỉnh/thành
 * theo hướng Bắc → Nam, chỉ là ô di chuyển (câu hỏi không gắn với ô nào).
 * Một số ô có 🎁: đổ xúc xắc đáp xuống đúng ô đó mới được vào vòng lật thẻ.
 *
 * Logic trò chơi luôn dùng `position: number` (chỉ số trong mảng này).
 */
export type BoardTile = {
  id: number;
  name: string;
  type: "start" | "province" | "finish";
  hasGift: boolean;
  subtitle?: string;
};

function province(id: number, name: string, hasGift = false): BoardTile {
  return { id, name, type: "province", hasGift };
}

export const BOARD_TILES: BoardTile[] = [
  {
    id: 0,
    name: "Khởi hành",
    type: "start",
    hasGift: false,
    subtitle: "Hành trình Đại Đoàn Kết",
  },
  province(1, "Hà Nội"),
  province(2, "Ninh Bình"),
  province(3, "Thanh Hóa", true),
  province(4, "Nghệ An"),
  province(5, "Hà Tĩnh"),
  province(6, "Quảng Bình", true),
  province(7, "Quảng Trị"),
  province(8, "Huế"),
  province(9, "Đà Nẵng", true),
  province(10, "Quảng Nam"),
  province(11, "Quảng Ngãi"),
  province(12, "Bình Định", true),
  province(13, "Phú Yên"),
  province(14, "Khánh Hòa", true),
  province(15, "Gia Lai"),
  province(16, "Đắk Lắk", true),
  province(17, "Lâm Đồng"),
  province(18, "Bình Thuận"),
  province(19, "Đồng Nai"),
  province(20, "Bình Dương"),
  province(21, "Tây Ninh", true),
  province(22, "TP. Hồ Chí Minh"),
  province(23, "Long An"),
  province(24, "Tiền Giang", true),
  province(25, "Bến Tre"),
  province(26, "Cần Thơ"),
  {
    id: 27,
    name: "Đích đến",
    type: "finish",
    hasGift: false,
    subtitle: "Khối Đại Đoàn Kết Toàn Dân Tộc",
  },
];

export const FINISH_POSITION = BOARD_TILES.length - 1;

export function tileAt(position: number): BoardTile {
  return BOARD_TILES[Math.min(Math.max(position, 0), FINISH_POSITION)];
}
