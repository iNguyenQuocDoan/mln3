"use client";

import type { ReactNode } from "react";
import { BrocadeBand } from "@/components/art/brocade-band";
import {
  ANSWER_SECONDS,
  CATCH_UP,
  DICE_WHEN_CORRECT,
  DICE_WHEN_WRONG,
  LUCKY_STREAK,
} from "@/content/game-balance";
import { MAX_TEAMS, MIN_TEAMS, TEAM_DEFS } from "@/content/game-teams";
import { BALANCE_COLORS } from "./leaderboard";
import { TeamAvatar } from "./team-piece";

/**
 * Trang giới thiệu / luật chơi — màn hình ĐẦU TIÊN khi mở /tro-choi. Thuần
 * hiển thị: không đụng tới `GameState`. MC đọc xong rồi bấm "Vào trò chơi"
 * để mở bàn cờ; ván vẫn chờ MC chọn số đội và bấm "Bắt đầu".
 */
export function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const lowestGap = Math.min(...CATCH_UP.map((level) => level.gap));
  return (
    <div className="panel-in absolute inset-0 bg-dem text-on-cham">
      <div className="grid h-[984px] grid-cols-[1fr_880px] gap-20 px-28 pt-22">
        <div className="flex flex-col">
          <p className="text-[30px] font-semibold text-vang">Trò chơi ôn tập MLN131</p>
          <h1 className="mt-4 text-[112px] leading-[0.98] font-extrabold tracking-[-0.02em]">
            Đường đua
            <br />
            đại đoàn kết
          </h1>
          <p className="mt-8 text-[34px] leading-snug text-on-cham-soft">
            Từ {MIN_TEAMS} đến {MAX_TEAMS} đội cùng đi một hành trình xuyên Việt, từ Hà Nội về Cần Thơ. Trả
            lời câu hỏi về bài Dân tộc để giành thêm bước đi.
          </p>
          <ul className="mt-10 flex gap-3">
            {TEAM_DEFS.map((team) => (
              <li key={team.id}>
                <TeamAvatar teamId={team.id} size={84} />
              </li>
            ))}
          </ul>
          <div className="mt-auto pb-16">
            <button
              type="button"
              autoFocus
              onClick={onEnter}
              className="cursor-pointer rounded-2xl bg-son px-14 py-5 text-[36px] leading-none font-extrabold text-paper transition-colors hover:bg-[#a51217] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
            >
              Vào trò chơi
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-10 pt-3">
          <section>
            <h2 className="text-[40px] font-extrabold">Cách chơi</h2>
            <ol className="mt-5 flex flex-col gap-4 text-[30px] leading-snug">
              <Step n={1}>Mỗi đội lắc một xúc xắc. Điểm cao đi trước.</Step>
              <Step n={2}>Mỗi lượt, đội có {ANSWER_SECONDS} giây để trả lời một câu hỏi.</Step>
              <Step n={3}>
                Đúng lắc {DICE_WHEN_CORRECT} xúc xắc, sai hoặc hết giờ vẫn được lắc {DICE_WHEN_WRONG}.
              </Step>
              <Step n={4}>Dừng ở ô có hộp quà thì được mở một thẻ bất ngờ.</Step>
              <Step n={5}>Đội về đích đầu tiên thắng.</Step>
            </ol>
          </section>

          <section className="rounded-[28px] bg-nhua px-8 py-7">
            <h2 className="text-[34px] font-extrabold">Ai gặp xui cũng có cơ hội</h2>
            <dl className="mt-4 flex flex-col gap-3 text-[28px] leading-snug">
              <Rule color={BALANCE_COLORS.boost} name="Tiếp sức">
                Bị bỏ xa từ {lowestGap} ô thì mỗi lần lắc được tiến thêm, mở hộp quà không gặp thẻ lùi.
              </Rule>
              <Rule color={BALANCE_COLORS.lucky} name="Bùa may mắn">
                Sai {LUCKY_STREAK} lượt liền thì lượt sau được thêm 1 xúc xắc.
              </Rule>
              <Rule color={BALANCE_COLORS.shield} name="Bảo hộ">
                Đội đứng cuối không bị thẻ tấn công nhắm tới.
              </Rule>
            </dl>
          </section>
        </div>
      </div>
      <BrocadeBand id="band-intro" height={96} className="absolute inset-x-0 bottom-0" />
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-vang text-[26px] font-extrabold text-cham tabular-nums">
        {n}
      </span>
      <span className="pt-1">{children}</span>
    </li>
  );
}

function Rule({ color, name, children }: { color: string; name: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-extrabold" style={{ color }}>
        {name}
      </dt>
      <dd className="text-on-cham-soft">{children}</dd>
    </div>
  );
}
