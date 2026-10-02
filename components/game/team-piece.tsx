"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { teamDef } from "./palette";

/**
 * Quân cờ của một đội: nhân vật chibi riêng, viền màu nhận diện riêng.
 * Đổi ảnh idle ⇄ move theo `isMoving` (không dùng sprite sheet).
 */
export function TeamPiece({
  teamId,
  size = 80,
  isMoving = false,
  highlight = false,
}: {
  teamId: string;
  size?: number;
  isMoving?: boolean;
  highlight?: boolean;
}) {
  const def = teamDef(teamId);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={def.name}>
      <div
        className="grid size-full place-items-center rounded-full transition-transform"
        style={{
          background: "rgb(11 15 38 / 0.6)",
          boxShadow: highlight
            ? `0 0 0 4px ${def.color}, 0 0 22px 8px ${def.color}aa`
            : `0 0 0 3px ${def.color}`,
          transform: highlight ? "scale(1.12)" : undefined,
        }}
      >
        <Image
          src={isMoving ? def.move : def.idle}
          alt={def.name}
          width={size}
          height={size}
          unoptimized
          className="size-[92%] object-contain object-bottom"
        />
      </div>
    </div>
  );
}

/** Ảnh đại diện nhỏ gọn (idle) dùng trong danh sách và chip: bảng xếp
 *  hạng, chọn mục tiêu, màn chờ... không cần hoạt ảnh di chuyển. */
export function TeamAvatar({ teamId, size = 32 }: { teamId: string; size?: number }) {
  const def = teamDef(teamId);
  return (
    <span
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full ring-2"
      style={
        {
          width: size,
          height: size,
          background: "rgb(11 15 38 / 0.55)",
          "--tw-ring-color": def.color,
        } as CSSProperties
      }
    >
      <Image
        src={def.idle}
        alt={def.name}
        width={size}
        height={size}
        unoptimized
        className="size-[92%] object-contain object-bottom"
      />
    </span>
  );
}
