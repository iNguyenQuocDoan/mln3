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

## Chỉnh nội dung

| Muốn sửa | File |
| --- | --- |
| Tên nhóm, giảng viên (hiện ở slide bìa) | `content/parts.ts` → `DECK_INFO` |
| Tên người trình bày từng phần | `content/parts.ts` → `SECTIONS[].presenter` |
| Tiêu đề và lời thuyết trình 15 slide | `content/script.ts` |
| Chữ trên từng slide | `components/slides/` (mỗi phần một file) |

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
| Cảm ơn | — | — |

Thiết kế dùng font Be Vietnam Pro, bảng màu chàm và son. Bản đồ Việt Nam vẽ
từ dữ liệu Natural Earth (phạm vi công cộng), có quần đảo Hoàng Sa và
Trường Sa.
