"use client";

import type { ReactNode } from "react";
import { BrocadeBand } from "@/components/art/brocade-band";
import { ANSWER_SECONDS, DICE_WHEN_CORRECT, DICE_WHEN_WRONG } from "@/content/game-balance";
import { MAX_TEAMS, MIN_TEAMS, TEAM_DEFS } from "@/content/game-teams";
import { TeamAvatar } from "./team-piece";

/**
 * Trang giới thiệu / luật chơi — màn hình ĐẦU TIÊN khi mở /tro-choi. Thuần
 * hiển thị: không đụng tới `GameState`. MC đọc xong rồi bấm "Vào trò chơi"
 * để mở bàn cờ; ván vẫn chờ MC chọn số đội và bấm "Bắt đầu".
 */
export function IntroScreen({ onEnter }: { onEnter: () => void }) {
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
              <Step n={1}>Các đội đi lần lượt theo số thứ tự, {TEAM_DEFS[0].name} đi trước.</Step>
              <Step n={2}>Mỗi lượt, đội có {ANSWER_SECONDS} giây để trả lời một câu hỏi.</Step>
              <Step n={3}>
                Đúng lắc {DICE_WHEN_CORRECT} xúc xắc, sai hoặc hết giờ vẫn được lắc {DICE_WHEN_WRONG}.
              </Step>
              <Step n={4}>Dừng ở ô có hộp quà thì được mở một thẻ bất ngờ.</Step>
              <Step n={5}>Đội về đích đầu tiên thắng.</Step>
            </ol>
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
