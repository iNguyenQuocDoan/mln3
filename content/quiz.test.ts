import assert from "node:assert/strict";
import { test } from "node:test";
import { createGame, type Level } from "../components/game/engine.ts";
import { QUIZ } from "./quiz.ts";

/*
 * Kiểm tra ngân hàng câu hỏi sau mỗi lần nhóm sửa content/quiz.ts:
 * chạy `npm test`. Giới hạn độ dài là để câu hỏi vừa khung trên màn hình.
 */

const LEVELS: Level[] = ["easy", "medium", "hard"];

test("mỗi câu có mã riêng", () => {
  const ids = QUIZ.map((item) => item.id);
  const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(repeated, []);
});

test("mỗi câu có đủ bốn đáp án khác nhau và đúng một đáp án đúng", () => {
  for (const item of QUIZ) {
    assert.equal(item.answers.length, 4, item.id);
    assert.equal(new Set(item.answers.map((a) => a.trim())).size, 4, item.id);
    assert.ok(item.answers.every((a) => a.trim().length > 0), item.id);
    assert.ok(
      Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 3,
      item.id,
    );
  }
});

test("mỗi câu có nội dung, giải thích và nguồn để đối chiếu", () => {
  for (const item of QUIZ) {
    assert.ok(item.question.trim(), item.id);
    assert.ok(item.explain.trim(), item.id);
    assert.ok(item.source.trim(), item.id);
  }
});

test("câu hỏi và đáp án đủ ngắn để vừa màn hình", () => {
  for (const item of QUIZ) {
    assert.ok(item.question.length <= 140, `${item.id}: câu hỏi quá dài`);
    assert.ok(item.explain.length <= 200, `${item.id}: giải thích quá dài`);
    for (const option of item.answers) {
      assert.ok(option.length <= 80, `${item.id}: đáp án quá dài "${option}"`);
    }
  }
});

test("lời giải thích kèm nguồn gói gọn trong hai dòng", () => {
  const tooLong = QUIZ.filter(
    (item) => item.explain.length + item.source.length > 150,
  ).map((item) => item.id);
  assert.deepEqual(tooLong, []);
});

test("mỗi mức có ít nhất 8 câu để một ván ít bị lặp câu", () => {
  for (const level of LEVELS) {
    const count = QUIZ.filter((item) => item.level === level).length;
    assert.ok(count >= 8, `mức ${level} chỉ có ${count} câu`);
  }
});

/*
 * Đáp án của đa số câu được xáo mỗi lần hỏi. Chỉ các câu keepOrder (đáp án
 * là số, năm, thứ tự) hiện đúng vị trí trong file, nên với các câu này đáp
 * án đúng không được dồn vào một chữ cái.
 */
const ORDERED = QUIZ.filter((item) => item.keepOrder);

test("có câu giữ nguyên thứ tự đáp án (số, năm, thứ tự)", () => {
  assert.ok(ORDERED.length > 0);
});

test("câu giữ thứ tự: đáp án đúng không dồn vào một chữ cái", () => {
  for (const position of [0, 1, 2, 3]) {
    const count = ORDERED.filter((item) => item.correct === position).length;
    assert.ok(
      count <= Math.ceil(ORDERED.length / 2),
      `${count}/${ORDERED.length} câu giữ thứ tự có đáp án đúng ở ô ${"ABCD"[position]}`,
    );
  }
});

test("câu giữ thứ tự có đáp án là số thì các số tăng dần", () => {
  for (const item of ORDERED) {
    const numbers = item.answers.map((text) => text.match(/\d+/)?.[0]);
    if (numbers.some((value) => value === undefined)) continue;
    const values = numbers.map(Number);
    assert.ok(
      values.every((value, i) => i === 0 || value > values[i - 1]),
      `${item.id}: ${item.answers.join(", ")}`,
    );
  }
});

test("trò chơi dựng được ván mới từ ngân hàng câu hỏi này", () => {
  const game = createGame(
    { teamNames: ["Đội 1", "Đội 2"], trackLength: 10, answerSeconds: 20 },
    QUIZ,
    Math.random,
  );
  assert.equal(game.teams.length, 2);
});
