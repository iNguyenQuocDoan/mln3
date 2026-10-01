/**
 * Thông tin chung của bài thuyết trình.
 * Điền tên nhóm, thành viên, giảng viên nếu muốn hiện trên slide bìa;
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
  number: 1 | 2 | 3 | 4 | 5;
  /** Tên đầy đủ, dùng ở mục lục và slide chuyển phần. */
  title: string;
  /** Tên ngắn, dùng ở chân slide và dải điều hướng. */
  short: string;
  /** Tên người trình bày. Để trống thì không hiển thị. */
  presenter: string;
};

export const PARTS: Part[] = [
  {
    number: 1,
    title: "Khái niệm và đặc trưng cơ bản của dân tộc",
    short: "Khái niệm dân tộc",
    presenter: "",
  },
  {
    number: 2,
    title: "Chủ nghĩa Mác – Lênin về vấn đề dân tộc",
    short: "Chủ nghĩa Mác – Lênin về vấn đề dân tộc",
    presenter: "",
  },
  {
    number: 3,
    title: "Đặc điểm dân tộc ở Việt Nam",
    short: "Đặc điểm dân tộc ở Việt Nam",
    presenter: "",
  },
  {
    number: 4,
    title: "Quan điểm về dân tộc và giải quyết quan hệ dân tộc ở Việt Nam",
    short: "Quan điểm về giải quyết vấn đề dân tộc",
    presenter: "",
  },
  {
    number: 5,
    title: "Chính sách dân tộc của Đảng và Nhà nước Việt Nam",
    short: "Chính sách dân tộc",
    presenter: "",
  },
];

export function getPart(number: number): Part {
  const part = PARTS.find((p) => p.number === number);
  if (!part) throw new Error(`Không có phần ${number}`);
  return part;
}
