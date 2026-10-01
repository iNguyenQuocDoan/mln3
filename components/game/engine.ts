/*
 * Luật chơi "Đường đua tiếp nhiên liệu".
 *
 * Mọi hàm ở đây là hàm thuần: nhận trạng thái ván chơi, trả về trạng thái
 * mới, không đụng tới giao diện. Thao tác không hợp lệ ở thời điểm gọi
 * (bấm đáp án lần hai, hết giờ sau khi đã trả lời...) trả lại nguyên trạng
 * thái cũ, nên giao diện không cần tự chặn bấm đúp.
 *
 * Trước khi đua: dice (các đội gieo xúc xắc chọn thứ tự) → startRace.
 * Một lượt: choose → question → answered → moving → (lượt sau | finished)
 *     hoặc: choose → event → [question → answered | steal] → moving → ...
 */

export type Level = "easy" | "medium" | "hard";
export type PumpId = "e5" | "ron95" | "mystery";
export type MysteryEvent = "hard" | "nitro" | "steal" | "flat" | "police";

export type Question = {
  id: string;
  level: Level;
  question: string;
  /** Đúng bốn đáp án, giữ nguyên thứ tự khi hiển thị. */
  answers: string[];
  /** Vị trí đáp án đúng trong `answers` (0–3). */
  correct: number;
  /** Một hai câu giải thích, hiện sau khi trả lời. */
  explain: string;
  /** Nguồn để nhóm đối chiếu, ví dụ "Slide 8" hoặc "Kiến thức chung". */
  source: string;
  /**
   * Giữ nguyên thứ tự đáp án khi hỏi (đáp án là số, năm, thứ tự...).
   * Mặc định, mỗi lần rút câu thì bốn đáp án được xáo lại vị trí.
   */
  keepOrder?: boolean;
};

export type Team = {
  name: string;
  /** Số ô đã đi (0 = vạch xuất phát, trackLength = vạch đích). */
  position: number;
  correct: number;
  /** Tổng số lít xăng đã nhận; nổ lốp hay bị cướp chỉ làm xe lùi. */
  fuel: number;
};

export type Move = {
  kind: "fuel" | "miss" | "nitro" | "flat" | "police" | "steal";
  /** Đội đang chơi lượt này. */
  actor: number;
  /** Số ô mỗi đội thực sự tiến (+) hoặc lùi (−), đã chặn trong đường đua. */
  shifts: { team: number; cells: number }[];
};

export type Phase =
  /** Gieo xúc xắc chọn thứ tự xuất phát, trước khi đua. */
  | { kind: "dice" }
  | { kind: "choose" }
  | {
      kind: "question";
      pump: PumpId;
      questionId: string;
      /** Ô thứ i (A, B, C, D) hiện đáp án gốc options[i] của câu hỏi. */
      options: number[];
    }
  | {
      kind: "answered";
      pump: PumpId;
      questionId: string;
      options: number[];
      /** Ô đã chọn (0 = A...); null: hết giờ mà chưa chọn. */
      picked: number | null;
      correct: boolean;
    }
  | {
      kind: "event";
      event: MysteryEvent;
      /** Câu khó đã rút sẵn (chỉ với sự kiện "hard") và cách xếp đáp án. */
      questionId: string | null;
      options: number[];
    }
  | { kind: "steal" }
  | { kind: "moving"; move: Move }
  /** winner null: MC kết thúc sớm, xếp hạng theo quãng đường. */
  | { kind: "finished"; winner: number | null };

export type GameOptions = {
  teamNames: string[];
  trackLength: number;
  /** null: không giới hạn thời gian trả lời. */
  answerSeconds: number | null;
};

export type GameState = {
  trackLength: number;
  answerSeconds: number | null;
  teams: Team[];
  /** Đội đang tới lượt. */
  current: number;
  /** Số lượt đã chơi xong. */
  turn: number;
  phase: Phase;
  /** Các lần gieo xúc xắc của từng đội (gieo lại khi trùng số). */
  rolls: number[][];
  /** Thứ tự lượt chơi theo kết quả gieo; rỗng khi chưa chốt. */
  order: number[];
  /** Câu hỏi chưa dùng của từng mức, đã xáo sẵn; rút từ đầu mảng. */
  pools: Record<Level, string[]>;
  lastAsked: Partial<Record<Level, string>>;
};

/** Hàm sinh số ngẫu nhiên trong [0, 1), như Math.random. */
export type Rng = () => number;

export const MIN_TEAMS = 2;
export const MAX_TEAMS = 6;

/** Số lít (cũng là số ô được tiến) khi trả lời đúng ở mỗi cây xăng. */
export const PUMP_LITERS: Record<PumpId, number> = {
  e5: 1,
  ron95: 2,
  mystery: 3,
};

const PUMP_LEVEL: Record<PumpId, Level> = {
  e5: "easy",
  ron95: "medium",
  mystery: "hard",
};

/**
 * Thế của đội đang chơi so với các đội khác, dùng để cân bằng ngầm bình ???:
 * bỏ xa các đội khác từ BALANCE_GAP ô thì "leading", đứng cuối và kém đội
 * đầu từ BALANCE_GAP ô thì "trailing", còn lại "even".
 */
export type Standing = "leading" | "even" | "trailing";
export const BALANCE_GAP = 2;

/**
 * Bình ???: tỉ lệ (phần trăm) của từng sự kiện theo thế của đội. Người chơi
 * không thấy bảng này; nó giữ cho các đội không bị bỏ quá xa nhau.
 */
export const MYSTERY_ODDS: Record<
  Standing,
  readonly (readonly [MysteryEvent, number])[]
> = {
  even: [
    ["hard", 50],
    ["nitro", 15],
    ["steal", 15],
    ["flat", 10],
    ["police", 10],
  ],
  leading: [
    ["hard", 50],
    ["nitro", 5],
    ["steal", 5],
    ["flat", 20],
    ["police", 20],
  ],
  trailing: [
    ["hard", 50],
    ["nitro", 25],
    ["steal", 25],
    ["flat", 0],
    ["police", 0],
  ],
};

const MYSTERY_EVENTS: MysteryEvent[] = [
  "hard",
  "nitro",
  "steal",
  "flat",
  "police",
];

export const NITRO_CELLS = 2;

const LEVELS: Level[] = ["easy", "medium", "hard"];

export function createGame(
  options: GameOptions,
  bank: Question[],
  rng: Rng,
): GameState {
  const count = options.teamNames.length;
  if (count < MIN_TEAMS || count > MAX_TEAMS) {
    throw new Error(`Cần từ 2 đến 6 đội, nhận được ${count}.`);
  }
  for (const level of LEVELS) {
    if (!bank.some((item) => item.level === level)) {
      throw new Error(`Ngân hàng câu hỏi chưa có câu nào ở mức "${level}".`);
    }
  }
  return {
    trackLength: options.trackLength,
    answerSeconds: options.answerSeconds,
    teams: options.teamNames.map((name, i) => ({
      name: name.trim() || `Đội ${i + 1}`,
      position: 0,
      correct: 0,
      fuel: 0,
    })),
    current: 0,
    turn: 0,
    phase: { kind: "dice" },
    rolls: options.teamNames.map(() => []),
    order: [],
    pools: {
      easy: shuffle(idsOf(bank, "easy"), rng),
      medium: shuffle(idsOf(bank, "medium"), rng),
      hard: shuffle(idsOf(bank, "hard"), rng),
    },
    lastAsked: {},
  };
}

/**
 * Các đội đang phải gieo xúc xắc: đội chưa gieo, hoặc đội đang trùng số
 * (qua mọi lần gieo) với một đội khác.
 */
export function teamsToRoll(state: GameState): number[] {
  if (state.phase.kind !== "dice") return [];
  const rolls = state.rolls;
  return rolls.flatMap((mine, i) =>
    rolls.some((other, j) => j !== i && startsWith(other, mine)) ? [i] : [],
  );
}

/**
 * Một đội gieo xúc xắc (1–6). Khi không còn đội nào phải gieo, thứ tự xuất
 * phát được chốt: số lớn đi trước, trùng thì so tiếp lần gieo lại.
 */
export function rollDie(state: GameState, team: number, rng: Rng): GameState {
  if (!teamsToRoll(state).includes(team)) return state;
  const value = Math.min(6, Math.floor(rng() * 6) + 1);
  const rolls = state.rolls.map((sequence, i) =>
    i === team ? [...sequence, value] : sequence,
  );
  const next = { ...state, rolls };
  if (teamsToRoll(next).length > 0) return next;
  const order = rolls
    .map((_, i) => i)
    .sort((a, b) => compareRolls(rolls[b], rolls[a]));
  return { ...next, order };
}

/** Đã chốt thứ tự xuất phát: đội đầu tiên vào lượt. */
export function startRace(state: GameState): GameState {
  if (state.phase.kind !== "dice") return state;
  if (state.order.length !== state.teams.length) return state;
  return { ...state, current: state.order[0], phase: { kind: "choose" } };
}

/** Đội đang chơi bấm vào một cây xăng. */
export function choosePump(
  state: GameState,
  pump: PumpId,
  bank: Question[],
  rng: Rng,
): GameState {
  if (state.phase.kind !== "choose") return state;

  if (pump !== "mystery") {
    const { questionId, ...drawn } = draw(state, PUMP_LEVEL[pump], bank, rng);
    const options = arrange(bank, questionId, rng);
    return {
      ...state,
      ...drawn,
      phase: { kind: "question", pump, questionId, options },
    };
  }

  const event = drawEvent(state, rng);
  if (event !== "hard") {
    return {
      ...state,
      phase: { kind: "event", event, questionId: null, options: [] },
    };
  }
  const { questionId, ...drawn } = draw(state, "hard", bank, rng);
  const options = arrange(bank, questionId, rng);
  return {
    ...state,
    ...drawn,
    phase: { kind: "event", event, questionId, options },
  };
}

/** Chọn ô đáp án (0 = A...); `null` nghĩa là hết giờ. */
export function answer(
  state: GameState,
  picked: number | null,
  bank: Question[],
): GameState {
  const phase = state.phase;
  if (phase.kind !== "question") return state;
  const question = bank.find((item) => item.id === phase.questionId);
  const original = picked === null ? undefined : phase.options[picked];
  return {
    ...state,
    phase: {
      kind: "answered",
      pump: phase.pump,
      questionId: phase.questionId,
      options: phase.options,
      picked,
      correct: original !== undefined && original === question?.correct,
    },
  };
}

/**
 * Bấm "Tiếp tục": đổ xăng theo kết quả trả lời, hoặc thực hiện sự kiện của
 * bình ??? (câu khó thì mở câu hỏi, cướp xăng thì chờ chọn đội).
 */
export function proceed(state: GameState): GameState {
  const phase = state.phase;
  const actor = state.current;

  if (phase.kind === "answered") {
    if (!phase.correct) return applyMove(state, "miss", []);
    const liters = PUMP_LITERS[phase.pump];
    return applyMove(state, "fuel", [
      { team: actor, cells: liters, fuel: liters, correct: 1 },
    ]);
  }

  if (phase.kind !== "event") return state;
  switch (phase.event) {
    case "hard":
      return phase.questionId
        ? {
            ...state,
            phase: {
              kind: "question",
              pump: "mystery",
              questionId: phase.questionId,
              options: phase.options,
            },
          }
        : state;
    case "nitro":
      return applyMove(state, "nitro", [
        { team: actor, cells: NITRO_CELLS, fuel: NITRO_CELLS },
      ]);
    case "flat":
      return applyMove(state, "flat", [{ team: actor, cells: -1 }]);
    case "police":
      return applyMove(state, "police", []);
    case "steal":
      return { ...state, phase: { kind: "steal" } };
  }
}

/** Các đội có thể bị cướp xăng: đội khác, đã rời vạch xuất phát. */
export function stealTargets(state: GameState): number[] {
  return state.teams.flatMap((team, i) =>
    i !== state.current && team.position > 0 ? [i] : [],
  );
}

/** Cướp xăng: đội `target` lùi 1 ô, đội đang chơi tiến 1 ô và nhận 1 lít. */
export function steal(state: GameState, target: number): GameState {
  if (state.phase.kind !== "steal") return state;
  if (!stealTargets(state).includes(target)) return state;
  return applyMove(state, "steal", [
    { team: target, cells: -1 },
    { team: state.current, cells: 1, fuel: 1 },
  ]);
}

/** Xe chạy xong: về đích thì thắng, không thì tới lượt đội kế tiếp. */
export function arrive(state: GameState): GameState {
  if (state.phase.kind !== "moving") return state;
  if (state.teams[state.current].position >= state.trackLength) {
    return { ...state, phase: { kind: "finished", winner: state.current } };
  }
  return {
    ...state,
    current: nextTeam(state),
    turn: state.turn + 1,
    phase: { kind: "choose" },
  };
}

/** Đội chơi sau đội đang tới lượt, theo thứ tự xuất phát. */
export function nextTeam(state: GameState): number {
  const order = state.order;
  if (order.length !== state.teams.length) {
    return (state.current + 1) % state.teams.length;
  }
  return order[(order.indexOf(state.current) + 1) % order.length];
}

/** MC dừng cuộc đua; các đội xếp hạng theo quãng đường đã đi. */
export function endEarly(state: GameState): GameState {
  if (state.phase.kind === "finished" || state.phase.kind === "dice") {
    return state;
  }
  if (state.phase.kind === "moving") {
    const settled = arrive(state);
    if (settled.phase.kind === "finished") return settled;
  }
  return { ...state, phase: { kind: "finished", winner: null } };
}

/** Mở lại ván đã lưu: bước xe đang chạy dở được hoàn tất ngay. */
export function resume(state: GameState): GameState {
  return state.phase.kind === "moving" ? arrive(state) : state;
}

/** Vòng hiện tại, bắt đầu từ 1. Mỗi vòng mọi đội chơi một lượt. */
export function roundOf(state: GameState): number {
  return Math.floor(state.turn / state.teams.length) + 1;
}

/**
 * Bảng xếp hạng: nhiều ô hơn đứng trên; bằng ô thì xét số câu đúng, rồi số
 * lít xăng. Các đội bằng nhau hoàn toàn thì đồng hạng.
 */
export function ranking(state: GameState): { team: number; rank: number }[] {
  const teams = state.teams;
  const order = teams
    .map((_, i) => i)
    .sort((a, b) => compareTeams(teams[a], teams[b]) || a - b);
  return order.map((team) => ({
    team,
    rank:
      1 +
      order.filter((other) => compareTeams(teams[other], teams[team]) < 0)
        .length,
  }));
}

/** Kiểm tra dữ liệu đọc lại từ bộ nhớ trình duyệt có đúng là một ván chơi. */
export function isGameState(value: unknown): value is GameState {
  if (!isRecord(value)) return false;
  const { trackLength, answerSeconds, teams, current, turn, phase, pools } =
    value;
  return (
    isCount(trackLength) &&
    trackLength > 0 &&
    (answerSeconds === null || isCount(answerSeconds)) &&
    Array.isArray(teams) &&
    teams.length >= MIN_TEAMS &&
    teams.length <= MAX_TEAMS &&
    teams.every(isTeam) &&
    isCount(current) &&
    current < teams.length &&
    isCount(turn) &&
    isPhase(phase) &&
    isRolls(value.rolls, teams.length) &&
    isOrder(value.order, teams.length) &&
    isRecord(pools) &&
    LEVELS.every((level) => isStringArray(pools[level])) &&
    isRecord(value.lastAsked)
  );
}

/**
 * Thời lượng ước tính (phút) của một ván: đội dẫn đầu đi trung bình khoảng
 * 1,6 ô mỗi lượt, mỗi lượt mất khoảng 30 giây.
 */
export function estimateMinutes(teams: number, trackLength: number): number {
  const rounds = Math.ceil(trackLength / 1.6);
  return Math.max(1, Math.round((rounds * teams * 30) / 60));
}

/* ------------------------------------------------------------------ */

type Change = { team: number; cells: number; fuel?: number; correct?: number };

function applyMove(
  state: GameState,
  kind: Move["kind"],
  changes: Change[],
): GameState {
  const teams = state.teams.map((team) => ({ ...team }));
  const shifts: Move["shifts"] = [];
  for (const change of changes) {
    const team = teams[change.team];
    const target = Math.min(
      Math.max(team.position + change.cells, 0),
      state.trackLength,
    );
    if (target !== team.position) {
      shifts.push({ team: change.team, cells: target - team.position });
    }
    team.position = target;
    team.fuel += change.fuel ?? 0;
    team.correct += change.correct ?? 0;
  }
  return {
    ...state,
    teams,
    phase: { kind: "moving", move: { kind, actor: state.current, shifts } },
  };
}

/** Thế của một đội so với các đội còn lại (xem Standing). */
export function standingOf(state: GameState, team: number): Standing {
  const mine = state.teams[team].position;
  const others = state.teams
    .filter((_, i) => i !== team)
    .map((other) => other.position);
  const best = Math.max(...others);
  if (mine - best >= BALANCE_GAP) return "leading";
  if (mine <= Math.min(...others) && best - mine >= BALANCE_GAP) {
    return "trailing";
  }
  return "even";
}

function drawEvent(state: GameState, rng: Rng): MysteryEvent {
  const canSteal = stealTargets(state).length > 0;
  const canFlat = state.teams[state.current].position > 0;
  const odds = MYSTERY_ODDS[standingOf(state, state.current)];
  const allowed = odds.filter(
    ([event, weight]) =>
      weight > 0 &&
      (event !== "steal" || canSteal) &&
      (event !== "flat" || canFlat),
  );
  const total = allowed.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [event, weight] of allowed) {
    if (roll < weight) return event;
    roll -= weight;
  }
  return allowed[allowed.length - 1][0];
}

/** Rút câu kế tiếp của một mức; hết câu thì xáo lại cả mức. */
function draw(state: GameState, level: Level, bank: Question[], rng: Rng) {
  const ids = idsOf(bank, level);
  let pool = state.pools[level].filter((id) => ids.includes(id));
  if (pool.length === 0) {
    pool = shuffle(ids, rng);
    // Không hỏi lại ngay câu vừa hỏi ở lượt trước.
    if (pool.length > 1 && pool[0] === state.lastAsked[level]) {
      pool.push(pool.shift() as string);
    }
  }
  const [questionId, ...rest] = pool;
  return {
    questionId,
    pools: { ...state.pools, [level]: rest },
    lastAsked: { ...state.lastAsked, [level]: questionId },
  };
}

/** Cách xếp bốn đáp án của câu vừa rút: xáo, trừ khi câu giữ thứ tự. */
function arrange(bank: Question[], questionId: string, rng: Rng): number[] {
  const question = bank.find((item) => item.id === questionId);
  const slots = Array.from(
    { length: question?.answers.length ?? 4 },
    (_, i) => i,
  );
  return question?.keepOrder ? slots : shuffle(slots, rng);
}

function idsOf(bank: Question[], level: Level): string[] {
  return bank.filter((item) => item.level === level).map((item) => item.id);
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function startsWith(sequence: number[], prefix: number[]): boolean {
  return (
    prefix.length <= sequence.length &&
    prefix.every((value, k) => sequence[k] === value)
  );
}

/** So hai dãy gieo xúc xắc theo từng lần gieo; dương nếu `a` cao hơn. */
function compareRolls(a: number[], b: number[]): number {
  for (let k = 0; k < Math.min(a.length, b.length); k++) {
    if (a[k] !== b[k]) return a[k] - b[k];
  }
  return a.length - b.length;
}

function compareTeams(a: Team, b: Team): number {
  return b.position - a.position || b.correct - a.correct || b.fuel - a.fuel;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTeam(value: unknown): value is Team {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    isCount(value.position) &&
    isCount(value.correct) &&
    isCount(value.fuel)
  );
}

function isRolls(value: unknown, teams: number): value is number[][] {
  return (
    Array.isArray(value) &&
    value.length === teams &&
    value.every(
      (sequence) =>
        Array.isArray(sequence) &&
        sequence.every(
          (face) => Number.isInteger(face) && face >= 1 && face <= 6,
        ),
    )
  );
}

/** Thứ tự lượt: rỗng (chưa chốt) hoặc đủ mọi đội, mỗi đội một lần. */
function isOrder(value: unknown, teams: number): value is number[] {
  if (!Array.isArray(value)) return false;
  return value.length === 0 || (value.length === teams && isPermutation(value));
}

/** Một hoán vị của 0, 1, ..., n − 1 (n = độ dài mảng). */
function isPermutation(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    new Set(value).size === value.length &&
    value.every((item) => isCount(item) && item < value.length)
  );
}

function isPhase(value: unknown): value is Phase {
  if (!isRecord(value)) return false;
  switch (value.kind) {
    case "dice":
    case "choose":
    case "steal":
      return true;
    case "question":
      return (
        isPump(value.pump) &&
        typeof value.questionId === "string" &&
        isPermutation(value.options)
      );
    case "answered":
      return (
        isPump(value.pump) &&
        typeof value.questionId === "string" &&
        isPermutation(value.options) &&
        (value.picked === null || isCount(value.picked)) &&
        typeof value.correct === "boolean"
      );
    case "event":
      return (
        MYSTERY_EVENTS.includes(value.event as MysteryEvent) &&
        (value.questionId === null
          ? Array.isArray(value.options) && value.options.length === 0
          : typeof value.questionId === "string" &&
            isPermutation(value.options))
      );
    case "moving":
      return (
        isRecord(value.move) &&
        isCount(value.move.actor) &&
        Array.isArray(value.move.shifts)
      );
    case "finished":
      return value.winner === null || isCount(value.winner);
    default:
      return false;
  }
}

function isPump(value: unknown): value is PumpId {
  return value === "e5" || value === "ron95" || value === "mystery";
}
