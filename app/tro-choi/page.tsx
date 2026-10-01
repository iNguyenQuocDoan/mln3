import type { Metadata } from "next";
import { RaceGame } from "@/components/game/race-game";

export const metadata: Metadata = {
  title: "Đường đua tiếp nhiên liệu | MLN131",
  description: "Trò chơi ôn tập sau bài thuyết trình MLN131.",
};

export default function GamePage() {
  return <RaceGame />;
}
