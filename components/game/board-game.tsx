"use client";

import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrocadeBand } from "@/components/art/brocade-band";
import { toggleFullscreen, useStageScale } from "@/components/stage";
import { cardById } from "@/content/game-cards";
import { questionById, validateQuestionBank } from "@/content/game-questions";
import { GameBackgroundMusic } from "./background-music";
import { DICE_TRAY_ID, loadDiceBox, rollDice3d, type ThrowAim } from "./dice-3d";
import {
  answerQuestion,
  applyCard,
  beginFirstTurn,
  chooseTarget,
  continueToNextTeam,
  createGame,
  currentTeam,
  diceMove,
  markDiceThrown,
  pickCard,
  rollDice,
  rollForOrder,
  setTeamCount,
  settleMove,
  settleRoll,
  startGame,
  type GameState,
  type TeamId,
} from "./engine";
import { CENTER_SIZE, GameBoard, STEP } from "./game-board";
import { GameHistory, ResultsDialog } from "./game-history";
import { IntroScreen } from "./intro-screen";
import { Leaderboard } from "./leaderboard";
import { MCControls } from "./mc-controls";
import { ConfirmDialog, MenuButton } from "./mc-menu";
import { buildSteps, LAND_PAUSE_MS, ROLL_MS, TILE_STEP_MS } from "./motion";
import { teamDef } from "./palette";
import { preloadSfx, setSfxMuted, sfx, stopAllSfx } from "./game-audio";
import { QuestionScreen } from "./question-screen";
import {
  clearGameHistory,
  ensureGame,
  hasUndo,
  startNewGame,
  undo,
  updateGame,
  updateSettings,
  useGame,
  useGameHistory,
  useSettings,
} from "./stores";
import { ThrowHand } from "./throw-hand";
import { moveEquation, TurnBanner, TurnCard, type TurnActions } from "./turn-panel";
import { WinnerScreen } from "./winner-screen";

/* Chỉ hai bước chạy tự động, đều nằm GIỮA một lượt và không bao giờ đổi đội:
 * xúc xắc dừng lăn, và quân cờ đi xong từng ô. Chúng không ghi vào lịch sử
 * hoàn tác — Undo luôn quay về trước một thao tác của MC. */
const AUTO = { record: false };

/** Ván hiển thị trước khi đọc xong bộ nhớ trình duyệt (bố cục cố định). */
const BLANK_GAME = createGame();

/** Bàn cờ nằm bên phải khung 1920×1080; cột lượt chơi chiếm phần bên trái. */
const BOARD_LEFT = 860;
const BOARD_TOP = 30;

/** Xúc xắc 3D nằm lại trên khay một lúc sau khi dừng để khán giả đọc số. */
const ARENA_CLOSE_MS = 1700;

/** "Đường đua đại đoàn kết": vẽ trên khung 1920×1080, như bộ slide. */
export function BoardGame() {
  const scale = useStageScale();
  const stored = useGame();
  const game = stored ?? BLANK_GAME;
  const settings = useSettings();
  const history = useGameHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState<"reset" | "history" | null>(null);
  /** Hộp "Kết quả các ván" mở từ menu người dẫn. */
  const [resultsOpen, setResultsOpen] = useState(false);
  const [winnerDismissed, setWinnerDismissed] = useState(false);
  /** Trang giới thiệu/luật chơi trước bàn cờ — chỉ có ý nghĩa khi ván chưa bắt đầu. */
  const [introChoice, setIntroChoice] = useState<"intro" | "game">("intro");
  /** Đang chờ xúc xắc 3D lăn xong: khóa nút lắc để không bấm hai lần. */
  const [busy, setBusy] = useState(false);
  /** Khay xúc xắc 3D đang mở giữa bàn cờ (thay chỗ bảng xếp hạng một lúc). */
  const [arena, setArena] = useState<{ color: string; label: string } | null>(null);
  /** Câu hỏi đã trả lời xong và MC đã đóng màn câu hỏi để đội ra bàn cờ ném. */
  const [throwingFor, setThrowingFor] = useState<string | null>(null);
  /** Tiến trình hoạt ảnh của pha "moving" đang chạy; chỉ cập nhật trong
   *  callback của setInterval. Vị trí hiển thị được suy ra lúc render. */
  const [anim, setAnim] = useState<{
    phase: GameState["phase"];
    step: number;
  } | null>(null);
  const previousKind = useRef<string | null>(null);
  const arenaTimer = useRef<number | undefined>(undefined);

  // Mở route: có ván đang dở thì giữ, không thì tạo ván "chưa bắt đầu".
  useEffect(() => {
    ensureGame();
  }, []);

  // Nạp sẵn xúc xắc 3D (lỗi hay máy yếu thì tự dùng xúc xắc 2D).
  useEffect(() => {
    void loadDiceBox();
    return () => window.clearTimeout(arenaTimer.current);
  }, []);

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

  // Hiệu ứng âm thanh theo diễn biến, mỗi khi đổi sang một pha mới.
  useEffect(() => {
    const phase = game.phase;
    const before = previousKind.current;
    previousKind.current = phase.kind;
    if (before === phase.kind) return;
    if (phase.kind === "waiting-roll") (phase.correct ? sfx.correct : sfx.wrong)();
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

  // Xúc xắc dừng thì quân cờ mới bắt đầu đi. Xúc xắc 3D đã lăn xong trên
  // màn hình nên chỉ chờ một nhịp ngắn; xúc xắc 2D chờ hết hoạt ảnh lăn.
  const rolling = game.phase.kind === "rolling" ? game.phase : null;
  useEffect(() => {
    if (!rolling) return;
    const timer = window.setTimeout(
      () => updateGame((s) => settleRoll(s, Math.random), AUTO),
      rolling.physical ? 350 : ROLL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [rolling]);

  // Tải lại trang giữa lúc xúc xắc 3D đang lăn: lượt lắc đã được ghi lại nên
  // tự đổ thay (xúc xắc 2D), không cho lắc lại.
  const stranded =
    !busy &&
    (game.phase.kind === "order-roll" || game.phase.kind === "waiting-roll") &&
    game.phase.thrown === true;
  useEffect(() => {
    if (!stranded) return;
    updateGame(
      (s) => (s.phase.kind === "order-roll" ? rollForOrder(s, Math.random) : rollDice(s, Math.random)),
      AUTO,
    );
  }, [stranded]);

  // Quân cờ đi qua từng ô, dừng lại một lúc ở ô vừa đến rồi mới sang pha kế
  // tiếp CỦA CÙNG LƯỢT (mở hộp quà hoặc hết lượt) — không bao giờ chuyển đội.
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
  /** Số ô quân cờ đã đi trong hoạt ảnh hiện tại. */
  const step = moving && anim && anim.phase === moving ? anim.step : 0;
  if (moving) {
    for (const move of moving.moves) {
      const steps = buildSteps(move.from, move.to);
      positions[move.teamId] = step === 0 ? move.from : steps[Math.min(step - 1, steps.length - 1)];
      if (step < steps.length) movingTeamIds.add(move.teamId);
    }
    landed = movingTeamIds.size === 0 && step > 0;
  }

  // Quãng đường lượt này: hiện khi xúc xắc đã dừng (xúc xắc 2D còn lăn thì chưa
  // hiện, để không lộ kết quả) và trong lúc quân cờ đi.
  const plannedMove = diceMove(game);
  const rollingHidden = game.phase.kind === "rolling" && !game.phase.physical;
  const move =
    plannedMove && !rollingHidden
      ? { ...plannedMove, taken: Math.min(step, plannedMove.to - plannedMove.from) }
      : null;

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    if (key === "f") toggleFullscreen();
    if (key === "m") updateSettings({ sound: !settings.sound });
    if (key === "z" && !busy) undo();
    if (event.key === "Escape") {
      setConfirm(null);
      setMenuOpen(false);
      setResultsOpen(false);
    }
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /**
   * Ném xúc xắc 3D theo cú ném `aim` của người chơi lên khay giữa bàn cờ rồi
   * đưa số chấm cho `apply` (null nếu không dùng được 3D — luật chơi sẽ tự đổ
   * và hiện xúc xắc 2D). `apply` chạy cùng nhịp với lúc mở khóa khay nên màn
   * hình không nháy lại pha cũ.
   */
  async function throwDice(
    count: number,
    color: string,
    label: string,
    aim: ThrowAim,
    apply: (faces: number[] | null) => void,
  ) {
    window.clearTimeout(arenaTimer.current);
    setBusy(true);
    setArena({ color, label });
    const faces = await rollDice3d(count, color, aim);
    apply(faces);
    setBusy(false);
    if (faces) arenaTimer.current = window.setTimeout(() => setArena(null), ARENA_CLOSE_MS);
    else setArena(null);
  }

  /** Chơi lại: về màn "chưa bắt đầu" với cùng số đội, câu hỏi trộn lại, hộp quà rải lại. */
  function newGame() {
    startNewGame(game.teams.length);
    setWinnerDismissed(false);
    setConfirm(null);
    setMenuOpen(false);
    setArena(null);
    setIntroChoice("game");
  }

  const actions: TurnActions = {
    onSetTeamCount: (count) => updateGame((s) => setTeamCount(s, count, Math.random), AUTO),
    onStart: () => updateGame(startGame),
    onShowIntro: () => setIntroChoice("intro"),
    onBeginFirstTurn: () => updateGame(beginFirstTurn),
    onPick: (option) => updateGame((s) => answerQuestion(s, option)),
    onTimeUp: () => updateGame((s) => answerQuestion(s, null)),
    onShowQuestion: () => setThrowingFor(null),
    onPickCard: (index) => {
      sfx.cardFlip();
      updateGame((s) => pickCard(s, index));
    },
    onApplyCard: () => updateGame(applyCard),
    onChooseTarget: (targetId) => {
      const phase = game.phase;
      const next = updateGame((s) => chooseTarget(s, targetId));
      // Không quân nào phải dời (đội bị nhắm đã ở KHỞI HÀNH, hay hai đội
      // đứng cùng ô): vẫn báo hiệu thẻ vừa dùng.
      if (next && next.phase.kind !== "moving" && phase.kind === "target-selection") {
        (cardById(phase.cardId).swap ? sfx.swap : sfx.attack)();
      }
    },
    onContinue: () => updateGame(continueToNextTeam),
    onPlayAgain: newGame,
    onShowWinner: () => setWinnerDismissed(false),
  };

  /** Đội vừa ném xong một xúc xắc chọn thứ tự (chưa áp dụng vào ván khi đang lăn). */
  async function throwForOrder(aim: ThrowAim) {
    const phase = game.phase;
    if (busy || phase.kind !== "order-roll" || phase.thrown) return;
    const teamId = phase.queue[0];
    if (!teamId) return;
    const def = teamDef(teamId);
    const landing = throwDice(1, def.color, `${def.name} ném chọn thứ tự`, aim, (faces) =>
      updateGame((s) => rollForOrder(s, Math.random, faces?.[0]), AUTO),
    );
    // Ghi ngay là đã ném (cũng là mốc hoàn tác) trong lúc xúc xắc còn lăn.
    updateGame(markDiceThrown);
    await landing;
  }

  /** Đội vừa ném xúc xắc của lượt (sau khi trả lời câu hỏi). */
  async function throwForTurn(aim: ThrowAim) {
    const phase = game.phase;
    if (busy || phase.kind !== "waiting-roll" || phase.thrown) return;
    const def = teamDef(currentTeam(game).id);
    const landing = throwDice(phase.plan.dice, def.color, `${def.name} vừa ném`, aim, (faces) =>
      updateGame((s) => rollDice(s, Math.random, faces ?? undefined), AUTO),
    );
    updateGame(markDiceThrown);
    await landing;
  }

  const phase = game.phase;
  const activeTeamId =
    phase.kind === "game-over" ||
    phase.kind === "not-started" ||
    phase.kind === "order-roll" ||
    phase.kind === "order-ready"
      ? null
      : currentTeam(game).id;

  // Câu hỏi chiếm trọn màn hình tới khi MC đưa đội ra bàn cờ ném xúc xắc.
  const asking =
    phase.kind === "question" ||
    (phase.kind === "waiting-roll" && !busy && !phase.thrown && throwingFor !== phase.questionId)
      ? phase
      : null;

  // Khay đang chờ một đội tự tay ném: chọn thứ tự, hoặc lượt sau khi trả lời.
  let pendingThrow: {
    kind: "order" | "turn";
    key: string;
    count: number;
    color: string;
    label: string;
  } | null = null;
  if (view === "game" && !busy) {
    if (phase.kind === "order-roll" && !phase.thrown && phase.queue[0]) {
      const def = teamDef(phase.queue[0]);
      pendingThrow = {
        key: `order-${def.id}-${phase.rolls[def.id]?.length ?? 0}`,
        count: 1,
        color: def.color,
        kind: "order",
        label: `${def.name} ném chọn thứ tự`,
      };
    } else if (phase.kind === "waiting-roll" && !phase.thrown && throwingFor === phase.questionId) {
      const def = teamDef(currentTeam(game).id);
      pendingThrow = {
        key: `turn-${phase.questionId}`,
        count: phase.plan.dice,
        color: def.color,
        kind: "turn",
        label: `${def.name} ném ${phase.plan.dice} xúc xắc`,
      };
    }
  }
  // Trước khi vào lượt đầu, mọi đội còn ở Khởi hành: giữa bàn cờ hiện kết quả các ván trước.
  const showHistory =
    history.length > 0 &&
    (phase.kind === "not-started" || phase.kind === "order-roll" || phase.kind === "order-ready");
  const openQuestion = view === "game" && asking ? questionById(asking.questionId) : undefined;

  const stageStyle: CSSProperties = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    visibility: scale ? "visible" : "hidden",
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-dem text-on-cham select-none">
      <div className="stage bg-dem" style={stageStyle}>
        {view === "intro" ? <IntroScreen onEnter={() => setIntroChoice("game")} /> : null}

        <div className="absolute inset-0" style={{ visibility: view === "game" ? "visible" : "hidden" }}>
          {/* Cột lượt chơi */}
          <div className="absolute top-10 bottom-10 left-10 flex w-195 flex-col gap-4">
            <TurnBanner game={game} winnerId={phase.kind === "game-over" ? phase.winnerId : null} />
            <TurnCard
              game={game}
              landed={landed}
              stepsTaken={move?.taken ?? 0}
              busy={busy}
              winnerDismissed={winnerDismissed}
              actions={actions}
            />
            <div className="flex h-16 items-center gap-4">
              <MenuButton open={menuOpen} onClick={() => setMenuOpen((open) => !open)} />
              <GameBackgroundMusic
                on={settings.music}
                volume={settings.musicVolume}
                winnerShown={phase.kind === "game-over" && !winnerDismissed}
                sfxOn={settings.sound}
                onToggle={() => updateSettings({ music: !settings.music })}
                onVolumeChange={(musicVolume) => updateSettings({ musicVolume })}
                onToggleSfx={() => updateSettings({ sound: !settings.sound })}
              />
            </div>
          </div>

          {/* Bàn cờ */}
          <div className="absolute" style={{ left: BOARD_LEFT, top: BOARD_TOP }}>
            <GameBoard
              game={game}
              positions={positions}
              movingTeamIds={movingTeamIds}
              activeTeamId={activeTeamId}
              track={
                move
                  ? {
                      from: move.from,
                      to: move.to,
                      taken: move.taken,
                      color: teamDef(move.teamId).color,
                      ink: teamDef(move.teamId).ink,
                    }
                  : null
              }
            >
              {arena ? (
                <DiceFelt color={arena.color} label={arena.label}>
                  {move && game.lastRoll ? (
                    <MoveTotal values={game.lastRoll.values} boost={game.lastRoll.boost} total={move.total} />
                  ) : null}
                </DiceFelt>
              ) : pendingThrow ? (
                <DiceFelt color={pendingThrow.color} label={pendingThrow.label}>
                  <ThrowHand
                    key={pendingThrow.key}
                    count={pendingThrow.count}
                    color={pendingThrow.color}
                    label={pendingThrow.label}
                    onThrow={pendingThrow.kind === "order" ? throwForOrder : throwForTurn}
                  />
                </DiceFelt>
              ) : showHistory ? (
                <GameHistory records={history} limit={7} className="size-full" />
              ) : (
                <Leaderboard
                  game={game}
                  activeTeamId={activeTeamId}
                  order={phase.kind === "game-over" ? phase.ranking : undefined}
                />
              )}
            </GameBoard>
          </div>

          {/* Lớp vẽ xúc xắc 3D, đặt trùng khay giữa bàn cờ. */}
          <div
            id={DICE_TRAY_ID}
            className="pointer-events-none absolute z-40"
            style={{
              left: BOARD_LEFT + STEP,
              top: BOARD_TOP + STEP,
              width: CENTER_SIZE,
              height: CENTER_SIZE,
            }}
          />
        </div>

        {openQuestion ? (
          <QuestionScreen
            game={game}
            question={openQuestion}
            onPick={actions.onPick}
            onTimeUp={actions.onTimeUp}
            onGoThrow={() => setThrowingFor(openQuestion.id)}
          />
        ) : null}

        {view === "game" && phase.kind === "game-over" && !winnerDismissed ? (
          <WinnerScreen
            game={game}
            winnerId={phase.winnerId}
            order={phase.ranking}
            history={history}
            onPlayAgain={newGame}
            onShowRanking={() => setWinnerDismissed(true)}
          />
        ) : null}

        {menuOpen && view === "game" ? (
          <MCControls
            soundOn={settings.sound}
            canUndo={hasUndo() && !busy}
            onToggleSound={() => updateSettings({ sound: !settings.sound })}
            onUndo={() => undo()}
            onReset={() => setConfirm("reset")}
            onShowResults={() => setResultsOpen(true)}
            onClearHistory={() => setConfirm("history")}
            onClose={() => setMenuOpen(false)}
          />
        ) : null}

        {confirm === "reset" ? (
          <ConfirmDialog
            title="Chơi lại từ đầu?"
            text="Các đội quay về Khởi hành, số câu đúng về 0, câu hỏi được trộn lại và hộp quà được rải lại."
            confirmLabel="Chơi lại từ đầu"
            onCancel={() => setConfirm(null)}
            onConfirm={newGame}
          />
        ) : null}

        {resultsOpen ? <ResultsDialog records={history} onClose={() => setResultsOpen(false)} /> : null}

        {confirm === "history" ? (
          <ConfirmDialog
            title="Xóa lịch sử các ván?"
            text="Kết quả các ván đã chơi và danh sách câu đã hỏi sẽ bị xóa. Ván đang chơi vẫn giữ nguyên."
            confirmLabel="Xóa lịch sử"
            onCancel={() => setConfirm(null)}
            onConfirm={() => {
              clearGameHistory();
              setConfirm(null);
            }}
          />
        ) : null}
      </div>
    </main>
  );
}

/** Tổng quãng đường ngay trên khay khi xúc xắc vừa dừng: "4 + 5 + 1 tiếp sức = 10 ô". */
function MoveTotal({ values, boost, total }: { values: number[]; boost: number; total: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-28 flex items-baseline justify-center gap-4 text-on-cham">
      {values.length > 1 || boost > 0 ? (
        <span className="text-[40px] font-bold text-on-cham-soft">{moveEquation(values, boost)} =</span>
      ) : (
        <span className="text-[40px] font-bold text-on-cham-soft">Đi</span>
      )}
      <span className="text-[88px] leading-none font-extrabold tabular-nums">{total}</span>
      <span className="text-[44px] font-extrabold">ô</span>
    </div>
  );
}

/** Mặt khay nỉ chàm viền thổ cẩm, nơi đội ném và xúc xắc 3D lăn. */
function DiceFelt({ color, label, children }: { color: string; label: string; children?: ReactNode }) {
  return (
    <div
      className="fade-in relative flex size-full flex-col overflow-hidden rounded-[28px] ring-4"
      style={
        {
          background: "radial-gradient(120% 90% at 50% 45%, #2a3577 0%, #1c2553 55%, #121836 100%)",
          "--tw-ring-color": color,
        } as CSSProperties
      }
    >
      <BrocadeBand id="felt-top" height={36} />
      <p className="mt-6 text-center text-[30px] font-bold text-on-cham-soft">{label}</p>
      <div className="flex-1" />
      <BrocadeBand id="felt-bottom" height={36} />
      {children}
    </div>
  );
}
