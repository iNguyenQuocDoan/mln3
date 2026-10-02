"use client";

import { TeamAvatar } from "./team-piece";
import { TEAM_DEFS } from "@/content/game-teams";

/**
 * Trang giới thiệu / luật chơi — màn hình ĐẦU TIÊN khi mở /tro-choi, trước
 * cả bàn cờ. Thuần hiển thị: không đụng tới `GameState` (không rút câu hỏi,
 * không đổ xúc xắc, không tăng lượt). MC đọc xong rồi mới bấm "VÀO TRÒ CHƠI"
 * để mở bàn cờ — bàn cờ vẫn dừng ở "chưa bắt đầu" cho tới khi bấm tiếp
 * "BẮT ĐẦU TRÒ CHƠI" (hai nút, hai việc khác nhau).
 */
export function IntroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="panel-in absolute inset-0 flex flex-col items-center justify-center gap-7 bg-cham px-20 text-center text-on-cham">
      <div>
        <p className="text-lead font-bold tracking-wide text-on-cham-soft uppercase">
          🇻🇳 Hành trình xuyên Việt
        </p>
        <h1 className="mt-2 text-banner leading-tight font-extrabold">
          ĐƯỜNG ĐUA
          <br />
          ĐẠI ĐOÀN KẾT
        </h1>
        <p className="mt-3 text-lead font-bold text-vang">Trả lời đúng · Đổ xúc xắc · Về đích</p>
        <p className="mx-auto mt-3 max-w-[920px] text-body text-on-cham-soft text-balance">
          5 đội cùng tham gia hành trình xuyên Việt. Trả lời đúng câu hỏi để giành quyền đổ xúc xắc
          và tiến về đích — đội đầu tiên chạm đích sẽ chiến thắng.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <RuleCard icon="❓" title="TRẢ LỜI" text="Chọn đáp án đúng để giành quyền di chuyển." />
        <RuleCard icon="🎲" title="ĐỔ XÚC XẮC" text="Trả lời đúng mới được đổ xúc xắc D6." />
        <RuleCard icon="🎁" title="SĂN HỘP QUÀ" text="Đáp xuống ô quà để lật thẻ, nhận hiệu ứng bất ngờ." />
        <RuleCard icon="🏆" title="VỀ ĐÍCH" text="Đội đầu tiên chạm đích sẽ chiến thắng ngay." />
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2 text-body font-bold text-on-cham-soft">
          <FlowStep icon="❓" label="CÂU HỎI" />
          <Arrow />
          <FlowStep icon="✅" label="ĐÚNG" tone="#4fd88a" />
          <Arrow />
          <FlowStep icon="🎲" label="XÚC XẮC" />
          <Arrow />
          <FlowStep icon="🏃" label="DI CHUYỂN" />
          <Arrow />
          <FlowStep icon="🎁" label="Ô QUÀ?" />
          <Arrow />
          <FlowStep icon="🃏" label="LẬT THẺ" />
          <Arrow />
          <FlowStep icon="➡️" label="TIẾP TỤC" tone="#e3b44b" />
        </div>
        <div className="flex items-center gap-2 text-body font-bold text-on-cham-soft">
          <FlowStep icon="❌" label="SAI" tone="#ff6b5e" />
          <Arrow />
          <FlowStep icon="⏸️" label="ĐỨNG YÊN" />
          <Arrow />
          <FlowStep icon="➡️" label="TIẾP TỤC" tone="#e3b44b" />
        </div>
      </div>

      <div className="flex items-center gap-5 text-label font-semibold text-on-cham-soft">
        <span>⚡ Tiến lên</span>
        <span>🍌 Lùi lại</span>
        <span>💥 Tấn công</span>
        <span>🔄 Đổi vị trí</span>
      </div>

      <ul className="flex flex-wrap justify-center gap-4">
        {TEAM_DEFS.map((team) => (
          <li
            key={team.id}
            className="flex items-center gap-2 rounded-full py-1.5 pr-5 pl-1.5 text-body font-extrabold"
            style={{ background: team.color, color: team.ink }}
          >
            <TeamAvatar teamId={team.id} size={48} />
            {team.name}
          </li>
        ))}
      </ul>

      <button
        type="button"
        autoFocus
        onClick={onEnter}
        className="cursor-pointer rounded-2xl bg-son px-16 py-5 text-lead font-extrabold text-paper transition-colors hover:bg-[#a51217] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-vang"
      >
        VÀO TRÒ CHƠI
      </button>
    </div>
  );
}

function RuleCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex w-[300px] flex-col items-center gap-2 rounded-[24px] bg-dem/70 px-6 py-6 ring-1 ring-on-cham-soft/25">
      <span className="text-[52px] leading-none" aria-hidden="true">
        {icon}
      </span>
      <p className="text-body font-extrabold tracking-wide">{title}</p>
      <p className="text-label text-on-cham-soft text-balance">{text}</p>
    </div>
  );
}

function FlowStep({ icon, label, tone }: { icon: string; label: string; tone?: string }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full bg-dem/70 px-3.5 py-1.5 ring-1 ring-on-cham-soft/25"
      style={tone ? { color: tone } : undefined}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-on-cham-soft/50" aria-hidden="true">
      →
    </span>
  );
}
