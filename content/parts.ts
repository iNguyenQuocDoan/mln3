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
  /** Tổng số slide nội dung theo bản phân công. */
  totalSlides: 15,
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

export type Section = {
  /** Thành viên phụ trách (1–5), theo bảng phân công. */
  member: 1 | 2 | 3 | 4 | 5;
  part: Part["number"];
  /** Nội dung phụ trách. */
  title: string;
  /** Các slide (theo bản Word) thành viên phụ trách. */
  slides: [number, number];
  /** Tên người trình bày. Để trống thì không hiển thị. */
  presenter: string;
};

export const SECTIONS: Section[] = [
  {
    member: 1,
    part: 1,
    title: "Khái niệm và đặc trưng cơ bản",
    slides: [1, 3],
    presenter: "",
  },
  {
    member: 2,
    part: 2,
    title: "Hai xu hướng và Cương lĩnh dân tộc",
    slides: [4, 6],
    presenter: "",
  },
  {
    member: 3,
    part: 3,
    title: "Sáu đặc điểm dân tộc ở Việt Nam",
    slides: [7, 9],
    presenter: "",
  },
  {
    member: 4,
    part: 3,
    title: "Quan điểm của Đảng và Nhà nước",
    slides: [10, 12],
    presenter: "",
  },
  {
    member: 5,
    part: 3,
    title: "Chính sách dân tộc và tổng kết",
    slides: [13, 15],
    presenter: "",
  },
];

export function getPart(number: number): Part {
  const part = PARTS.find((p) => p.number === number);
  if (!part) throw new Error(`Không có phần ${number}`);
  return part;
}

/** Phần nội dung (theo bảng phân công) chứa slide số `slide`. */
export function sectionOfSlide(slide: number): Section {
  const section = SECTIONS.find(
    (s) => slide >= s.slides[0] && slide <= s.slides[1],
  );
  if (!section) throw new Error(`Không có slide ${slide}`);
  return section;
}

export function sectionsOfPart(part: number): Section[] {
  return SECTIONS.filter((s) => s.part === part);
}
