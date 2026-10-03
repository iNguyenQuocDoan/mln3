# Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội

Website trình chiếu cho bài thuyết trình nhóm môn MLN131. Khung slide cố định
16:9 (1920 × 1080) và tự co giãn theo màn hình. Khi chiếu trên TV Full HD ở
chế độ toàn màn hình, mọi cỡ chữ hiển thị đúng như thiết kế, không chữ nào
nhỏ hơn 24px.

## Chạy bài

```bash
npm install
npm run dev        # mở http://localhost:3000
```

Hôm thuyết trình, nên chạy bản build để máy chạy mượt hơn:

```bash
npm run build
npm start          # mở http://localhost:3000
```

## Điều khiển khi trình chiếu

| Phím | Tác dụng |
| --- | --- |
| → ↓ PageDown Space | Màn hình tiếp theo (dùng được với bút trình chiếu) |
| ← ↑ PageUp | Lùi lại |
| Home / End | Về màn hình đầu / cuối |
| 1, 2, 3 | Nhảy tới slide mở đầu Phần 1, 2, 3 |
| F | Bật/tắt toàn màn hình |
| N | Bật/tắt ghi chú người trình bày ngay trên màn hình chiếu (mặc định ẩn) |
| P | Mở màn hình người trình bày (cửa sổ riêng) |
| Esc | Đóng ghi chú |

Rê chuột sẽ hiện thanh điều khiển nhỏ ở giữa mép dưới (lùi, số màn hình,
tiếp, toàn màn hình, ghi chú, người trình bày); để yên khoảng 2 giây thì
thanh và con trỏ tự ẩn. Trên màn hình cảm ứng có thể vuốt trái/phải.

Chân mỗi slide nội dung có thanh tiến độ mảnh, mục đang trình bày (ví dụ
`04 Cương lĩnh dân tộc Mác – Lênin`) và số màn hình (ví dụ `12 / 27`).
Một số slide gồm nhiều màn hình (hai nghĩa của dân tộc, sáu đặc điểm,
chính sách): bấm "tiếp" chỉ đổi phần nội dung,
bố cục giữ nguyên.

Ghi chú (phím N) nằm đè lên phần dưới màn hình, không làm slide co lại.
Nếu chiếu bằng một màn hình duy nhất thì khán giả cũng thấy ghi chú, nên
chỉ bật khi cần.

## Màn hình người trình bày

1. Nối laptop với TV ở chế độ **mở rộng màn hình** (Extend), không dùng
   chế độ nhân đôi.
2. Mở bài, kéo cửa sổ trình duyệt sang TV, bấm **F** để toàn màn hình.
3. Bấm **P** để mở cửa sổ người trình bày, rồi kéo cửa sổ này về màn hình
   laptop.

Cửa sổ người trình bày hiện màn hình đang chiếu, màn hình kế tiếp, lời
thuyết trình và câu chuyển người theo bản Word, cùng đồng hồ bấm giờ. Bấm
chuyển ở cửa sổ nào thì cửa sổ kia cũng chuyển theo. Màn hình nào bản Word
chưa có lời thì hiện dòng **Gợi ý (chưa có trong bản Word)**, viết lại từ
chữ trên màn hình; nhóm có thể sửa ở `content/script.ts` → `HINTS`.

## Trò chơi "Đường đua đại đoàn kết"

Trò chơi ôn tập sau phần thuyết trình. Vào từ slide **Trò chơi** (ngay trước
slide Cảm ơn) hoặc mở thẳng http://localhost:3000/tro-choi. Người chơi dùng
chuột bấm trực tiếp trên màn hình chiếu.

### Một ván chơi

1. Ở slide Trò chơi, bấm **Vào đường đua**, đọc luật rồi bấm **Vào trò
   chơi**. Trang chuyển ngay trong trình duyệt nên TV vẫn ở chế độ toàn màn
   hình.
2. Chọn số đội (2–5) rồi bấm **Bắt đầu**. Không lắc chọn thứ tự: các đội đi
   lần lượt theo số thứ tự, Đội 1 đi trước.
3. Tới lượt đội nào, câu hỏi hiện toàn màn hình và đội có 15 giây để chọn
   đáp án. Đúng được lắc 2 xúc xắc, sai hoặc hết giờ vẫn được lắc 1.
4. Đội tự ném xúc xắc trên bàn cờ (nhấn giữ để lắc, kéo rồi thả tay), quân
   cờ đi đúng tổng số chấm. Dừng đúng ô có hộp quà thì chọn một trong ba thẻ
   úp: thẻ tiến, thẻ tự lùi hoặc thẻ tấn công (bắt một đội khác lùi, đổi chỗ).
5. MC bấm **Đến lượt Đội n** để sang đội kế tiếp. Đội về đích đầu tiên
   thắng; các đội còn lại xếp theo số ô, bằng nhau thì xét số câu đúng.

Màn hình không có ưu đãi nào cho đội đi sau: đội nào cũng lắc cùng số xúc
xắc, đi đúng số chấm, và thẻ tấn công nhắm được mọi đội khác.

**Cân bằng ngầm** (chỉ nhóm biết, màn hình không hiện): khi một đội mở hộp
quà, tỉ lệ các nhóm thẻ đổi theo thế của đội đó, để không đội nào hên quá mà
bỏ xa cả lớp.

| Thế của đội lúc mở hộp | Thẻ tiến | Thẻ tấn công | Thẻ tự lùi |
| --- | --- | --- | --- |
| Sát nhau | 40% | 40% | 20% |
| Bỏ xa mọi đội khác từ 5 ô | 20% | 40% | 40% |
| Đứng cuối, kém đội dẫn đầu từ 5 ô | 60% | 40% | 0% |

Muốn chỉnh các con số này thì sửa `CARD_ODDS` và `BALANCE_GAP` trong
`content/game-balance.ts`.

### Điều khiển cho người dẫn

| Phím / nút | Tác dụng |
| --- | --- |
| F | Bật/tắt toàn màn hình |
| M | Bật/tắt âm thanh |
| Z | Hoàn tác thao tác vừa rồi |
| Esc | Đóng menu |
| Nút ≡ dưới cột lượt chơi | Hoàn tác, toàn màn hình, âm thanh, **Chơi lại từ đầu**, **Kết quả các ván**, **Xóa lịch sử các ván**, **Về bài thuyết trình** |

Ván chơi được lưu vào localStorage của trình duyệt sau mỗi lần bấm. Lỡ tải
lại trang hoặc quay về slide thì vào lại game vẫn chơi tiếp đúng chỗ cũ.
Trước buổi thuyết trình, nhớ bỏ ván chơi thử (menu ≡ → **Chơi lại từ đầu**).

### Câu hỏi

Câu hỏi nằm ở `content/game-questions.ts`: 108 câu, mỗi câu 4 đáp án;
`correctAnswer` là chữ cái của đáp án đúng (A–D), `difficulty` là độ khó.

- Mỗi ván mới, thứ tự câu được xáo lại; câu đã hỏi ở các ván trước bị dồn
  xuống cuối, hỏi hết một vòng ngân hàng câu thì tính lại từ đầu.
- Bốn đáp án được xáo vị trí theo từng ván, nên gặp lại câu cũ thì đáp án
  đúng nằm ở ô khác; trong cùng một ván, tải lại trang không làm đáp án đổi
  chỗ.

Sửa xong chạy `npm test`. Lệnh này kiểm tra luật chơi và ngân hàng câu hỏi:
đủ bốn đáp án, không trùng mã câu, các đáp án dài tương đương nhau.

## Chỉnh nội dung

| Muốn sửa | File |
| --- | --- |
| Tên nhóm, giảng viên (hiện ở slide bìa) | `content/parts.ts` → `DECK_INFO` |
| Tên người trình bày | `content/parts.ts` → `MEMBERS[].presenter` |
| Tên bảy mục, mục nào thuộc phần nào, ai trình bày | `content/parts.ts` → `SECTIONS` |
| Lời thuyết trình theo bản Word | `content/script.ts` → `SCRIPT` |
| Gợi ý lời cho màn hình mới | `content/script.ts` → `HINTS` |
| Thứ tự màn hình, đoạn lời gắn với màn hình nào | `content/slides.tsx` |
| Chữ trên từng màn hình | `components/slides/` (mỗi mục một file) |
| Câu hỏi của trò chơi | `content/game-questions.ts` |
| Luật và cân bằng ngầm của trò chơi | `content/game-balance.ts` |

Trường nào để trống thì không hiển thị trên slide.

Thứ tự trên màn hình theo giáo trình và lời thuyết trình bản Word: chính
sách **văn hóa** trước **xã hội**; trong "Ba hướng thực hiện", **phát triển
toàn diện** trước **ưu tiên đầu tư**. Muốn đổi thứ tự thì sửa mảng `POLICIES`
(`components/slides/policy-steps.tsx`) hoặc `DIRECTIONS`
(`components/slides/part-4.tsx`), và nhớ đổi cả thứ tự lời trong
`content/slides.tsx`.

## Cấu trúc bài

27 màn hình. Số màn hình ở chân slide đếm cả bìa, mục lục và slide chuyển
phần.

| Màn hình | Nội dung | Lời theo bản Word | Thành viên |
| --- | --- | --- | --- |
| 1–2 | Bìa, Nội dung (bảy mục) | slide 1 (lời chào) | 1 |
| 3 | Phần 1 | — | — |
| 4 | 01 Sự hình thành dân tộc | slide 1 | 1 |
| 5–6 | 02 Hai nghĩa của dân tộc (so sánh, hai bước) | slide 2, 3 | 1 |
| 7 | Phần 2 | — | — |
| 8 | 03 Hai xu hướng khách quan | slide 4 | 2 |
| 9–11 | 04 Cương lĩnh: bình đẳng, quyền tự quyết, liên hiệp | slide 5, 6 | 2 |
| 12 | Phần 3 | — | — |
| 13–17 | 05 Sáu đặc điểm: tổng quan, dân cư & địa bàn, phát triển & đoàn kết, bản sắc văn hóa riêng, đa dạng – thống nhất | slide 7, 8, 9 | 3 |
| 18–20 | 06 Quan điểm của Đảng, Nhà nước (năm quan điểm) | slide 10, 11, 12 | 4 |
| 21–25 | 07 Chính sách dân tộc (mỗi lĩnh vực một màn; màn cuối kèm lời kết của bài) | slide 13, 14, 15 | 5 |
| 26 | Trò chơi (mở trang `/tro-choi`) | — | — |
| 27 | Cảm ơn | — | — |

Thiết kế dùng font Be Vietnam Pro (tự lưu trong `app/fonts/`), bảng màu
chàm và son.

## Ảnh

Ảnh nằm trong `content/photos/`, khai báo ở `content/photos.ts` (mô tả ảnh,
điểm cần giữ khi cắt khung, chú thích và nguồn). Dưới mỗi ảnh có tên dân
tộc và nguồn; bấm vào tên nguồn sẽ mở bài gốc trong tab mới.

| Màn hình | Ảnh | Nguồn |
| --- | --- | --- |
| 1, nền slide bìa | Bản đồ Việt Nam trên nền trống đồng (`ban-do-trong-dong.webp`) | nhóm cung cấp |
| 3, mở đầu Phần 1 | Văn hóa dân tộc Tày, Nùng (`van-hoa-tay-nung.jpg`) | [Báo Chính phủ – Sắc màu văn hóa các dân tộc Việt Nam tại Làng Văn hóa (4/4/2024)](https://baochinhphu.vn/gioi-thieu-sac-mau-van-hoa-cac-dan-toc-viet-nam-tai-lang-van-hoa-du-lich-cac-dan-toc-viet-nam-102240404103553803.htm) |
| 6, cạnh ba đặc trưng của tộc người | Người Dao Chàm (`phu-nu-vung-cao.jpg`) | [vietnam.travel – trang phục truyền thống](https://vietnam.travel/vi/things-to-do/traditional-ethnic-costumes-vietnam) |
| 8, Hai xu hướng: tách ra | Lễ chào cờ kỷ niệm 80 năm Quốc khánh ở Quảng trường Ba Đình, 2/9/2025 (`chao-co-ba-dinh-2025.jpg`) | [Báo Chính phủ – Tổng thuật: Kỷ niệm trọng thể 80 năm Quốc khánh (2/9/2025)](https://baochinhphu.vn/truc-tiep-ky-niem-trong-the-80-nam-quoc-khanh-nuoc-cong-hoa-xhcn-viet-nam-102250902000653367.htm) (ảnh VGP/Nhật Bắc) |
| 8, Hai xu hướng: liên hiệp | Lễ thượng cờ ASEAN tại Bộ Ngoại giao, 2025 (`thuong-co-asean.jpg`) | [Báo Chính phủ – Lễ thượng cờ kỷ niệm 58 năm thành lập ASEAN (8/8/2025)](https://baochinhphu.vn/le-thuong-co-ky-niem-58-nam-thanh-lap-asean-102250808095515908.htm) (ảnh Tuấn Dũng) |
| 9, Cương lĩnh: bình đẳng | Nữ đại biểu các dân tộc tại Đại hội MTTQ Việt Nam lần thứ XI, 2026 (`dai-bieu-cac-dan-toc.jpg`) | [Nhân Dân – Sắc màu đại đoàn kết tại Đại hội MTTQ Việt Nam lần thứ XI (12/5/2026)](https://nhandan.vn/anh-sac-mau-dai-doan-ket-tai-dai-hoi-dai-bieu-toan-quoc-mat-tran-to-quoc-viet-nam-lan-thu-xi-post961609.html) |
| 10, Cương lĩnh: quyền tự quyết | Cử tri người Mường ở Ninh Bình bỏ phiếu bầu Quốc hội khóa XVI, 15/3/2026 (`cu-tri-bau-cu-2026.jpg`) | [VnExpress – Nhiều nơi vượt 70% cử tri đi bầu trong buổi sáng (15/3/2026)](https://vnexpress.net/cu-tri-ca-nuoc-bo-phieu-bau-nguoi-dai-dien-5050485.html) (ảnh Lam Sơn) |
| 11, Cương lĩnh: liên hiệp công nhân | Tuần hành Ngày Quốc tế Lao động ở La Habana, Cuba, 2019 (`quoc-te-lao-dong.jpg`) | [TTXVN/VietnamPlus – Chùm ảnh tôn vinh người lao động ngày 1/5](https://www.vietnamplus.vn/photo-chum-anh-ton-vinh-nguoi-lao-dong-trong-ngay-15-post637892.vnp) (ảnh Lê Hà, phóng viên TTXVN tại Cuba) |
| 12, mở đầu Phần 3 | Người H'Mông Đen (`nam-trang-phuc-truyen-thong.jpg`) | như trên |
| 14, Dân cư & địa bàn | Bản đồ dân tộc trong Atlat Địa lí Việt Nam, số liệu năm 1999 (`phan-bo-dan-toc.jpg`) | [iDiaLy.com – Atlatvn: Dân tộc](https://www.idialy.com/2015/02/atlatvn-dan-toc.html) |
| 15, Phát triển & đoàn kết | Ngày hội Đại đoàn kết toàn dân tộc ở xóm Nà Cốc, Cao Bằng, 2025 (`ngay-hoi-dai-doan-ket.jpg`, thu về 1600px) | [Báo Chính phủ – Phó Thủ tướng dự Ngày hội Đại đoàn kết tại Nà Cốc (14/11/2025)](https://baochinhphu.vn/pho-thu-tuong-ho-quoc-dung-du-ngay-hoi-dai-doan-ket-toan-dan-toc-tai-khu-dan-cu-na-coc-cao-bang-102251114131135155.htm) (ảnh VGP/Gia Huy) |
| 16, bên trái | Thêu hoa văn trên trang phục truyền thống (`doi-tay-theu.jpg`) | [vietnam.travel – Sa Pa](https://www.vietnam.travel/vi/things-to-do/sapa-sustainable-travellers) |
| 16, bên phải | Người Chăm biểu diễn nhạc cụ truyền thống (`nhac-cu-truyen-thong.jpg`) | [vietnam.travel – trang phục truyền thống](https://vietnam.travel/vi/things-to-do/traditional-ethnic-costumes-vietnam) |
| 17, Đa dạng về bản sắc – thống nhất | Người Dao Đỏ (`phu-nu-khan-do.jpg`) | như trên |
| 18, Vấn đề dân tộc là vấn đề chiến lược | Đồng bào các dân tộc diễu hành (`van-de-chien-luoc.jpg`) | [VOV – Nước Việt Nam là một, dân tộc Việt Nam là một](https://vov.vn/chinh-tri/nuoc-viet-nam-la-mot-dan-toc-viet-nam-la-mot-post1089712.vov) (ảnh: Tuyengiao.vn) |
| 19, Quan hệ giữa các dân tộc | Lễ khai mạc Ngày hội văn hóa các dân tộc có số dân dưới 10.000 người lần thứ I, Lai Châu 2023 (`ngay-hoi-dan-toc-it-nguoi.jpg`) | [Bộ VHTTDL – Trường Cán bộ quản lý VHTTDL (6/11/2023)](https://smot.bvhttdl.gov.vn/to-chuc-thanh-cong-ngay-hoi-van-hoa-cac-dan-toc-co-so-dan-duoi-10-000-nguoi-lan-thu-i-gop-phan-tang-cuong-khoi-dai-doan-ket-dan-toc/) |
| 20, Ưu tiên đầu tư | Hạ tầng vùng cao từ Chương trình 1719 (`ban-lang-vung-cao.jpg`) | [Báo Chính phủ – Xóa “lõi nghèo” vùng đồng bào DTTS và miền núi (11/7/2025)](https://baochinhphu.vn/xoa-loi-ngheo-vung-dong-bao-dtts-va-mien-nui-bai-cuoi-tap-trung-giai-quyet-5-nhat-102250711115252033.htm) (ảnh Ngọc Chí) |
| 20, Trách nhiệm chung | Tổng Bí thư gặp mặt học sinh, sinh viên dân tộc thiểu số tiêu biểu (`hoc-sinh-dan-toc-thieu-so.jpg`) | [TTXVN/VietnamPlus – Tổng Bí thư: Công tác dân tộc là nhiệm vụ của cả hệ thống chính trị (26/12/2025)](https://www.vietnamplus.vn/tong-bi-thu-cong-tac-dan-toc-la-nhiem-vu-cua-ca-he-thong-chinh-tri-post1085234.vnp) (ảnh Thống Nhất/TTXVN) |
| 21, Chính sách dân tộc: chính trị | Nhà Quốc hội, Hà Nội (`toa-nha-quoc-hoi.jpg`) | [VOV1 – Thời sự 18h 5/4/2026](https://vov1.vov.vn/thoi-su/thoi-su-18h/thoi-su-18h-542026-ky-hop-thu-nhat-quoc-hoi-khoa-xvi-se-khai-mac-vao-ngay-mai-127019.vov) |
| 22, Chính sách dân tộc: kinh tế | Biên phòng A Pa Chải giúp dân phát triển kinh tế (`kinh-te-vung-cao.jpg`) | [baotintuc.vn – Xây dựng thế trận lòng dân nơi cực Tây của Tổ quốc](https://baotintuc.vn/xay-dung-the-tran-long-dan-noi-cuc-tay-cua-to-quoc-post797521.html) (ảnh Minh Đức/TTXVN) |
| 23, Chính sách dân tộc: văn hóa | Nghệ thuật các dân tộc Tây Nguyên, 2023 (`van-hoa-tay-nguyen.jpg`, thu về 1600px) | [Báo Chính phủ – Khai mạc Ngày hội văn hóa, thể thao và du lịch các dân tộc vùng Tây Nguyên (29/11/2023)](https://baochinhphu.vn/khai-mac-ngay-hoi-van-hoa-the-thao-va-du-lich-cac-dan-toc-vung-tay-nguyen-102231129213951268.htm) (ảnh VGP/Dương Nương) |
| 24, Chính sách dân tộc: xã hội | Diễu hành kỷ niệm 70 năm Chiến thắng Điện Biên Phủ (`xa-hoi-dan-toc.jpg`) | [Nhân Dân – Vị trí, vai trò, sức mạnh nhân dân, đại đoàn kết toàn dân tộc…](https://special.nhandan.vn/vi_tri_vai_tro_suc_manh_nhan_dan_dai_doan_ket_dan_toc_trong_ky_nguyen_vuon_minh/index.html) |
| 25, Chính sách dân tộc: an ninh – quốc phòng | Khu trưng bày Bộ Quốc phòng tại Triển lãm thành tựu đất nước (`an-ninh-quoc-phong.jpg`) | [QĐND – Đại tướng Phan Văn Giang kiểm tra khu trưng bày Bộ Quốc phòng…](https://www.qdnd.vn/80-nam-trien-lam-thanh-tuu-dat-nuoc-hanh-trinh-doc-lap-tu-do-hanh-phuc/dai-tuong-phan-van-giang-kiem-tra-khu-trung-bay-bo-quoc-phong-tai-trien-lam-thanh-tuu-dat-nuoc-845903) |
| 27, Cảm ơn | Bản đồ minh họa trang phục các dân tộc Việt Nam (`phan-bo-dan-toc-2.jpg`) | [Behance – Dạ Hương: Brochure bản đồ dân tộc Vietnam](https://www.behance.net/gallery/150172805/BROCHURE-BN-D-DAN-TC-VIETNAM-VIETNAM-WHY-NOT) |

Các màn lý luận (hai xu hướng, Cương lĩnh dân tộc) dùng ảnh màu chụp sự kiện thật minh họa đúng ý từng nội dung, không dùng ảnh tư liệu đen trắng.
Ảnh chụp lấy từ báo chí, cơ quan nhà nước và có ghi nguồn; không dùng ảnh do AI tạo. Hai bản đồ là ngoại lệ: trang Dân tộc của Atlat Địa lí Việt Nam (đăng lại trên iDiaLy.com) và bản đồ minh họa ở slide cảm ơn (đồ án của Dạ Hương trên Behance).
Chú thích dưới ảnh giữ một dòng ngắn. Ảnh có logo báo ở góc thì dùng `focus` (và `zoom` khi cần) để khung ảnh cắt bỏ góc đó.
Ảnh người gốc chỉ 870 × 580 nên khung ảnh được giữ ở mức không phóng quá
khoảng 1,05 lần khi chiếu 1920 × 1080. Muốn ảnh nét hơn trên màn 2K thì
thay bằng ảnh gốc lớn hơn, giữ nguyên tên tệp. Bài tải sẵn mọi ảnh ngay khi
mở, nên tới slide nào ảnh cũng đã có.
