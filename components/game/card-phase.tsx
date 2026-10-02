"use client";

import Image from "next/image";
import { cardById, type CardId } from "@/content/game-cards";
import { CARD_BACK_SRC } from "@/content/game-teams";

const CATEGORY_LABEL = {
  attack: "Tấn công",
  penalty: "Rủi ro",
  forward: "May mắn",
} as const;

const CATEGORY_COLOR = {
  attack: "#ff6b5e",
  penalty: "#8fb4ff",
  forward: "#4fd88a",
} as const;

/* Tỉ lệ khung theo đúng ảnh card-back.png (442×668). */
const CARD_W = 186;
const CARD_H = Math.round((CARD_W * 668) / 442);

/**
 * "Chọn 1 trong 3 thẻ": ba thẻ úp (card-back.png), bấm một thẻ để lật bằng
 * CSS 3D — nội dung không lộ trước. Sau khi lật, hiện mô tả và nút áp dụng.
 */
export function CardPhase({
  teamName,
  teamColor,
  cards,
  chosenIndex,
  onPick,
  onApply,
}: {
  teamName: string;
  teamColor: string;
  cards: readonly CardId[];
  /** null: chưa chọn thẻ nào. */
  chosenIndex: number | null;
  onPick: (index: number) => void;
  onApply: () => void;
}) {
  const chosen = chosenIndex === null ? null : cardById(cards[chosenIndex]);

  return (
    <div className="panel-in flex w-[730px] flex-col items-center gap-5 rounded-[28px] bg-dem/96 px-8 py-7 shadow-2xl ring-2 ring-vang/60">
      <p className="text-heading font-extrabold">
        🎁 <span style={{ color: teamColor }}>{teamName}</span> — chọn 1 trong 3 thẻ
      </p>

      <div className="flex gap-7">
        {cards.map((cardId, i) => {
          const isChosen = chosenIndex === i;
          return (
            <button
              key={i}
              type="button"
              disabled={chosenIndex !== null}
              onClick={() => onPick(i)}
              className={`flip-card cursor-pointer rounded-[20px] transition-opacity disabled:cursor-default ${
                chosenIndex !== null && !isChosen ? "opacity-35" : ""
              }`}
              style={{
                width: CARD_W,
                height: CARD_H,
                boxShadow: isChosen ? "0 0 0 4px #e3b44b, 0 0 32px 8px rgb(227 180 75 / 0.55)" : undefined,
              }}
              aria-label={`Thẻ ${i + 1}`}
            >
              <div className="flip-inner relative size-full" style={isChosen ? undefined : { animation: "none" }}>
                <div className="flip-face absolute inset-0 overflow-hidden rounded-[20px]">
                  <Image src={CARD_BACK_SRC} alt="Mặt sau thẻ" fill unoptimized className="object-cover" />
                </div>
                <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[20px] bg-paper p-3 text-center text-cham">
                  {isChosen ? <CardFace cardId={cardId} /> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {chosen ? (
        <div className="fade-in flex w-full items-center justify-between gap-6">
          <p className="text-body text-pretty">
            <span className="font-extrabold" style={{ color: CATEGORY_COLOR[chosen.category] }}>
              {chosen.icon} {chosen.name}:
            </span>{" "}
            {chosen.description}
          </p>
          <button
            type="button"
            autoFocus
            onClick={onApply}
            className="shrink-0 cursor-pointer rounded-2xl bg-vang px-7 py-3 text-body font-extrabold text-cham transition-colors hover:bg-on-cham"
          >
            {chosen.category === "attack" && chosen.swap !== "leader" ? "Chọn đội" : "Áp dụng"}
          </button>
        </div>
      ) : (
        <p className="text-label text-on-cham-soft">Bấm vào một thẻ để lật.</p>
      )}
    </div>
  );
}

function CardFace({ cardId }: { cardId: CardId }) {
  const card = cardById(cardId);
  return (
    <>
      <span className="text-[64px] leading-none" aria-hidden="true">
        {card.icon}
      </span>
      <p className={`${card.name.length > 16 ? "text-body" : "text-lead"} leading-tight font-extrabold`}>{card.name}</p>
      <p className="text-label font-bold" style={{ color: card.category === "forward" ? "#188a4a" : "#c4161c" }}>
        {card.swap ? "⇄ đổi vị trí" : `${card.cells > 0 ? `+${card.cells}` : card.cells} ô`}
      </p>
      <p className="text-label font-semibold text-cham-soft">{CATEGORY_LABEL[card.category]}</p>
    </>
  );
}
