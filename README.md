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
| → ↓ PageDown Space | Slide hoặc bước tiếp theo (dùng được với bút trình chiếu) |
| ← ↑ PageUp | Lùi lại |
| Home / End | Về slide đầu / cuối |
| 1, 2, 3 | Nhảy tới slide mở đầu Phần 1, 2, 3 |
| F | Bật/tắt toàn màn hình |
| P | Mở màn hình người trình bày |

Rê chuột sẽ hiện các nút điều khiển ở giữa mép dưới; để yên khoảng 2 giây
thì nút và con trỏ tự ẩn. Trên màn hình cảm ứng có thể vuốt trái/phải.

Các slide 5–6, 7–9 và 13–15 nằm chung một trang: bấm "tiếp" sẽ đổi nội dung
trong trang (bố cục, bản đồ, danh sách lĩnh vực giữ nguyên). Số ở góc phải
chân slide là số slide theo bản Word (ví dụ `07 / 15`).

## Màn hình người trình bày

1. Nối laptop với TV ở chế độ **mở rộng màn hình** (Extend), không dùng
   chế độ nhân đôi.
2. Mở bài, kéo cửa sổ trình duyệt sang TV, bấm **F** để toàn màn hình.
3. Bấm **P** để mở cửa sổ người trình bày, rồi kéo cửa sổ này về màn hình
   laptop.

Cửa sổ người trình bày hiện slide đang chiếu, slide kế tiếp, lời thuyết
trình và câu chuyển người theo bản Word, cùng đồng hồ bấm giờ. Bấm chuyển
slide ở cửa sổ nào thì cửa sổ kia cũng chuyển theo.

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

Câu hỏi nằm ở `content/quiz.ts`: 62 câu, gồm 24 câu E5, 22 câu RON95 và 16
câu khó. Thứ tự rút câu được xáo mỗi ván mới, và mỗi lần một câu được rút,
bốn đáp án lại được xáo vị trí A–D. Vì vậy gặp lại câu cũ thì đáp án đúng
nằm ở ô khác. Cách xếp được lưu cùng ván chơi, nên tải lại trang không làm
đáp án đổi chỗ giữa chừng.

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
| Tên người trình bày từng phần | `content/parts.ts` → `SECTIONS[].presenter` |
| Tiêu đề và lời thuyết trình 15 slide | `content/script.ts` |
| Chữ trên từng slide | `components/slides/` (mỗi phần một file) |
| Câu hỏi của trò chơi | `content/quiz.ts` |

Trường nào để trống thì không hiển thị trên slide.

> **Cần đối chiếu:** bản Word ghi nội dung thứ ba của Cương lĩnh dân tộc cần
> bổ sung nguyên văn. Slide 6 đang dùng cách diễn đạt trong giáo trình
> ("Liên hiệp công nhân tất cả các dân tộc"). Nếu tài liệu gốc khác, sửa ở
> `components/slides/program-steps.tsx`.

## Cấu trúc bài

| Trang web | Slide (bản Word) | Thành viên |
| --- | --- | --- |
| Bìa, Nội dung | — | — |
| Phần 1 | 1–3 | 1 |
| Phần 2 | 4–6 | 2 |
| Phần 3 | 7–9, 10–12, 13–15 | 3, 4, 5 |
| Trò chơi (mở trang `/tro-choi`) | — | — |
| Cảm ơn | — | — |

Thiết kế dùng font Be Vietnam Pro, bảng màu chàm và son. Bản đồ Việt Nam vẽ
từ dữ liệu Natural Earth (phạm vi công cộng), có quần đảo Hoàng Sa và
Trường Sa.
