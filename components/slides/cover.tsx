import { Photo } from "@/components/art/photo";
import { delay } from "@/components/motion";
import { DECK_INFO } from "@/content/parts";
import { PHOTOS } from "@/content/photos";

/*
 * Slide bìa: ảnh bản đồ trên nền trống đồng phủ kín cả màn hình (làm nền
 * qua CoverBackdrop, nên không có viền trắng khi cửa sổ khác tỉ lệ 16:9).
 * Bản đồ nằm bên trái ảnh nên chữ đặt ở vùng trống đồng bên phải.
 */
export function CoverBackdrop() {
  return <Photo photo={PHOTOS.map} className="h-full w-full" />;
}

export function CoverSlide() {
  return (
    <div className="absolute inset-0">
      {/*
       * Cột chữ rộng 840px, bắt đầu sau nhãn Trường Sa của ảnh. Tiêu đề viết
       * hoa cỡ 64px: dòng dài nhất ("TRONG THỜI KỲ QUÁ ĐỘ") rộng khoảng
       * 815px nên mỗi dòng vẫn nằm trên một hàng.
       */}
      <div className="absolute inset-y-0 right-32 flex w-210 flex-col justify-center">
        <p className="anim-fade text-lead font-bold" style={delay(150)}>
          {DECK_INFO.course}
        </p>

        <h1
          className="anim-rise mt-8 text-[64px] leading-[1.3] font-extrabold uppercase"
          style={delay(300)}
        >
          Dân tộc
          <br />
          trong thời kỳ quá độ
          <br />
          lên chủ nghĩa xã hội
        </h1>

        {DECK_INFO.group || DECK_INFO.instructor ? (
          <div
            className="anim-fade mt-12 space-y-2 text-lead text-cham-soft"
            style={delay(700)}
          >
            {DECK_INFO.group ? <p>{DECK_INFO.group}</p> : null}
            {DECK_INFO.instructor ? (
              <p>Giảng viên: {DECK_INFO.instructor}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
