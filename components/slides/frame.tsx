import type { ReactNode } from "react";
import { keepWords } from "@/content/typography";

/** Khung chung cho slide nội dung: tiêu đề ở trên, nội dung bên dưới. */
export function SlideFrame({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-32 pt-22 pb-32">
      <header>
        <h2 className="text-title font-bold text-balance">
          {keepWords(title)}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-lead text-cham-soft">{keepWords(subtitle)}</p>
        ) : null}
      </header>
      <div className={`mt-14 min-h-0 flex-1 ${className}`}>{children}</div>
    </div>
  );
}
