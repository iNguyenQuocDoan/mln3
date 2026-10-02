"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { toggleFullscreen, useStageScale } from "@/components/stage";
import { tileAt } from "@/content/game-board";
import { cardById } from "@/content/game-cards";
import { questionById, validateQuestionBank } from "@/content/game-questions";
import { TEAM_COUNT } from "@/content/game-teams";
import { GameBackgroundMusic } from "./background-music";
import { CardPhase } from "./card-phase";
import { CompactRanking } from "./compact-ranking";
import { Dice } from "./dice";
import {
  answerQuestion,
  applyCard,
  chooseTarget,
  continueToNextTeam,
  createGame,
  currentTeam,
  nextTeam,
  pickCard,
  rollDice,
  settleMove,
  settleRoll,
  startGame,
  type GameState,
  type TeamId,
  type TurnOutcome,
} from "./engine";
import { BOARD_SIZE, GameBoard } from "./game-board";
import { IntroScreen } from "./intro-screen";
import { MCControls } from "./mc-controls";
import { ConfirmDialog, MenuButton } from "./mc-menu";
import { buildSteps, LAND_PAUSE_MS, ROLL_MS, TILE_STEP_MS } from "./motion";
import { teamDef } from "./palette";
import { QuestionPanel } from "./question-panel";
import { preloadSfx, setSfxMuted, sfx, stopAllSfx } from "./game-audio";
import {
  clearUndoHistory,
  ensureGame,
  hasUndo,
  saveGame,
  undo,
  updateGame,
  updateSettings,
  useGame,
  useSettings,
} from "./stores";
import { TargetSelector } from "./target-selector";
import { WinnerScreen } from "./winner-screen";

/* Chỉ hai bước chạy tự động, đều nằm GIỮA một lượt và không bao giờ đổi đội:
 * xúc xắc dừng lăn, và quân cờ đi xong từng ô. Chúng không ghi vào lịch sử
 * hoàn tác — Undo luôn quay về trước một thao tác của MC. */
const AUTO = { record: false };

/** Ván hiển thị trước khi đọc xong bộ nhớ trình duyệt (năm đội ở KHỞI HÀNH). */
const BLANK_GAME = createGame();

/** "Đường đua đại đoàn kết": vẽ trên khung 1920x1080, như bộ slide. */
export function BoardGame() {
  const scale = useStageScale();
  const stored = useGame();
  const game = stored ?? BLANK_GAME;
  const settings = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [winnerDismissed, setWinnerDismissed] = useState(false);
  /** Trang giới thiệu/luật chơi trước bàn cờ — màn hình thuần UI, không đụng
   *  tới GameState; chỉ có ý nghĩa khi ván CHƯA bắt đầu (xem `view` dưới đây). */
  const [introChoice, setIntroChoice] = useState<"intro" | "game">("intro");
  /** Tiến trình hoạt ảnh của pha "moving" đang chạy; chỉ cập nhật trong
   *  callback của setInterval. Vị trí hiển thị được suy ra lúc render. */
  const [anim, setAnim] = useState<{ phase: GameState["phase"]; step: number } | null>(null);
  const previousKind = useRef<string | null>(null);

  // Mở route: có ván đang dở thì giữ, không thì tạo ván "chưa bắt đầu".
  // Không bao giờ tự bắt đầu — MC bấm "BẮT ĐẦU TRÒ CHƠI".
  useEffect(() => {
    ensureGame();
  }, []);

  // Trang giới thiệu chỉ có ý nghĩa trước khi ván bắt đầu: một ván đang dở
  // hoặc đã kết thúc (đọc lại từ bộ nhớ trình duyệt) luôn vào thẳng bàn cờ,
  // bất kể `introChoice` — tính trong lúc render, không cần effect riêng.
  const view: "intro" | "game" = game.phase.kind === "not-started" ? introChoice : "game";

  // Nạp sẵn SFX khi mở route; rời route thì dừng mọi hiệu ứng đang kêu.
  useEffect(() => {
    preloadSfx();
    return stopAllSfx;
  }, []);

  useEffect(() => {
    setSfxMuted(!settings.sound);
  }, [settings.sound]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const errors = validateQuestionBank();
    if (errors.length === 0) console.info("Question Bank Validation: PASS");
    else errors.forEach((error) => console.warn(error));
  }, []);

  // Hiệu ứng âm thanh theo diễn biến, mỗi khi đổi sang một pha mới. Âm
  // thanh chỉ là phản hồi: không có gì ở đây làm thay đổi ván chơi.
  // (Xúc xắc và lật thẻ kêu ngay lúc bấm; bước chân, ô 🎁 và về đích kêu
  // theo hoạt ảnh di chuyển bên dưới.)
  useEffect(() => {
    const phase = game.phase;
    const before = previousKind.current;
    previousKind.current = phase.kind;
    if (before === phase.kind) return;
    if (phase.kind === "waiting-roll") sfx.correct();
    if (phase.kind === "turn-complete" && phase.outcome.kind === "wrong") sfx.wrong();
    if (phase.kind === "moving" && phase.cause === "card") {
      const me = currentTeam(game).id;
      const move = phase.moves[0];
      if (phase.moves.length === 2) sfx.swap();
      else if (move.teamId !== me) sfx.attack();
      else if (move.to > move.from) sfx.forward();
      else sfx.backward();
    }
    if (phase.kind === "game-over" && before !== null) sfx.victory();
  }, [game]);

  // Xúc xắc lăn xong thì quân cờ mới bắt đầu đi.
  const rolling = game.phase.kind === "rolling" ? game.phase : null;
  useEffect(() => {
    if (!rolling) return;
    const timer = window.setTimeout(() => updateGame((s) => settleRoll(s, Math.random), AUTO), ROLL_MS);
    return () => window.clearTimeout(timer);
  }, [rolling]);

  // Quân cờ đi qua từng ô (ảnh move.png), dừng thì về idle.png, đứng lại một
  // lúc ở ô vừa đến rồi mới sang pha kế tiếp CỦA CÙNG LƯỢT (lật thẻ hoặc
  // turn-complete) — không bao giờ chuyển đội.
  const moving = game.phase.kind === "moving" ? game.phase : null;
  useEffect(() => {
    if (!moving) return;
    const maxSteps = Math.max(1, ...moving.moves.map((m) => buildSteps(m.from, m.to).length));
    const next = moving.next;
    const finishing = next.kind === "game-over" && next.reason === "finish";
    let step = 0;
    let settle: number | undefined;
    const timer = window.setInterval(() => {
      step++;
      setAnim({ phase: moving, step });
      if (moving.cause === "dice") sfx.moveStep();
      if (step >= maxSteps) {
        window.clearInterval(timer);
        // Vừa dừng chân: về đích hoặc ô 🎁 thì báo bằng âm thanh trước khi
        // chuyển pha (màn chiến thắng / chọn thẻ hiện sau khoảng dừng).
        if (finishing) sfx.finish();
        else if (next.kind === "card-selection") sfx.gift();
        settle = window.setTimeout(
          () => updateGame(settleMove, AUTO),
          moving.cause === "dice" || finishing ? LAND_PAUSE_MS : 600,
        );
      }
    }, TILE_STEP_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(settle);
    };
  }, [moving]);

  const positions: Record<TeamId, number> = {};
  const movingTeamIds = new Set<TeamId>();
  let landed = false;
  if (moving) {
    const step = anim && anim.phase === moving ? anim.step : 0;
    for (const move of moving.moves) {
      const steps = buildSteps(move.from, move.to);
      positions[move.teamId] = step === 0 ? move.from : steps[Math.min(step - 1, steps.length - 1)];
      if (step < steps.length) movingTeamIds.add(move.teamId);
    }
    landed = movingTeamIds.size === 0 && step > 0;
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    if (key === "f") toggleFullscreen();
    if (key === "m") updateSettings({ sound: !settings.sound });
    if (key === "z") undo();
    if (event.key === "Escape") {
      setConfirmReset(false);
      setMenuOpen(false);
    }
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /** Chơi lại: về màn "chưa bắt đầu" (nhạc nền không bị ảnh hưởng). */
  function newGame() {
    saveGame(createGame());
    clearUndoHistory();
    setWinnerDismissed(false);
    setConfirmReset(false);
    setMenuOpen(false);
    setIntroChoice("game");
  }

  const stageStyle: CSSProperties = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    visibility: scale ? "visible" : "hidden",
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-cham text-on-cham select-none">
      <div className="stage" style={stageStyle}>
        {view === "intro" ? <IntroScreen onEnter={() => setIntroChoice("game")} /> : null}

        <div
          className="absolute"
          style={{
            left: (1920 - BOARD_SIZE) / 2,
            top: (1080 - BOARD_SIZE) / 2,
            visibility: view === "game" ? "visible" : "hidden",
          }}
        >
          <GameBoard
            game={game}
            positions={positions}
            movingTeamIds={movingTeamIds}
            activeTeamId={
              game.phase.kind === "game-over" || game.phase.kind === "not-started" ? null : currentTeam(game).id
            }
          >
            <CenterArea
              game={game}
              landed={landed}
              winnerDismissed={winnerDismissed}
              onReopenWinner={() => setWinnerDismissed(false)}
              onPlayAgain={newGame}
              onShowIntro={() => setIntroChoice("intro")}
            />
          </GameBoard>
        </div>

        {view === "game" ? (
          <div className="absolute top-7 right-12 z-50">
            <MenuButton open={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
          </div>
        ) : null}

        {view === "game" && game.phase.kind === "game-over" && !winnerDismissed ? (
          <WinnerScreen
            game={game}
            winnerId={game.phase.winnerId}
            order={game.phase.ranking}
            onPlayAgain={newGame}
            onShowRanking={() => setWinnerDismissed(true)}
          />
        ) : null}

        {/* Một nhạc nền duy nhất cho cả route: không gắn với pha / lượt / ván. */}
        <GameBackgroundMusic
          on={settings.music}
          volume={settings.musicVolume}
          winnerShown={game.phase.kind === "game-over" && !winnerDismissed}
          sfxOn={settings.sound}
          onToggle={() => updateSettings({ music: !settings.music })}
          onVolumeChange={(musicVolume) => updateSettings({ musicVolume })}
          onToggleSfx={() => updateSettings({ sound: !settings.sound })}
        />

        {menuOpen && view === "game" ? (
          <MCControls
            soundOn={settings.sound}
            canUndo={hasUndo()}
            onToggleSound={() => updateSettings({ sound: !settings.sound })}
            onUndo={() => undo()}
            onReset={() => setConfirmReset(true)}
            onClose={() => setMenuOpen(false)}
          />
        ) : null}

        {confirmReset ? (
          <ConfirmDialog
            title="Chơi lại từ đầu?"
            text="Năm đội quay về KHỞI HÀNH, số câu đúng về 0 và toàn bộ câu hỏi được dùng lại từ đầu."
            confirmLabel="Chơi lại từ đầu"
            onCancel={() => setConfirmReset(false)}
            onConfirm={newGame}
          />
        ) : null}
      </div>
    </main>
  );
}

const BIG_BUTTON =
  "cursor-pointer whitespace-nowrap rounded-2xl px-8 py-4 text-lead font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/** Vùng giữa bàn cờ tùy pha: màn chờ bắt đầu, câu hỏi, xúc xắc, thẻ, kết
 *  thúc lượt, chọn mục tiêu, hay bảng xếp hạng cuối ván. */
function CenterArea({
  game,
  landed,
  winnerDismissed,
  onReopenWinner,
  onPlayAgain,
  onShowIntro,
}: {
  game: GameState;
  /** Quân cờ vừa đi hết số bước, đang dừng ở ô đích của nước đi. */
  landed: boolean;
  winnerDismissed: boolean;
  onReopenWinner: () => void;
  onPlayAgain: () => void;
  /** "← Xem lại luật chơi": chỉ hợp lệ trước khi bấm BẮT ĐẦU (game chưa chạy). */
  onShowIntro: () => void;
}) {
  const phase = game.phase;
  const def = teamDef(currentTeam(game).id);
  const next = teamDef(nextTeam(game).id);
  const continueLabel = `TIẾP TỤC → ${next.name.toUpperCase()}`;
  const onContinue = () => updateGame((s) => continueToNextTeam(s, Math.random));

  if (phase.kind === "not-started") {
    return (
      <Hub game={game}>
        <Title />
        <p className="text-lead font-extrabold text-vang">{TEAM_COUNT} ĐỘI ĐÃ SẴN SÀNG</p>
        <p className="text-label text-on-cham-soft text-balance">
          Trả lời đúng mới được đổ xúc xắc · Đáp ô 🎁 được lật thẻ · Về đích trước là thắng
        </p>
        <button
          type="button"
          autoFocus
          onClick={() => updateGame((s) => startGame(s, Math.random))}
          className={`${BIG_BUTTON} bg-son text-paper hover:bg-[#a51217]`}
        >
          ▶ BẮT ĐẦU TRÒ CHƠI
        </button>
        <button
          type="button"
          onClick={onShowIntro}
          className="cursor-pointer text-label font-bold text-on-cham-soft underline-offset-4 hover:text-on-cham hover:underline"
        >
          ← Xem lại luật chơi
        </button>
      </Hub>
    );
  }

  const question =
    phase.kind === "question" || phase.kind === "waiting-roll"
      ? questionById(phase.questionId)
      : phase.kind === "turn-complete" && phase.outcome.kind === "wrong"
        ? questionById(phase.outcome.questionId)
        : undefined;
  if (question) {
    const picked =
      phase.kind === "waiting-roll"
        ? phase.picked
        : phase.kind === "turn-complete" && phase.outcome.kind === "wrong"
          ? phase.outcome.picked
          : null;
    return (
      <div className="relative z-20">
        <QuestionPanel
          key={question.id}
          question={question}
          teamName={def.name}
          teamColor={def.color}
          teamInk={def.ink}
          picked={picked}
          correct={picked === null ? null : phase.kind === "waiting-roll"}
          continueLabel={continueLabel}
          onPick={(option) => updateGame((s) => answerQuestion(s, option))}
          onRoll={() => {
            sfx.dice();
            updateGame((s) => rollDice(s, Math.random));
          }}
          onContinue={onContinue}
        />
      </div>
    );
  }

  if (phase.kind === "card-selection" || phase.kind === "card-result") {
    return (
      <div className="relative z-20">
        <CardPhase
          teamName={def.name}
          teamColor={def.color}
          cards={phase.cards}
          chosenIndex={phase.kind === "card-result" ? phase.cardIndex : null}
          onPick={(index) => {
            sfx.cardFlip();
            updateGame((s) => pickCard(s, index));
          }}
          onApply={() => updateGame(applyCard)}
        />
      </div>
    );
  }

  if (phase.kind === "target-selection") {
    return (
      <div className="relative z-20">
        <TargetSelector
          cardId={phase.cardId}
          attackerName={def.name}
          candidates={phase.candidates}
          positions={Object.fromEntries(game.teams.map((t) => [t.id, t.position]))}
          onChoose={(targetId) => {
            const next = updateGame((s) => chooseTarget(s, targetId));
            // Không quân nào phải dời (đội bị nhắm đã ở KHỞI HÀNH, hay hai đội
            // đứng cùng ô): vẫn báo hiệu thẻ vừa dùng.
            if (next && next.phase.kind !== "moving") (cardById(phase.cardId).swap ? sfx.swap : sfx.attack)();
          }}
        />
      </div>
    );
  }

  if (phase.kind === "game-over") {
    const winner = teamDef(phase.winnerId);
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-heading font-extrabold" style={{ color: winner.color }}>
          🏆 {winner.name.toUpperCase()} CHIẾN THẮNG
        </p>
        {phase.reason === "questions-exhausted" ? (
          <p className="text-label text-on-cham-soft">Đã dùng hết câu hỏi · xếp hạng theo vị trí</p>
        ) : null}
        <CompactRanking game={game} order={phase.ranking} />
        {winnerDismissed ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReopenWinner}
              className="cursor-pointer rounded-2xl border-2 border-on-cham-soft/40 px-6 py-3 text-label font-bold text-on-cham-soft hover:bg-on-cham/10"
            >
              Màn chiến thắng
            </button>
            <button
              type="button"
              onClick={onPlayAgain}
              className="cursor-pointer rounded-2xl bg-vang px-6 py-3 text-label font-extrabold text-cham hover:bg-on-cham"
            >
              Chơi lại
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  if (phase.kind === "turn-complete") {
    const tile = tileAt(currentTeam(game).position);
    return (
      <Hub game={game}>
        <TeamBadge label="Lượt vừa xong" name={def.name} color={def.color} ink={def.ink} />
        <p className="text-lead leading-tight font-extrabold">
          {def.name.toUpperCase()} ĐÃ HOÀN THÀNH LƯỢT
        </p>
        <p className="text-body text-on-cham-soft">
          Vị trí: <span className="font-extrabold text-on-cham">{tile.name}</span> · ô {tile.id}
        </p>
        <p className="min-h-8 text-label font-bold text-vang">{outcomeLine(game, phase.outcome)}</p>
        <button
          type="button"
          autoFocus
          onClick={onContinue}
          className={`${BIG_BUTTON} bg-vang text-cham hover:bg-on-cham`}
        >
          {continueLabel}
        </button>
      </Hub>
    );
  }

  // rolling, moving: xúc xắc và chú thích nước đi.
  return (
    <Hub game={game}>
      <Title />
      <TeamBadge label="Lượt hiện tại" name={def.name} color={def.color} ink={def.ink} />
      <Dice value={game.diceValue} rolling={phase.kind === "rolling"} color={def.color} />
      <p className="min-h-8 text-label font-bold text-on-cham">{statusLine(game, landed)}</p>
    </Hub>
  );
}

/** Bố cục chung của vùng giữa: nội dung chính bên trái, xếp hạng gọn bên phải. */
function Hub({ game, children }: { game: GameState; children: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-6 px-8">
      <div className="flex flex-1 flex-col items-center gap-4 text-center">{children}</div>
      <div className="flex flex-col items-center gap-3">
        <CompactRanking game={game} />
        <p className="text-label text-on-cham-soft">🎁 = ô được lật thẻ</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <p className="text-heading leading-tight font-extrabold">
      ĐƯỜNG ĐUA
      <br />
      ĐẠI ĐOÀN KẾT
    </p>
  );
}

function TeamBadge({ label, name, color, ink }: { label: string; name: string; color: string; ink: string }) {
  return (
    <div>
      <p className="text-label font-bold tracking-wide text-on-cham-soft uppercase">{label}</p>
      <p className="mt-1 rounded-full px-8 py-1.5 text-heading font-extrabold" style={{ background: color, color: ink }}>
        {name.toUpperCase()}
      </p>
    </div>
  );
}

/** Kể lại lượt vừa xong: số xúc xắc, thẻ lật được và đội bị nhắm (nếu có). */
function outcomeLine(game: GameState, outcome: TurnOutcome): string {
  if (outcome.kind === "wrong") return "Trả lời sai · đứng yên";
  const dice = `🎲 ${outcome.dice}`;
  if (!outcome.cardId) return `${dice} · không có 🎁`;
  const card = cardById(outcome.cardId);
  const target = outcome.targetId ? ` → ${teamDef(outcome.targetId).name}` : "";
  const effect = card.swap ? "đổi vị trí" : `${card.cells > 0 ? "+" : ""}${card.cells} ô`;
  return `${dice} · 🎁 ${card.icon} ${card.name}${target} (${effect})`;
}

/** Chú thích ngắn cho khán giả: đang đổ, đi mấy bước, tới ô nào, có 🎁 không. */
function statusLine(game: GameState, landed: boolean): string {
  const phase = game.phase;
  const actor = teamDef(currentTeam(game).id).name;
  if (phase.kind === "rolling") return "Đang đổ xúc xắc…";
  if (phase.kind !== "moving") return "";
  const move = phase.moves[0];
  const tile = tileAt(move.to);
  if (phase.moves.length === 2) {
    const [a, b] = phase.moves.map((m) => teamDef(m.teamId).name);
    return `🔄 ${a} ↔ ${b}: đổi vị trí`;
  }
  if (phase.cause === "dice") {
    if (!landed) return `${actor} đi ${game.diceValue} bước…`;
    if (tile.type === "finish") return `🏁 ${actor} về ĐÍCH ĐẾN!`;
    return tile.hasGift ? `📍 ${tile.name} · 🎁 được lật thẻ!` : `📍 ${tile.name} · không có 🎁`;
  }
  const delta = move.to - move.from;
  const mover = teamDef(move.teamId).name;
  if (move.teamId !== currentTeam(game).id) return `${actor} tấn công ${mover}: lùi ${-delta} ô`;
  return `${mover} ${delta > 0 ? "tiến" : "lùi"} ${Math.abs(delta)} ô nhờ thẻ`;
}
