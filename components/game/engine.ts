/*
 * Luật chơi "Đường đua đại đoàn kết" — race board game kiểu Cờ Tỷ Phú.
 *
 * Mọi hàm ở đây là hàm thuần: nhận trạng thái ván chơi, trả về trạng thái
 * mới, không đụng tới giao diện. Năm đội đi lần lượt Đội 1 → 5 → Đội 1...
 *
 * MC điều khiển nhịp chơi — phần mềm không bao giờ tự chuyển đội:
 *   not-started ──[MC: BẮT ĐẦU]──▶ question (Đội 1)
 *   question → chọn A/B/C/D
 *     SAI  → turn-complete (đứng yên, không đổ, không lật thẻ)
 *     ĐÚNG → waiting-roll ──[🎲]──▶ rolling → moving (từng ô)
 *            → ô 🎁: card-selection → card-result → (target-selection) → moving
 *            → turn-complete
 *   turn-complete ──[MC: TIẾP TỤC → ĐỘI n]──▶ question của đội kế tiếp
 *   Đội nào chạm FINISH (xúc xắc, thẻ hay đổi vị trí) thì game-over ngay.
 *
 * `startGame` và `continueToNextTeam` là hai nơi DUY NHẤT rút câu hỏi mới /
 * đổi đội; cả hai chỉ được gọi từ nút bấm của MC.
 *
 * Vị trí không bao giờ "teleport" trước mắt người xem: mọi thay đổi vị trí
 * được gom vào pha "moving" để giao diện animate từng ô, rồi mới áp dụng
 * pha thật sự tiếp theo (`next`).
 */

import { FINISH_POSITION, tileAt } from "../../content/game-board.ts";
import { cardById, drawThreeCards, type CardId } from "../../content/game-cards.ts";
import {
  QUESTION_POOL,
  questionById,
  type GameQuestion,
  type OptionId,
} from "../../content/game-questions.ts";
import { TEAM_DEFS } from "../../content/game-teams.ts";

export type TeamId = string;

export type Team = {
  id: TeamId;
  position: number;
  previousPosition: number;
  correctAnswers: number;
  /** Thứ tự (toàn cục) lần gần nhất đội đổi vị trí — đội tới trước xếp trên. */
  reachedPositionAt: number;
};

/** Một bước dời quân trên bàn cờ, để giao diện animate từng ô. */
export type BoardMove = { teamId: TeamId; from: number; to: number };

/** Lượt vừa xong diễn ra thế nào — để màn "turn-complete" kể lại cho khán giả. */
export type TurnOutcome =
  | { kind: "wrong"; questionId: string; picked: OptionId }
  | { kind: "moved"; dice: number; cardId?: CardId; targetId?: TeamId };

export type Phase =
  | { kind: "not-started" }
  | { kind: "question"; questionId: string }
  /** Đã trả lời ĐÚNG câu `questionId`; chờ bấm 🎲. */
  | { kind: "waiting-roll"; questionId: string; picked: OptionId }
  | { kind: "rolling"; value: number }
  | {
      kind: "moving";
      moves: BoardMove[];
      next: Phase;
      /** Nước đi do xúc xắc hay do thẻ — để giao diện chú thích cho khán giả. */
      cause: "dice" | "card";
    }
  | { kind: "card-selection"; cards: CardId[] }
  | { kind: "card-result"; cards: CardId[]; cardId: CardId; cardIndex: number }
  | { kind: "target-selection"; cardId: CardId; candidates: TeamId[] }
  /** Hết lượt: DỪNG HẲN, chờ MC bấm "TIẾP TỤC → ĐỘI n". */
  | { kind: "turn-complete"; outcome: TurnOutcome }
  | {
      kind: "game-over";
      winnerId: TeamId;
      ranking: TeamId[];
      /** "questions-exhausted": đã dùng hết pool câu hỏi mà chưa ai về đích. */
      reason: "finish" | "questions-exhausted";
    };

export type GameState = {
  teams: Team[];
  currentTeamIndex: number;
  phase: Phase;
  /** Mọi câu đã từng xuất hiện trong ván — không bao giờ được hỏi lại. */
  usedQuestionIds: string[];
  diceValue: number | null;
  moveSeq: number;
  /** Dùng nội bộ trong một bước xử lý; luôn rỗng giữa hai hành động. */
  pendingMoves: BoardMove[];
};

export type Rng = () => number;

/* -------------------------------------------------------------------- */
/* Khởi tạo & truy vấn                                                    */
/* -------------------------------------------------------------------- */

/** Ván mới: năm đội ở KHỞI HÀNH, chưa có câu hỏi nào — chờ MC bấm BẮT ĐẦU. */
export function createGame(): GameState {
  return {
    teams: TEAM_DEFS.map((def) => ({
      id: def.id,
      position: 0,
      previousPosition: 0,
      correctAnswers: 0,
      reachedPositionAt: 0,
    })),
    currentTeamIndex: 0,
    phase: { kind: "not-started" },
    usedQuestionIds: [],
    diceValue: null,
    moveSeq: 0,
    pendingMoves: [],
  };
}

export function currentTeam(state: GameState): Team {
  return state.teams[state.currentTeamIndex];
}

/** Đội sẽ chơi sau khi MC bấm "TIẾP TỤC". */
export function nextTeam(state: GameState): Team {
  return state.teams[(state.currentTeamIndex + 1) % state.teams.length];
}

export function teamOf(state: GameState, id: TeamId): Team {
  const team = state.teams.find((item) => item.id === id);
  if (!team) throw new Error(`Không tìm thấy đội "${id}"`);
  return team;
}

export function currentQuestion(state: GameState): GameQuestion | undefined {
  const phase = state.phase;
  if (phase.kind === "question" || phase.kind === "waiting-roll") return questionById(phase.questionId);
  if (phase.kind === "turn-complete" && phase.outcome.kind === "wrong") {
    return questionById(phase.outcome.questionId);
  }
  return undefined;
}

/** Nút 🎲 chỉ bật khi đội hiện tại vừa trả lời đúng và chưa đổ. */
export function canRollDice(state: GameState): boolean {
  return state.phase.kind === "waiting-roll";
}

/**
 * Thứ tự xếp hạng: ô cao hơn đứng trên; bằng ô thì xét số câu đúng, rồi
 * đội tới vị trí đó sớm hơn, cuối cùng là số thứ tự đội (luôn ra một thứ
 * tự duy nhất).
 */
export function ranking(state: GameState): TeamId[] {
  return [...state.teams]
    .sort(
      (a, b) =>
        b.position - a.position ||
        b.correctAnswers - a.correctAnswers ||
        a.reachedPositionAt - b.reachedPositionAt ||
        state.teams.indexOf(a) - state.teams.indexOf(b),
    )
    .map((team) => team.id);
}

/* -------------------------------------------------------------------- */
/* Nhịp lượt — chỉ MC mới chuyển đội                                      */
/* -------------------------------------------------------------------- */

/** MC bấm "BẮT ĐẦU TRÒ CHƠI": Đội 1 nhận câu hỏi đầu tiên. */
export function startGame(state: GameState, rng: Rng): GameState {
  if (state.phase.kind !== "not-started") return state;
  return askQuestion({ ...state, currentTeamIndex: 0 }, rng);
}

/**
 * MC bấm "TIẾP TỤC → ĐỘI n": nơi DUY NHẤT chuyển sang đội kế tiếp, và đội
 * đó nhận ngay một câu hỏi mới.
 */
export function continueToNextTeam(state: GameState, rng: Rng): GameState {
  if (state.phase.kind !== "turn-complete") return state;
  return askQuestion(
    { ...state, currentTeamIndex: (state.currentTeamIndex + 1) % state.teams.length, diceValue: null },
    rng,
  );
}

/** Đội hiện tại nhận một câu chưa từng xuất hiện; hết pool thì kết thúc ván. */
function askQuestion(state: GameState, rng: Rng): GameState {
  const drawn = drawQuestion(state, rng);
  if (!drawn) {
    // Không bao giờ lặp câu: hết pool mà chưa ai về đích thì dừng ván và
    // xếp hạng theo vị trí hiện tại.
    return finishGame(state, ranking(state)[0], "questions-exhausted");
  }
  return { ...drawn.state, phase: { kind: "question", questionId: drawn.questionId } };
}

/** Hết lượt: đứng lại ở "turn-complete" — KHÔNG đổi đội, không rút câu hỏi. */
function completeTurn(state: GameState, outcome: TurnOutcome): GameState {
  return setPhase(state, { kind: "turn-complete", outcome });
}

/* -------------------------------------------------------------------- */
/* Di chuyển                                                              */
/* -------------------------------------------------------------------- */

/** Dời một đội `delta` ô (âm là lùi), chặn trong [START, FINISH]. */
function moveTeam(state: GameState, teamId: TeamId, delta: number): GameState {
  const team = teamOf(state, teamId);
  const to = Math.min(Math.max(team.position + delta, 0), FINISH_POSITION);
  if (to === team.position) return state;
  const moveSeq = state.moveSeq + 1;
  return {
    ...state,
    moveSeq,
    teams: state.teams.map((t) =>
      t.id === teamId
        ? { ...t, previousPosition: t.position, position: to, reachedPositionAt: moveSeq }
        : t,
    ),
    pendingMoves: [...state.pendingMoves, { teamId, from: team.position, to }],
  };
}

/**
 * Hai đội đổi ô đứng cho nhau. Chỉ đổi position / previousPosition /
 * reachedPositionAt — số câu đúng, màu, nhân vật và lượt chơi giữ nguyên.
 * Cả hai quân cờ cùng được animate qua pha "moving".
 */
function swapTeams(state: GameState, aId: TeamId, bId: TeamId): GameState {
  const a = teamOf(state, aId);
  const b = teamOf(state, bId);
  if (a.position === b.position) return state;
  const moveSeq = state.moveSeq + 1;
  const target: Record<TeamId, number> = { [aId]: b.position, [bId]: a.position };
  return {
    ...state,
    moveSeq,
    teams: state.teams.map((t) =>
      t.id in target
        ? { ...t, previousPosition: t.position, position: target[t.id], reachedPositionAt: moveSeq }
        : t,
    ),
    pendingMoves: [
      ...state.pendingMoves,
      { teamId: aId, from: a.position, to: b.position },
      { teamId: bId, from: b.position, to: a.position },
    ],
  };
}

/**
 * Kết thúc một thẻ: xét trạng thái MỚI — đội nào đang đứng ở FINISH thì về
 * đích (ưu tiên đội vừa dời quân), game-over đúng một lần; không thì hết lượt.
 */
function finishOrCompleteTurn(state: GameState, mover: TeamId, outcome: TurnOutcome): GameState {
  const atFinish = state.teams.filter((t) => t.position >= FINISH_POSITION).map((t) => t.id);
  if (atFinish.length === 0) return completeTurn(state, outcome);
  return finishGame(state, atFinish.includes(mover) ? mover : atFinish[0], "finish");
}

/**
 * Chuyển sang pha kế tiếp. Nếu bước vừa rồi làm đổi vị trí, bọc trong pha
 * "moving" để giao diện animate trước; `next` áp dụng ngay sau đó.
 */
function setPhase(state: GameState, next: Phase): GameState {
  if (state.pendingMoves.length === 0) return { ...state, phase: next };
  return {
    ...state,
    phase: {
      kind: "moving",
      moves: state.pendingMoves,
      next,
      cause: state.phase.kind === "rolling" ? "dice" : "card",
    },
    pendingMoves: [],
  };
}

/**
 * Hoạt ảnh di chuyển vừa chạy xong trên giao diện: áp dụng pha tiếp theo
 * (vòng lật thẻ, turn-complete hoặc game-over) — không bao giờ đổi đội.
 */
export function settleMove(state: GameState): GameState {
  if (state.phase.kind !== "moving") return state;
  return { ...state, phase: state.phase.next };
}

/** Đội `winnerId` vừa chạm đích: dừng mọi lượt và chốt bảng xếp hạng. */
function finishGame(state: GameState, winnerId: TeamId, reason: "finish" | "questions-exhausted"): GameState {
  const others = ranking(state).filter((id) => id !== winnerId);
  return setPhase(state, { kind: "game-over", winnerId, ranking: [winnerId, ...others], reason });
}

/* -------------------------------------------------------------------- */
/* Câu hỏi                                                                */
/* -------------------------------------------------------------------- */

/**
 * Lấy ngẫu nhiên một câu CHƯA TỪNG xuất hiện trong ván từ pool chung. Câu
 * được đánh dấu đã dùng ngay khi rút; hết câu thì trả về null.
 */
export function drawQuestion(
  state: GameState,
  rng: Rng,
): { state: GameState; questionId: string } | null {
  const used = new Set(state.usedQuestionIds);
  const available = QUESTION_POOL.filter((q) => !used.has(q.id));
  if (available.length === 0) return null;
  const questionId = available[Math.min(available.length - 1, Math.floor(rng() * available.length))].id;
  return {
    questionId,
    state: { ...state, usedQuestionIds: [...state.usedQuestionIds, questionId] },
  };
}

/**
 * Người chơi bấm A/B/C/D; hệ thống tự chấm. Đúng → chờ đổ xúc xắc. Sai →
 * đứng yên, hết lượt ngay (vẫn hiện đáp án đúng) và chờ MC bấm TIẾP TỤC.
 */
export function answerQuestion(state: GameState, picked: OptionId): GameState {
  if (state.phase.kind !== "question") return state;
  const questionId = state.phase.questionId;
  const question = questionById(questionId);
  if (!question) return state;
  if (picked !== question.correctAnswer) {
    return completeTurn(state, { kind: "wrong", questionId, picked });
  }
  const teamId = currentTeam(state).id;
  return {
    ...state,
    teams: state.teams.map((t) => (t.id === teamId ? { ...t, correctAnswers: t.correctAnswers + 1 } : t)),
    phase: { kind: "waiting-roll", questionId, picked },
  };
}

/* -------------------------------------------------------------------- */
/* Xúc xắc                                                                */
/* -------------------------------------------------------------------- */

/** Đổ một viên D6. Chỉ hợp lệ sau khi trả lời đúng — không thể đổ hai lần. */
export function rollDice(state: GameState, rng: Rng): GameState {
  if (!canRollDice(state)) return state;
  const value = Math.min(6, Math.floor(rng() * 6) + 1);
  return { ...state, diceValue: value, phase: { kind: "rolling", value } };
}

/** Xúc xắc dừng lại: quân đi đúng số bước, đáp ô 🎁 thì lật thẻ. */
export function settleRoll(state: GameState, rng: Rng): GameState {
  if (state.phase.kind !== "rolling") return state;
  const dice = state.phase.value;
  const team = currentTeam(state);
  const moved = moveTeam(state, team.id, dice);
  const landed = teamOf(moved, team.id).position;

  if (landed >= FINISH_POSITION) return finishGame(moved, team.id, "finish");
  if (!tileAt(landed).hasGift) return completeTurn(moved, { kind: "moved", dice });

  const someoneAhead = moved.teams.some((t) => t.id !== team.id && t.position > landed);
  const cards = drawThreeCards(rng, someoneAhead ? [] : ["pullback"]);
  return setPhase(moved, { kind: "card-selection", cards });
}

/* -------------------------------------------------------------------- */
/* Vòng lật thẻ                                                           */
/* -------------------------------------------------------------------- */

/** Chọn đúng một trong ba thẻ úp. */
export function pickCard(state: GameState, cardIndex: number): GameState {
  if (state.phase.kind !== "card-selection") return state;
  const cardId = state.phase.cards[cardIndex];
  if (!cardId) return state;
  return {
    ...state,
    phase: { kind: "card-result", cards: state.phase.cards, cardId, cardIndex },
  };
}

/** Áp dụng thẻ vừa lật. Thẻ không bao giờ kích hoạt thêm câu hỏi hay thẻ. */
export function applyCard(state: GameState): GameState {
  if (state.phase.kind !== "card-result") return state;
  const card = cardById(state.phase.cardId);
  const me = currentTeam(state);
  const dice = state.diceValue ?? 0;

  if (card.category === "attack") {
    const candidates = targetsFor(state, card.id);
    if (candidates.length === 0) return completeTurn(state, { kind: "moved", dice, cardId: card.id });
    // Đổi chỗ với đội dẫn đầu: chỉ một đội dẫn đầu thì đổi luôn, đồng hạng
    // đầu thì cho chọn một trong các đội đó.
    if (card.swap === "leader" && candidates.length === 1) {
      const targetId = candidates[0];
      return finishOrCompleteTurn(swapTeams(state, me.id, targetId), me.id, {
        kind: "moved",
        dice,
        cardId: card.id,
        targetId,
      });
    }
    return { ...state, phase: { kind: "target-selection", cardId: card.id, candidates } };
  }

  return finishOrCompleteTurn(moveTeam(state, me.id, card.cells), me.id, { kind: "moved", dice, cardId: card.id });
}

/**
 * Các đội có thể bị nhắm bởi thẻ tấn công (không bao giờ có chính mình).
 * "Đổi chỗ với đội dẫn đầu": các đội đứng cao nhất trong số đội còn lại —
 * nếu chính mình đang dẫn đầu thì đó là đội đứng thứ hai.
 */
function targetsFor(state: GameState, cardId: CardId): TeamId[] {
  const card = cardById(cardId);
  const me = currentTeam(state);
  const others = state.teams.filter((t) => t.id !== me.id);
  if (card.swap === "leader") {
    const top = Math.max(...others.map((t) => t.position));
    return others.filter((t) => t.position === top).map((t) => t.id);
  }
  return others.filter((t) => !card.targetAheadOnly || t.position > me.position).map((t) => t.id);
}

/** Chọn đội bị tấn công / để đổi vị trí (chỉ một đội, không có phòng thủ). */
export function chooseTarget(state: GameState, targetId: TeamId): GameState {
  if (state.phase.kind !== "target-selection") return state;
  if (!state.phase.candidates.includes(targetId)) return state;
  const card = cardById(state.phase.cardId);
  const outcome: TurnOutcome = { kind: "moved", dice: state.diceValue ?? 0, cardId: card.id, targetId };
  if (card.swap) return finishOrCompleteTurn(swapTeams(state, currentTeam(state).id, targetId), targetId, outcome);
  return completeTurn(moveTeam(state, targetId, card.cells), outcome);
}

/* -------------------------------------------------------------------- */
/* Kiểm tra dữ liệu đọc lại từ localStorage                               */
/* -------------------------------------------------------------------- */

export function isGameState(value: unknown): value is GameState {
  if (!isRecord(value)) return false;
  const phase = value.phase;
  return (
    Array.isArray(value.teams) &&
    value.teams.length === TEAM_DEFS.length &&
    value.teams.every(isTeam) &&
    typeof value.currentTeamIndex === "number" &&
    isRecord(phase) &&
    typeof phase.kind === "string" &&
    Array.isArray(value.usedQuestionIds) &&
    typeof value.moveSeq === "number" &&
    Array.isArray(value.pendingMoves)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTeam(value: unknown): value is Team {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.position === "number" &&
    typeof value.correctAnswers === "number" &&
    typeof value.reachedPositionAt === "number"
  );
}
