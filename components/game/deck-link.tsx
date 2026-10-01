"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** id của slide giới thiệu trò chơi trong bộ slide (content/slides.tsx). */
const GAME_SLIDE = "tro-choi";

/**
 * Liên kết quay về slide "Trò chơi". Chuyển trang ngay trong trình duyệt để
 * TV giữ chế độ toàn màn hình. Bộ slide đọc slide cần hiện từ #… trên địa
 * chỉ trang ngay lần vẽ đầu, lúc Next.js chưa kịp đổi địa chỉ; vì vậy gắn
 * sẵn #tro-choi vào địa chỉ hiện tại trước khi chuyển, để không chớp slide
 * bìa.
 */
export function DeckLink({
  className,
  role,
  children,
}: {
  className?: string;
  role?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/#${GAME_SLIDE}`}
      scroll={false}
      role={role}
      className={className}
      onClick={() =>
        window.history.replaceState(window.history.state, "", `#${GAME_SLIDE}`)
      }
    >
      {children}
    </Link>
  );
}
