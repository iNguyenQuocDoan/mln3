/**
 * Thông tin chung của bài thuyết trình.
 * Điền tên nhóm, giảng viên nếu muốn hiện trên slide bìa;
 * trường nào để trống sẽ không hiển thị.
 */
export const DECK_INFO = {
  course: "MLN131",
  title: "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội",
  group: "",
  instructor: "",
  source: "Slide môn MLN131, slide 155–163",
};

export type Part = {
  number: 1 | 2 | 3;
  /** Tên phần, theo lời mở đầu: "Bài trình bày gồm ba phần". */
  title: string;
};

export const PARTS: Part[] = [
  { number: 1, title: "Khái niệm và đặc trưng của dân tộc" },
  {
    number: 2,
    title: "Quan điểm của chủ nghĩa Mác – Lênin về vấn đề dân tộc",
  },
  { number: 3, title: "Dân tộc và quan hệ dân tộc ở Việt Nam" },
];

export type Member = {
  /** Thành viên phụ trách (1–5), theo bảng phân công. */
  number: 1 | 2 | 3 | 4 | 5;
  /** Tên người trình bày. Để trống thì không hiển thị. */
  presenter: string;
};

export const MEMBERS: Member[] = [
  { number: 1, presenter: "" },
  { number: 2, presenter: "" },
  { number: 3, presenter: "" },
  { number: 4, presenter: "" },
  { number: 5, presenter: "" },
];

export type Section = {
  /** Số mục (1–7), hiện ở mục lục và chân slide. */
  number: number;
  title: string;
  part: Part["number"];
  member: Member["number"];
};

/** Bảy mục nội dung của bài, theo thứ tự trình bày. */
export const SECTIONS: Section[] = [
  { number: 1, title: "Sự hình thành dân tộc", part: 1, member: 1 },
  { number: 2, title: "Hai nghĩa của dân tộc", part: 1, member: 1 },
  { number: 3, title: "Hai xu hướng khách quan", part: 2, member: 2 },
  { number: 4, title: "Cương lĩnh dân tộc Mác – Lênin", part: 2, member: 2 },
  { number: 5, title: "Sáu đặc điểm dân tộc Việt Nam", part: 3, member: 3 },
  {
    number: 6,
    title: "Quan điểm của Đảng, Nhà nước Việt Nam",
    part: 3,
    member: 4,
  },
  { number: 7, title: "Chính sách dân tộc", part: 3, member: 5 },
];

export function getPart(number: number): Part {
  const part = PARTS.find((p) => p.number === number);
  if (!part) throw new Error(`Không có phần ${number}`);
  return part;
}

export function getSection(number: number): Section {
  const section = SECTIONS.find((s) => s.number === number);
  if (!section) throw new Error(`Không có mục ${number}`);
  return section;
}

export function getMember(number: number): Member {
  const member = MEMBERS.find((m) => m.number === number);
  if (!member) throw new Error(`Không có thành viên ${number}`);
  return member;
}

export function sectionsOfPart(part: number): Section[] {
  return SECTIONS.filter((s) => s.part === part);
}

/** "01", "02"...: số mục luôn hai chữ số. */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
