import type { Metadata } from "next";
import { Presenter } from "@/components/deck/presenter";
import { slides } from "@/content/slides";

export const metadata: Metadata = {
  title: "Màn hình người trình bày | MLN131",
};

export default function PresenterPage() {
  return <Presenter slides={slides} />;
}
