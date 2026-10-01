import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  answer,
  arrive,
  choosePump,
  createGame,
  endEarly,
  estimateMinutes,
  isGameState,
  proceed,
  ranking,
  resume,
  rollDie,
  roundOf,
  startRace,
  steal,
  stealTargets,
  teamsToRoll,
  type GameState,
  type Level,
  type PumpId,
  type Question,
  type Team,
} from "./engine.ts";

/* Ngân hàng câu hỏi nhỏ: đáp án đúng của từng câu ghi ngay trong dữ liệu. */
function q(id: string, level: Level, correct: number): Question {
  return {
    id,
    level,
    question: `Câu ${id}`,
    answers: ["A", "B", "C", "D"],
    correct,
    explain: "",
    source: "",
  };
}

const bank: Question[] = [
  q("e1", "easy", 0),
  q("e2", "easy", 1),
  q("e3", "easy", 2),
  q("m1", "medium", 3),
  q("m2", "medium", 0),
  q("m3", "medium", 1),
  q("h1", "hard", 2),
  q("h2", "hard", 3),
];

const fixed = (value: number) => () => value;

/*
 * Giá trị rng chọn từng sự kiện của bình ??? khi các đội đang sát nhau
 * (chênh dưới 2 ô, tỉ lệ thường) và mọi sự kiện đều có thể xảy ra: đội đang
 * chơi đã rời vạch xuất phát và có đội khác đang có xăng.
 * Tỉ lệ thường: câu khó 50, Nitro 15, cướp xăng 15, nổ lốp 10, cảnh sát 10.
 */
const ROLL = { hard: 0, nitro: 0.55, steal: 0.7, flat: 0.85, police: 0.95 };

/** rng để xúc xắc ra đúng mặt `face` (1–6). */
const face = (value: number) => fixed((value - 0.5) / 6);

function freshGame(teamCount: number, trackLength = 10): GameState {
  return createGame(
    {
      teamNames: Array.from({ length: teamCount }, (_, i) => `Đội ${i + 1}`),
      trackLength,
      answerSeconds: 20,
    },
    bank,
    fixed(0),
  );
}

/** Gieo lần lượt cho các đội theo `faces` (đội 1 ra faces[0]...). */
function rollAll(state: GameState, faces: number[]): GameState {
  return faces.reduce(
    (game, value, team) => rollDie(game, team, face(value)),
    state,
  );
}

/** Ván đã gieo xong xúc xắc: đội 1 đi trước, rồi đội 2, đội 3... */
function newGame(teamCount = 2, trackLength = 10): GameState {
  const faces = Array.from({ length: teamCount }, (_, i) => 6 - i);
  return startRace(rollAll(freshGame(teamCount, trackLength), faces));
}

/** Đặt sẵn vị trí các đội (dựng tình huống cho test). */
function withPositions(state: GameState, positions: number[]): GameState {
  return {
    ...state,
    teams: state.teams.map((team, i) => ({ ...team, position: positions[i] })),
  };
}

function currentQuestion(state: GameState): Question {
  const phase = state.phase;
  if (phase.kind !== "question") throw new Error(`Đang ở ${phase.kind}`);
  const found = bank.find((item) => item.id === phase.questionId);
  if (!found) throw new Error(`Không có câu ${phase.questionId}`);
  return found;
}

/** Ô (A–D trên màn hình) đang chứa đáp án đúng, sau khi đáp án đã được xáo. */
function rightAnswer(state: GameState): number {
  const phase = state.phase;
  if (phase.kind !== "question") throw new Error(`Đang ở ${phase.kind}`);
  return phase.options.indexOf(currentQuestion(state).correct);
}
const wrongAnswer = (state: GameState) => (rightAnswer(state) + 1) % 4;

/** Chơi trọn một lượt bằng cây xăng `pump`, trả lời đúng hoặc sai. */
function playTurn(state: GameState, pump: PumpId, correct: boolean) {
  const asked = choosePump(state, pump, bank, fixed(0));
  const picked = correct ? rightAnswer(asked) : wrongAnswer(asked);
  return arrive(proceed(answer(asked, picked, bank)));
}

describe("tạo ván mới", () => {
  test("mọi đội đứng ở vạch xuất phát và đội 1 đi trước", () => {
    const game = newGame(4);
    assert.equal(game.teams.length, 4);
    assert.deepEqual(
      game.teams.map((team) => [team.position, team.correct, team.fuel]),
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    );
    assert.equal(game.current, 0);
    assert.equal(game.phase.kind, "choose");
  });

  test("tên đội để trống được đặt thành 'Đội n', tên có khoảng trắng thừa được cắt gọn", () => {
    const game = createGame(
      { teamNames: ["  Rồng ", "", "Hổ"], trackLength: 10, answerSeconds: 20 },
      bank,
      fixed(0),
    );
    assert.deepEqual(
      game.teams.map((team) => team.name),
      ["Rồng", "Đội 2", "Hổ"],
    );
  });

  test("chỉ nhận từ 2 đến 6 đội", () => {
    const options = (count: number) => ({
      teamNames: Array.from({ length: count }, () => "x"),
      trackLength: 10,
      answerSeconds: 20,
    });
    assert.throws(() => createGame(options(1), bank, fixed(0)), /từ 2 đến 6 đội/);
    assert.throws(() => createGame(options(7), bank, fixed(0)), /từ 2 đến 6 đội/);
    assert.equal(createGame(options(6), bank, fixed(0)).teams.length, 6);
  });

  test("mỗi ván mới xáo lại thứ tự câu hỏi", () => {
    const options = { teamNames: ["A", "B"], trackLength: 10, answerSeconds: 20 };
    const first = createGame(options, bank, fixed(0)).pools.easy;
    const second = createGame(options, bank, fixed(0.99)).pools.easy;
    assert.deepEqual(first, ["e2", "e3", "e1"]);
    assert.deepEqual(second, ["e1", "e2", "e3"]);
  });

  test("ván mới hỏi trước những câu chưa hỏi ở các ván trước", () => {
    const options = { teamNames: ["A", "B"], trackLength: 10, answerSeconds: 20 };
    const game = createGame(options, bank, fixed(0), ["e2", "m1"]);
    assert.deepEqual(game.pools.easy, ["e3", "e1", "e2"]);
    assert.equal(game.pools.medium.at(-1), "m1");
    assert.deepEqual([...game.pools.hard].sort(), ["h1", "h2"]);
  });

  test("báo lỗi khi ngân hàng câu hỏi thiếu một mức", () => {
    const noHard = bank.filter((item) => item.level !== "hard");
    assert.throws(
      () =>
        createGame(
          { teamNames: ["A", "B"], trackLength: 10, answerSeconds: 20 },
          noHard,
          fixed(0),
        ),
      /hard/,
    );
  });
});

describe("gieo xúc xắc chọn thứ tự xuất phát", () => {
  test("ván mới bắt đầu bằng gieo xúc xắc, đội nào cũng phải gieo", () => {
    const game = freshGame(3);
    assert.deepEqual(game.phase, { kind: "dice" });
    assert.deepEqual(teamsToRoll(game), [0, 1, 2]);
    assert.deepEqual(choosePump(game, "e5", bank, fixed(0)), game);
  });

  test("xúc xắc ra từ 1 đến 6 và được ghi lại cho đội vừa gieo", () => {
    const low = rollDie(freshGame(3), 1, fixed(0));
    const high = rollDie(low, 2, fixed(0.9999));
    assert.deepEqual(high.rolls, [[], [1], [6]]);
    assert.deepEqual(teamsToRoll(high), [0]);
  });

  test("đội đã gieo không gieo thêm khi không bị trùng số", () => {
    const rolled = rollDie(freshGame(3), 0, face(4));
    assert.deepEqual(rollDie(rolled, 0, face(6)), rolled);
  });

  test("đội gieo được số lớn hơn đi trước", () => {
    const rolled = rollAll(freshGame(3), [3, 6, 1]);
    assert.deepEqual(rolled.order, [1, 0, 2]);
    assert.equal(rolled.phase.kind, "dice");

    const started = startRace(rolled);
    assert.deepEqual(started.phase, { kind: "choose" });
    assert.equal(started.current, 1);
  });

  test("các đội ra trùng số phải gieo lại, chỉ những đội đó", () => {
    const tied = rollAll(freshGame(3), [5, 5, 2]);
    assert.deepEqual(teamsToRoll(tied), [0, 1]);
    assert.deepEqual(tied.order, []);
    assert.deepEqual(startRace(tied), tied);

    const oneMore = rollDie(tied, 0, face(1));
    assert.deepEqual(teamsToRoll(oneMore), [1]);

    const settled = rollDie(oneMore, 1, face(4));
    assert.deepEqual(teamsToRoll(settled), []);
    assert.deepEqual(settled.order, [1, 0, 2]);
  });

  test("lượt chơi đi theo thứ tự xuất phát, hết vòng quay lại đội đầu", () => {
    const game = startRace(rollAll(freshGame(3), [2, 1, 6]));
    assert.equal(game.current, 2);
    const second = playTurn(game, "e5", false);
    assert.equal(second.current, 0);
    const third = playTurn(second, "e5", false);
    assert.equal(third.current, 1);
    const fourth = playTurn(third, "e5", false);
    assert.equal(fourth.current, 2);
    assert.equal(roundOf(fourth), 2);
  });
});

describe("chọn cây xăng", () => {
  test("E5 rút câu dễ, RON95 rút câu vừa", () => {
    const game = newGame();
    const e5 = currentQuestion(choosePump(game, "e5", bank, fixed(0)));
    const ron95 = currentQuestion(choosePump(game, "ron95", bank, fixed(0)));
    assert.equal(e5.level, "easy");
    assert.equal(ron95.level, "medium");
  });

  test("câu hỏi không lặp lại cho tới khi dùng hết câu cùng mức", () => {
    let game = newGame();
    const asked: string[] = [];
    for (let i = 0; i < 3; i++) {
      const next = choosePump(game, "e5", bank, fixed(0));
      asked.push(currentQuestion(next).id);
      game = arrive(proceed(answer(next, 0, bank)));
    }
    assert.deepEqual([...asked].sort(), ["e1", "e2", "e3"]);
  });

  test("hết câu thì xáo lại, nhưng câu đầu tiên không trùng câu vừa hỏi", () => {
    let game = newGame();
    let last = "";
    for (let i = 0; i < 3; i++) {
      const next = choosePump(game, "e5", bank, fixed(0));
      last = currentQuestion(next).id;
      game = arrive(proceed(answer(next, 0, bank)));
    }
    for (const roll of [0, 0.5, 0.99]) {
      const refill = currentQuestion(choosePump(game, "e5", bank, fixed(roll)));
      assert.equal(refill.level, "easy");
      assert.notEqual(refill.id, last, `rng ${roll}`);
    }
  });

  test("câu đã bị xóa khỏi ngân hàng không còn được rút", () => {
    const game = newGame();
    const trimmed = bank.filter((item) => item.id !== "e1");
    const seen = new Set<string>();
    let state = game;
    for (let i = 0; i < 4; i++) {
      const next = choosePump(state, "e5", trimmed, fixed(0));
      const phase = next.phase;
      assert.equal(phase.kind, "question");
      if (phase.kind === "question") seen.add(phase.questionId);
      state = arrive(proceed(answer(next, 0, trimmed)));
    }
    assert.equal(seen.has("e1"), false);
  });

  test("chỉ chọn được cây xăng khi đang chờ chọn", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    assert.deepEqual(choosePump(asked, "ron95", bank, fixed(0)), asked);
  });
});

describe("xáo đáp án mỗi lượt", () => {
  test("bốn đáp án được xáo; chỉ ô đang chứa đáp án đúng mới được tính đúng", () => {
    // Ván thử rút câu e2 (đáp án đúng ở ô B gốc). Với rng = 0, các ô hiện
    // lần lượt đáp án gốc B, C, D, A: đáp án đúng chuyển lên ô A.
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    assert.deepEqual(asked.phase, {
      kind: "question",
      pump: "e5",
      questionId: "e2",
      options: [1, 2, 3, 0],
    });
    const atA = answer(asked, 0, bank);
    const atB = answer(asked, 1, bank);
    assert.equal(atA.phase.kind === "answered" && atA.phase.correct, true);
    assert.equal(atB.phase.kind === "answered" && atB.phase.correct, false);
  });

  test("mỗi lần rút câu xếp đáp án theo lần xáo mới", () => {
    const game = newGame();
    const shuffled = choosePump(game, "e5", bank, fixed(0));
    const kept = choosePump(game, "e5", bank, fixed(0.99));
    assert.deepEqual(
      shuffled.phase.kind === "question" && shuffled.phase.options,
      [1, 2, 3, 0],
    );
    assert.deepEqual(
      kept.phase.kind === "question" && kept.phase.options,
      [0, 1, 2, 3],
    );
  });

  test("câu đánh dấu keepOrder (đáp án là số, năm...) giữ nguyên thứ tự", () => {
    const ordered = bank.map((item) => ({ ...item, keepOrder: true }));
    const asked = choosePump(newGame(), "e5", ordered, fixed(0));
    assert.deepEqual(
      asked.phase.kind === "question" && asked.phase.options,
      [0, 1, 2, 3],
    );
  });

  test("câu khó của bình ??? cũng được xáo, và giữ cách xếp khi mở câu hỏi", () => {
    const drawn = choosePump(newGame(), "mystery", bank, fixed(0));
    assert.deepEqual(
      drawn.phase.kind === "event" && drawn.phase.options,
      [1, 2, 3, 0],
    );
    const asked = proceed(drawn);
    assert.deepEqual(
      asked.phase.kind === "question" && asked.phase.options,
      [1, 2, 3, 0],
    );
  });

  test("hết giờ vẫn giữ cách xếp để chỉ ra đúng ô đáp án", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    const timedOut = answer(asked, null, bank);
    assert.deepEqual(
      timedOut.phase.kind === "answered" && timedOut.phase.options,
      [1, 2, 3, 0],
    );
  });
});

describe("trả lời câu hỏi", () => {
  test("đúng ở E5: xe tiến 1 ô, nhận 1 lít, thêm 1 câu đúng", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    const answered = answer(asked, rightAnswer(asked), bank);
    assert.equal(answered.phase.kind, "answered");
    assert.equal(
      answered.phase.kind === "answered" && answered.phase.correct,
      true,
    );

    const moving = proceed(answered);
    assert.deepEqual(moving.phase, {
      kind: "moving",
      move: { kind: "fuel", actor: 0, shifts: [{ team: 0, cells: 1 }] },
    });
    assert.deepEqual(moving.teams[0], {
      name: "Đội 1",
      position: 1,
      correct: 1,
      fuel: 1,
    });
  });

  test("đúng ở RON95: xe tiến 2 ô và nhận 2 lít", () => {
    const after = playTurn(newGame(), "ron95", true);
    assert.equal(after.teams[0].position, 2);
    assert.equal(after.teams[0].fuel, 2);
  });

  test("sai: xe đứng yên, không nhận xăng", () => {
    const asked = choosePump(newGame(), "ron95", bank, fixed(0));
    const moving = proceed(answer(asked, wrongAnswer(asked), bank));
    assert.deepEqual(moving.phase, {
      kind: "moving",
      move: { kind: "miss", actor: 0, shifts: [] },
    });
    assert.deepEqual(
      [moving.teams[0].position, moving.teams[0].correct, moving.teams[0].fuel],
      [0, 0, 0],
    );
  });

  test("hết giờ được tính như trả lời sai", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    const timedOut = answer(asked, null, bank);
    assert.equal(timedOut.phase.kind, "answered");
    if (timedOut.phase.kind === "answered") {
      assert.equal(timedOut.phase.picked, null);
      assert.equal(timedOut.phase.correct, false);
    }
    assert.equal(arrive(proceed(timedOut)).teams[0].position, 0);
  });

  test("bấm thêm đáp án sau khi đã trả lời không đổi kết quả", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    const answered = answer(asked, rightAnswer(asked), bank);
    assert.deepEqual(answer(answered, wrongAnswer(asked), bank), answered);
  });

  test("xe dừng ở vạch đích nhưng vẫn được tính đủ số lít", () => {
    const game = withPositions(newGame(2, 10), [9, 0]);
    const asked = choosePump(game, "ron95", bank, fixed(0));
    const moving = proceed(answer(asked, rightAnswer(asked), bank));
    assert.equal(moving.teams[0].position, 10);
    assert.equal(moving.teams[0].fuel, 2);
    assert.deepEqual(
      moving.phase.kind === "moving" && moving.phase.move.shifts,
      [{ team: 0, cells: 1 }],
    );
  });
});

describe("bình ???", () => {
  test("có thể ra câu hỏi khó; trả lời đúng thì tiến 3 ô", () => {
    const drawn = choosePump(newGame(), "mystery", bank, fixed(ROLL.hard));
    assert.equal(drawn.phase.kind, "event");
    if (drawn.phase.kind !== "event") return;
    assert.equal(drawn.phase.event, "hard");

    const asked = proceed(drawn);
    assert.equal(currentQuestion(asked).level, "hard");
    assert.equal(asked.phase.kind === "question" && asked.phase.pump, "mystery");
    const moving = proceed(answer(asked, rightAnswer(asked), bank));
    assert.equal(moving.teams[0].position, 3);
    assert.equal(moving.teams[0].fuel, 3);
    assert.equal(moving.teams[0].correct, 1);
  });

  test("Nitro: tiến 2 ô và nhận 2 lít ngay, không cần trả lời", () => {
    const game = withPositions(newGame(), [1, 1]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.nitro));
    assert.deepEqual(drawn.phase, {
      kind: "event",
      event: "nitro",
      questionId: null,
      options: [],
    });
    const moving = proceed(drawn);
    assert.deepEqual(
      [moving.teams[0].position, moving.teams[0].fuel, moving.teams[0].correct],
      [3, 2, 0],
    );
  });

  test("Nổ lốp: lùi 1 ô", () => {
    const game = withPositions(newGame(), [3, 2]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.flat));
    assert.equal(drawn.phase.kind === "event" && drawn.phase.event, "flat");
    const moving = proceed(drawn);
    assert.equal(moving.teams[0].position, 2);
    assert.deepEqual(
      moving.phase.kind === "moving" && moving.phase.move,
      { kind: "flat", actor: 0, shifts: [{ team: 0, cells: -1 }] },
    );
  });

  test("xe còn ở vạch xuất phát thì không bị nổ lốp", () => {
    const game = withPositions(newGame(), [0, 1]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.flat));
    assert.equal(drawn.phase.kind, "event");
    assert.notEqual(drawn.phase.kind === "event" && drawn.phase.event, "flat");
  });

  test("Cảnh sát: mất lượt, xe đứng yên", () => {
    const game = withPositions(newGame(), [4, 3]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.police));
    assert.equal(drawn.phase.kind === "event" && drawn.phase.event, "police");
    const moving = proceed(drawn);
    assert.deepEqual(
      moving.phase.kind === "moving" && moving.phase.move,
      { kind: "police", actor: 0, shifts: [] },
    );
    assert.equal(moving.teams[0].position, 4);
  });

  test("không ra Cướp xăng khi chưa đội nào khác có xăng", () => {
    const game = withPositions(newGame(), [1, 0]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.steal));
    assert.equal(drawn.phase.kind, "event");
    assert.notEqual(drawn.phase.kind === "event" && drawn.phase.event, "steal");
  });
});

describe("cân bằng ngầm của bình ???", () => {
  /*
   * Cùng một giá trị rng 0.62: tỉ lệ thường ra Nitro (khoảng 50–65), còn
   * đội đang bỏ xa (từ 2 ô) ra Nổ lốp (khoảng 60–80 khi Nitro chỉ còn 5%).
   */
  test("đội bỏ xa các đội khác từ 2 ô trở lên khó ra Nitro, dễ gặp rủi ro", () => {
    const leading = withPositions(newGame(3), [5, 2, 1]);
    const close = withPositions(newGame(3), [3, 2, 1]);
    const lead = choosePump(leading, "mystery", bank, fixed(0.62));
    const even = choosePump(close, "mystery", bank, fixed(0.62));
    assert.equal(lead.phase.kind === "event" && lead.phase.event, "flat");
    assert.equal(even.phase.kind === "event" && even.phase.event, "nitro");
  });

  test("đội đứng cuối, kém đội đầu từ 2 ô, không gặp nổ lốp hay cảnh sát", () => {
    const trailing = withPositions(newGame(3), [1, 4, 3]);
    const events = [0, 0.3, 0.55, 0.7, 0.85, 0.9, 0.95, 0.99].map((roll) => {
      const drawn = choosePump(trailing, "mystery", bank, fixed(roll));
      return drawn.phase.kind === "event" ? drawn.phase.event : "";
    });
    assert.equal(events.includes("flat"), false);
    assert.equal(events.includes("police"), false);
    assert.equal(events[6], "steal");
  });
});

describe("cướp xăng", () => {
  test("đội bị chọn lùi 1 ô; đội cướp tiến 1 ô và nhận 1 lít", () => {
    const game = withPositions(newGame(3), [1, 2, 0]);
    const drawn = choosePump(game, "mystery", bank, fixed(ROLL.steal));
    assert.equal(drawn.phase.kind === "event" && drawn.phase.event, "steal");

    const choosing = proceed(drawn);
    assert.equal(choosing.phase.kind, "steal");
    assert.deepEqual(stealTargets(choosing), [1]);

    const moving = steal(choosing, 1);
    assert.deepEqual(
      moving.phase.kind === "moving" && moving.phase.move,
      {
        kind: "steal",
        actor: 0,
        shifts: [
          { team: 1, cells: -1 },
          { team: 0, cells: 1 },
        ],
      },
    );
    assert.deepEqual(
      moving.teams.map((team) => [team.position, team.fuel]),
      [
        [2, 1],
        [1, 0],
        [0, 0],
      ],
    );
  });

  test("không cướp được của chính mình hay của đội còn ở vạch xuất phát", () => {
    const game = withPositions(newGame(3), [1, 2, 0]);
    const choosing = proceed(
      choosePump(game, "mystery", bank, fixed(ROLL.steal)),
    );
    assert.equal(choosing.phase.kind, "steal");
    assert.deepEqual(steal(choosing, 0), choosing);
    assert.deepEqual(steal(choosing, 2), choosing);
  });
});

describe("đổi lượt và về đích", () => {
  test("xe chạy xong thì tới lượt đội kế tiếp; hết vòng quay lại đội 1", () => {
    const game = newGame(2);
    assert.equal(roundOf(game), 1);
    const second = playTurn(game, "e5", false);
    assert.equal(second.current, 1);
    assert.equal(second.phase.kind, "choose");
    const third = playTurn(second, "e5", false);
    assert.equal(third.current, 0);
    assert.equal(roundOf(third), 2);
  });

  test("đội chạm vạch đích thì thắng ngay", () => {
    const game = withPositions(newGame(3, 6), [5, 0, 0]);
    const done = playTurn(game, "e5", true);
    assert.deepEqual(done.phase, { kind: "finished", winner: 0 });
  });

  test("kết thúc sớm: cuộc đua dừng và không có đội về đích", () => {
    const game = withPositions(newGame(), [3, 1]);
    const asked = choosePump(game, "e5", bank, fixed(0));
    const ended = endEarly(asked);
    assert.deepEqual(ended.phase, { kind: "finished", winner: null });
    assert.deepEqual(ended.teams, asked.teams);
  });

  test("đang gieo xúc xắc thì chưa có cuộc đua để dừng", () => {
    const rolling = rollDie(freshGame(3), 0, face(2));
    assert.deepEqual(endEarly(rolling), rolling);
  });

  test("kết thúc sớm đúng lúc xe vừa chạm vạch đích thì đội đó vẫn thắng", () => {
    const game = withPositions(newGame(2, 6), [5, 0]);
    const asked = choosePump(game, "e5", bank, fixed(0));
    const moving = proceed(answer(asked, rightAnswer(asked), bank));
    assert.deepEqual(endEarly(moving).phase, { kind: "finished", winner: 0 });
  });

  test("mở lại ván đang lúc xe chạy thì hoàn tất bước chạy", () => {
    const asked = choosePump(newGame(), "e5", bank, fixed(0));
    const moving = proceed(answer(asked, rightAnswer(asked), bank));
    const resumed = resume(moving);
    assert.equal(resumed.phase.kind, "choose");
    assert.equal(resumed.current, 1);
    assert.equal(resumed.teams[0].position, 1);
    assert.deepEqual(resume(asked), asked);
  });
});

describe("xếp hạng", () => {
  function teamsOf(rows: [number, number, number][]): Team[] {
    return rows.map(([position, correct, fuel], i) => ({
      name: `Đội ${i + 1}`,
      position,
      correct,
      fuel,
    }));
  }

  test("theo số ô, rồi số câu đúng, rồi số lít xăng", () => {
    const game: GameState = {
      ...newGame(4),
      teams: teamsOf([
        [5, 2, 6],
        [7, 1, 7],
        [5, 3, 5],
        [5, 2, 8],
      ]),
    };
    assert.deepEqual(ranking(game), [
      { team: 1, rank: 1 },
      { team: 2, rank: 2 },
      { team: 3, rank: 3 },
      { team: 0, rank: 4 },
    ]);
  });

  test("các đội bằng nhau hoàn toàn thì đồng hạng", () => {
    const game: GameState = {
      ...newGame(3),
      teams: teamsOf([
        [4, 2, 5],
        [4, 2, 5],
        [2, 1, 2],
      ]),
    };
    assert.deepEqual(ranking(game), [
      { team: 0, rank: 1 },
      { team: 1, rank: 1 },
      { team: 2, rank: 3 },
    ]);
  });
});

describe("lưu và ước lượng", () => {
  test("nhận lại ván đã lưu, kể cả lúc đang gieo xúc xắc; bỏ qua dữ liệu hỏng", () => {
    const saved: unknown = JSON.parse(JSON.stringify(newGame(3)));
    assert.equal(isGameState(saved), true);
    const rolling = rollDie(freshGame(3), 0, face(5));
    assert.equal(isGameState(JSON.parse(JSON.stringify(rolling))), true);
    assert.equal(isGameState({ ...(saved as object), order: [0, 0, 1] }), false);
    assert.equal(isGameState({ ...(saved as object), rolls: [[7], [], []] }), false);
    assert.equal(
      isGameState({
        ...(saved as object),
        phase: { kind: "question", pump: "e5", questionId: "e1", options: [0, 0, 1, 2] },
      }),
      false,
    );
    assert.equal(isGameState(null), false);
    assert.equal(isGameState({}), false);
    assert.equal(isGameState({ ...(saved as object), teams: "x" }), false);
    assert.equal(
      isGameState({ ...(saved as object), phase: { kind: "bay" } }),
      false,
    );
  });

  test("thời gian ước lượng tăng theo số đội và độ dài đường đua", () => {
    assert.ok(estimateMinutes(4, 10) > estimateMinutes(4, 6));
    assert.ok(estimateMinutes(6, 10) > estimateMinutes(2, 10));
  });
});
