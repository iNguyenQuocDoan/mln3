import type { StaticImageData } from "next/image";
import map from "./photos/ban-do-trong-dong.webp";
import embroidery from "./photos/doi-tay-theu.jpg";
import man from "./photos/nam-trang-phuc-truyen-thong.jpg";
import music from "./photos/nhac-cu-truyen-thong.jpg";
import redScarf from "./photos/phu-nu-khan-do.jpg";
import highland from "./photos/phu-nu-vung-cao.jpg";

/*
 * Ảnh dùng trong bài. Mỗi ảnh gắn với đúng một chỗ trên slide:
 * - map: nền slide bìa (bản đồ trên nền trống đồng, khung 16:9 như ảnh)
 * - highland: 02 Dân tộc – tộc người, cạnh ba đặc trưng
 * - man: slide mở đầu Phần 3 (dân tộc ở Việt Nam)
 * - embroidery, music: 05 Bản sắc văn hóa riêng
 * - redScarf: 05 Đa dạng về bản sắc, thống nhất trong cộng đồng quốc gia
 *
 * Ảnh người gốc chỉ 870 × 580 nên khung ảnh không lớn quá khoảng 1,05 lần
 * ảnh gốc (khi chiếu 1920 × 1080) để không vỡ hạt.
 */
export type PhotoSource = {
  /** Tên trang, hiện ngắn gọn dưới ảnh. */
  site: string;
  /** Địa chỉ bài gốc; bấm vào nguồn dưới ảnh sẽ mở trang này. */
  url: string;
};

/** Bài "Trang phục truyền thống các dân tộc Việt Nam" trên vietnam.travel. */
const ETHNIC_COSTUMES: PhotoSource = {
  site: "vietnam.travel",
  url: "https://vietnam.travel/vi/things-to-do/traditional-ethnic-costumes-vietnam",
};

/** Bài về du lịch bền vững ở Sa Pa trên vietnam.travel. */
const SAPA_TRAVEL: PhotoSource = {
  site: "vietnam.travel",
  url: "https://www.vietnam.travel/vi/things-to-do/sapa-sustainable-travellers",
};

export type DeckPhoto = {
  image: StaticImageData;
  alt: string;
  /** object-position khi ảnh bị cắt cho vừa khung: giữ khuôn mặt, chủ thể. */
  focus: string;
  /** Chú thích ngắn dưới ảnh (tên dân tộc hoặc nội dung ảnh). */
  caption?: string;
  source?: PhotoSource;
};

export const PHOTOS = {
  map: {
    image: map,
    alt: "Bản đồ Việt Nam trên nền hoa văn trống đồng, có quần đảo Hoàng Sa và quần đảo Trường Sa",
    focus: "50% 50%",
  },
  highland: {
    image: highland,
    alt: "Người phụ nữ Dao Chàm đeo vòng cổ bạc, mặc trang phục truyền thống",
    focus: "45% 50%",
    caption: "Người Dao Chàm",
    source: ETHNIC_COSTUMES,
  },
  man: {
    image: man,
    alt: "Người đàn ông H'Mông Đen mặc trang phục truyền thống, ngồi trước nhà gỗ",
    focus: "58% 50%",
    caption: "Người H'Mông Đen",
    source: ETHNIC_COSTUMES,
  },
  embroidery: {
    image: embroidery,
    alt: "Đôi tay đang thêu hoa văn trên vải",
    focus: "50% 70%",
    caption: "Thêu hoa văn trên trang phục truyền thống",
    source: SAPA_TRAVEL,
  },
  music: {
    image: music,
    alt: "Người Chăm biểu diễn nhạc cụ truyền thống bên tháp cổ",
    focus: "50% 40%",
    caption: "Người Chăm biểu diễn nhạc cụ truyền thống",
    source: ETHNIC_COSTUMES,
  },
  redScarf: {
    image: redScarf,
    alt: "Người phụ nữ Dao Đỏ đội khăn đỏ, mặc trang phục truyền thống",
    focus: "35% 50%",
    caption: "Người Dao Đỏ",
    source: ETHNIC_COSTUMES,
  },
} satisfies Record<string, DeckPhoto>;
