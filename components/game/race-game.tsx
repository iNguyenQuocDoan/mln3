"use client";

import {
  useEffect,
  useEffectEvent,
  useState,
  type CSSProperties,
} from "react";
import { toggleFullscreen, useStageScale } from "@/components/stage";
import { QUIZ } from "@/content/quiz";
import { Car } from "./car";
import { DiceScreen } from "./dice-screen";
import {
  answer,
  arrive,
  choosePump,
  createGame,
  endEarly,
  nextTeam,
  proceed,
  resume,
  rollDie,
  roundOf,
  startRace,
  steal,
  teamsToRoll,
  type GameState,
  type Move,
  type MysteryEvent,
  type PumpId,
} from "./engine";
import { EventPanel } from "./event-panel";
import { Lobby } from "./lobby";
import { ConfirmDialog, McMenu, MenuButton } from "./mc-menu";
import { moveMs } from "./motion";
import { FinishOverlay, StartLights, TurnBanner } from "./overlays";
import { EVENTS, PUMPS, TEAM_COLORS } from "./palette";
import { PumpButton } from "./pump";
import { QuestionPanel } from "./question-panel";
import { Results } from "./results";
import { setMuted, sfx } from "./sound";
import {
  readGame,
  readRecent,
  rememberAsked,
  saveGame,
  updateGame,
  updateSettings,
  useGame,
  useSettings,
} from "./stores";
import { Track } from "./track";

type View = "lobby" | "race" | "results";
type Confirm = "stop" | "abandon";

/* Tiếng của từng sự kiện bình ???, phát đúng lúc thẻ lật xong. */
const REVEAL_SOUND: Record<MysteryEvent, () => void> = {
  hard: sfx.reveal,
  nitro: sfx.reveal,
  steal: sfx.reveal,
  flat: sfx.flat,
  police: sfx.police,
};
const REVEAL_AFTER_MS = 650;

function playMove(move: Move) {
  const seconds = moveMs(move) / 1000;
  if (move.kind === "fuel") sfx.drive(seconds);
  else if (move.kind === "nitro") sfx.nitro(seconds);
  else if (move.kind === "steal") sfx.steal();
}

/** Trò chơi "Đường đua tiếp nhiên liệu", vẽ trên khung 1920x1080. */
export function RaceGame() {
  const scale = useStageScale();
  const game = useGame();
  const settings = useSettings();
  const [view, setView] = useState<View>("lobby");
  const [starting, setStarting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  useEffect(() => {
    setMuted(!settings.sound);
  }, [settings.sound]);

  // Xe chạy xong hiệu ứng thì mới sang lượt kế tiếp (hoặc về đích).
  const moving =
    view === "race" && game?.phase.kind === "moving" ? game.phase.move : null;
  const onArrived = useEffectEvent(() => {
    const next = updateGame(arrive);
    if (next?.phase.kind === "finished") sfx.win();
  });
  useEffect(() => {
    if (!moving) return;
    const timer = window.setTimeout(() => onArrived(), moveMs(moving));
    return () => window.clearTimeout(timer);
  }, [moving]);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if ((event.target as HTMLElement | null)?.closest("input")) return;
    if (event.key === "f" || event.key === "F") toggleFullscreen();
    if (event.key === "m" || event.key === "M")
      updateSettings({ sound: !settings.sound });
    if (event.key === "Escape") {
      setConfirm(null);
      setMenuOpen(false);
    }
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function start() {
    saveGame(
      createGame(
        {
          teamNames: settings.teamNames,
          trackLength: settings.trackLength,
          answerSeconds: settings.answerSeconds,
        },
        QUIZ,
        Math.random,
        readRecent(),
      ),
    );
    setView("race");
  }

  /** Gieo xúc xắc cho một đội; kết quả được lưu ngay vào localStorage. */
  function roll(team: number) {
    updateGame((state) => rollDie(state, team, Math.random));
    sfx.dice();
  }

  /** MC gieo hộ mọi đội còn phải gieo. */
  function rollRest() {
    updateGame((state) =>
      teamsToRoll(state).reduce(
        (game, team) => rollDie(game, team, Math.random),
        state,
      ),
    );
    sfx.dice();
  }

  function launch() {
    const next = updateGame(startRace);
    if (next?.phase.kind !== "choose") return;
    setStarting(true);
    sfx.lights();
  }

  function resumeSaved() {
    const saved = readGame();
    if (!saved) return;
    saveGame(resume(saved));
    setView("race");
  }

  function choose(pump: PumpId) {
    const next = updateGame((state) =>
      choosePump(state, pump, QUIZ, Math.random),
    );
    sfx.pump();
    if (next?.phase.kind === "event") {
      const play = REVEAL_SOUND[next.phase.event];
      window.setTimeout(play, REVEAL_AFTER_MS);
    }
  }

  function pick(index: number | null) {
    const next = updateGame((state) => answer(state, index, QUIZ));
    if (next?.phase.kind !== "answered") return;
    rememberAsked(next.phase.questionId);
    if (next.phase.correct) sfx.correct();
    else sfx.wrong();
  }

  function advance() {
    const next = updateGame(proceed);
    if (next?.phase.kind === "moving") playMove(next.phase.move);
  }

  function rob(target: number) {
    const next = updateGame((state) => steal(state, target));
    if (next?.phase.kind === "moving") playMove(next.phase.move);
  }

  function stopRace() {
    updateGame(endEarly);
    setConfirm(null);
    setMenuOpen(false);
    setView("results");
  }

  function abandon() {
    saveGame(null);
    setConfirm(null);
    setMenuOpen(false);
    setStarting(false);
    setView("lobby");
  }

  const stageStyle: CSSProperties = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    visibility: scale ? "visible" : "hidden",
  };

  let screen;
  if (view === "lobby" || !game) {
    screen = (
      <Lobby
        settings={settings}
        saved={game}
        onStart={start}
        onResume={resumeSaved}
        onReview={() => setView("results")}
      />
    );
  } else if (view === "results") {
    screen = <Results game={game} onNewGame={abandon} />;
  } else if (game.phase.kind === "dice") {
    screen = (
      <>
        <DiceScreen
          game={game}
          onRoll={roll}
          onRollRest={rollRest}
          onStart={launch}
        />
        <div className="absolute top-26 right-12">
          <MenuButton
            open={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          />
        </div>
      </>
    );
  } else {
    screen = (
      <RaceScreen
        game={game}
        starting={starting}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((open) => !open)}
        onStarted={() => setStarting(false)}
        onChoose={choose}
        onAnswer={pick}
        onProceed={advance}
        onSteal={rob}
        onShowResults={() => setView("results")}
      />
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-cham text-on-cham select-none">
      <div className="stage" style={stageStyle}>
        {screen}

        {menuOpen && view === "race" && game ? (
          <McMenu
            soundOn={settings.sound}
            canEnd={
              game.phase.kind !== "finished" && game.phase.kind !== "dice"
            }
            onToggleSound={() => updateSettings({ sound: !settings.sound })}
            onEnd={() => setConfirm("stop")}
            onAbandon={() => setConfirm("abandon")}
            onClose={() => setMenuOpen(false)}
          />
        ) : null}

        {confirm === "stop" ? (
          <ConfirmDialog
            title="Dừng đua và xếp hạng?"
            text="Các đội được xếp hạng theo quãng đường đã đi; bằng nhau thì xét số câu đúng, rồi số lít xăng."
            confirmLabel="Dừng đua và xếp hạng"
            onCancel={() => setConfirm(null)}
            onConfirm={stopRace}
          />
        ) : null}
        {confirm === "abandon" ? (
          <ConfirmDialog
            title="Bỏ ván đang chơi?"
            text="Kết quả ván này sẽ bị xóa và trò chơi quay về sảnh chờ."
            confirmLabel="Bỏ ván này"
            onCancel={() => setConfirm(null)}
            onConfirm={abandon}
          />
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {view === "race" && game ? describe(game) : ""}
      </p>
    </main>
  );
}

function RaceScreen({
  game,
  starting,
  menuOpen,
  onMenu,
  onStarted,
  onChoose,
  onAnswer,
  onProceed,
  onSteal,
  onShowResults,
}: {
  game: GameState;
  starting: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onStarted: () => void;
  onChoose: (pump: PumpId) => void;
  onAnswer: (index: number | null) => void;
  onProceed: () => void;
  onSteal: (team: number) => void;
  onShowResults: () => void;
}) {
  const phase = game.phase;
  const team = game.teams[game.current];
  const color = TEAM_COLORS[game.current];
  const questionId =
    phase.kind === "question" || phase.kind === "answered"
      ? phase.questionId
      : null;
  const question = questionId
    ? QUIZ.find((item) => item.id === questionId)
    : undefined;

  return (
    <>
      <header className="absolute inset-x-12 top-7 flex h-18 items-center gap-8">
        <p className="text-lead font-extrabold">Đường đua tiếp nhiên liệu</p>
        <p className="text-body text-on-cham-soft">Vòng {roundOf(game)}</p>
        <div className="ml-auto flex items-center gap-6">
          {phase.kind !== "finished" ? (
            <p
              className="flex items-center gap-4 rounded-full py-1.5 pr-8 pl-3 text-cham"
              style={{ background: color }}
            >
              <Car color="#1c2553" width={92} />
              <span className="text-body font-semibold">Lượt của</span>
              <span className="max-w-110 truncate text-heading font-extrabold">
                {team.name}
              </span>
            </p>
          ) : null}
          {/* Nổi trên các thẻ câu hỏi/sự kiện để MC luôn mở được menu. */}
          <div className="relative z-50">
            <MenuButton open={menuOpen} onClick={onMenu} />
          </div>
        </div>
      </header>

      <Track game={game} stealing={phase.kind === "steal"} onSteal={onSteal} />

      <section
        className="absolute inset-x-12 bottom-6 flex items-end justify-between"
        style={{ top: 728 }}
      >
        <div className="mb-16 max-w-170">
          {phase.kind === "steal" ? (
            <>
              <p
                className="text-heading font-extrabold"
                style={{ color: EVENTS.steal.color }}
              >
                Cướp xăng!
              </p>
              <p className="mt-2 text-lead font-semibold text-pretty">
                Bấm vào làn của đội muốn hút 1 lít xăng.
              </p>
            </>
          ) : phase.kind === "finished" ? null : (
            <>
              <p
                className="truncate text-heading font-extrabold"
                style={{ color }}
              >
                {team.name}
              </p>
              <p className="mt-1 text-lead font-semibold">chọn một cây xăng</p>
              <p className="mt-3 text-body text-on-cham-soft">
                Xăng càng ngon, câu hỏi càng khó.
              </p>
              <p className="mt-1 truncate text-body text-on-cham-soft">
                Lượt sau:{" "}
                <span className="font-bold text-on-cham">
                  {game.teams[nextTeam(game)].name}
                </span>
              </p>
            </>
          )}
        </div>
        <div className="flex items-end gap-10">
          {PUMPS.map((pump) => (
            <PumpButton
              key={pump.id}
              pump={pump}
              disabled={phase.kind !== "choose" || starting}
              onChoose={() => onChoose(pump.id)}
            />
          ))}
        </div>
      </section>

      {question &&
      (phase.kind === "question" || phase.kind === "answered") ? (
        <QuestionPanel
          key={`${game.turn}-${question.id}`}
          phase={phase}
          question={question}
          teamName={team.name}
          seconds={game.answerSeconds}
          onAnswer={onAnswer}
          onTimeout={() => onAnswer(null)}
          onContinue={onProceed}
        />
      ) : null}

      {phase.kind === "event" ? (
        <EventPanel key={game.turn} event={phase.event} onProceed={onProceed} />
      ) : null}

      {phase.kind === "choose" && !starting ? (
        <TurnBanner key={game.turn} name={team.name} color={color} />
      ) : null}

      {starting ? <StartLights onDone={onStarted} /> : null}

      {phase.kind === "finished" && phase.winner !== null ? (
        <FinishOverlay
          name={game.teams[phase.winner].name}
          color={TEAM_COLORS[phase.winner]}
          onShowResults={onShowResults}
        />
      ) : null}
    </>
  );
}

/** Câu đọc cho trình đọc màn hình, theo diễn biến trận. */
function describe(game: GameState): string {
  const phase = game.phase;
  const team = game.teams[game.current].name;
  switch (phase.kind) {
    case "dice":
      return "Các đội gieo xúc xắc chọn thứ tự xuất phát.";
    case "choose":
      return `Lượt của ${team}. Chọn một cây xăng.`;
    case "question":
      return `${team} đang trả lời câu hỏi.`;
    case "answered":
      return phase.correct ? `${team} trả lời đúng.` : `${team} trả lời chưa đúng.`;
    case "event":
      return `${team} mở bình xăng lạ: ${EVENTS[phase.event].title}`;
    case "steal":
      return `${team} chọn đội để cướp xăng.`;
    case "moving":
      return `${team} đang chạy.`;
    case "finished":
      return phase.winner !== null
        ? `${game.teams[phase.winner].name} về đích đầu tiên!`
        : "Cuộc đua đã dừng.";
  }
}
