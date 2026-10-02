/*
 * Luật chơi "Đường đua đại đoàn kết" — race board game kiểu Cờ Tỷ Phú.
 *
 * Mọi hàm ở đây là hàm thuần: nhận trạng thái ván chơi, trả về trạng thái
 * mới, không đụng tới giao diện. MC chọn 2–5 đội; thứ tự đi do xúc xắc quyết
 * định ngay đầu ván.
 *
 * MC điều khiển nhịp chơi — phần mềm không bao giờ tự chuyển đội:
 *   not-started (chọn số đội) ──[MC: BẮT ĐẦU]──▶ order-roll
 *   order-roll: từng đội đổ 1 xúc xắc, cao đi trước; bằng điểm thì các đội
 *     đó đổ lại tới khi phân xong ──▶ order-ready ──[MC]──▶ question (đội đầu)
 *   question → chọn A/B/C/D trong ANSWER_SECONDS giây (giao diện đếm giờ)
 *     ĐÚNG → waiting-roll (2 xúc xắc)   SAI / HẾT GIỜ → waiting-roll (1 xúc xắc)
 *     (+1 xúc xắc 🍀 nếu đã sai liên tiếp; +ô 🤝 nếu đang bị bỏ xa)
 *     ──[🎲]──▶ rolling → moving (từng ô)
 *     → ô có 🎁: mở hộp (hộp mới hiện ở ô khác) → card-selection →
 *       card-result → (target-selection) → moving
 *     → turn-complete
 *   turn-complete ──[MC: TIẾP TỤC → ĐỘI n]──▶ question của đội kế tiếp
 *   Đội nào chạm FINISH (xúc xắc, thẻ hay đổi vị trí) thì game-over ngay.
 *
 * `beginFirstTurn` và `continueToNextTeam` là hai nơi DUY NHẤT rút câu hỏi
 * mới / đổi đội; cả hai chỉ được gọi từ nút bấm của MC.
 *
 * Vị trí không bao giờ "teleport" trước mắt người xem: mọi thay đổi vị trí
 * được gom vào pha "moving" để giao diện animate từng ô, rồi mới áp dụng
 * pha thật sự tiếp theo (`next`).
 */

import {
  CATCH_UP,
  DICE_WHEN_CORRECT,
  DICE_WHEN_WRONG,
  GIFT_BOX_COUNT,
  LUCKY_STREAK,
} from "../../content/game-balance.ts";
import { DEFAULT_GIFT_TILES, FINISH_POSITION, GIFT_ZONE } from "../../content/game-board.ts";
import { cardById, CARDS, drawThreeCards, type CardId } from "../../content/game-cards.ts";
import {
  QUESTION_POOL,
  questionById,
  type GameQuestion,
  type OptionId,
} from "../../content/game-questions.ts";
import { MAX_TEAMS, MIN_TEAMS, TEAM_DEFS } from "../../content/game-teams.ts";

export type TeamId = string;

export type Team = {
  id: TeamId;
  position: number;
  previousPosition: number;
  correctAnswers: number;
  /** Số lượt trả lời sai liên tiếp gần nhất (đủ LUCKY_STREAK thì có 🍀). */
  wrongStreak: number;
  /** Thứ tự (toàn cục) lần gần nhất đội đổi vị trí — đội tới trước xếp trên. */
  reachedPositionAt: number;
};

/** Một bước dời quân trên bàn cờ, để giao diện animate từng ô. */
export type BoardMove = { teamId: TeamId; from: number; to: number };

/** Lượt đổ đã được tính trước khi bấm 🎲, để khán giả thấy ngay. */
export type RollPlan = {
  /** Số viên xúc xắc: 2 nếu đúng, 1 nếu sai, cộng 1 nếu có 🍀. */
  dice: number;
  /** Có viên xúc xắc thêm nhờ 🍀 Bùa may mắn. */
  lucky: boolean;
  /** Số ô tiến thêm nhờ 🤝 Tiếp sức. */
  boost: number;
};

/** Lần đổ gần nhất của lượt đang chơi. */
export type LastRoll = {
  values: number[];
  boost: number;
  lucky: boolean;
  correct: boolean;
  /** Hết giờ mà chưa chọn đáp án (ván lưu từ bản cũ không có trường này). */
  timedOut?: boolean;
};

/** Lượt vừa xong diễn ra thế nào — để màn "turn-complete" kể lại cho khán giả. */
export type TurnOutcome = {
  correct: boolean;
  timedOut: boolean;
  dice: number[];
  boost: number;
  lucky: boolean;
  /** Đáp đúng ô có hộp quà và đã mở hộp. */
  gift: boolean;
  cardId?: CardId;
  targetId?: TeamId;
};

export type Phase =
  | { kind: "not-started" }
  /**
   * Đổ xúc xắc phân thứ tự: `queue[0]` là đội đổ kế tiếp; `rolls` là các lần
   * đổ (gồm đổ lại khi bằng điểm). `thrown`: đội đó đã bấm lắc, xúc xắc đang lăn.
   */
  | {
      kind: "order-roll";
      rolls: Record<TeamId, number[]>;
      queue: TeamId[];
      last: TeamId | null;
      thrown?: boolean;
    }
  /** Đã phân xong thứ tự, chờ MC bấm bắt đầu lượt đầu tiên. */
  | {
      kind: "order-ready";
      rolls: Record<TeamId, number[]>;
      order: TeamId[];
      last: TeamId | null;
    }
  | { kind: "question"; questionId: string }
  /**
   * Đã trả lời câu `questionId` (`picked` null: hết giờ); chờ bấm 🎲 với số
   * xúc xắc theo `plan`. `thrown`: đã bấm lắc, xúc xắc đang lăn.
   */
  | {
      kind: "waiting-roll";
      questionId: string;
      picked: OptionId | null;
      correct: boolean;
      plan: RollPlan;
      thrown?: boolean;
    }
  /** `physical`: số chấm đến từ xúc xắc 3D đã lăn xong trên màn hình (không cần lăn 2D nữa). */
  | { kind: "rolling"; values: number[]; boost: number; physical: boolean }
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
  /** Mã ván — để lịch sử các ván không ghi trùng một ván hai lần. */
  id: string;
  /** Các đội trong ván, xếp theo thứ tự đi (sau khi đổ phân thứ tự). */
  teams: Team[];
  currentTeamIndex: number;
  phase: Phase;
  /** Thứ tự câu hỏi của ván, trộn lúc tạo ván (xem `shuffleQuestions`). */
  questionDeck: string[];
  /** Mọi câu đã từng xuất hiện trong ván — không bao giờ được hỏi lại. */
  usedQuestionIds: string[];
  /** Các ô đang có hộp quà 🎁. */
  gifts: number[];
  lastRoll: LastRoll | null;
  moveSeq: number;
  /** Dùng nội bộ trong một bước xử lý; luôn rỗng giữa hai hành động. */
  pendingMoves: BoardMove[];
};

export type Rng = () => number;

/* -------------------------------------------------------------------- */
/* Khởi tạo & truy vấn                                                    */
/* -------------------------------------------------------------------- */

/**
 * Ván mới "chưa bắt đầu" với `teamCount` đội ở KHỞI HÀNH. Có `rng` thì trộn
 * câu hỏi (câu trong `askedBefore` — đã hỏi ở các ván trước — xếp xuống cuối)
 * và rải hộp quà ngẫu nhiên; không có (ván tạm hiển thị trước khi đọc bộ nhớ)
 * thì dùng thứ tự mặc định để server và trình duyệt vẽ giống nhau.
 */
export function createGame(
  teamCount: number = MAX_TEAMS,
  rng?: Rng,
  askedBefore: readonly string[] = [],
): GameState {
  const count = Math.min(Math.max(Math.round(teamCount), MIN_TEAMS), MAX_TEAMS);
  return {
    id: rng ? gameId(rng) : "blank",
    teams: TEAM_DEFS.slice(0, count).map((def) => ({
      id: def.id,
      position: 0,
      previousPosition: 0,
      correctAnswers: 0,
      wrongStreak: 0,
      reachedPositionAt: 0,
    })),
    currentTeamIndex: 0,
    phase: { kind: "not-started" },
    questionDeck: rng ? shuffleQuestions(rng, askedBefore) : QUESTION_POOL.map((q) => q.id),
    usedQuestionIds: [],
    gifts: rng ? scatterGifts(rng) : [...DEFAULT_GIFT_TILES],
    lastRoll: null,
    moveSeq: 0,
    pendingMoves: [],
  };
}

/** Chỉ đổi được số đội trước khi bắt đầu: tạo lại ván với số đội đó, giữ nguyên thứ tự câu hỏi. */
export function setTeamCount(state: GameState, teamCount: number, rng: Rng): GameState {
  if (state.phase.kind !== "not-started") return state;
  if (teamCount === state.teams.length) return state;
  return {
    ...createGame(teamCount, rng),
    id: state.id,
    questionDeck: state.questionDeck,
  };
}

/**
 * Trộn thứ tự câu hỏi cho một ván mới: câu chưa hỏi ở các ván trước lên đầu,
 * câu đã hỏi (`askedBefore`) xuống cuối; mỗi nhóm đều được trộn ngẫu nhiên.
 */
export function shuffleQuestions(rng: Rng, askedBefore: readonly string[] = []): string[] {
  const asked = new Set(askedBefore);
  const ids = QUESTION_POOL.map((q) => q.id);
  return [
    ...shuffle(
      ids.filter((id) => !asked.has(id)),
      rng,
    ),
    ...shuffle(
      ids.filter((id) => asked.has(id)),
      rng,
    ),
  ];
}

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function gameId(rng: Rng): string {
  const part = () =>
    Math.floor(rng() * 36 ** 6)
      .toString(36)
      .padStart(6, "0");
  return part() + part();
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
  return undefined;
}

/** Nút 🎲 chỉ bật khi đội hiện tại vừa trả lời (đúng hay sai) và chưa đổ. */
export function canRollDice(state: GameState): boolean {
  return state.phase.kind === "waiting-roll";
}

export function hasGift(state: GameState, position: number): boolean {
  return state.gifts.includes(position);
}

/**
 * Thứ tự xếp hạng: ô cao hơn đứng trên; bằng ô thì xét số câu đúng, rồi
 * đội tới vị trí đó sớm hơn, cuối cùng là thứ tự đi (luôn ra một thứ tự
 * duy nhất).
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
/* Cân bằng                                                               */
/* -------------------------------------------------------------------- */

/** Khoảng cách (số ô) từ đội `teamId` tới đội dẫn đầu (0 nếu đang dẫn đầu). */
export function gapToLeader(state: GameState, teamId: TeamId): number {
  const top = Math.max(...state.teams.map((t) => t.position));
  return top - teamOf(state, teamId).position;
}

/** 🤝 Tiếp sức: số ô được tiến thêm sau khi đổ, theo khoảng cách tới đội dẫn đầu. */
export function catchUpSteps(state: GameState, teamId: TeamId): number {
  const gap = gapToLeader(state, teamId);
  return CATCH_UP.find((level) => gap >= level.gap)?.steps ?? 0;
}

/** 🍀 Bùa may mắn: đội đã sai đủ LUCKY_STREAK lượt liên tiếp, lượt tới được thêm một xúc xắc. */
export function hasLuckyCharm(team: Team): boolean {
  return team.wrongStreak >= LUCKY_STREAK;
}

/**
 * 🛡️ Bảo hộ: đội (hoặc các đội) đang đứng cuối, khi không phải tất cả cùng
 * một ô — thẻ tấn công không nhắm được vào họ.
 */
export function protectedTeams(state: GameState): TeamId[] {
  const positions = state.teams.map((t) => t.position);
  const low = Math.min(...positions);
  if (low === Math.max(...positions)) return [];
  return state.teams.filter((t) => t.position === low).map((t) => t.id);
}

/** Đội đang bị bỏ xa (đủ mức Tiếp sức thấp nhất) mở hộp quà thì không gặp thẻ rủi ro. */
function isTrailing(state: GameState, teamId: TeamId): boolean {
  const lowest = Math.min(...CATCH_UP.map((level) => level.gap));
  return gapToLeader(state, teamId) >= lowest;
}

/* -------------------------------------------------------------------- */
/* Đổ xúc xắc phân thứ tự                                                 */
/* -------------------------------------------------------------------- */

function d6(rng: Rng): number {
  return Math.min(6, Math.floor(rng() * 6) + 1);
}

function clampFace(value: number): number {
  return Math.min(6, Math.max(1, Math.round(value)));
}

/**
 * MC vừa bấm lắc (chọn thứ tự hoặc lắc của lượt): ghi ngay vào ván để tải lại
 * trang giữa lúc xúc xắc 3D đang lăn cũng không lắc lại được — giao diện thấy
 * `thrown` mà không có xúc xắc nào đang lăn thì tự đổ thay.
 */
export function markDiceThrown(state: GameState): GameState {
  const phase = state.phase;
  if ((phase.kind !== "order-roll" && phase.kind !== "waiting-roll") || phase.thrown) return state;
  return { ...state, phase: { ...phase, thrown: true } };
}

/** MC bấm "BẮT ĐẦU TRÒ CHƠI": vào vòng đổ xúc xắc phân thứ tự đi. */
export function startGame(state: GameState): GameState {
  if (state.phase.kind !== "not-started") return state;
  return {
    ...state,
    phase: {
      kind: "order-roll",
      rolls: {},
      queue: state.teams.map((t) => t.id),
      last: null,
    },
  };
}

/** So hai dãy điểm đổ: điểm cao hơn ở lần đổ sớm nhất khác nhau thì đi trước. */
function compareRolls(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (b[i] ?? 0) - (a[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Đội ở đầu hàng chờ đổ một xúc xắc (`value`: số chấm xúc xắc 3D vừa lăn ra;
 * bỏ trống thì tự đổ bằng `rng`). Đổ đủ một vòng: nếu còn đội bằng điểm
 * nhau thì chỉ các đội đó đổ lại; không thì chốt thứ tự đi.
 */
export function rollForOrder(state: GameState, rng: Rng, value?: number): GameState {
  if (state.phase.kind !== "order-roll") return state;
  const [teamId, ...queue] = state.phase.queue;
  if (!teamId) return state;
  const face = value === undefined ? d6(rng) : clampFace(value);
  const rolls = {
    ...state.phase.rolls,
    [teamId]: [...(state.phase.rolls[teamId] ?? []), face],
  };
  if (queue.length > 0)
    return {
      ...state,
      phase: { kind: "order-roll", rolls, queue, last: teamId },
    };

  const ids = state.teams.map((t) => t.id);
  const tied = ids.filter((id) =>
    ids.some((other) => other !== id && compareRolls(rolls[id] ?? [], rolls[other] ?? []) === 0),
  );
  if (tied.length > 0)
    return {
      ...state,
      phase: { kind: "order-roll", rolls, queue: tied, last: teamId },
    };
  const order = [...ids].sort((a, b) => compareRolls(rolls[a], rolls[b]));
  return {
    ...state,
    phase: { kind: "order-ready", rolls, order, last: teamId },
  };
}

/** MC bấm bắt đầu lượt đầu: xếp các đội theo thứ tự vừa đổ, đội đầu nhận câu hỏi. */
export function beginFirstTurn(state: GameState): GameState {
  if (state.phase.kind !== "order-ready") return state;
  const order = state.phase.order;
  const teams = order.map((id) => teamOf(state, id));
  return askQuestion({ ...state, teams, currentTeamIndex: 0 });
}

/* -------------------------------------------------------------------- */
/* Nhịp lượt — chỉ MC mới chuyển đội                                      */
/* -------------------------------------------------------------------- */

/**
 * MC bấm "TIẾP TỤC → ĐỘI n": nơi DUY NHẤT (ngoài lượt đầu) chuyển sang đội
 * kế tiếp, và đội đó nhận ngay một câu hỏi mới.
 */
export function continueToNextTeam(state: GameState): GameState {
  if (state.phase.kind !== "turn-complete") return state;
  return askQuestion({
    ...state,
    currentTeamIndex: (state.currentTeamIndex + 1) % state.teams.length,
    lastRoll: null,
  });
}

/** Đội hiện tại nhận một câu chưa từng xuất hiện; hết pool thì kết thúc ván. */
function askQuestion(state: GameState): GameState {
  const drawn = drawQuestion(state);
  if (!drawn) {
    // Không bao giờ lặp câu: hết pool mà chưa ai về đích thì dừng ván và
    // xếp hạng theo vị trí hiện tại.
    return finishGame(state, ranking(state)[0], "questions-exhausted");
  }
  return {
    ...drawn.state,
    phase: { kind: "question", questionId: drawn.questionId },
  };
}

/** Hết lượt: đứng lại ở "turn-complete" — KHÔNG đổi đội, không rút câu hỏi. */
function completeTurn(state: GameState, outcome: TurnOutcome): GameState {
  return setPhase(state, { kind: "turn-complete", outcome });
}

/** Kết quả lượt dựa trên lần đổ vừa rồi. */
function outcomeOf(state: GameState, extra: Partial<TurnOutcome> = {}): TurnOutcome {
  const roll = state.lastRoll;
  return {
    correct: roll?.correct ?? false,
    timedOut: roll?.timedOut ?? false,
    dice: roll?.values ?? [],
    boost: roll?.boost ?? 0,
    lucky: roll?.lucky ?? false,
    gift: false,
    ...extra,
  };
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
        ? {
            ...t,
            previousPosition: t.position,
            position: to,
            reachedPositionAt: moveSeq,
          }
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
  const target: Record<TeamId, number> = {
    [aId]: b.position,
    [bId]: a.position,
  };
  return {
    ...state,
    moveSeq,
    teams: state.teams.map((t) =>
      t.id in target
        ? {
            ...t,
            previousPosition: t.position,
            position: target[t.id],
            reachedPositionAt: moveSeq,
          }
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
  return setPhase(state, {
    kind: "game-over",
    winnerId,
    ranking: [winnerId, ...others],
    reason,
  });
}

/* -------------------------------------------------------------------- */
/* Hộp quà ngẫu nhiên                                                     */
/* -------------------------------------------------------------------- */

/** Ô `tile` còn trống để đặt hộp: chưa có hộp, không sát một hộp khác. */
function canPlaceGift(gifts: number[], tile: number): boolean {
  return gifts.every((g) => Math.abs(g - tile) >= 2);
}

/** Rải GIFT_BOX_COUNT hộp quà ngẫu nhiên trong GIFT_ZONE, không hai hộp sát nhau. */
export function scatterGifts(rng: Rng): number[] {
  const gifts: number[] = [];
  let guard = 0;
  while (gifts.length < GIFT_BOX_COUNT && guard < 1000) {
    guard++;
    const tile = GIFT_ZONE[Math.min(GIFT_ZONE.length - 1, Math.floor(rng() * GIFT_ZONE.length))];
    if (canPlaceGift(gifts, tile)) gifts.push(tile);
  }
  return gifts.sort((a, b) => a - b);
}

/**
 * Mở hộp ở ô `opened`: hộp biến mất, một hộp mới hiện ở ô khác ngẫu nhiên
 * (không trùng ô vừa mở, không sát hộp khác, không đặt dưới chân đội nào).
 */
function respawnGift(state: GameState, opened: number, rng: Rng): number[] {
  const remaining = state.gifts.filter((g) => g !== opened);
  const occupied = new Set(state.teams.map((t) => t.position));
  const free = GIFT_ZONE.filter(
    (tile) => tile !== opened && !occupied.has(tile) && canPlaceGift(remaining, tile),
  );
  if (free.length === 0) return remaining;
  const tile = free[Math.min(free.length - 1, Math.floor(rng() * free.length))];
  return [...remaining, tile].sort((a, b) => a - b);
}

/* -------------------------------------------------------------------- */
/* Câu hỏi                                                                */
/* -------------------------------------------------------------------- */

/**
 * Lấy câu kế tiếp CHƯA TỪNG xuất hiện trong ván, theo thứ tự đã trộn lúc tạo
 * ván (câu mới thêm vào ngân hàng sau đó xếp cuối). Câu được đánh dấu đã dùng
 * ngay khi rút; hết câu thì trả về null.
 */
export function drawQuestion(state: GameState): { state: GameState; questionId: string } | null {
  const used = new Set(state.usedQuestionIds);
  const inDeck = new Set(state.questionDeck);
  const questionId =
    state.questionDeck.find((id) => !used.has(id) && questionById(id)) ??
    QUESTION_POOL.find((q) => !used.has(q.id) && !inDeck.has(q.id))?.id;
  if (!questionId) return null;
  return {
    questionId,
    state: {
      ...state,
      usedQuestionIds: [...state.usedQuestionIds, questionId],
    },
  };
}

/**
 * Người chơi bấm A/B/C/D; hệ thống tự chấm. Đúng → được đổ 2 xúc xắc, sai →
 * vẫn được đổ 1 xúc xắc. `picked` null: hết giờ mà chưa chọn, tính như sai.
 * 🍀 và 🤝 được tính ngay lúc này để hiện cho khán giả trước khi đổ.
 */
export function answerQuestion(state: GameState, picked: OptionId | null): GameState {
  if (state.phase.kind !== "question") return state;
  const questionId = state.phase.questionId;
  const question = questionById(questionId);
  if (!question) return state;
  const correct = picked === question.correctAnswer;
  const team = currentTeam(state);
  const lucky = hasLuckyCharm(team);
  const plan: RollPlan = {
    dice: (correct ? DICE_WHEN_CORRECT : DICE_WHEN_WRONG) + (lucky ? 1 : 0),
    lucky,
    boost: catchUpSteps(state, team.id),
  };
  // Dùng 🍀 thì chuỗi sai đếm lại từ đầu.
  const streak = lucky ? 0 : team.wrongStreak;
  return {
    ...state,
    teams: state.teams.map((t) =>
      t.id === team.id
        ? {
            ...t,
            correctAnswers: t.correctAnswers + (correct ? 1 : 0),
            wrongStreak: correct ? 0 : streak + 1,
          }
        : t,
    ),
    phase: { kind: "waiting-roll", questionId, picked, correct, plan },
  };
}

/* -------------------------------------------------------------------- */
/* Xúc xắc                                                                */
/* -------------------------------------------------------------------- */

/**
 * Đổ đủ số xúc xắc D6 của lượt — không thể đổ hai lần. `faces`: số chấm các
 * viên xúc xắc 3D vừa lăn ra (phải đủ số viên); bỏ trống thì tự đổ bằng `rng`.
 */
export function rollDice(state: GameState, rng: Rng, faces?: number[]): GameState {
  if (state.phase.kind !== "waiting-roll") return state;
  const { plan, correct, picked } = state.phase;
  const physical = faces !== undefined && faces.length === plan.dice;
  const values = physical ? faces.map(clampFace) : Array.from({ length: plan.dice }, () => d6(rng));
  return {
    ...state,
    lastRoll: {
      values,
      boost: plan.boost,
      lucky: plan.lucky,
      correct,
      timedOut: picked === null,
    },
    phase: { kind: "rolling", values, boost: plan.boost, physical },
  };
}

/** Xúc xắc dừng lại: quân đi tổng số chấm (+ ô Tiếp sức), đáp ô 🎁 thì mở hộp. */
export function settleRoll(state: GameState, rng: Rng): GameState {
  if (state.phase.kind !== "rolling") return state;
  const steps = state.phase.values.reduce((sum, value) => sum + value, 0) + state.phase.boost;
  const team = currentTeam(state);
  const moved = moveTeam(state, team.id, steps);
  const landed = teamOf(moved, team.id).position;

  if (landed >= FINISH_POSITION) return finishGame(moved, team.id, "finish");
  if (!hasGift(moved, landed)) return completeTurn(moved, outcomeOf(moved));

  const opened = { ...moved, gifts: respawnGift(moved, landed, rng) };
  const someoneAhead = opened.teams.some((t) => t.id !== team.id && t.position > landed);
  const excluded: CardId[] = someoneAhead ? [] : ["pullback"];
  // 🛡️ Đội đang bị bỏ xa: hộp quà không có thẻ rủi ro (tự lùi).
  if (isTrailing(opened, team.id))
    excluded.push(...CARDS.filter((c) => c.category === "penalty").map((c) => c.id));
  return setPhase(opened, {
    kind: "card-selection",
    cards: drawThreeCards(rng, excluded),
  });
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

  if (card.category === "attack") {
    const candidates = targetsFor(state, card.id);
    if (candidates.length === 0)
      return completeTurn(state, outcomeOf(state, { gift: true, cardId: card.id }));
    // Đổi chỗ với đội dẫn đầu: chỉ một đội dẫn đầu thì đổi luôn, đồng hạng
    // đầu thì cho chọn một trong các đội đó.
    if (card.swap === "leader" && candidates.length === 1) {
      const targetId = candidates[0];
      return finishOrCompleteTurn(
        swapTeams(state, me.id, targetId),
        me.id,
        outcomeOf(state, { gift: true, cardId: card.id, targetId }),
      );
    }
    return {
      ...state,
      phase: { kind: "target-selection", cardId: card.id, candidates },
    };
  }

  return finishOrCompleteTurn(
    moveTeam(state, me.id, card.cells),
    me.id,
    outcomeOf(state, { gift: true, cardId: card.id }),
  );
}

/**
 * Các đội có thể bị nhắm bởi thẻ tấn công (không bao giờ có chính mình).
 * "Đổi chỗ với đội dẫn đầu": các đội đứng cao nhất trong số đội còn lại —
 * nếu chính mình đang dẫn đầu thì đó là đội đứng thứ hai. Thẻ đẩy lùi
 * không nhắm được đội đang được 🛡️ Bảo hộ (đứng cuối).
 */
function targetsFor(state: GameState, cardId: CardId): TeamId[] {
  const card = cardById(cardId);
  const me = currentTeam(state);
  const others = state.teams.filter((t) => t.id !== me.id);
  if (card.swap === "leader") {
    const top = Math.max(...others.map((t) => t.position));
    return others.filter((t) => t.position === top).map((t) => t.id);
  }
  const shielded = card.cells < 0 ? protectedTeams(state) : [];
  return others
    .filter((t) => !card.targetAheadOnly || t.position > me.position)
    .filter((t) => !shielded.includes(t.id))
    .map((t) => t.id);
}

/** Chọn đội bị tấn công / để đổi vị trí (chỉ một đội, không có phòng thủ). */
export function chooseTarget(state: GameState, targetId: TeamId): GameState {
  if (state.phase.kind !== "target-selection") return state;
  if (!state.phase.candidates.includes(targetId)) return state;
  const card = cardById(state.phase.cardId);
  const outcome = outcomeOf(state, { gift: true, cardId: card.id, targetId });
  if (card.swap)
    return finishOrCompleteTurn(swapTeams(state, currentTeam(state).id, targetId), targetId, outcome);
  return completeTurn(moveTeam(state, targetId, card.cells), outcome);
}

/* -------------------------------------------------------------------- */
/* Kiểm tra dữ liệu đọc lại từ localStorage                               */
/* -------------------------------------------------------------------- */

export function isGameState(value: unknown): value is GameState {
  if (!isRecord(value)) return false;
  const phase = value.phase;
  return (
    typeof value.id === "string" &&
    Array.isArray(value.questionDeck) &&
    value.questionDeck.every((id) => typeof id === "string") &&
    Array.isArray(value.teams) &&
    value.teams.length >= MIN_TEAMS &&
    value.teams.length <= MAX_TEAMS &&
    value.teams.every(isTeam) &&
    typeof value.currentTeamIndex === "number" &&
    isRecord(phase) &&
    typeof phase.kind === "string" &&
    Array.isArray(value.usedQuestionIds) &&
    Array.isArray(value.gifts) &&
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
    typeof value.wrongStreak === "number" &&
    typeof value.reachedPositionAt === "number"
  );
}
