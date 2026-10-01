import { Deck } from "@/components/deck/deck";
import { slides } from "@/content/slides";

export default function Home() {
  return <Deck slides={slides} />;
}
