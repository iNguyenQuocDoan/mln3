import assert from "node:assert/strict";
import { test } from "node:test";
import { QUESTION_POOL, validateQuestionBank } from "./game-questions.ts";

test("question pool: 108 questions with unique ids and text", () => {
  assert.equal(QUESTION_POOL.length, 108);
  assert.equal(new Set(QUESTION_POOL.map((q) => q.id)).size, 108);
  assert.equal(new Set(QUESTION_POOL.map((q) => q.question)).size, 108);
});

test("validateQuestionBank: PASS", () => {
  assert.deepEqual(validateQuestionBank(), []);
});

test("difficulty mix ≈ 20 / 55 / 25", () => {
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const q of QUESTION_POOL) counts[q.difficulty]++;
  assert.deepEqual(counts, { easy: 22, medium: 59, hard: 27 });
});

test("the validator catches a long-answer give-away", () => {
  const bad = {
    ...QUESTION_POOL[0],
    id: "BAD-1",
    question: "Câu thử",
    options: [
      { id: "A" as const, text: "Văn hóa" },
      { id: "B" as const, text: "Xã hội" },
      { id: "C" as const, text: "Chính trị" },
      { id: "D" as const, text: "Phát triển kinh tế xã hội miền núi và vùng đồng bào" },
    ],
  };
  assert.ok(validateQuestionBank([bad]).some((e) => e.includes("unbalanced option length")));
});
