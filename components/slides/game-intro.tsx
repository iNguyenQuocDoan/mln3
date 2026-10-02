import Link from "next/link";
import { BrocadeBand } from "@/components/art/brocade-band";
import { TeamAvatar } from "@/components/game/team-piece";
import { ANSWER_SECONDS, DICE_WHEN_CORRECT, DICE_WHEN_WRONG } from "@/content/game-balance";
import { MAX_TEAMS, MIN_TEAMS, TEAM_DEFS } from "@/content/game-teams";
import { delay, stagger } from "@/components/motion";

/**
 * Slide dẫn vào trò chơi. Nút "Vào đường đua" chuyển trang ngay trong
 * trình duyệt nên TV vẫn giữ chế độ toàn màn hình.
 */
export function GameIntroSlide() {
  return (
    <div className="absolute inset-0 bg-cham text-on-cham">
      <BrocadeBand id="band-game" className="absolute inset-x-0 top-0" />

      <div className="absolute top-40 left-32 w-250">
        <p className="anim-fade text-lead font-bold text-on-cham-soft" style={delay(150)}>
          Trò chơi ôn tập
        </p>
        <h2 className="anim-rise mt-6 text-display font-extrabold" style={stagger(0)}>
          Đường đua
          <br />
          đại đoàn kết
        </h2>
        <p className="anim-rise mt-8 text-lead text-on-cham-soft" style={stagger(1)}>
          Từ {MIN_TEAMS} đến {MAX_TEAMS} đội, mỗi lượt có {ANSWER_SECONDS} giây trả lời một câu hỏi.
          Đúng được lắc {DICE_WHEN_CORRECT} xúc xắc, sai hoặc hết giờ vẫn được lắc {DICE_WHEN_WRONG}
          . Hành trình xuyên Việt từ Hà Nội về Cần Thơ, đích đến là khối đại đoàn kết toàn dân tộc.
        </p>
        <ul className="anim-rise mt-12 flex flex-wrap gap-4" style={stagger(2)}>
          {TEAM_DEFS.map((team) => (
            <li
              key={team.id}
              className="flex items-center gap-2 rounded-full py-1.5 pr-5 pl-1.5 text-body font-extrabold"
              style={{ background: team.color, color: team.ink }}
            >
              <TeamAvatar teamId={team.id} size={40} />
              {team.name}
            </li>
          ))}
        </ul>
        <Link
          href="/tro-choi"
          className="anim-rise mt-16 inline-block rounded-2xl bg-son px-14 py-6 text-heading font-extrabold text-paper transition-colors hover:bg-[#a51217] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
          style={stagger(3)}
        >
          Vào đường đua
        </Link>
      </div>
    </div>
  );
}
