import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội | MLN131",
  description:
    "Bài thuyết trình nhóm môn MLN131: Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội.",
};

export const viewport: Viewport = {
  themeColor: "#1c2553",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
