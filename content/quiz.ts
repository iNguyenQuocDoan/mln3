import type { Question } from "@/components/game/engine";

/*
 * Ngân hàng câu hỏi của trò chơi "Đường đua tiếp nhiên liệu".
 *
 * - level: "easy" = cây xăng E5 (đúng +1 ô), "medium" = RON95 (+2 ô),
 *   "hard" = câu khó trong bình ??? (+3 ô).
 * - answers: đúng bốn đáp án. Mỗi lần câu được rút, bốn đáp án được xáo
 *   lại vị trí A–D, nên gặp lại câu cũ thì đáp án đúng ở ô khác.
 * - correct: vị trí đáp án đúng trong mảng answers (0 = đáp án đầu tiên).
 * - keepOrder: true nếu đáp án là số, năm hoặc thứ tự (51, 52, 53, 54...):
 *   giữ nguyên thứ tự trong file cho dễ đọc, không xáo.
 * - source: số slide theo bản Word để nhóm đối chiếu.
 *
 * Sửa xong chạy `npm test` để kiểm tra: đủ bốn đáp án, không trùng mã câu,
 * câu không quá dài so với khung hiển thị.
 */
export const QUIZ: Question[] = [
  /* ---------- E5: câu dễ ---------- */
  {
    id: "e01",
    level: "easy",
    question: "Theo nghĩa thứ nhất, “dân tộc” được hiểu là gì?",
    answers: ["Quốc gia dân tộc", "Tộc người", "Giai cấp", "Tôn giáo"],
    correct: 0,
    explain:
      "Nghĩa thứ nhất: dân tộc là quốc gia dân tộc, một cộng đồng chính trị – xã hội.",
    source: "Slide 2",
  },
  {
    id: "e02",
    level: "easy",
    question: "Theo nghĩa thứ hai, “dân tộc” được hiểu là gì?",
    answers: ["Quốc gia dân tộc", "Nhà nước", "Giai cấp", "Tộc người"],
    correct: 3,
    explain:
      "Nghĩa thứ hai: dân tộc là tộc người, với ba đặc trưng: ngôn ngữ, văn hóa và ý thức tự giác tộc người.",
    source: "Slide 3",
  },
  {
    id: "e03",
    level: "easy",
    question: "Dân tộc theo nghĩa quốc gia dân tộc có mấy đặc trưng?",
    answers: ["3", "4", "5", "6"],
    correct: 2,
    keepOrder: true,
    explain:
      "Năm đặc trưng: chung kinh tế, chung lãnh thổ, có nhà nước dân tộc độc lập, có ngôn ngữ chung và bản sắc văn hóa.",
    source: "Slide 2",
  },
  {
    id: "e04",
    level: "easy",
    question: "Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin gồm mấy nội dung?",
    answers: ["2", "3", "4", "5"],
    correct: 1,
    keepOrder: true,
    explain:
      "Ba nội dung: các dân tộc hoàn toàn bình đẳng, được quyền tự quyết, và liên hiệp công nhân tất cả các dân tộc.",
    source: "Slide 5–6",
  },
  {
    id: "e05",
    level: "easy",
    question: "Nội dung thứ nhất của Cương lĩnh dân tộc là gì?",
    answers: [
      "Các dân tộc hoàn toàn bình đẳng",
      "Các dân tộc được quyền tự quyết",
      "Liên hiệp công nhân tất cả các dân tộc",
      "Xây dựng nền văn hóa tiên tiến",
    ],
    correct: 0,
    explain:
      "Thứ tự ba nội dung: hoàn toàn bình đẳng, quyền tự quyết, liên hiệp công nhân tất cả các dân tộc.",
    source: "Slide 5",
  },
  {
    id: "e06",
    level: "easy",
    question:
      "Trong sự phát triển của quan hệ dân tộc có mấy xu hướng khách quan?",
    answers: ["1", "2", "3", "4"],
    correct: 1,
    keepOrder: true,
    explain:
      "Hai xu hướng: tách ra để hình thành cộng đồng dân tộc độc lập, và các dân tộc liên hiệp lại với nhau.",
    source: "Slide 4",
  },
  {
    id: "e07",
    level: "easy",
    question: "Các dân tộc ở Việt Nam cư trú như thế nào?",
    answers: [
      "Mỗi dân tộc ở một vùng riêng",
      "Xen kẽ nhau",
      "Chỉ ở vùng đồng bằng",
      "Chỉ ở vùng núi cao",
    ],
    correct: 1,
    explain: "Một đặc điểm của dân tộc ở Việt Nam: các dân tộc cư trú xen kẽ nhau.",
    source: "Slide 7",
  },
  {
    id: "e08",
    level: "easy",
    question: "Bài thuyết trình nêu mấy đặc điểm của dân tộc ở Việt Nam?",
    answers: ["4", "5", "6", "7"],
    correct: 2,
    keepOrder: true,
    explain:
      "Sáu đặc điểm: số dân, cư trú, địa bàn, trình độ phát triển, truyền thống đoàn kết và bản sắc văn hóa.",
    source: "Slide 7–9",
  },
  {
    id: "e09",
    level: "easy",
    question: "Việt Nam có bao nhiêu dân tộc?",
    answers: ["51", "52", "53", "54"],
    correct: 3,
    keepOrder: true,
    explain:
      "Việt Nam có 54 dân tộc, cùng gắn bó trong một cộng đồng quốc gia thống nhất.",
    source: "Kiến thức chung",
  },
  {
    id: "e10",
    level: "easy",
    question: "Dân tộc nào đông dân nhất ở Việt Nam?",
    answers: ["Tày", "Thái", "Kinh", "Mường"],
    correct: 2,
    explain:
      "Người Kinh chiếm khoảng 85% dân số (Tổng điều tra 2019), ví dụ rõ nhất cho sự chênh lệch số dân giữa các tộc người.",
    source: "Kiến thức chung, liên hệ Slide 7",
  },
  {
    id: "e11",
    level: "easy",
    question:
      "Đảng và Nhà nước ưu tiên đầu tư phát triển kinh tế – xã hội ở vùng nào?",
    answers: [
      "Các đô thị lớn",
      "Các khu công nghiệp",
      "Vùng ven biển",
      "Vùng dân tộc và miền núi",
    ],
    correct: 3,
    explain:
      "Quan điểm của Đảng: ưu tiên đầu tư phát triển kinh tế – xã hội vùng dân tộc và miền núi.",
    source: "Slide 11",
  },
  {
    id: "e12",
    level: "easy",
    question:
      "Chính sách dân tộc về văn hóa hướng tới xây dựng nền văn hóa Việt Nam như thế nào?",
    answers: [
      "Tiên tiến, đậm đà bản sắc dân tộc",
      "Hiện đại, theo chuẩn quốc tế",
      "Thống nhất theo một khuôn mẫu chung",
      "Giữ nguyên như thời xưa",
    ],
    correct: 0,
    explain:
      "Về văn hóa: xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc.",
    source: "Slide 14",
  },
  {
    id: "e13",
    level: "easy",
    question: "Ở phương Tây, dân tộc ra đời gắn với phương thức sản xuất nào?",
    answers: ["Chiếm hữu nô lệ", "Phong kiến", "Tư bản chủ nghĩa", "Công xã nguyên thủy"],
    correct: 2,
    explain:
      "Dân tộc xuất hiện khi phương thức sản xuất tư bản chủ nghĩa thay thế phương thức sản xuất phong kiến.",
    source: "Slide 1",
  },
  {
    id: "e14",
    level: "easy",
    question: "Quốc gia dân tộc là một cộng đồng như thế nào?",
    answers: [
      "Cộng đồng chính trị – xã hội",
      "Cộng đồng tôn giáo",
      "Cộng đồng dòng họ",
      "Cộng đồng nghề nghiệp",
    ],
    correct: 0,
    explain:
      "Theo nghĩa thứ nhất, dân tộc là quốc gia dân tộc, một cộng đồng chính trị – xã hội.",
    source: "Slide 2",
  },
  {
    id: "e15",
    level: "easy",
    question: "Xu hướng khách quan thứ hai của quan hệ dân tộc là gì?",
    answers: [
      "Các dân tộc sống tách biệt hoàn toàn",
      "Các dân tộc bỏ ngôn ngữ riêng",
      "Các dân tộc đóng cửa với nhau",
      "Các dân tộc muốn liên hiệp lại với nhau",
    ],
    correct: 3,
    explain: "Xu hướng thứ hai: các dân tộc muốn liên hiệp lại với nhau.",
    source: "Slide 4",
  },
  {
    id: "e16",
    level: "easy",
    question: "Nội dung thứ ba của Cương lĩnh dân tộc là gì?",
    answers: [
      "Các dân tộc hoàn toàn bình đẳng",
      "Liên hiệp công nhân tất cả các dân tộc",
      "Các dân tộc được quyền tự quyết",
      "Ưu tiên đầu tư cho miền núi",
    ],
    correct: 1,
    explain: "Nội dung thứ ba: liên hiệp công nhân tất cả các dân tộc.",
    source: "Slide 6",
  },
  {
    id: "e17",
    level: "easy",
    question: "Các dân tộc Việt Nam có truyền thống gì?",
    answers: [
      "Đoàn kết, gắn bó lâu đời",
      "Sống biệt lập với nhau",
      "Cạnh tranh lẫn nhau",
      "Mỗi dân tộc lập một quốc gia riêng",
    ],
    correct: 0,
    explain:
      "Các dân tộc có truyền thống đoàn kết, gắn bó lâu đời trong cộng đồng quốc gia thống nhất.",
    source: "Slide 9",
  },
  {
    id: "e18",
    level: "easy",
    question: "Việt Nam có bao nhiêu dân tộc thiểu số?",
    answers: ["51", "52", "53", "54"],
    correct: 2,
    keepOrder: true,
    explain:
      "Trong 54 dân tộc, người Kinh là dân tộc đa số; 53 dân tộc còn lại là dân tộc thiểu số.",
    source: "Kiến thức chung",
  },
  {
    id: "e19",
    level: "easy",
    question: "Theo Hiến pháp 2013, ngôn ngữ quốc gia của Việt Nam là gì?",
    answers: ["Tiếng Anh", "Tiếng Việt", "Tiếng Hán", "Mỗi vùng một ngôn ngữ"],
    correct: 1,
    explain:
      "Điều 5 Hiến pháp 2013: ngôn ngữ quốc gia là tiếng Việt; các dân tộc có quyền dùng tiếng nói, chữ viết của mình.",
    source: "Hiến pháp 2013, liên hệ Slide 2",
  },
  {
    id: "e20",
    level: "easy",
    question: "Theo bài, chính sách dân tộc gồm mấy lĩnh vực?",
    answers: ["2", "3", "4", "5"],
    correct: 3,
    keepOrder: true,
    explain:
      "Năm lĩnh vực: chính trị, kinh tế, văn hóa, xã hội và an ninh – quốc phòng.",
    source: "Slide 13–15",
  },
  {
    id: "e21",
    level: "easy",
    question:
      "“Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc” thuộc lĩnh vực nào?",
    answers: ["Chính trị", "Kinh tế", "Văn hóa", "An ninh – quốc phòng"],
    correct: 2,
    explain: "Đây là chính sách dân tộc về văn hóa.",
    source: "Slide 14",
  },
  {
    id: "e22",
    level: "easy",
    question: "Nhà rông là kiến trúc tiêu biểu của đồng bào các dân tộc vùng nào?",
    answers: [
      "Tây Nguyên",
      "Đồng bằng sông Hồng",
      "Đồng bằng sông Cửu Long",
      "Đông Nam Bộ",
    ],
    correct: 0,
    explain:
      "Nhà rông là nhà sinh hoạt cộng đồng của nhiều dân tộc Tây Nguyên, một nét bản sắc văn hóa riêng.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "e23",
    level: "easy",
    question: "Chôl Chnăm Thmây là Tết cổ truyền của dân tộc nào?",
    answers: ["Chăm", "Hoa", "Tày", "Khmer"],
    correct: 3,
    explain:
      "Chôl Chnăm Thmây là Tết cổ truyền của đồng bào Khmer, thường vào giữa tháng 4 dương lịch.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "e24",
    level: "easy",
    question: "Câu “Nước Việt Nam là một, dân tộc Việt Nam là một” là của ai?",
    answers: ["Phan Bội Châu", "Hồ Chí Minh", "Trần Hưng Đạo", "Nguyễn Trãi"],
    correct: 1,
    explain:
      "Chủ tịch Hồ Chí Minh viết câu này trong Thư gửi đồng bào Nam Bộ năm 1946.",
    source: "Kiến thức chung",
  },
  {
    id: "e25",
    level: "easy",
    question:
      "Câu “Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công” là của ai?",
    answers: ["Hồ Chí Minh", "Lê Duẩn", "Trường Chinh", "Phạm Văn Đồng"],
    correct: 0,
    explain:
      "Chủ tịch Hồ Chí Minh khẳng định sức mạnh của khối đại đoàn kết toàn dân tộc, trong đó có đoàn kết các dân tộc.",
    source: "Kiến thức chung, liên hệ Slide 9–10",
  },
  {
    id: "e26",
    level: "easy",
    question: "Đồng bào Ê Đê, Gia Rai, Ba Na sinh sống chủ yếu ở vùng nào?",
    answers: [
      "Tây Bắc",
      "Tây Nguyên",
      "Đồng bằng sông Cửu Long",
      "Đồng bằng sông Hồng",
    ],
    correct: 1,
    explain: "Ê Đê, Gia Rai, Ba Na là những dân tộc cư trú lâu đời ở Tây Nguyên.",
    source: "Kiến thức chung, liên hệ Slide 8",
  },
  {
    id: "e27",
    level: "easy",
    question: "Khèn là nhạc cụ gắn liền với lễ hội của dân tộc nào?",
    answers: ["Khmer", "Chăm", "Mông", "Hoa"],
    correct: 2,
    explain:
      "Khèn Mông gắn với lễ hội và đời sống tinh thần của người Mông, một nét bản sắc văn hóa riêng.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "e28",
    level: "easy",
    question: "Tháp Bà Po Nagar ở Nha Trang là công trình của dân tộc nào?",
    answers: ["Chăm", "Khmer", "Ê Đê", "Mường"],
    correct: 0,
    explain:
      "Các tháp Chăm như Po Nagar do người Chăm xây dựng, là di sản kiến trúc độc đáo của văn hóa Chăm.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "e29",
    level: "easy",
    question: "Đặc điểm nào nói về số dân của các dân tộc ở Việt Nam?",
    answers: [
      "Các dân tộc có số dân bằng nhau",
      "Dân tộc thiểu số đông hơn người Kinh",
      "Có sự chênh lệch về số dân giữa các tộc người",
      "Số dân các dân tộc không thay đổi",
    ],
    correct: 2,
    explain: "Đặc điểm thứ nhất: có sự chênh lệch về số dân giữa các tộc người.",
    source: "Slide 7",
  },
  {
    id: "e30",
    level: "easy",
    question: "Quốc gia dân tộc có đặc trưng gì về lãnh thổ?",
    answers: [
      "Không cần có lãnh thổ",
      "Có lãnh thổ chung ổn định",
      "Lãnh thổ thay đổi theo mùa",
      "Mỗi gia đình một lãnh thổ riêng",
    ],
    correct: 1,
    explain: "Một trong năm đặc trưng của quốc gia dân tộc: có lãnh thổ chung ổn định.",
    source: "Slide 2",
  },
  {
    id: "e31",
    level: "easy",
    question: "Theo bài, quốc gia dân tộc chịu sự quản lý của ai?",
    answers: [
      "Một tổ chức quốc tế",
      "Một dòng họ lớn",
      "Một tổ chức tôn giáo",
      "Một nhà nước dân tộc độc lập",
    ],
    correct: 3,
    explain:
      "Quốc gia dân tộc có sự quản lý của một nhà nước dân tộc độc lập.",
    source: "Slide 2",
  },
  {
    id: "e32",
    level: "easy",
    question: "Các thành viên cùng một tộc người có chung điều gì để giao tiếp?",
    answers: [
      "Cộng đồng về ngôn ngữ",
      "Cùng một nghề nghiệp",
      "Cùng một độ tuổi",
      "Cùng một trường học",
    ],
    correct: 0,
    explain:
      "Cộng đồng về ngôn ngữ là một trong ba đặc trưng của tộc người, cùng với văn hóa và ý thức tự giác tộc người.",
    source: "Slide 3",
  },
  {
    id: "e33",
    level: "easy",
    question:
      "Đảng chủ trương phát triển vùng dân tộc và miền núi theo hướng nào?",
    answers: [
      "Chỉ phát triển kinh tế",
      "Chỉ bảo tồn văn hóa",
      "Phát triển toàn diện",
      "Để sau các vùng khác",
    ],
    correct: 2,
    explain:
      "Phát triển toàn diện chính trị, kinh tế, văn hóa, xã hội, gắn với an ninh – quốc phòng ở vùng dân tộc và miền núi.",
    source: "Slide 11",
  },
  {
    id: "e34",
    level: "easy",
    question: "Mặt trận Tổ quốc Việt Nam là nơi thể hiện điều gì?",
    answers: [
      "Một doanh nghiệp nhà nước",
      "Khối đại đoàn kết toàn dân tộc",
      "Một đơn vị quân đội",
      "Một tổ chức quốc tế",
    ],
    correct: 1,
    explain:
      "Mặt trận Tổ quốc Việt Nam là nơi tập hợp, phát huy sức mạnh khối đại đoàn kết toàn dân tộc.",
    source: "Kiến thức chung, liên hệ Slide 10",
  },
  {
    id: "e35",
    level: "easy",
    question: "Đàn tính là nhạc cụ tiêu biểu của dân tộc nào?",
    answers: ["Khmer", "Chăm", "Ê Đê", "Tày"],
    correct: 3,
    explain:
      "Đàn tính gắn với hát Then của người Tày (và Nùng, Thái), một nét văn hóa đặc sắc vùng núi phía Bắc.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "e36",
    level: "easy",
    question: "Theo Hiến pháp 2013, Việt Nam là quốc gia như thế nào của các dân tộc?",
    answers: [
      "Quốc gia thống nhất của các dân tộc",
      "Liên bang của nhiều nước dân tộc",
      "Quốc gia của riêng một dân tộc",
      "Mỗi vùng một nhà nước riêng",
    ],
    correct: 0,
    explain:
      "Điều 5 Hiến pháp 2013: Việt Nam là quốc gia thống nhất của các dân tộc cùng sinh sống trên đất nước Việt Nam.",
    source: "Hiến pháp 2013, liên hệ Slide 9",
  },
  {
    id: "e37",
    level: "easy",
    question: "Bài thuyết trình của nhóm gồm mấy phần?",
    answers: ["2", "3", "4", "5"],
    correct: 1,
    keepOrder: true,
    explain:
      "Ba phần: khái niệm và đặc trưng của dân tộc; quan điểm Mác – Lênin về vấn đề dân tộc; dân tộc và quan hệ dân tộc ở Việt Nam.",
    source: "Slide mở đầu",
  },
  {
    id: "e38",
    level: "easy",
    question: "Nhà sàn, áo chàm, chợ phiên vùng cao thể hiện điều gì của các dân tộc?",
    answers: [
      "Trình độ phát triển cao",
      "Số dân đông",
      "Lãnh thổ riêng",
      "Bản sắc văn hóa riêng",
    ],
    correct: 3,
    explain:
      "Mỗi dân tộc có bản sắc văn hóa riêng, góp phần tạo nên sự phong phú, đa dạng của văn hóa Việt Nam.",
    source: "Slide 9",
  },

  /* ---------- RON95: câu vừa ---------- */
  {
    id: "m01",
    level: "medium",
    question: "Ở phương Tây, dân tộc xuất hiện khi nào?",
    answers: [
      "Khi chế độ chiếm hữu nô lệ ra đời",
      "Khi xuất hiện chữ viết",
      "Khi phương thức sản xuất tư bản chủ nghĩa thay thế phong kiến",
      "Khi chủ nghĩa xã hội giành thắng lợi",
    ],
    correct: 2,
    explain:
      "Ở phương Tây, dân tộc xuất hiện khi phương thức sản xuất tư bản chủ nghĩa thay thế phương thức sản xuất phong kiến.",
    source: "Slide 1",
  },
  {
    id: "m02",
    level: "medium",
    question: "Ba đặc trưng của dân tộc theo nghĩa tộc người là gì?",
    answers: [
      "Kinh tế, lãnh thổ, nhà nước",
      "Ngôn ngữ, văn hóa, ý thức tự giác tộc người",
      "Lãnh thổ, dân số, tôn giáo",
      "Nhà nước, pháp luật, quân đội",
    ],
    correct: 1,
    explain:
      "Tộc người có ba đặc trưng: cộng đồng về ngôn ngữ, cộng đồng về văn hóa và ý thức tự giác tộc người.",
    source: "Slide 3",
  },
  {
    id: "m03",
    level: "medium",
    question: "Xu hướng khách quan thứ nhất của quan hệ dân tộc là gì?",
    answers: [
      "Các dân tộc muốn liên hiệp lại với nhau",
      "Các dân tộc hòa vào một dân tộc lớn",
      "Các quốc gia sáp nhập lãnh thổ",
      "Cộng đồng dân cư muốn tách ra để hình thành cộng đồng dân tộc độc lập",
    ],
    correct: 3,
    explain:
      "Xu hướng thứ nhất là tách ra để hình thành cộng đồng dân tộc độc lập; xu hướng thứ hai là liên hiệp lại với nhau.",
    source: "Slide 4",
  },
  {
    id: "m04",
    level: "medium",
    question:
      "“Các dân tộc được quyền tự quyết” là nội dung thứ mấy của Cương lĩnh dân tộc?",
    answers: ["Thứ nhất", "Thứ hai", "Thứ ba", "Không thuộc Cương lĩnh"],
    correct: 1,
    keepOrder: true,
    explain:
      "Thứ tự: (1) hoàn toàn bình đẳng, (2) quyền tự quyết, (3) liên hiệp công nhân tất cả các dân tộc.",
    source: "Slide 6",
  },
  {
    id: "m05",
    level: "medium",
    question: "Các dân tộc thiểu số ở Việt Nam phân bố chủ yếu ở đâu?",
    answers: [
      "Địa bàn có vị trí chiến lược quan trọng",
      "Các thành phố lớn",
      "Vùng đồng bằng ven biển",
      "Các đảo xa bờ",
    ],
    correct: 0,
    explain:
      "Các dân tộc thiểu số phân bố chủ yếu ở địa bàn có vị trí chiến lược quan trọng.",
    source: "Slide 8",
  },
  {
    id: "m06",
    level: "medium",
    question: "Nhận định nào đúng về trình độ phát triển của các dân tộc ở Việt Nam?",
    answers: [
      "Hoàn toàn như nhau",
      "Đã đồng đều từ lâu",
      "Không đồng đều",
      "Chỉ khác nhau về ngôn ngữ",
    ],
    correct: 2,
    explain: "Các dân tộc ở Việt Nam có trình độ phát triển không đồng đều.",
    source: "Slide 8",
  },
  {
    id: "m07",
    level: "medium",
    question:
      "Theo quan điểm của Đảng, vấn đề dân tộc và đoàn kết dân tộc là vấn đề như thế nào?",
    answers: [
      "Chỉ là vấn đề trước mắt",
      "Vấn đề riêng của miền núi",
      "Vấn đề đã giải quyết xong",
      "Chiến lược cơ bản, lâu dài, đồng thời là vấn đề cấp bách",
    ],
    correct: 3,
    explain:
      "Vấn đề dân tộc và đoàn kết dân tộc là vấn đề chiến lược cơ bản, lâu dài, đồng thời là vấn đề cấp bách.",
    source: "Slide 10",
  },
  {
    id: "m08",
    level: "medium",
    question: "Quan hệ giữa các dân tộc ở Việt Nam được xây dựng trên cơ sở nào?",
    answers: [
      "Bình đẳng, đoàn kết, tương trợ, giúp nhau cùng phát triển",
      "Cạnh tranh để cùng phát triển",
      "Mỗi dân tộc tự lo phát triển riêng",
      "Hòa nhập thành một dân tộc chung",
    ],
    correct: 0,
    explain:
      "Tài liệu nhấn mạnh: bình đẳng, đoàn kết, tương trợ, giúp nhau cùng phát triển.",
    source: "Slide 10",
  },
  {
    id: "m09",
    level: "medium",
    question:
      "Phát triển toàn diện vùng dân tộc và miền núi gồm những lĩnh vực nào?",
    answers: [
      "Chỉ riêng kinh tế",
      "Kinh tế và văn hóa",
      "Giáo dục và y tế",
      "Chính trị, kinh tế, văn hóa, xã hội, an ninh – quốc phòng",
    ],
    correct: 3,
    explain:
      "Phát triển toàn diện: chính trị, kinh tế, văn hóa, xã hội, gắn với an ninh – quốc phòng ở vùng dân tộc và miền núi.",
    source: "Slide 11",
  },
  {
    id: "m10",
    level: "medium",
    question: "Công tác dân tộc và thực hiện chính sách dân tộc là nhiệm vụ của ai?",
    answers: [
      "Riêng cơ quan chuyên trách về dân tộc",
      "Toàn Đảng, toàn dân, các cấp, các ngành và toàn bộ hệ thống chính trị",
      "Riêng đồng bào dân tộc thiểu số",
      "Riêng chính quyền các tỉnh miền núi",
    ],
    correct: 1,
    explain:
      "Đây là nhiệm vụ của toàn Đảng, toàn dân, các cấp, các ngành và toàn bộ hệ thống chính trị.",
    source: "Slide 12",
  },
  {
    id: "m11",
    level: "medium",
    question:
      "“Bảo đảm an sinh xã hội vùng đồng bào dân tộc thiểu số” thuộc chính sách dân tộc về lĩnh vực nào?",
    answers: ["Chính trị", "Kinh tế", "Xã hội", "An ninh – quốc phòng"],
    correct: 2,
    explain:
      "Về xã hội: thực hiện chính sách xã hội, bảo đảm an sinh xã hội vùng đồng bào dân tộc thiểu số.",
    source: "Slide 14",
  },
  {
    id: "m12",
    level: "medium",
    question: "Ngày hội Đại đoàn kết toàn dân tộc là ngày nào?",
    answers: ["18/11", "19/4", "2/9", "22/12"],
    correct: 0,
    explain:
      "18/11 là ngày truyền thống của Mặt trận Tổ quốc Việt Nam, được lấy làm Ngày hội Đại đoàn kết toàn dân tộc.",
    source: "Kiến thức chung",
  },
  {
    id: "m13",
    level: "medium",
    question:
      "Ở phương Đông, khi dân tộc hình thành, cộng đồng kinh tế nhìn chung ra sao?",
    answers: [
      "Đã thống nhất và phát triển cao",
      "Còn kém phát triển và phân tán",
      "Hoàn toàn chưa xuất hiện",
      "Phát triển hơn phương Tây",
    ],
    correct: 1,
    explain:
      "Cộng đồng kinh tế đạt mức độ nhất định nhưng nhìn chung còn kém phát triển và phân tán.",
    source: "Slide 1",
  },
  {
    id: "m14",
    level: "medium",
    question: "Đặc trưng nào sau đây thuộc dân tộc theo nghĩa quốc gia dân tộc?",
    answers: [
      "Ý thức tự giác tộc người",
      "Cùng theo một tôn giáo",
      "Cùng chung một dòng họ",
      "Có sự quản lý của một nhà nước dân tộc độc lập",
    ],
    correct: 3,
    explain:
      "Quốc gia dân tộc có sự quản lý của một nhà nước dân tộc độc lập; ý thức tự giác tộc người là đặc trưng của tộc người.",
    source: "Slide 2–3",
  },
  {
    id: "m15",
    level: "medium",
    question:
      "Việc các thành viên tự nhận mình thuộc về một tộc người thể hiện đặc trưng nào?",
    answers: [
      "Ý thức tự giác tộc người",
      "Cộng đồng về kinh tế",
      "Lãnh thổ chung ổn định",
      "Nhà nước dân tộc độc lập",
    ],
    correct: 0,
    explain:
      "Ý thức tự giác tộc người là một trong ba đặc trưng của dân tộc theo nghĩa tộc người.",
    source: "Slide 3",
  },
  {
    id: "m16",
    level: "medium",
    question: "Khi dùng từ “dân tộc”, bài thuyết trình lưu ý cần làm rõ điều gì?",
    answers: [
      "Dân tộc đó đông hay ít người",
      "Dân tộc đó ở miền núi hay đồng bằng",
      "Đang dùng theo nghĩa quốc gia dân tộc hay nghĩa tộc người",
      "Dân tộc đó đã có chữ viết hay chưa",
    ],
    correct: 2,
    explain:
      "Từ “dân tộc” có hai nghĩa, nên cần làm rõ đang nói theo nghĩa quốc gia dân tộc hay theo nghĩa tộc người.",
    source: "Slide 3",
  },
  {
    id: "m17",
    level: "medium",
    question:
      "Ai đã phát hiện hai xu hướng khách quan trong sự phát triển quan hệ dân tộc?",
    answers: ["C. Mác", "V.I. Lênin", "Ph. Ăngghen", "Hồ Chí Minh"],
    correct: 1,
    explain:
      "Nghiên cứu vấn đề dân tộc, V.I. Lênin phát hiện ra hai xu hướng khách quan: tách ra và liên hiệp lại.",
    source: "Giáo trình, liên hệ Slide 4",
  },
  {
    id: "m18",
    level: "medium",
    question: "Nội dung nào thuộc Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin?",
    answers: [
      "Các dân tộc được quyền tự quyết",
      "Ưu tiên đầu tư vùng dân tộc và miền núi",
      "Xây dựng nền văn hóa tiên tiến",
      "Bảo đảm an sinh xã hội",
    ],
    correct: 0,
    explain:
      "Quyền tự quyết là nội dung thứ hai của Cương lĩnh; các ý còn lại là quan điểm, chính sách của Đảng ta.",
    source: "Slide 6, 11, 14",
  },
  {
    id: "m19",
    level: "medium",
    question: "Bản sắc văn hóa riêng của mỗi dân tộc góp phần tạo nên điều gì?",
    answers: [
      "Sự tách biệt giữa các vùng",
      "Một nền văn hóa đồng nhất",
      "Sự phong phú, đa dạng của văn hóa Việt Nam thống nhất",
      "Sự chênh lệch giữa các dân tộc",
    ],
    correct: 2,
    explain:
      "Các bản sắc riêng góp phần tạo nên sự phong phú, đa dạng của văn hóa Việt Nam thống nhất.",
    source: "Slide 9",
  },
  {
    id: "m20",
    level: "medium",
    question: "Phát triển toàn diện vùng dân tộc và miền núi phải gắn với điều gì?",
    answers: [
      "Du lịch quốc tế",
      "Khai thác khoáng sản",
      "Di dân xuống đồng bằng",
      "An ninh và quốc phòng",
    ],
    correct: 3,
    explain:
      "Phát triển chính trị, kinh tế, văn hóa, xã hội gắn với an ninh và quốc phòng ở vùng dân tộc và miền núi.",
    source: "Slide 11",
  },
  {
    id: "m21",
    level: "medium",
    question: "Chính sách dân tộc về kinh tế tập trung vào điều gì?",
    answers: [
      "Phát triển kinh tế – xã hội miền núi, vùng đồng bào dân tộc thiểu số",
      "Chỉ phát triển các đô thị lớn",
      "Thu hút vốn nước ngoài vào đồng bằng",
      "Giảm đầu tư cho vùng sâu, vùng xa",
    ],
    correct: 0,
    explain:
      "Về kinh tế: chủ trương, chính sách phát triển kinh tế – xã hội miền núi, vùng đồng bào các dân tộc thiểu số.",
    source: "Slide 13",
  },
  {
    id: "m22",
    level: "medium",
    question: "Theo Hiến pháp 2013, hành vi nào đối với các dân tộc bị nghiêm cấm?",
    answers: [
      "Học tiếng của dân tộc khác",
      "Kỳ thị, chia rẽ dân tộc",
      "Giữ gìn phong tục tập quán",
      "Dùng chữ viết của dân tộc mình",
    ],
    correct: 1,
    explain:
      "Điều 5 Hiến pháp 2013: các dân tộc bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển; nghiêm cấm kỳ thị, chia rẽ dân tộc.",
    source: "Hiến pháp 2013",
  },
  {
    id: "m23",
    level: "medium",
    question: "Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin do ai khái quát?",
    answers: ["C. Mác", "Ph. Ăngghen", "V.I. Lênin", "Hồ Chí Minh"],
    correct: 2,
    explain:
      "Dựa trên quan điểm của Mác, Ăngghen và hai xu hướng khách quan, V.I. Lênin khái quát Cương lĩnh dân tộc.",
    source: "Giáo trình, liên hệ Slide 5–6",
  },
  {
    id: "m24",
    level: "medium",
    question: "Theo Cương lĩnh, các dân tộc hoàn toàn bình đẳng, không phân biệt điều gì?",
    answers: [
      "Dân tộc lớn hay nhỏ, trình độ phát triển cao hay thấp",
      "Chỉ bình đẳng giữa các dân tộc lớn",
      "Chỉ bình đẳng về kinh tế",
      "Chỉ bình đẳng khi cùng tôn giáo",
    ],
    correct: 0,
    explain:
      "Các dân tộc đều có quyền lợi và nghĩa vụ ngang nhau, không phân biệt lớn hay nhỏ, trình độ phát triển cao hay thấp.",
    source: "Giáo trình, liên hệ Slide 5",
  },
  {
    id: "m25",
    level: "medium",
    question: "Cộng đồng về văn hóa của một tộc người bao gồm những gì?",
    answers: [
      "Chỉ trang phục truyền thống",
      "Văn hóa vật thể và văn hóa phi vật thể",
      "Chỉ các lễ hội",
      "Chỉ ngôn ngữ viết",
    ],
    correct: 1,
    explain:
      "Văn hóa của tộc người gồm cả văn hóa vật thể (nhà ở, trang phục...) và phi vật thể (phong tục, lễ hội, tín ngưỡng...).",
    source: "Giáo trình, liên hệ Slide 3",
  },
  {
    id: "m26",
    level: "medium",
    question:
      "Theo Tổng điều tra 2019, các dân tộc thiểu số chiếm khoảng bao nhiêu phần trăm dân số?",
    answers: ["14,7%", "25%", "35%", "45%"],
    correct: 0,
    keepOrder: true,
    explain:
      "Người Kinh chiếm khoảng 85,3%, 53 dân tộc thiểu số chiếm khoảng 14,7% dân số cả nước.",
    source: "Tổng điều tra 2019, liên hệ Slide 7",
  },
  {
    id: "m27",
    level: "medium",
    question:
      "Đồng bào dân tộc thiểu số cư trú trên khoảng bao nhiêu diện tích lãnh thổ nước ta?",
    answers: ["1/4", "1/2", "3/4", "Toàn bộ"],
    correct: 2,
    keepOrder: true,
    explain:
      "Đồng bào dân tộc thiểu số cư trú trên khoảng 3/4 diện tích, ở nhiều vị trí trọng yếu về an ninh, quốc phòng.",
    source: "Giáo trình, liên hệ Slide 8",
  },
  {
    id: "m28",
    level: "medium",
    question: "Lễ hội Lồng Tồng (xuống đồng) là lễ hội của các dân tộc nào?",
    answers: ["Chăm, Khmer", "Ê Đê, Ba Na", "Tày, Nùng", "Hoa, Sán Dìu"],
    correct: 2,
    explain:
      "Lồng Tồng là lễ hội xuống đồng đầu năm của người Tày, Nùng, cầu mùa màng tốt tươi.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "m29",
    level: "medium",
    question: "Dân tộc Mường gần gũi nhất về nguồn gốc và ngôn ngữ với dân tộc nào?",
    answers: ["Khmer", "Kinh", "Chăm", "Hoa"],
    correct: 1,
    explain:
      "Người Mường và người Kinh cùng nhóm ngôn ngữ Việt – Mường, có chung nguồn gốc lâu đời.",
    source: "Kiến thức chung",
  },
  {
    id: "m30",
    level: "medium",
    question: "Chính sách dân tộc về kinh tế nhằm từng bước khắc phục điều gì?",
    answers: [
      "Sự khác nhau về ngôn ngữ",
      "Sự đa dạng văn hóa",
      "Số lượng các dân tộc",
      "Khoảng cách chênh lệch giữa các vùng, giữa các dân tộc",
    ],
    correct: 3,
    explain:
      "Chính sách kinh tế nhằm phát huy tiềm năng, từng bước khắc phục khoảng cách chênh lệch giữa các vùng, giữa các dân tộc.",
    source: "Giáo trình, liên hệ Slide 13",
  },
  {
    id: "m31",
    level: "medium",
    question:
      "Theo Hiến pháp 2013, các dân tộc có quyền gì đối với tiếng nói, chữ viết của mình?",
    answers: [
      "Có quyền dùng tiếng nói, chữ viết của mình",
      "Chỉ được dùng tiếng Việt",
      "Chỉ được dùng trong gia đình",
      "Phải xin phép mới được dùng",
    ],
    correct: 0,
    explain:
      "Các dân tộc có quyền dùng tiếng nói, chữ viết, giữ gìn bản sắc dân tộc, phát huy phong tục, tập quán, văn hóa tốt đẹp.",
    source: "Hiến pháp 2013",
  },
  {
    id: "m32",
    level: "medium",
    question: "Xu hướng “tách ra” trong quan hệ dân tộc biểu hiện qua điều gì?",
    answers: [
      "Các nước lập liên minh kinh tế",
      "Phong trào đấu tranh chống áp bức, giành độc lập dân tộc",
      "Các dân tộc hòa nhập văn hóa",
      "Mở rộng giao lưu quốc tế",
    ],
    correct: 1,
    explain:
      "Xu hướng thứ nhất biểu hiện thành phong trào đấu tranh chống áp bức dân tộc, thành lập quốc gia dân tộc độc lập.",
    source: "Giáo trình, liên hệ Slide 4",
  },
  {
    id: "m33",
    level: "medium",
    question: "Xu hướng “liên hiệp” trong quan hệ dân tộc biểu hiện qua điều gì?",
    answers: [
      "Các dân tộc đóng cửa với nhau",
      "Các dân tộc tách thành nhiều nước nhỏ",
      "Xóa bỏ hàng rào ngăn cách, các dân tộc xích lại gần nhau",
      "Mỗi dân tộc tự cung tự cấp",
    ],
    correct: 2,
    explain:
      "Giao lưu kinh tế, văn hóa phát triển làm các dân tộc muốn xóa bỏ hàng rào ngăn cách, xích lại gần nhau.",
    source: "Giáo trình, liên hệ Slide 4",
  },
  {
    id: "m34",
    level: "medium",
    question: "Chương trình 135 của Chính phủ hướng tới đối tượng nào?",
    answers: [
      "Các đô thị loại I",
      "Các khu công nghiệp ven biển",
      "Các trường đại học",
      "Các xã đặc biệt khó khăn vùng đồng bào dân tộc và miền núi",
    ],
    correct: 3,
    explain:
      "Từ năm 1998, Chương trình 135 hỗ trợ các xã đặc biệt khó khăn vùng đồng bào dân tộc và miền núi.",
    source: "Kiến thức chung, liên hệ Slide 11, 13",
  },
  {
    id: "m35",
    level: "medium",
    question:
      "Vì sao địa bàn cư trú của đồng bào dân tộc thiểu số có vị trí chiến lược quan trọng?",
    answers: [
      "Gồm nhiều vùng biên giới, trọng yếu về kinh tế, an ninh, quốc phòng",
      "Vì đó đều là các thành phố lớn",
      "Vì nằm ở trung tâm các đồng bằng",
      "Vì có ít tài nguyên thiên nhiên",
    ],
    correct: 0,
    explain:
      "Đồng bào dân tộc thiểu số sống ở nhiều vùng biên giới, trọng yếu về kinh tế, an ninh, quốc phòng.",
    source: "Giáo trình, liên hệ Slide 8",
  },
  {
    id: "m36",
    level: "medium",
    question: "Văn hóa Việt Nam được mô tả như thế nào trong quan hệ giữa các dân tộc?",
    answers: [
      "Đồng nhất theo một khuôn mẫu",
      "Thống nhất trong đa dạng",
      "Mỗi vùng tách biệt hoàn toàn",
      "Chỉ gồm văn hóa của người Kinh",
    ],
    correct: 1,
    explain:
      "Mỗi dân tộc có bản sắc riêng, cùng tạo nên nền văn hóa Việt Nam thống nhất trong đa dạng.",
    source: "Giáo trình, liên hệ Slide 9",
  },

  /* ---------- ???: câu khó ---------- */
  {
    id: "h01",
    level: "hard",
    question: "Đặc trưng nào KHÔNG thuộc dân tộc theo nghĩa quốc gia dân tộc?",
    answers: [
      "Có chung phương thức sinh hoạt kinh tế",
      "Có lãnh thổ chung ổn định",
      "Có sự quản lý của một nhà nước dân tộc độc lập",
      "Ý thức tự giác tộc người",
    ],
    correct: 3,
    explain:
      "Ý thức tự giác tộc người là đặc trưng của tộc người (nghĩa thứ hai), không nằm trong năm đặc trưng của quốc gia dân tộc.",
    source: "Slide 2–3",
  },
  {
    id: "h02",
    level: "hard",
    question:
      "Ở phương Đông, khi dân tộc hình thành, yếu tố nào đã phát triển tương đối chín muồi?",
    answers: [
      "Văn hóa và tâm lý dân tộc",
      "Cộng đồng kinh tế thống nhất",
      "Phương thức sản xuất tư bản chủ nghĩa",
      "Thị trường chung của cả dân tộc",
    ],
    correct: 0,
    explain:
      "Văn hóa và tâm lý dân tộc đã tương đối chín muồi, còn cộng đồng kinh tế nhìn chung kém phát triển và phân tán.",
    source: "Slide 1",
  },
  {
    id: "h03",
    level: "hard",
    question: "Theo tài liệu, cộng đồng về ngôn ngữ của một tộc người có thể là gì?",
    answers: [
      "Bắt buộc phải có chữ viết riêng",
      "Chỉ riêng ngôn ngữ viết",
      "Cả ngôn ngữ nói và viết, hoặc chỉ riêng ngôn ngữ nói",
      "Ngôn ngữ chung của quốc gia",
    ],
    correct: 2,
    explain:
      "Cộng đồng ngôn ngữ của tộc người có thể gồm cả ngôn ngữ nói và viết, hoặc chỉ riêng ngôn ngữ nói.",
    source: "Slide 3",
  },
  {
    id: "h04",
    level: "hard",
    question:
      "Nội dung nào KHÔNG thuộc Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin?",
    answers: [
      "Các dân tộc hoàn toàn bình đẳng",
      "Ưu tiên đầu tư vùng dân tộc và miền núi",
      "Các dân tộc được quyền tự quyết",
      "Liên hiệp công nhân tất cả các dân tộc",
    ],
    correct: 1,
    explain:
      "Ưu tiên đầu tư vùng dân tộc và miền núi là quan điểm của Đảng ta (Slide 11), không phải nội dung của Cương lĩnh.",
    source: "Slide 5–6, 11",
  },
  {
    id: "h05",
    level: "hard",
    question: "Câu nào KHÔNG phải là đặc điểm của dân tộc ở Việt Nam?",
    answers: [
      "Có sự chênh lệch về số dân giữa các tộc người",
      "Các dân tộc cư trú xen kẽ nhau",
      "Mỗi dân tộc sống trên một lãnh thổ riêng biệt",
      "Trình độ phát triển không đồng đều",
    ],
    correct: 2,
    explain:
      "Các dân tộc ở Việt Nam cư trú xen kẽ nhau, không tách thành những lãnh thổ riêng biệt.",
    source: "Slide 7–9",
  },
  {
    id: "h06",
    level: "hard",
    question:
      "“Tăng cường sức mạnh bảo vệ Tổ quốc, bảo đảm ổn định chính trị” thuộc chính sách dân tộc về lĩnh vực nào?",
    answers: ["Chính trị", "An ninh – quốc phòng", "Xã hội", "Văn hóa"],
    correct: 1,
    explain:
      "Về an ninh – quốc phòng: tăng cường sức mạnh bảo vệ Tổ quốc, bảo đảm ổn định chính trị, an ninh chính trị và trật tự an toàn xã hội.",
    source: "Slide 15",
  },
  {
    id: "h07",
    level: "hard",
    question:
      "“Thực hiện bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển giữa các dân tộc” thuộc lĩnh vực nào?",
    answers: ["Chính trị", "Kinh tế", "Văn hóa", "Xã hội"],
    correct: 0,
    explain:
      "Đây là chính sách dân tộc về chính trị.",
    source: "Slide 13",
  },
  {
    id: "h08",
    level: "hard",
    question: "Ngày Văn hóa các dân tộc Việt Nam là ngày nào?",
    answers: ["18/11", "2/9", "3/2", "19/4"],
    correct: 3,
    explain:
      "Từ năm 2008, ngày 19/4 hằng năm là Ngày Văn hóa các dân tộc Việt Nam.",
    source: "Kiến thức chung",
  },
  {
    id: "h09",
    level: "hard",
    question:
      "Ngoài là vấn đề chiến lược cơ bản, lâu dài, vấn đề dân tộc còn là vấn đề gì của cách mạng Việt Nam?",
    answers: ["Thứ yếu", "Tạm thời", "Cấp bách", "Riêng của từng địa phương"],
    correct: 2,
    explain:
      "Vấn đề dân tộc và đoàn kết dân tộc đồng thời là vấn đề cấp bách của cách mạng Việt Nam.",
    source: "Slide 10",
  },
  {
    id: "h10",
    level: "hard",
    question: "Đặc điểm “trình độ phát triển không đồng đều” nói về điều gì?",
    answers: [
      "Mức phát triển kinh tế – xã hội khác nhau giữa các dân tộc",
      "Số dân khác nhau giữa các dân tộc",
      "Nơi cư trú khác nhau giữa các dân tộc",
      "Ngôn ngữ khác nhau giữa các dân tộc",
    ],
    correct: 0,
    explain:
      "Các dân tộc ở Việt Nam có trình độ phát triển kinh tế – xã hội không đồng đều; số dân và cư trú là những đặc điểm khác.",
    source: "Slide 7–8",
  },
  {
    id: "h11",
    level: "hard",
    question:
      "Bác Hồ viết “…đều là con cháu Việt Nam, đều là anh em ruột thịt” trong thư gửi ai?",
    answers: [
      "Đồng bào Nam Bộ",
      "Thanh niên, nhi đồng",
      "Quân đội nhân dân",
      "Đại hội các dân tộc thiểu số miền Nam",
    ],
    correct: 3,
    explain:
      "Thư gửi Đại hội các dân tộc thiểu số miền Nam ở Plây Cu ngày 19/4/1946; vì thế 19/4 là Ngày Văn hóa các dân tộc Việt Nam.",
    source: "Kiến thức chung",
  },
  {
    id: "h12",
    level: "hard",
    question: "Dân tộc thiểu số nào đông dân nhất Việt Nam (Tổng điều tra 2019)?",
    answers: ["Thái", "Tày", "Mường", "Khmer"],
    correct: 1,
    explain:
      "Người Tày đông nhất trong các dân tộc thiểu số, khoảng 1,85 triệu người; người Thái đứng thứ hai.",
    source: "Tổng điều tra dân số 2019",
  },
  {
    id: "h13",
    level: "hard",
    question: "Dân tộc nào có số dân ít nhất Việt Nam (Tổng điều tra 2019)?",
    answers: ["Ơ Đu", "Brâu", "Rơ Măm", "Pu Péo"],
    correct: 0,
    explain:
      "Người Ơ Đu chỉ có khoảng 430 người, minh họa rõ sự chênh lệch về số dân giữa các tộc người.",
    source: "Tổng điều tra 2019, liên hệ Slide 7",
  },
  {
    id: "h14",
    level: "hard",
    question:
      "Không gian văn hóa Cồng chiêng Tây Nguyên được UNESCO công nhận năm nào?",
    answers: ["1999", "2003", "2005", "2010"],
    correct: 2,
    keepOrder: true,
    explain:
      "Năm 2005, UNESCO công nhận Cồng chiêng Tây Nguyên là Kiệt tác truyền khẩu và phi vật thể của nhân loại.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "h15",
    level: "hard",
    question:
      "Điều nào của Hiến pháp 2013 khẳng định Việt Nam là quốc gia thống nhất của các dân tộc?",
    answers: ["Điều 1", "Điều 2", "Điều 3", "Điều 5"],
    correct: 3,
    keepOrder: true,
    explain:
      "Điều 5: Việt Nam là quốc gia thống nhất của các dân tộc cùng sinh sống trên đất nước Việt Nam.",
    source: "Hiến pháp 2013",
  },
  {
    id: "h16",
    level: "hard",
    question:
      "“Thực hành Then”, được UNESCO ghi danh năm 2019, là di sản của các dân tộc nào?",
    answers: [
      "Kinh, Mường, Thổ",
      "Tày, Nùng, Thái",
      "Ê Đê, Gia Rai, Ba Na",
      "Chăm, Khmer, Hoa",
    ],
    correct: 1,
    explain:
      "Năm 2019, UNESCO ghi danh Thực hành Then của người Tày, Nùng, Thái là di sản văn hóa phi vật thể của nhân loại.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "h17",
    level: "hard",
    question:
      "Theo giáo trình, đặc trưng nào là tiêu chí quan trọng nhất để phân định một tộc người?",
    answers: [
      "Cộng đồng về ngôn ngữ",
      "Cộng đồng về văn hóa",
      "Có lãnh thổ riêng",
      "Ý thức tự giác tộc người",
    ],
    correct: 3,
    explain:
      "Ý thức tự giác tộc người là tiêu chí quan trọng nhất để phân định một tộc người, quyết định sự tồn tại của tộc người đó.",
    source: "Giáo trình, liên hệ Slide 3",
  },
  {
    id: "h18",
    level: "hard",
    question:
      "Theo giáo trình, đặc trưng quan trọng nhất của dân tộc theo nghĩa quốc gia dân tộc là gì?",
    answers: [
      "Có chung phương thức sinh hoạt kinh tế",
      "Có ngôn ngữ chung của quốc gia",
      "Có lãnh thổ chung ổn định",
      "Có nét tâm lý, văn hóa chung",
    ],
    correct: 0,
    explain:
      "Chung phương thức sinh hoạt kinh tế là đặc trưng quan trọng nhất, là cơ sở gắn kết các thành viên của dân tộc.",
    source: "Giáo trình, liên hệ Slide 2",
  },
  {
    id: "h19",
    level: "hard",
    question: "Xu hướng thứ nhất (tách ra) nổi lên mạnh trong giai đoạn nào?",
    answers: [
      "Thời kỳ công xã nguyên thủy",
      "Giai đoạn đầu của chủ nghĩa tư bản",
      "Thời kỳ phong kiến tập quyền",
      "Sau khi chủ nghĩa xã hội thắng lợi",
    ],
    correct: 1,
    explain:
      "Xu hướng tách ra nổi lên trong giai đoạn đầu của chủ nghĩa tư bản, khi các dân tộc thức tỉnh ý thức độc lập.",
    source: "Giáo trình, liên hệ Slide 4",
  },
  {
    id: "h20",
    level: "hard",
    question: "Xu hướng thứ hai (liên hiệp) nổi lên khi nào?",
    answers: [
      "Trong xã hội chiếm hữu nô lệ",
      "Trong thời kỳ phong kiến",
      "Khi chủ nghĩa tư bản phát triển thành chủ nghĩa đế quốc",
      "Khi dân tộc vừa mới hình thành",
    ],
    correct: 2,
    explain:
      "Xu hướng liên hiệp nổi lên khi chủ nghĩa tư bản phát triển thành chủ nghĩa đế quốc, giao lưu giữa các dân tộc mở rộng.",
    source: "Giáo trình, liên hệ Slide 4",
  },
  {
    id: "h21",
    level: "hard",
    question: "Liên hiệp công nhân các dân tộc phản ánh sự thống nhất giữa những gì?",
    answers: [
      "Kinh tế và văn hóa",
      "Nhà nước và tôn giáo",
      "Thành thị và nông thôn",
      "Giải phóng dân tộc và giải phóng giai cấp",
    ],
    correct: 3,
    explain:
      "Liên hiệp công nhân tất cả các dân tộc phản ánh sự thống nhất giữa giải phóng dân tộc và giải phóng giai cấp.",
    source: "Giáo trình, liên hệ Slide 6",
  },
  {
    id: "h22",
    level: "hard",
    question: "Quyền tự quyết dân tộc bao gồm những quyền nào?",
    answers: [
      "Quyền tách ra lập quốc gia độc lập và quyền tự nguyện liên hiệp",
      "Chỉ quyền tách ra lập quốc gia mới",
      "Chỉ quyền liên hiệp với dân tộc lớn hơn",
      "Quyền can thiệp vào công việc của dân tộc khác",
    ],
    correct: 0,
    explain:
      "Gồm quyền tách ra thành lập quốc gia độc lập và quyền tự nguyện liên hiệp với dân tộc khác, trên cơ sở bình đẳng.",
    source: "Giáo trình, liên hệ Slide 6",
  },
  {
    id: "h23",
    level: "hard",
    question:
      "Nghị quyết 24-NQ/TW năm 2003 (Hội nghị Trung ương 7 khóa IX) bàn về vấn đề gì?",
    answers: [
      "Công tác tôn giáo",
      "Công tác dân tộc",
      "Phát triển giáo dục",
      "Hội nhập kinh tế quốc tế",
    ],
    correct: 1,
    explain:
      "Nghị quyết 24 bàn về công tác dân tộc; Nghị quyết 25 của cùng hội nghị bàn về công tác tôn giáo.",
    source: "Kiến thức chung, liên hệ Slide 10–12",
  },
  {
    id: "h24",
    level: "hard",
    question:
      "Theo Tổng điều tra 2019, ngoài người Kinh có bao nhiêu dân tộc có trên 1 triệu người?",
    answers: ["6", "7", "8", "9"],
    correct: 0,
    keepOrder: true,
    explain: "Sáu dân tộc: Tày, Thái, Mường, Mông, Khmer và Nùng.",
    source: "Tổng điều tra 2019, liên hệ Slide 7",
  },
  {
    id: "h25",
    level: "hard",
    question:
      "Nghệ thuật Xòe Thái được UNESCO ghi danh là di sản văn hóa phi vật thể năm nào?",
    answers: ["2015", "2018", "2021", "2023"],
    correct: 2,
    keepOrder: true,
    explain:
      "Năm 2021, Nghệ thuật Xòe Thái được ghi danh là di sản văn hóa phi vật thể đại diện của nhân loại.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "h26",
    level: "hard",
    question:
      "Năm 2022, nghệ thuật làm gốm của người Chăm được UNESCO ghi danh vào danh sách nào?",
    answers: [
      "Di sản thiên nhiên thế giới",
      "Di sản tư liệu thế giới",
      "Di sản văn hóa phi vật thể cần bảo vệ khẩn cấp",
      "Kỳ quan thiên nhiên mới",
    ],
    correct: 2,
    explain:
      "Gốm Chăm được ghi danh vào Danh sách di sản văn hóa phi vật thể cần bảo vệ khẩn cấp, cần chung tay gìn giữ.",
    source: "Kiến thức chung, liên hệ Slide 9",
  },
  {
    id: "h27",
    level: "hard",
    question:
      "Chương trình mục tiêu quốc gia phát triển vùng đồng bào dân tộc thiểu số và miền núi thực hiện giai đoạn nào?",
    answers: ["2011–2015", "2016–2020", "2021–2030", "2031–2040"],
    correct: 2,
    keepOrder: true,
    explain:
      "Chương trình triển khai cho giai đoạn 2021–2030, giai đoạn I từ năm 2021 đến năm 2025.",
    source: "Kiến thức chung, liên hệ Slide 11",
  },
  {
    id: "h28",
    level: "hard",
    question:
      "Theo Hiến pháp 2013, Nhà nước tạo điều kiện để các dân tộc thiểu số làm gì?",
    answers: [
      "Tách ra phát triển riêng",
      "Phát huy nội lực, cùng phát triển với đất nước",
      "Chuyển về đồng bằng sinh sống",
      "Bỏ phong tục truyền thống",
    ],
    correct: 1,
    explain:
      "Điều 5: Nhà nước tạo điều kiện để các dân tộc thiểu số phát huy nội lực, cùng phát triển với đất nước.",
    source: "Hiến pháp 2013, liên hệ Slide 11",
  },
  {
    id: "h29",
    level: "hard",
    question: "Nhận định nào đúng về các dân tộc ở Việt Nam hiện nay?",
    answers: [
      "Mỗi dân tộc có một vùng lãnh thổ riêng",
      "Mỗi dân tộc có một nền kinh tế riêng",
      "Các dân tộc sống tách biệt theo từng vùng",
      "Không dân tộc nào có lãnh thổ riêng, nền kinh tế riêng",
    ],
    correct: 3,
    explain:
      "Do cư trú xen kẽ, không dân tộc nào có lãnh thổ riêng, nền kinh tế riêng; thuận lợi cho giao lưu, đoàn kết.",
    source: "Giáo trình, liên hệ Slide 7",
  },
];
