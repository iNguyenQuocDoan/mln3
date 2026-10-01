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
`04 Cương lĩnh dân tộc Mác – Lênin`) và số màn hình (ví dụ `12 / 29`).
Một số slide gồm nhiều màn hình (hai nghĩa của dân tộc, quyền tự quyết,
sáu đặc điểm, chính sách, tổng kết): bấm "tiếp" chỉ đổi phần nội dung,
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

## Trò chơi "Đường đua tiếp nhiên liệu"

Trò chơi ôn tập sau phần thuyết trình. Vào từ slide **Trò chơi** (ngay trước
slide Cảm ơn) hoặc mở thẳng http://localhost:3000/tro-choi. Người chơi dùng
chuột bấm trực tiếp trên màn hình chiếu.

### Một ván chơi

1. Ở slide Trò chơi, bấm **Vào đường đua**. Trang chuyển ngay trong trình
   duyệt nên TV vẫn ở chế độ toàn màn hình.
2. Sảnh chờ: chọn số đội (2–6), đặt tên đội, độ dài đường đua, thời gian
   trả lời, bật/tắt âm thanh, rồi bấm **Bắt đầu đua**. Sảnh chờ hiện thời
   lượng ước tính theo số đội và độ dài đường.
3. Mỗi đội cử một bạn lên bấm **Gieo** xúc xắc. Số lớn hơn đi trước; các đội
   ra trùng số gieo lại. Có thứ tự rồi thì bấm **Xuất phát**.
4. Tới lượt đội nào, một bạn của đội đó lên chọn cây xăng và trả lời.

| Cây xăng | Bên trong | Trả lời đúng | Sai hoặc hết giờ |
| --- | --- | --- | --- |
| E5 (1 lít) | câu dễ | tiến 1 ô | đứng yên |
| RON95 (2 lít) | câu vừa | tiến 2 ô | đứng yên |
| ??? | rút thăm một sự kiện, xem bảng dưới | | |

| Sự kiện của bình ??? | Kết quả |
| --- | --- |
| Câu hỏi khó | đúng thì tiến 3 ô |
| Nitro | tiến 2 ô ngay |
| Cướp xăng | chọn một đội đang có xăng: đội đó lùi 1 ô, mình tiến 1 ô |
| Nổ lốp | lùi 1 ô (không xảy ra khi xe còn ở vạch xuất phát) |
| Cảnh sát | mất lượt |

Đội đầu tiên chạm vạch đích thắng. Các đội còn lại xếp theo số ô, bằng nhau
thì xét số câu đúng, rồi số lít xăng đã đổ.

**Cân bằng ngầm** (chỉ nhóm biết, màn hình không hiện): tỉ lệ các sự kiện
của bình ??? thay đổi theo thế của đội đang chơi, để không đội nào hên quá mà
bỏ xa cả lớp.

| Thế của đội | Câu khó | Nitro | Cướp xăng | Nổ lốp | Cảnh sát |
| --- | --- | --- | --- | --- | --- |
| Sát nhau (chênh dưới 2 ô) | 50% | 15% | 15% | 10% | 10% |
| Bỏ xa mọi đội khác từ 2 ô | 50% | 5% | 5% | 20% | 20% |
| Đứng cuối, kém đội đầu từ 2 ô | 50% | 25% | 25% | 0% | 0% |

Muốn chỉnh các con số này thì sửa `MYSTERY_ODDS` và `BALANCE_GAP` trong
`components/game/engine.ts`.

### Điều khiển cho người dẫn

| Phím / nút | Tác dụng |
| --- | --- |
| F | Bật/tắt toàn màn hình |
| M | Bật/tắt âm thanh |
| Esc | Đóng menu |
| Nút ≡ ở góc phải | Toàn màn hình, âm thanh, **Dừng đua và xếp hạng** (khi hết giờ), **Bỏ ván này**, **Về bài thuyết trình** |

Ván chơi, kể cả kết quả gieo xúc xắc và thứ tự xuất phát, được lưu vào
localStorage của trình duyệt sau mỗi lần bấm. Lỡ tải lại trang hoặc quay về
slide thì vào lại game sẽ có nút **Chơi tiếp**. Trước buổi thuyết trình, nhớ
bỏ ván chơi thử (menu ≡ → **Bỏ ván này**, hoặc **Ván mới** ở bảng kết quả).

### Câu hỏi

Câu hỏi nằm ở `content/quiz.ts`: 103 câu, gồm 38 câu E5, 36 câu RON95 và 29
câu khó.

- Mỗi ván mới, thứ tự rút câu được xáo lại. Trình duyệt nhớ khoảng 50 câu
  đã hỏi gần nhất (localStorage), nên ván sau hỏi trước những câu chưa gặp
  ở các ván trước; câu đã hỏi bị dồn xuống cuối.
- Mỗi lần một câu được rút, bốn đáp án lại được xáo vị trí A–D, nên gặp lại
  câu cũ thì đáp án đúng nằm ở ô khác. Cách xếp được lưu cùng ván chơi, nên
  tải lại trang không làm đáp án đổi chỗ giữa chừng.

Mỗi câu có 4 đáp án; `correct` là vị trí đáp án đúng trong danh sách (0 là
đáp án đầu tiên); `explain` hiện sau khi trả lời; `source` ghi slide để đối
chiếu. Câu có đáp án là số, năm hoặc thứ tự (ví dụ 51, 52, 53, 54) được đánh
dấu `keepOrder: true` để giữ nguyên thứ tự cho dễ đọc. Các câu có nguồn
"Kiến thức chung", "Hiến pháp 2013" hoặc "Tổng điều tra 2019" nằm ngoài 15
slide, nhóm nên đọc lại trước khi chơi.

Sửa xong chạy `npm test`. Lệnh này kiểm tra luật chơi và ngân hàng câu hỏi:
đủ bốn đáp án, không trùng mã câu, câu không dài quá khung hiển thị, câu giữ
thứ tự thì các số tăng dần.

## Chỉnh nội dung

| Muốn sửa | File |
| --- | --- |
| Tên nhóm, giảng viên (hiện ở slide bìa) | `content/parts.ts` → `DECK_INFO` |
| Tên người trình bày | `content/parts.ts` → `MEMBERS[].presenter` |
| Tên tám mục, mục nào thuộc phần nào, ai trình bày | `content/parts.ts` → `SECTIONS` |
| Lời thuyết trình theo bản Word | `content/script.ts` → `SCRIPT` |
| Gợi ý lời cho màn hình mới | `content/script.ts` → `HINTS` |
| Thứ tự màn hình, đoạn lời gắn với màn hình nào | `content/slides.tsx` |
| Chữ trên từng màn hình | `components/slides/` (mỗi mục một file) |
| Câu hỏi của trò chơi | `content/quiz.ts` |

Trường nào để trống thì không hiển thị trên slide.

Thứ tự trên màn hình theo giáo trình và lời thuyết trình bản Word: chính
sách **văn hóa** trước **xã hội**; trong "Ba hướng thực hiện", **phát triển
toàn diện** trước **ưu tiên đầu tư**. Muốn đổi thứ tự thì sửa mảng `POLICIES`
(`components/slides/policy-steps.tsx`) hoặc `DIRECTIONS`
(`components/slides/part-4.tsx`), và nhớ đổi cả thứ tự lời trong
`content/slides.tsx`.

## Cấu trúc bài

29 màn hình. Số màn hình ở chân slide đếm cả bìa, mục lục và slide chuyển
phần.

| Màn hình | Nội dung | Lời theo bản Word | Thành viên |
| --- | --- | --- | --- |
| 1–2 | Bìa, Nội dung (tám mục) | slide 1 (lời chào) | 1 |
| 3 | Phần 1 | — | — |
| 4 | 01 Sự hình thành dân tộc | slide 1 | 1 |
| 5–6 | 02 Hai nghĩa của dân tộc (so sánh, hai bước) | slide 2, 3 | 1 |
| 7 | Phần 2 | — | — |
| 8 | 03 Hai xu hướng khách quan | slide 4 | 2 |
| 9–13 | 04 Cương lĩnh: bình đẳng, quyền tự quyết (2 màn), liên hiệp, tóm tắt | slide 5, 6 | 2 |
| 14 | Phần 3 | — | — |
| 15–17 | 05 Sáu đặc điểm: tổng quan, dân cư & địa bàn, phát triển & văn hóa | slide 7, 8, 9 | 3 |
| 18–20 | 06 Quan điểm của Đảng, Nhà nước (năm quan điểm) | slide 10, 11, 12 | 4 |
| 21–25 | 07 Chính sách dân tộc (mỗi lĩnh vực một màn) | slide 13, 14, 15 | 5 |
| 26–27 | 08 Tổng kết: 2 → 2 → 3 → 6 → 5 → 5 | slide 15 (lời kết) | 5 |
| 28 | Trò chơi (mở trang `/tro-choi`) | — | — |
| 29 | Cảm ơn | — | — |

Thiết kế dùng font Be Vietnam Pro (tự lưu trong `app/fonts/`), bảng màu
chàm và son. Bản đồ Việt Nam vẽ từ dữ liệu Natural Earth (phạm vi công
cộng), có quần đảo Hoàng Sa và Trường Sa.

Ảnh trang phục truyền thống ở màn "Phát triển & văn hóa":
["A colorful discovery"](https://commons.wikimedia.org/wiki/File:A_colorful_discovery.jpg),
tác giả AlbMem, giấy phép
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), qua
Wikimedia Commons (đã thu nhỏ còn 1200 × 800). Nguồn ảnh ghi ngay dưới ảnh
trên slide.
