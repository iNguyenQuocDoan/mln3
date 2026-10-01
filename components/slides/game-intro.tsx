import Link from "next/link";
import { BrocadeBand } from "@/components/art/brocade-band";
import { Car } from "@/components/game/car";
import { PUMPS, TEAM_COLORS } from "@/components/game/palette";
import { PumpGlyph } from "@/components/game/pump";
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
        <p
          className="anim-fade text-lead font-bold text-on-cham-soft"
          style={delay(150)}
        >
          Trò chơi ôn tập
        </p>
        <h2
          className="anim-rise mt-6 text-display font-extrabold"
          style={stagger(0)}
        >
          Đường đua
          <br />
          tiếp nhiên liệu
        </h2>
        <p
          className="anim-rise mt-8 text-lead text-on-cham-soft"
          style={stagger(1)}
        >
          Các đội gieo xúc xắc chọn thứ tự, rồi lần lượt cử người lên chọn cây
          xăng và trả lời câu hỏi về bài vừa trình bày. Đội về đích trước
          thắng.
        </p>
        <ul className="anim-rise mt-12 flex gap-14" style={stagger(2)}>
          {PUMPS.map((pump) => (
            <li key={pump.id} className="flex items-center gap-4">
              <PumpGlyph pump={pump} size={52} />
              <span className="text-lead font-extrabold">{pump.name}</span>
              <span className="text-body text-on-cham-soft">
                {pump.liters}
              </span>
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

      <div
        className="anim-fade absolute top-72 right-32 flex flex-col gap-10"
        style={delay(700)}
        aria-hidden="true"
      >
        {TEAM_COLORS.slice(0, 4).map((color, i) => (
          <Car
            key={color}
            color={color}
            width={300}
            style={{ marginLeft: i % 2 === 0 ? 0 : 120 }}
          />
        ))}
      </div>
    </div>
  );
}
