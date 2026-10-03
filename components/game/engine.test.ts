import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BALANCE_GAP,
  CARD_ODDS,
  DICE_WHEN_CORRECT,
  DICE_WHEN_WRONG,
  GIFT_BOX_COUNT,
} from "../../content/game-balance.ts";
import { BOARD_TILES, DEFAULT_GIFT_TILES, FINISH_POSITION, GIFT_ZONE } from "../../content/game-board.ts";
import { cardById, CARDS, drawThreeCards, type CardCategory, type CardId } from "../../content/game-cards.ts";
import { QUESTION_POOL, type OptionId } from "../../content/game-questions.ts";
import { MAX_TEAMS, MIN_TEAMS, TEAM_DEFS } from "../../content/game-teams.ts";
import {
  answerQuestion,
  applyCard,
  canRollDice,
  chooseTarget,
  continueToNextTeam,
  createGame,
  diceMove,
  optionOrder,
  shownLetter,
  currentQuestion,
  currentTeam,
  isGameState,
  markDiceThrown,
  nextTeam,
  pickCard,
  ranking,
  rollDice,
  setTeamCount,
  settleMove,
  settleRoll,
  shuffleQuestions,
  standingOf,
  startGame,
  teamOf,
  type GameState,
  type Rng,
} from "./engine.ts";

/** RNG có hạt giống (mulberry32): cùng hạt giống, cùng dãy số. */
function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** RNG cho một mặt xúc xắc cố định: d6 = floor(r*6)+1. */
function face(value: number): Rng {
  return () => (value - 1) / 6 + 0.01;
}

const zero: Rng = () => 0;

const [T1, T2, T3, T4, T5] = TEAM_DEFS.map((t) => t.id);

function setPositions(game: GameState, positions: Record<string, number>): GameState {
  return {
    ...game,
    teams: game.teams.map((t) => (t.id in positions ? { ...t, position: positions[t.id] } : t)),
  };
}

function setGifts(game: GameState, gifts: number[]): GameState {
  return { ...game, gifts };
}

function settle(game: GameState): GameState {
  let next = game;
  while (next.phase.kind === "moving") next = settleMove(next);
  return next;
}

/** Ván `count` đội (T1, T2, …) đã bắt đầu và đang ở câu hỏi của đội `teamIndex`. */
function started(count = MAX_TEAMS, teamIndex = 0): GameState {
  const game = startGame(createGame(count, seeded(count)));
  return { ...game, currentTeamIndex: teamIndex };
}

/** Trả lời câu đang mở: đúng, sai, hay để hết giờ. */
function answer(game: GameState, result: "right" | "wrong" | "timeout"): GameState {
  const question = currentQuestion(game)!;
  const wrong = (["A", "B", "C", "D"] as OptionId[]).find((o) => o !== question.correctAnswer)!;
  return answerQuestion(
    game,
    result === "right" ? question.correctAnswer : result === "wrong" ? wrong : null,
  );
}

/** Lắc ra đúng các mặt `faces` (như xúc xắc 3D) rồi chạy hết hoạt ảnh. */
function rollFaces(game: GameState, faces: number[], rng: Rng = zero): GameState {
  return settle(settleRoll(rollDice(game, zero, faces), rng));
}

/** Đội `teamIndex` vừa lật được thẻ `cardId`. */
function flipped(game: GameState, teamIndex: number, cardId: CardId): GameState {
  return {
    ...game,
    currentTeamIndex: teamIndex,
    phase: { kind: "card-result", cards: [cardId], cardId, cardIndex: 0 },
  };
}

/* ------------------------------ Bàn cờ ------------------------------ */

test("board: 28 tiles, finish at 27, gift boxes only on provinces away from start and finish", () => {
  assert.equal(BOARD_TILES.length, 28);
  assert.equal(FINISH_POSITION, 27);
  assert.equal(BOARD_TILES.filter((t) => t.type === "province").length, 26);
  for (let i = 1; i < DEFAULT_GIFT_TILES.length; i++) {
    assert.ok(DEFAULT_GIFT_TILES[i] - DEFAULT_GIFT_TILES[i - 1] >= 2, "no two default gifts in a row");
  }
  assert.ok(GIFT_ZONE.every((id) => id >= 2 && id <= FINISH_POSITION - 2));
});

test("gift boxes are scattered at random, never next to each other", () => {
  for (let seed = 0; seed < 200; seed++) {
    const { gifts } = createGame(MAX_TEAMS, seeded(seed));
    assert.equal(gifts.length, GIFT_BOX_COUNT);
    assert.ok(gifts.every((tile) => GIFT_ZONE.includes(tile)));
    for (let i = 1; i < gifts.length; i++) assert.ok(gifts[i] - gifts[i - 1] >= 2);
  }
  assert.notDeepEqual(createGame(4, seeded(1)).gifts, createGame(4, seeded(2)).gifts);
});

/* --------------------------- Chuẩn bị ván --------------------------- */

test("new game: 2 to 5 teams at the start, nothing asked, every question in a shuffled deck", () => {
  for (const count of [1, 2, 3, 4, 5, 9]) {
    assert.equal(
      createGame(count, seeded(count)).teams.length,
      Math.min(Math.max(count, MIN_TEAMS), MAX_TEAMS),
    );
  }
  const game = createGame(4, seeded(1));
  assert.equal(game.phase.kind, "not-started");
  assert.ok(game.teams.every((t) => t.position === 0));
  assert.equal(currentQuestion(game), undefined);
  assert.equal(game.usedQuestionIds.length, 0);
  assert.equal(canRollDice(game), false);
  assert.equal(continueToNextTeam(game), game, "Continue does nothing before the game starts");
  assert.deepEqual([...game.questionDeck].sort(), QUESTION_POOL.map((q) => q.id).sort());
  assert.notDeepEqual(game.questionDeck, createGame(4, seeded(2)).questionDeck, "each game shuffles anew");
  assert.notEqual(game.id, createGame(4, seeded(2)).id);
  assert.equal(createGame().id, "blank", "the placeholder game is the same on server and browser");
});

test("team count changes only before the start and keeps the shuffled questions", () => {
  const game = createGame(5, seeded(3));
  const three = setTeamCount(game, 3, seeded(4));
  assert.deepEqual(
    three.teams.map((t) => t.id),
    [T1, T2, T3],
  );
  assert.deepEqual(three.questionDeck, game.questionDeck);
  assert.equal(three.id, game.id);
  const begun = startGame(three);
  assert.equal(setTeamCount(begun, 4, seeded(5)), begun);
});

test("a new game asks the questions not used in earlier games first", () => {
  const earlier = QUESTION_POOL.slice(0, 40).map((q) => q.id);
  const deck = shuffleQuestions(seeded(9), earlier);
  assert.equal(new Set(deck).size, QUESTION_POOL.length);
  const fresh = QUESTION_POOL.length - earlier.length;
  assert.ok(deck.slice(0, fresh).every((id) => !earlier.includes(id)));
  assert.deepEqual(new Set(deck.slice(fresh)), new Set(earlier));
  assert.notDeepEqual(deck.slice(fresh), earlier, "the old questions are shuffled too");
  assert.ok(!earlier.includes(createGame(4, seeded(9), earlier).questionDeck[0]));
});

/* ---------------------------- Bắt đầu ván ---------------------------- */

test("start: no order roll, team 1 gets the first question and the teams go in number order", () => {
  const game = startGame(createGame(4, seeded(1)));
  assert.deepEqual(
    game.teams.map((t) => t.id),
    [T1, T2, T3, T4],
  );
  assert.equal(game.phase.kind, "question");
  assert.equal(currentTeam(game).id, T1);
  assert.equal(currentQuestion(game)?.id, game.questionDeck[0]);
  assert.equal(nextTeam(game).id, T2);
  assert.equal(startGame(game), game, "Start does nothing once the game is running");
});

test("pressing roll is saved at once, so a reload cannot roll the same dice again", () => {
  const blank = createGame(3, seeded(1));
  assert.equal(markDiceThrown(blank), blank, "nothing to throw before the start");
  const asked = started(3);
  assert.equal(markDiceThrown(asked), asked, "nothing to throw while the question is open");
  const thrown = markDiceThrown(answer(asked, "right"));
  assert.ok(thrown.phase.kind === "waiting-roll" && thrown.phase.thrown);
  assert.equal(markDiceThrown(thrown), thrown);
  assert.equal(rollDice(thrown, zero, [3, 4]).phase.kind, "rolling");
});

/* ------------------------- Trả lời câu hỏi ------------------------- */

test("a right answer rolls 2 dice, a wrong answer or a time-out still rolls 1", () => {
  const right = answer(started(), "right");
  assert.equal(right.phase.kind, "waiting-roll");
  if (right.phase.kind === "waiting-roll") {
    assert.equal(right.phase.correct, true);
    assert.equal(right.phase.plan.dice, DICE_WHEN_CORRECT);
  }
  assert.equal(teamOf(right, T1).correctAnswers, 1);

  const wrong = answer(started(), "wrong");
  if (wrong.phase.kind === "waiting-roll") assert.equal(wrong.phase.plan.dice, DICE_WHEN_WRONG);
  assert.equal(teamOf(wrong, T1).correctAnswers, 0);

  const late = answer(started(), "timeout");
  assert.equal(late.phase.kind, "waiting-roll");
  if (late.phase.kind === "waiting-roll") {
    assert.equal(late.phase.picked, null);
    assert.equal(late.phase.correct, false);
    assert.equal(late.phase.plan.dice, DICE_WHEN_WRONG);
  }
  assert.equal(teamOf(late, T1).correctAnswers, 0);
  assert.equal(answerQuestion(late, "A"), late, "cannot answer twice");
});

test("a time-out is reported in the turn summary", () => {
  const game = rollFaces(setGifts(answer(started(), "timeout"), []), [3]);
  assert.equal(game.phase.kind, "turn-complete");
  if (game.phase.kind === "turn-complete") {
    assert.equal(game.phase.outcome.timedOut, true);
    assert.equal(game.phase.outcome.correct, false);
    assert.deepEqual(game.phase.outcome.dice, [3]);
  }
  assert.equal(teamOf(game, T1).position, 3);
});

/* ------------------------------ Xúc xắc ------------------------------ */

test("3D dice faces are used as rolled; a wrong count falls back to the RNG", () => {
  const ready = answer(started(), "right");
  const physical = rollDice(ready, zero, [6, 2]);
  assert.equal(physical.phase.kind, "rolling");
  if (physical.phase.kind === "rolling") {
    assert.equal(physical.phase.physical, true);
    assert.deepEqual(physical.phase.values, [6, 2]);
  }
  assert.equal(rollDice(physical, zero, [1, 1]), physical, "cannot roll twice");

  const fallback = rollDice(ready, face(4), [5]);
  if (fallback.phase.kind === "rolling") {
    assert.equal(fallback.phase.physical, false);
    assert.deepEqual(fallback.phase.values, [4, 4]);
  }
});

test("the piece moves by the dice total; a plain tile ends the turn and waits for Continue", () => {
  const ready = rollDice(setGifts(answer(started(), "right"), []), zero, [2, 3]);
  const moving = settleRoll(ready, zero);
  assert.equal(moving.phase.kind, "moving");
  if (moving.phase.kind === "moving") assert.deepEqual(moving.phase.moves, [{ teamId: T1, from: 0, to: 5 }]);

  const game = settle(moving);
  assert.equal(teamOf(game, T1).position, 5);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T1, "no automatic next team");
  assert.equal(nextTeam(game).id, T2);
  assert.equal(settleMove(game), game, "animation callbacks cannot advance the turn");
});

test("the move plan shows the total distance and the stop tile before and while the piece walks", () => {
  let game = setGifts(setPositions(started(), { [T1]: 2, [T2]: 14 }), []);
  game = rollDice(answer(game, "right"), zero, [4, 5]);
  assert.deepEqual(diceMove(game), { teamId: T1, from: 2, to: 11, total: 9 }, "far behind, still just the dice");
  game = settleRoll(game, zero);
  assert.deepEqual(diceMove(game), { teamId: T1, from: 2, to: 11, total: 9 });
  assert.equal(diceMove(settle(game)), null, "nothing to show once the turn is over");

  let near = setGifts(setPositions(started(), { [T1]: FINISH_POSITION - 3 }), []);
  near = rollDice(answer(near, "right"), zero, [6, 6]);
  assert.deepEqual(diceMove(near), { teamId: T1, from: FINISH_POSITION - 3, to: FINISH_POSITION, total: 12 });
});

/* ------------------------------ Hộp quà ------------------------------ */

test("landing exactly on a gift opens it, and a new box appears on another free tile", () => {
  const game = rollFaces(setGifts(answer(started(), "wrong"), [4, 10, 16]), [4], seeded(7));
  assert.equal(game.phase.kind, "card-selection");
  assert.ok(!game.gifts.includes(4), "the opened box is gone");
  assert.equal(game.gifts.length, 3, "a new box replaces it");
  assert.ok(
    game.gifts.every((tile) => !game.teams.some((t) => t.position === tile)),
    "never under a piece",
  );

  const passing = rollFaces(setGifts(answer(started(), "wrong"), [2]), [4]);
  assert.equal(passing.phase.kind, "turn-complete", "passing over a box does not open it");
  assert.deepEqual(passing.gifts, [2]);
});

test("a gift box opens only when the piece arrives, never while it is still walking past tiles", () => {
  for (let seed = 0; seed < 50; seed++) {
    const ready = rollDice(setGifts(answer(started(), "wrong"), [6, 12, 18]), zero, [6]);
    const walking = settleRoll(ready, seeded(seed));
    assert.equal(walking.phase.kind, "moving");
    assert.deepEqual(walking.gifts, [6, 12, 18], "no box moves or appears while the piece walks");
    const arrived = settle(walking);
    assert.equal(arrived.phase.kind, "card-selection");
    assert.ok(!arrived.gifts.includes(6), "the box opened on arrival is gone");
    assert.equal(arrived.gifts.length, 3, "a new box appears elsewhere after arrival");
  }
});

test("pullback is never dealt when nobody is ahead, and only targets teams ahead", () => {
  for (let seed = 0; seed < 200; seed++) {
    const landed = rollFaces(setGifts(answer(started(), "wrong"), [3]), [3], seeded(seed));
    if (landed.phase.kind === "card-selection") assert.ok(!landed.phase.cards.includes("pullback"));
  }
  const game = applyCard(flipped(setPositions(started(), { [T1]: 3, [T2]: 9 }), 0, "pullback"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.deepEqual(game.phase.candidates, [T2]);
});

test("a forward card onto another box does not chain: no new card, no new question", () => {
  let game = setGifts(setPositions(started(), { [T1]: 4 }), [6]);
  const used = game.usedQuestionIds.length;
  game = settle(applyCard(flipped(game, 0, "speed")));
  assert.equal(teamOf(game, T1).position, 6);
  assert.equal(game.phase.kind, "turn-complete");
  assert.deepEqual(game.gifts, [6]);
  assert.equal(game.usedQuestionIds.length, used);
});

/* --------------------------- Cân bằng ngầm --------------------------- */

test("no visible bonuses: far behind after many wrong answers, a team still rolls and moves by the dice only", () => {
  let game = setGifts(setPositions(started(2), { [T2]: 20 }), []);
  for (let round = 0; round < 3; round++) {
    game = continueToNextTeam(rollFaces(answer(game, "wrong"), [1]));
    game = continueToNextTeam(rollFaces(answer(game, "wrong"), [1]));
  }
  assert.equal(currentTeam(game).id, T1);
  game = answer(game, "wrong");
  if (game.phase.kind === "waiting-roll") assert.equal(game.phase.plan.dice, DICE_WHEN_WRONG);
  const before = teamOf(game, T1).position;
  game = rollFaces(game, [3]);
  assert.equal(teamOf(game, T1).position, before + 3);
});

test("attack cards can target any other team, the last one included", () => {
  const game = setPositions(started(), { [T1]: 8, [T2]: 6, [T3]: 3, [T4]: 6, [T5]: 6 });
  const attack = applyCard(flipped(game, 0, "pushback"));
  assert.equal(attack.phase.kind, "target-selection");
  if (attack.phase.kind === "target-selection") assert.deepEqual(attack.phase.candidates, [T2, T3, T4, T5]);
});

test("hidden balance: a team leads or trails only when BALANCE_GAP tiles apart", () => {
  const game = setPositions(started(), { [T1]: BALANCE_GAP + 6, [T2]: 6, [T3]: 4, [T4]: 6, [T5]: 1 });
  assert.equal(standingOf(game, T1), "leading");
  assert.equal(standingOf(game, T5), "trailing");
  assert.equal(standingOf(game, T2), "even");
  assert.equal(standingOf(game, T3), "even", "far behind but not last");
  const close = setPositions(started(), { [T1]: BALANCE_GAP - 1 });
  assert.equal(standingOf(close, T1), "even");
  assert.equal(standingOf(close, T2), "even");
});

test("hidden balance: each row of CARD_ODDS adds up to 100 and the even row is the plain deck", () => {
  for (const odds of Object.values(CARD_ODDS)) assert.equal(odds.forward + odds.attack + odds.penalty, 100);
  const plain: Record<CardCategory, number> = { forward: 0, attack: 0, penalty: 0 };
  for (const card of CARDS) plain[card.category] += card.weight;
  assert.deepEqual(CARD_ODDS.even, plain);
});

/** Tỉ lệ từng nhóm thẻ khi Đội 1 đi từ ô 7 tới hộp quà ở ô 10, các đội khác đứng ở `others`. */
function giftShares(others: Record<string, number>): Record<CardCategory, number> {
  const counts: Record<CardCategory, number> = { forward: 0, attack: 0, penalty: 0 };
  let total = 0;
  for (let seed = 0; seed < 800; seed++) {
    let game = setGifts(setPositions(started(), { [T1]: 7, ...others }), [10]);
    game = rollFaces(answer(game, "wrong"), [3], seeded(seed));
    assert.equal(game.phase.kind, "card-selection");
    if (game.phase.kind !== "card-selection") continue;
    for (const id of game.phase.cards) counts[cardById(id).category]++;
    total += game.phase.cards.length;
  }
  return { forward: counts.forward / total, attack: counts.attack / total, penalty: counts.penalty / total };
}

test("hidden balance: far ahead meets more self-penalty cards, last and far behind meets none", () => {
  const even = giftShares({ [T2]: 12, [T3]: 9, [T4]: 8, [T5]: 6 });
  const leading = giftShares({ [T2]: 10 - BALANCE_GAP, [T3]: 2, [T4]: 0, [T5]: 1 });
  const trailing = giftShares({ [T2]: 10 + BALANCE_GAP, [T3]: 13, [T4]: 12, [T5]: 11 });
  assert.equal(trailing.penalty, 0, "the last team far behind never draws a self-penalty card");
  assert.ok(trailing.forward > even.forward + 0.1, `forward ${trailing.forward} vs ${even.forward}`);
  assert.ok(leading.penalty > even.penalty + 0.1, `penalty ${leading.penalty} vs ${even.penalty}`);
  assert.ok(leading.forward < even.forward - 0.1, `forward ${leading.forward} vs ${even.forward}`);
});

/* ------------------------- Lượt và câu hỏi ------------------------- */

test("questions follow the shuffled deck; Continue is the only way the team changes", () => {
  let game = setGifts(started(3), []);
  const asked = [currentQuestion(game)!.id];
  const order = [currentTeam(game).id];
  for (let i = 0; i < 6; i++) {
    game = rollFaces(answer(game, "wrong"), [1]);
    assert.equal(currentTeam(game).id, order.at(-1), "team unchanged before Continue");
    game = continueToNextTeam(game);
    order.push(currentTeam(game).id);
    asked.push(currentQuestion(game)!.id);
  }
  assert.deepEqual(order, [T1, T2, T3, T1, T2, T3, T1]);
  assert.deepEqual(asked, game.questionDeck.slice(0, 7));
});

test("pool exhausted: Continue ends the game instead of repeating a question", () => {
  let game = setGifts(setPositions(started(), { [T3]: 9 }), []);
  game = rollFaces(answer({ ...game, usedQuestionIds: QUESTION_POOL.map((q) => q.id) }, "wrong"), [1]);
  game = continueToNextTeam(game);
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.reason, "questions-exhausted");
    assert.equal(game.phase.winnerId, T3);
  }
});

test("300 random games: each ends, no question repeats, the saved state stays valid", () => {
  let exhausted = 0;
  for (let n = 0; n < 300; n++) {
    const rng = seeded(1000 + n);
    const count = MIN_TEAMS + (n % (MAX_TEAMS - MIN_TEAMS + 1));
    let game = startGame(createGame(count, rng));
    const seen = new Set<string>();
    for (let turn = 0; turn < 1000 && game.phase.kind !== "game-over"; turn++) {
      assert.equal(game.phase.kind, "question", "every turn starts with a question");
      const question = currentQuestion(game)!;
      assert.ok(!seen.has(question.id), `question ${question.id} repeated`);
      seen.add(question.id);
      const r = rng();
      game = answer(game, r < 0.6 ? "right" : r < 0.9 ? "wrong" : "timeout");
      game = settle(settleRoll(rollDice(markDiceThrown(game), rng), rng));
      if (game.phase.kind === "card-selection") {
        game = applyCard(pickCard(game, Math.floor(rng() * 3)));
        if (game.phase.kind === "target-selection") game = chooseTarget(game, game.phase.candidates[0]);
        game = settle(game);
      }
      assert.ok(game.gifts.length <= GIFT_BOX_COUNT);
      if (game.phase.kind === "turn-complete") game = continueToNextTeam(game);
    }
    assert.equal(game.phase.kind, "game-over");
    assert.ok(isGameState(JSON.parse(JSON.stringify(game))));
    if (game.phase.kind === "game-over" && game.phase.reason === "questions-exhausted") exhausted++;
  }
  assert.ok(exhausted < 10, `pool ran out in ${exhausted}/300 games`);
});

/* ------------------------------ Về đích ------------------------------ */

test("reaching the finish by dice ends the game at once, no Continue needed", () => {
  let game = setGifts(setPositions(started(), { [T1]: FINISH_POSITION - 2, [T2]: 7, [T3]: 9 }), []);
  game = rollFaces(answer(game, "right"), [5, 6]);
  assert.equal(teamOf(game, T1).position, FINISH_POSITION, "clamped to the finish");
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.winnerId, T1);
    assert.equal(game.phase.reason, "finish");
    assert.deepEqual(game.phase.ranking.slice(0, 3), [T1, T3, T2]);
  }
  assert.equal(canRollDice(game), false);
  assert.equal(continueToNextTeam(game), game, "nothing continues after game over");
});

test("reaching the finish through a +3 card also ends the game", () => {
  let game = setPositions(started(), { [T1]: FINISH_POSITION - 2 });
  game = settle(applyCard(flipped(game, 0, "breakthrough")));
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") assert.equal(game.phase.winnerId, T1);
});

test("ranking ties: same tile, more right answers first, then who arrived first", () => {
  let game = setPositions(createGame(), { [T1]: 5, [T2]: 5, [T3]: 5 });
  game = {
    ...game,
    teams: game.teams.map((t) => {
      if (t.id === T1) return { ...t, correctAnswers: 1, reachedPositionAt: 9 };
      if (t.id === T2) return { ...t, correctAnswers: 2, reachedPositionAt: 7 };
      if (t.id === T3) return { ...t, correctAnswers: 1, reachedPositionAt: 3 };
      return t;
    }),
  };
  assert.deepEqual(ranking(game).slice(0, 3), [T2, T3, T1]);
});

/* ------------------------------ Thẻ ------------------------------ */

test("attack card: the chosen team moves back, then the turn waits for Continue", () => {
  let game = applyCard(flipped(setPositions(started(), { [T4]: 8, [T2]: 3 }), 1, "headwind"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection")
    assert.ok(!game.phase.candidates.includes(T2), "never yourself");
  game = settle(chooseTarget(game, T4));
  assert.equal(teamOf(game, T4).position, 6);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T2);
});

test("backward moves never go below the start", () => {
  let game = setPositions(started(), { [T2]: 1 });
  game = { ...game, phase: { kind: "target-selection", cardId: "pushback", candidates: [T2] } };
  game = settle(chooseTarget(game, T2));
  assert.equal(teamOf(game, T2).position, 0);
});

test("swap: Đội 2 (tile 5) swaps with Đội 4 (tile 15); identity and score stay", () => {
  let game = setPositions(started(), { [T2]: 5, [T4]: 15 });
  game = { ...game, teams: game.teams.map((t) => (t.id === T4 ? { ...t, correctAnswers: 3 } : t)) };
  game = applyCard(flipped(game, 1, "swap"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.deepEqual(game.phase.candidates, [T1, T3, T4, T5]);
  game = chooseTarget(game, T4);
  assert.equal(game.phase.kind, "moving");
  if (game.phase.kind === "moving") {
    assert.deepEqual(game.phase.moves, [
      { teamId: T2, from: 5, to: 15 },
      { teamId: T4, from: 15, to: 5 },
    ]);
  }
  game = settle(game);
  assert.equal(teamOf(game, T2).position, 15);
  assert.equal(teamOf(game, T4).position, 5);
  assert.equal(teamOf(game, T4).correctAnswers, 3, "right answers are not swapped");
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T2, "waits for Continue");
});

test("swap onto a gift tile never opens another card", () => {
  let game = setGifts(setPositions(started(), { [T1]: 3, [T3]: 9 }), [9]);
  game = settle(chooseTarget(applyCard(flipped(game, 0, "swap")), T3));
  assert.equal(teamOf(game, T1).position, 9);
  assert.equal(game.phase.kind, "turn-complete");
});

test("a swap that puts a team on the finish ends the game exactly once", () => {
  // Trạng thái dựng tay (trong ván thật không đội nào đứng ở đích mà ván chưa kết thúc).
  let game = setPositions(started(), { [T1]: 4, [T2]: FINISH_POSITION, [T3]: 12 });
  game = settle(chooseTarget(applyCard(flipped(game, 0, "swap")), T2));
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.winnerId, T1, "the team moved onto the finish wins");
    assert.deepEqual(game.phase.ranking.slice(0, 3), [T1, T3, T2]);
  }
  assert.equal(settle(game), game, "nothing runs after game over");
});

test("swap with the leader: the leader swaps with the 2nd team, others swap with the leader", () => {
  let lead = applyCard(flipped(setPositions(started(), { [T1]: 14, [T2]: 9, [T3]: 6 }), 0, "swapLeader"));
  assert.equal(lead.phase.kind, "moving", "single leader, no selector");
  lead = settle(lead);
  assert.equal(teamOf(lead, T1).position, 9);
  assert.equal(teamOf(lead, T2).position, 14);

  const trail = settle(
    applyCard(flipped(setPositions(started(), { [T1]: 14, [T2]: 9, [T5]: 2 }), 4, "swapLeader")),
  );
  assert.equal(teamOf(trail, T5).position, 14);
  assert.equal(teamOf(trail, T1).position, 2);
});

test("swap with the leader: two teams tied for the lead, choose one of them", () => {
  let game = applyCard(flipped(setPositions(started(), { [T1]: 3, [T2]: 11, [T4]: 11 }), 0, "swapLeader"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.deepEqual(game.phase.candidates, [T2, T4]);
  game = settle(chooseTarget(game, T4));
  assert.equal(teamOf(game, T1).position, 11);
  assert.equal(teamOf(game, T4).position, 3);
});

test("the three face-down cards sit in random positions, so no slot is safer than another", () => {
  const forwardBySlot = [0, 0, 0];
  const draws = 30000;
  for (let i = 0; i < draws; i++) {
    drawThreeCards(Math.random).forEach((id, slot) => {
      if (cardById(id).category === "forward") forwardBySlot[slot]++;
    });
  }
  const shares = forwardBySlot.map((count) => count / draws);
  assert.ok(Math.max(...shares) - Math.min(...shares) < 0.02, `forward share by slot ${shares.join(", ")}`);
});

test("answer options are shuffled per game, and stay put within a game", () => {
  const game = started();
  const id = currentQuestion(game)!.id;
  const order = optionOrder(game, id);
  assert.deepEqual([...order].sort(), ["A", "B", "C", "D"]);
  assert.deepEqual(optionOrder(JSON.parse(JSON.stringify(game)), id), order, "same game, same order");

  const slotOfRight: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (let n = 0; n < 4000; n++) {
    const other = { ...game, id: `game-${n}` };
    slotOfRight[shownLetter(other, "Q001", "B")]++;
  }
  for (const count of Object.values(slotOfRight))
    assert.ok(count > 850 && count < 1150, JSON.stringify(slotOfRight));
});

test("each new game gets a fresh random question order", () => {
  const firsts = new Set<string>();
  for (let seed = 0; seed < 40; seed++)
    firsts.add(
      createGame(4, seeded(500 + seed))
        .questionDeck.slice(0, 5)
        .join(),
    );
  assert.equal(firsts.size, 40, "no two new games start with the same questions in the same order");
});

test("card draw: never more than one swap card among the three, rates close to the weights", () => {
  const counts: Record<string, number> = {};
  let draws = 0;
  for (let i = 0; i < 20000; i++) {
    const cards = drawThreeCards(Math.random);
    assert.equal(cards.length, 3);
    assert.equal(new Set(cards).size, 3);
    assert.ok(cards.filter((id) => cardById(id).swap).length <= 1);
    for (const id of cards) counts[id] = (counts[id] ?? 0) + 1;
    draws += 3;
  }
  assert.equal(
    CARDS.reduce((sum, c) => sum + c.weight, 0),
    100,
  );
  const swapShare = ((counts.swap ?? 0) + (counts.swapLeader ?? 0)) / draws;
  assert.ok(swapShare > 0.08 && swapShare < 0.16, `swap share ${swapShare}`);
});

/* ------------------------- Dữ liệu đã lưu ------------------------- */

test("saved games from an older version are rejected", () => {
  const game = createGame(3, seeded(1));
  assert.ok(isGameState(JSON.parse(JSON.stringify(game))));
  const withoutDeck: Partial<GameState> = { ...game };
  delete withoutDeck.questionDeck;
  assert.equal(isGameState(withoutDeck), false);
  assert.equal(isGameState({ ...game, id: undefined }), false);
  assert.equal(isGameState({ ...game, teams: game.teams.slice(0, 1) }), false);
  const duringOrderRoll = { ...game, phase: { kind: "order-roll", rolls: {}, queue: [], last: null } };
  assert.equal(isGameState(duringOrderRoll), false, "the removed order roll cannot be resumed");
  const olderTeams = { ...game, teams: game.teams.map((t) => ({ ...t, wrongStreak: 2 })) };
  assert.ok(isGameState(JSON.parse(JSON.stringify(olderTeams))), "a game saved mid-turn by the older build still loads");
});
