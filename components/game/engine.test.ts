import assert from "node:assert/strict";
import { test } from "node:test";
import { BOARD_TILES, FINISH_POSITION } from "../../content/game-board.ts";
import { cardById, CARDS, drawThreeCards, type CardId } from "../../content/game-cards.ts";
import { QUESTION_POOL } from "../../content/game-questions.ts";
import { TEAM_DEFS } from "../../content/game-teams.ts";
import {
  answerQuestion,
  applyCard,
  canRollDice,
  chooseTarget,
  continueToNextTeam,
  createGame,
  currentQuestion,
  currentTeam,
  nextTeam,
  pickCard,
  ranking,
  rollDice,
  settleMove,
  settleRoll,
  startGame,
  teamOf,
  type GameState,
  type Rng,
} from "./engine.ts";

/** RNG cho một mặt xúc xắc cố định: rollDice dùng floor(r*6)+1. */
function dice(face: number): Rng {
  return () => (face - 1) / 6 + 0.01;
}

const firstRng: Rng = () => 0;

function setPositions(game: GameState, positions: Record<string, number>): GameState {
  return {
    ...game,
    teams: game.teams.map((t) => (t.id in positions ? { ...t, position: positions[t.id] } : t)),
  };
}

function settle(game: GameState): GameState {
  let next = game;
  while (next.phase.kind === "moving") next = settleMove(next);
  return next;
}

/** Ván đã bấm BẮT ĐẦU, đang ở câu hỏi của đội `teamIndex`. */
function started(teamIndex = 0): GameState {
  const game = startGame(createGame(), firstRng);
  return { ...game, currentTeamIndex: teamIndex };
}

/** Trả lời câu đang mở (đúng/sai). */
function answer(game: GameState, correct: boolean): GameState {
  const q = currentQuestion(game)!;
  const picked = correct ? q.correctAnswer : (["A", "B", "C", "D"].find((o) => o !== q.correctAnswer) as "A");
  return answerQuestion(game, picked);
}

/** Đổ xúc xắc ra `face` và chạy hết hoạt ảnh di chuyển. */
function roll(game: GameState, face: number): GameState {
  return settle(settleRoll(rollDice(game, dice(face)), firstRng));
}

const [T1, T2, T3, T4, T5] = TEAM_DEFS.map((t) => t.id);

test("board: 28 positions = START + 26 provinces + FINISH, 8 spread-out gift tiles", () => {
  assert.equal(BOARD_TILES.length, 28);
  assert.equal(FINISH_POSITION, 27);
  assert.equal(BOARD_TILES.filter((t) => t.type === "province").length, 26);
  const gifts = BOARD_TILES.filter((t) => t.hasGift).map((t) => t.id);
  assert.equal(gifts.length, 8);
  for (let i = 1; i < gifts.length; i++) assert.ok(gifts[i] - gifts[i - 1] >= 2, "no two gifts in a row");
});

test("Test Start: a new game shows no question, no dice, no turn until the MC starts", () => {
  const game = createGame();
  assert.equal(game.phase.kind, "not-started");
  assert.equal(currentQuestion(game), undefined);
  assert.equal(game.usedQuestionIds.length, 0);
  assert.equal(canRollDice(game), false);
  assert.equal(continueToNextTeam(game, firstRng), game, "Continue does nothing before Start");

  const begun = startGame(game, firstRng);
  assert.equal(begun.phase.kind, "question");
  assert.equal(currentTeam(begun).id, T1);
  assert.equal(begun.usedQuestionIds.length, 1);
  assert.equal(startGame(begun, firstRng), begun, "Start only works once");
});

test("Test wrong: ❌ → turn-complete, the game stops; Đội 2 has no question until Continue", () => {
  let game = started();
  const used = game.usedQuestionIds.length;
  game = answer(game, false);
  assert.equal(game.phase.kind, "turn-complete");
  if (game.phase.kind === "turn-complete") assert.equal(game.phase.outcome.kind, "wrong");
  assert.equal(currentTeam(game).id, T1, "still Đội 1 — no automatic next team");
  assert.equal(teamOf(game, T1).position, 0);
  assert.equal(game.usedQuestionIds.length, used, "no question drawn for Đội 2 yet");
  assert.equal(canRollDice(game), false);
  assert.equal(rollDice(game, dice(4)), game);
  assert.equal(settleMove(game), game, "animation callbacks cannot advance the turn");

  game = continueToNextTeam(game, firstRng);
  assert.equal(currentTeam(game).id, T2);
  assert.equal(game.phase.kind, "question");
  assert.equal(game.usedQuestionIds.length, used + 1);
});

test("Test correct, no gift: roll 4 → move 4 tiles → turn-complete, waits for Continue", () => {
  let game = answer(started(1), true);
  assert.equal(game.phase.kind, "waiting-roll");
  assert.equal(canRollDice(game), true);
  assert.equal(teamOf(game, T2).correctAnswers, 1);

  const rolling = rollDice(game, dice(4));
  assert.equal(rollDice(rolling, dice(6)), rolling, "cannot roll twice");
  const moving = settleRoll(rolling, firstRng);
  assert.equal(moving.phase.kind, "moving");
  if (moving.phase.kind === "moving") assert.deepEqual(moving.phase.moves, [{ teamId: T2, from: 0, to: 4 }]);

  game = settle(moving);
  assert.equal(teamOf(game, T2).position, 4);
  assert.equal(BOARD_TILES[4].hasGift, false);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T2, "no automatic next team");
  assert.equal(nextTeam(game).id, T3);
});

test("Test correct + gift: card effect → turn-complete, waits for Continue", () => {
  let game = roll(answer(started(2), true), 3); // Thanh Hóa 🎁
  assert.ok(BOARD_TILES[3].hasGift);
  assert.equal(game.phase.kind, "card-selection");
  game = { ...game, phase: { kind: "card-selection", cards: ["speed", "slip", "headwind"] } };
  game = settle(applyCard(pickCard(game, 0)));
  assert.equal(teamOf(game, T3).position, 5);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T3);
  if (game.phase.kind === "turn-complete" && game.phase.outcome.kind === "moved") {
    assert.equal(game.phase.outcome.cardId, "speed");
    assert.equal(game.phase.outcome.dice, 3);
  }
});

test("attack card → target moves back → turn-complete, no defense, no auto-next", () => {
  let game = setPositions(started(1), { [T4]: 8, [T2]: 3 });
  game = { ...game, phase: { kind: "card-result", cards: ["headwind"], cardId: "headwind", cardIndex: 0 } };
  game = applyCard(game);
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.ok(!game.phase.candidates.includes(T2));
  game = settle(chooseTarget(game, T4));
  assert.equal(teamOf(game, T4).position, 6);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T2);
});

test("Continue cycles Đội 1 → 2 → 3 → 4 → 5 → 1, and is the only way the team changes", () => {
  let game = started();
  const order = [currentTeam(game).id];
  for (let i = 0; i < 5; i++) {
    game = answer(game, false);
    assert.equal(currentTeam(game).id, order[order.length - 1], "team unchanged before Continue");
    game = continueToNextTeam(game, firstRng);
    order.push(currentTeam(game).id);
  }
  assert.deepEqual(order, [T1, T2, T3, T4, T5, T1]);
});

test("a question that appeared can never appear again (300 random games)", () => {
  let exhausted = 0;
  for (let gameNo = 0; gameNo < 300; gameNo++) {
    let game = startGame(createGame(), Math.random);
    const seen = new Set<string>();
    for (let turn = 0; turn < 1000 && game.phase.kind !== "game-over"; turn++) {
      assert.equal(game.phase.kind, "question", "every turn starts with a question");
      const q = currentQuestion(game)!;
      assert.ok(!seen.has(q.id), `question ${q.id} repeated`);
      seen.add(q.id);
      const correct = Math.random() < 0.6;
      game = answer(game, correct);
      if (correct) {
        game = settle(settleRoll(rollDice(game, Math.random), Math.random));
        if (game.phase.kind === "card-selection") {
          game = applyCard(pickCard(game, 0));
          if (game.phase.kind === "target-selection") game = chooseTarget(game, game.phase.candidates[0]);
          game = settle(game);
        }
      }
      if (game.phase.kind === "turn-complete") game = continueToNextTeam(game, Math.random);
    }
    assert.equal(game.phase.kind, "game-over");
    if (game.phase.kind === "game-over" && game.phase.reason === "questions-exhausted") exhausted++;
  }
  assert.ok(exhausted < 15, `pool ran out in ${exhausted}/300 games`);
});

test("pool exhausted: Continue ends the game instead of repeating a question", () => {
  let game = setPositions(started(), { [T3]: 9 });
  game = answer({ ...game, usedQuestionIds: QUESTION_POOL.map((q) => q.id) }, false);
  game = continueToNextTeam(game, firstRng);
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.reason, "questions-exhausted");
    assert.equal(game.phase.winnerId, T3);
  }
});

test("reaching FINISH by dice ends the game immediately — no Continue needed", () => {
  let game = setPositions(started(), { [T1]: FINISH_POSITION - 2, [T2]: 7, [T3]: 9 });
  game = roll(answer(game, true), 5);
  assert.equal(teamOf(game, T1).position, FINISH_POSITION, "clamped to FINISH");
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.winnerId, T1);
    assert.equal(game.phase.reason, "finish");
    assert.deepEqual(game.phase.ranking.slice(0, 3), [T1, T3, T2]);
  }
  assert.equal(canRollDice(game), false);
  assert.equal(continueToNextTeam(game, firstRng), game, "nothing continues after game over");
});

test("reaching FINISH through a +3 card also ends the game", () => {
  let game = setPositions(started(), { [T1]: FINISH_POSITION - 2 });
  game = { ...game, phase: { kind: "card-result", cards: ["step", "breakthrough"], cardId: "breakthrough", cardIndex: 1 } };
  game = settle(applyCard(game));
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") assert.equal(game.phase.winnerId, T1);
});

test("forward card onto another 🎁 does not chain: no new card, no new question", () => {
  let game = setPositions(started(), { [T1]: 4 });
  assert.ok(BOARD_TILES[6].hasGift);
  game = { ...game, phase: { kind: "card-result", cards: ["speed"], cardId: "speed", cardIndex: 0 } };
  const used = game.usedQuestionIds.length;
  game = settle(applyCard(game));
  assert.equal(teamOf(game, T1).position, 6);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(game.usedQuestionIds.length, used);
});

test("pullback only targets teams ahead and is never dealt when nobody is ahead", () => {
  const ready = answer(started(), true);
  for (let i = 0; i < 200; i++) {
    const landed = settle(settleRoll(rollDice(ready, dice(3)), Math.random));
    if (landed.phase.kind === "card-selection") assert.ok(!landed.phase.cards.includes("pullback"));
  }
  let game = setPositions(started(), { [T1]: 3, [T2]: 9 });
  game = { ...game, phase: { kind: "card-result", cards: ["pullback"], cardId: "pullback", cardIndex: 0 } };
  game = applyCard(game);
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.deepEqual(game.phase.candidates, [T2]);
});

test("ranking ties: same tile → more correct answers first, then who arrived first", () => {
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

test("backward moves never go below START", () => {
  let game = setPositions(started(), { [T2]: 1 });
  game = { ...game, phase: { kind: "target-selection", cardId: "pushback", candidates: [T2] } };
  game = settle(chooseTarget(game, T2));
  assert.equal(teamOf(game, T2).position, 0);
});

/* -------------------------- Thẻ đổi vị trí -------------------------- */

/** Đội `teamIndex` vừa lật được thẻ `cardId`. */
function flipped(game: GameState, teamIndex: number, cardId: CardId): GameState {
  return { ...game, currentTeamIndex: teamIndex, phase: { kind: "card-result", cards: [cardId], cardId, cardIndex: 0 } };
}

test("Swap 1: Đội 2 (ô 5) swaps with Đội 4 (ô 15); identity and score stay", () => {
  let game = setPositions(started(), { [T2]: 5, [T4]: 15 });
  game = { ...game, teams: game.teams.map((t) => (t.id === T4 ? { ...t, correctAnswers: 3 } : t)) };
  game = applyCard(flipped(game, 1, "swap"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") {
    assert.deepEqual(game.phase.candidates, [T1, T3, T4, T5], "never yourself");
  }
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
  assert.equal(teamOf(game, T4).correctAnswers, 3, "correctAnswers is not swapped");
  assert.equal(teamOf(game, T2).previousPosition, 5);
  assert.equal(game.phase.kind, "turn-complete");
  assert.equal(currentTeam(game).id, T2, "waits for Continue");
});

test("Swap 2: swapping onto a 🎁 tile never opens another card phase", () => {
  let game = setPositions(started(), { [T1]: 3, [T3]: 9 });
  assert.ok(BOARD_TILES[9].hasGift);
  game = settle(chooseTarget(applyCard(flipped(game, 0, "swap")), T3));
  assert.equal(teamOf(game, T1).position, 9);
  assert.equal(game.phase.kind, "turn-complete");
});

test("Swap 3: a swap that puts a team on FINISH ends the game exactly once", () => {
  // Trạng thái dựng tay (trong ván thật không đội nào đứng ở FINISH mà game chưa kết thúc).
  let game = setPositions(started(), { [T1]: 4, [T2]: FINISH_POSITION, [T3]: 12 });
  game = settle(chooseTarget(applyCard(flipped(game, 0, "swap")), T2));
  assert.equal(game.phase.kind, "game-over");
  if (game.phase.kind === "game-over") {
    assert.equal(game.phase.winnerId, T1, "the team moved onto FINISH wins");
    assert.deepEqual(game.phase.ranking.slice(0, 3), [T1, T3, T2], "T2 was moved out of FINISH");
  }
  assert.equal(settle(game), game, "nothing runs after game over");
});

test("Swap 4: the leader flipping 'swap with leader' swaps with the 2nd team", () => {
  let game = setPositions(started(), { [T1]: 14, [T2]: 9, [T3]: 6 });
  game = applyCard(flipped(game, 0, "swapLeader"));
  assert.equal(game.phase.kind, "moving", "single leader → no selector");
  game = settle(game);
  assert.equal(teamOf(game, T1).position, 9);
  assert.equal(teamOf(game, T2).position, 14);
});

test("swap with leader: a trailing team swaps with the leader automatically", () => {
  let game = setPositions(started(), { [T1]: 14, [T2]: 9, [T5]: 2 });
  game = settle(applyCard(flipped(game, 4, "swapLeader")));
  assert.equal(teamOf(game, T5).position, 14);
  assert.equal(teamOf(game, T1).position, 2);
});

test("Swap 5: two teams tied for the lead → target selector with just those two", () => {
  let game = setPositions(started(), { [T1]: 3, [T2]: 11, [T4]: 11 });
  game = applyCard(flipped(game, 0, "swapLeader"));
  assert.equal(game.phase.kind, "target-selection");
  if (game.phase.kind === "target-selection") assert.deepEqual(game.phase.candidates, [T2, T4]);
  game = settle(chooseTarget(game, T4));
  assert.equal(teamOf(game, T1).position, 11);
  assert.equal(teamOf(game, T4).position, 3);
  assert.equal(teamOf(game, T2).position, 11);
});

test("card draw: never more than one swap card among the three, rates ≈ spec", () => {
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
  assert.equal(CARDS.reduce((sum, c) => sum + c.weight, 0), 100);
  const swapShare = ((counts.swap ?? 0) + (counts.swapLeader ?? 0)) / draws;
  assert.ok(swapShare > 0.08 && swapShare < 0.16, `swap share ${swapShare}`);
});
