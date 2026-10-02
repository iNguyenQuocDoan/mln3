import Image from "next/image";
import type { ReactNode } from "react";
import type { DeckPhoto } from "@/content/photos";
import { keepWords } from "@/content/typography";

/**
 * Ảnh trong khung có kích thước cố định. `cover` cắt ảnh cho đầy khung và
 * giữ chủ thể theo `photo.focus`; `contain` giữ nguyên toàn bộ ảnh (bản đồ).
 * Ảnh đã nén sẵn nên dùng nguyên tệp và tải ngay, không qua bộ tối ưu.
 */
export function Photo({
  photo,
  fit = "cover",
  className = "",
}: {
  photo: DeckPhoto;
  fit?: "cover" | "contain";
  /** Kích thước khung (rộng, cao) và vị trí. */
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.image}
        alt={photo.alt}
        fill
        sizes="50vw"
        unoptimized
        loading="eager"
        className={fit === "cover" ? "object-cover" : "object-contain"}
        style={{ objectPosition: photo.focus }}
      />
    </div>
  );
}

/**
 * Chú thích dưới ảnh: dòng mô tả (tên dân tộc) và nguồn ảnh; bấm vào tên
 * nguồn sẽ mở bài gốc trong tab mới.
 */
export function PhotoCaption({
  photo,
  dark = false,
  className = "",
}: {
  photo: DeckPhoto;
  /** Ảnh nằm trên nền chàm. */
  dark?: boolean;
  className?: string;
}) {
  if (!photo.caption && !photo.source) return null;
  return (
    <figcaption className={`text-label ${className}`}>
      {photo.caption ? (
        <span className={`block ${dark ? "text-on-cham" : "text-cham"}`}>
          {keepWords(photo.caption)}
        </span>
      ) : null}
      {photo.source ? (
        <span
          className={`block ${dark ? "text-on-cham-soft" : "text-cham-soft"}`}
        >
          Nguồn:{" "}
          <SourceLink url={photo.source.url} dark={dark}>
            {photo.source.site}
          </SourceLink>
        </span>
      ) : null}
    </figcaption>
  );
}

/**
 * Liên kết tới trang nguồn ảnh. Mở trong tab mới để bài trình chiếu vẫn
 * giữ nguyên ở tab cũ.
 */
export function SourceLink({
  url,
  dark = false,
  children,
}: {
  url: string;
  /** Liên kết nằm trên nền chàm. */
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`underline decoration-1 underline-offset-4 transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 ${
        dark
          ? "hover:text-vang focus-visible:outline-vang"
          : "hover:text-son focus-visible:outline-son"
      }`}
    >
      {children}
    </a>
  );
}
