import type { Metadata } from "next";
import { BoardGame } from "@/components/game/board-game";

export const metadata: Metadata = {
  title: "Đường đua đại đoàn kết | MLN131",
  description: "Mini board game ôn tập sau bài thuyết trình MLN131.",
};

export default function GamePage() {
  return <BoardGame />;
}
