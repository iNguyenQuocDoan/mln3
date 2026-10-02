import { useEffect } from "react";
import { PHOTOS } from "@/content/photos";

/**
 * Tải sẵn mọi ảnh của bài vào bộ nhớ đệm trình duyệt sau khi mở bài, để
 * khi tới slide có ảnh thì ảnh đã sẵn sàng, không hiện dần lên trước lớp.
 */
export function useWarmDeckPhotos() {
  useEffect(() => {
    for (const photo of Object.values(PHOTOS)) {
      const image = new window.Image();
      image.decoding = "async";
      image.src = photo.image.src;
    }
  }, []);
}
