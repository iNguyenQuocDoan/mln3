import type { StaticImageData } from "next/image";
import independence from "./photos/chao-co-ba-dinh-2025.jpg";
import aseanFlag from "./photos/thuong-co-asean.jpg";
import delegates from "./photos/dai-bieu-cac-dan-toc.jpg";
import election from "./photos/cu-tri-bau-cu-2026.jpg";
import mayDay from "./photos/quoc-te-lao-dong.jpg";
import security from "./photos/an-ninh-quoc-phong.jpg";
import highlandVillage from "./photos/ban-lang-vung-cao.jpg";
import map from "./photos/ban-do-trong-dong.webp";
import embroidery from "./photos/doi-tay-theu.jpg";
import minorityYouth from "./photos/hoc-sinh-dan-toc-thieu-so.jpg";
import economy from "./photos/kinh-te-vung-cao.jpg";
import man from "./photos/nam-trang-phuc-truyen-thong.jpg";
import unityFestival from "./photos/ngay-hoi-dai-doan-ket.jpg";
import smallGroupsFestival from "./photos/ngay-hoi-dan-toc-it-nguoi.jpg";
import music from "./photos/nhac-cu-truyen-thong.jpg";
import ethnicMap from "./photos/phan-bo-dan-toc.jpg";
import ethnicMapArt from "./photos/phan-bo-dan-toc-2.jpg";
import redScarf from "./photos/phu-nu-khan-do.jpg";
import highland from "./photos/phu-nu-vung-cao.jpg";
import politics from "./photos/toa-nha-quoc-hoi.jpg";
import tayNung from "./photos/van-hoa-tay-nung.jpg";
import culture from "./photos/van-hoa-tay-nguyen.jpg";
import parade from "./photos/van-de-chien-luoc.jpg";
import society from "./photos/xa-hoi-dan-toc.jpg";

/*
 * Ảnh dùng trong bài. Mỗi ảnh gắn với đúng một chỗ trên slide:
 * - map: nền slide bìa (bản đồ trên nền trống đồng, khung 16:9 như ảnh)
 * - tayNung: slide mở đầu Phần 1 (khái niệm và đặc trưng của dân tộc)
 * - highland: 02 Dân tộc – tộc người, cạnh ba đặc trưng
 * - independence, aseanFlag: 03 Hai xu hướng (tách ra, liên hiệp)
 * - delegates, election, mayDay: 04 Cương lĩnh dân tộc (bình đẳng,
 *   quyền tự quyết, liên hiệp công nhân)
 * - ethnicMap: 05 Dân cư & địa bàn (bản đồ dân tộc trong Atlat, giữ
 *   nguyên cả trang, không cắt)
 * - unityFestival: 05 Phát triển & đoàn kết
 * - man: slide mở đầu Phần 3 (dân tộc ở Việt Nam)
 * - embroidery, music: 05 Bản sắc văn hóa riêng
 * - redScarf: 05 Đa dạng về bản sắc, thống nhất trong cộng đồng quốc gia
 * - politics, economy, culture, society, security: 07 Chính sách dân tộc,
 *   mỗi lĩnh vực một ảnh
 * - parade: 06 Quan điểm 1, vấn đề dân tộc là vấn đề chiến lược
 * - smallGroupsFestival: 06 Quan điểm 2, quan hệ giữa các dân tộc
 * - highlandVillage, minorityYouth: 06 Quan điểm 4 và 5 (ba hướng thực hiện)
 * - ethnicMapArt: slide cảm ơn (bản đồ minh họa trang phục các dân tộc,
 *   giữ nguyên cả tranh, không cắt)
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
  /**
   * Phóng nhẹ ảnh trong khung, neo tại `focus` (ví dụ 1.1): dùng khi cần cắt
   * bỏ logo báo in ở góc ảnh mà không sửa tệp ảnh.
   */
  zoom?: number;
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
  politics: {
    image: politics,
    alt: "Nhà Quốc hội ở Hà Nội, cờ đỏ sao vàng treo dọc mặt tiền",
    focus: "50% 45%",
    caption: "Nhà Quốc hội, Hà Nội",
    source: {
      site: "vov1.vov.vn",
      url: "https://vov1.vov.vn/thoi-su/thoi-su-18h/thoi-su-18h-542026-ky-hop-thu-nhat-quoc-hoi-khoa-xvi-se-khai-mac-vao-ngay-mai-127019.vov",
    },
  },
  economy: {
    image: economy,
    alt: "Cán bộ biên phòng cùng phụ nữ dân tộc thiểu số chăm sóc vườn rau",
    focus: "50% 60%",
    caption: "Biên phòng giúp đồng bào phát triển kinh tế",
    source: {
      site: "baotintuc.vn",
      url: "https://baotintuc.vn/xay-dung-the-tran-long-dan-noi-cuc-tay-cua-to-quoc-post797521.html",
    },
  },
  culture: {
    image: culture,
    alt: "Diễn viên trong trang phục các dân tộc Tây Nguyên múa cùng gùi trên sân khấu ngày hội",
    focus: "50% 60%",
    caption: "Nghệ thuật các dân tộc Tây Nguyên, 2023",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/khai-mac-ngay-hoi-van-hoa-the-thao-va-du-lich-cac-dan-toc-vung-tay-nguyen-102231129213951268.htm",
    },
  },
  society: {
    image: society,
    alt: "Thanh niên mặc trang phục các dân tộc vẫy cờ, diễu hành bên mô hình Quốc huy",
    focus: "0% 30%",
    zoom: 1.1,
    caption: "Lễ kỷ niệm 70 năm Chiến thắng Điện Biên Phủ",
    source: {
      site: "special.nhandan.vn",
      url: "https://special.nhandan.vn/vi_tri_vai_tro_suc_manh_nhan_dan_dai_doan_ket_dan_toc_trong_ky_nguyen_vuon_minh/index.html",
    },
  },
  security: {
    image: security,
    alt: "Đại tướng Phan Văn Giang cùng cán bộ quân đội đi qua dàn tên lửa phòng không",
    focus: "0% 50%",
    caption: "Khu trưng bày Bộ Quốc phòng, năm 2025",
    source: {
      site: "qdnd.vn",
      url: "https://www.qdnd.vn/80-nam-trien-lam-thanh-tuu-dat-nuoc-hanh-trinh-doc-lap-tu-do-hanh-phuc/dai-tuong-phan-van-giang-kiem-tra-khu-trung-bay-bo-quoc-phong-tai-trien-lam-thanh-tuu-dat-nuoc-845903",
    },
  },
  ethnicMap: {
    image: ethnicMap,
    alt: "Bản đồ phân bố các dân tộc Việt Nam theo ngữ hệ trong Atlat Địa lí Việt Nam, có quần đảo Hoàng Sa và quần đảo Trường Sa",
    focus: "50% 50%",
    caption: "Atlat Địa lí Việt Nam (số liệu năm 1999)",
    source: {
      site: "idialy.com",
      url: "https://www.idialy.com/2015/02/atlatvn-dan-toc.html",
    },
  },
  parade: {
    image: parade,
    alt: "Đồng bào các dân tộc mặc trang phục truyền thống, cầm cờ đỏ sao vàng và hoa, diễu hành",
    focus: "50% 40%",
    caption: "Đồng bào các dân tộc diễu hành",
    source: {
      site: "vov.vn",
      url: "https://vov.vn/chinh-tri/nuoc-viet-nam-la-mot-dan-toc-viet-nam-la-mot-post1089712.vov",
    },
  },
  independence: {
    image: independence,
    alt: "Lễ chào cờ kỷ niệm 80 năm Quốc khánh ở Quảng trường Ba Đình: khán đài xếp thành lá cờ đỏ sao vàng, các khối diễu binh đứng nghiêm",
    focus: "50% 45%",
    caption: "Lễ chào cờ 80 năm Quốc khánh ở Ba Đình, 2/9/2025",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/truc-tiep-ky-niem-trong-the-80-nam-quoc-khanh-nuoc-cong-hoa-xhcn-viet-nam-102250902000653367.htm",
    },
  },
  aseanFlag: {
    image: aseanFlag,
    alt: "Lá cờ ASEAN được kéo lên trước trụ sở Bộ Ngoại giao, đội nghi lễ đứng chào",
    focus: "40% 30%",
    caption: "Lễ thượng cờ ASEAN tại Bộ Ngoại giao, 2025",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/le-thuong-co-ky-niem-58-nam-thanh-lap-asean-102250808095515908.htm",
    },
  },
  delegates: {
    image: delegates,
    alt: "Các nữ đại biểu thuộc nhiều dân tộc mặc trang phục truyền thống trò chuyện ở hành lang Đại hội",
    focus: "30% 40%",
    zoom: 1.06,
    caption: "Nữ đại biểu các dân tộc tại Đại hội MTTQ, 2026",
    source: {
      site: "nhandan.vn",
      url: "https://nhandan.vn/anh-sac-mau-dai-doan-ket-tai-dai-hoi-dai-bieu-toan-quoc-mat-tran-to-quoc-viet-nam-lan-thu-xi-post961609.html",
    },
  },
  election: {
    image: election,
    alt: "Hai phụ nữ Mường mặc trang phục truyền thống bỏ phiếu bầu đại biểu Quốc hội khóa XVI ngày 15/3/2026 ở Ninh Bình",
    // Lệch sang phải để khung ảnh cắt bỏ logo báo ở góc dưới bên trái.
    focus: "56% 50%",
    caption: "Cử tri người Mường bầu Quốc hội khóa XVI",
    source: {
      site: "vnexpress.net",
      url: "https://vnexpress.net/cu-tri-ca-nuoc-bo-phieu-bau-nguoi-dai-dien-5050485.html",
    },
  },
  mayDay: {
    image: mayDay,
    alt: "Đông đảo người lao động áo xanh tuần hành Ngày Quốc tế Lao động ở La Habana, có tấm biển Unidad (đoàn kết)",
    focus: "35% 60%",
    caption: "Tuần hành Ngày Quốc tế Lao động ở Cuba, 2019",
    source: {
      site: "TTXVN – VietnamPlus",
      url: "https://www.vietnamplus.vn/photo-chum-anh-ton-vinh-nguoi-lao-dong-trong-ngay-15-post637892.vnp",
    },
  },
  tayNung: {
    image: tayNung,
    alt: "Phụ nữ dân tộc thiểu số mặc áo chàm ngồi bên bếp lửa, người chơi đàn tính, người đan lát",
    focus: "68% 50%",
    caption: "Văn hóa dân tộc Tày, Nùng",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/gioi-thieu-sac-mau-van-hoa-cac-dan-toc-viet-nam-tai-lang-van-hoa-du-lich-cac-dan-toc-viet-nam-102240404103553803.htm",
    },
  },
  unityFestival: {
    image: unityFestival,
    alt: "Phụ nữ Tày mặc áo chàm vừa đàn tính vừa hát trên sân khấu Ngày hội Đại đoàn kết toàn dân tộc ở xóm Nà Cốc, Cao Bằng",
    focus: "50% 50%",
    caption: "Ngày hội Đại đoàn kết ở Nà Cốc, Cao Bằng, 2025",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/pho-thu-tuong-ho-quoc-dung-du-ngay-hoi-dai-doan-ket-toan-dan-toc-tai-khu-dan-cu-na-coc-cao-bang-102251114131135155.htm",
    },
  },
  smallGroupsFestival: {
    image: smallGroupsFestival,
    alt: "Sân khấu lễ khai mạc Ngày hội văn hóa các dân tộc có số dân dưới 10.000 người, đông đảo diễn viên mặc trang phục các dân tộc",
    focus: "50% 60%",
    caption: "Ngày hội các dân tộc dưới 10.000 người, 2023",
    source: {
      site: "bvhttdl.gov.vn",
      url: "https://smot.bvhttdl.gov.vn/to-chuc-thanh-cong-ngay-hoi-van-hoa-cac-dan-toc-co-so-dan-duoi-10-000-nguoi-lan-thu-i-gop-phan-tang-cuong-khoi-dai-doan-ket-dan-toc/",
    },
  },
  highlandVillage: {
    image: highlandVillage,
    alt: "Bản làng vùng cao nhìn từ trên cao, có nhà rông, nhà văn hóa và đường bê tông mới",
    focus: "45% 50%",
    caption: "Bản làng vùng cao, Chương trình 1719",
    source: {
      site: "baochinhphu.vn",
      url: "https://baochinhphu.vn/xoa-loi-ngheo-vung-dong-bao-dtts-va-mien-nui-bai-cuoi-tap-trung-giai-quyet-5-nhat-102250711115252033.htm",
    },
  },
  minorityYouth: {
    image: minorityYouth,
    alt: "Tổng Bí thư Tô Lâm tặng quà học sinh, sinh viên, thanh niên dân tộc thiểu số xuất sắc",
    focus: "58% 50%",
    caption: "Gặp mặt học sinh dân tộc thiểu số",
    source: {
      site: "TTXVN – VietnamPlus",
      url: "https://www.vietnamplus.vn/tong-bi-thu-cong-tac-dan-toc-la-nhiem-vu-cua-ca-he-thong-chinh-tri-post1085234.vnp",
    },
  },
  ethnicMapArt: {
    image: ethnicMapArt,
    alt: "Bản đồ minh họa Việt Nam với hình người mặc trang phục truyền thống của 18 dân tộc, đặt ở vùng mỗi dân tộc sinh sống",
    focus: "50% 50%",
    caption: "Bản đồ minh họa trang phục các dân tộc",
    source: {
      site: "Behance – Dạ Hương",
      url: "https://www.behance.net/gallery/150172805/BROCHURE-BN-D-DAN-TC-VIETNAM-VIETNAM-WHY-NOT",
    },
  },
} satisfies Record<string, DeckPhoto>;
