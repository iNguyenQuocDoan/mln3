import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted so builds don't depend on reaching fonts.gstatic.com.
const beVietnamPro = localFont({
  variable: "--font-be-vietnam",
  src: [
    { path: "./fonts/BeVietnamPro-Regular.woff", weight: "400" },
    { path: "./fonts/BeVietnamPro-Medium.woff", weight: "500" },
    { path: "./fonts/BeVietnamPro-SemiBold.woff", weight: "600" },
    { path: "./fonts/BeVietnamPro-Bold.woff", weight: "700" },
    { path: "./fonts/BeVietnamPro-ExtraBold.woff", weight: "800" },
  ],
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
