/**
 * Ngân hàng câu hỏi của "Đường đua đại đoàn kết" — một pool chung 108 câu
 * (id `Q001`…`Q108`). Mỗi lượt, đội hiện tại nhận một câu chưa từng xuất
 * hiện trong ván TRƯỚC khi đổ xúc xắc; câu hỏi không gắn với ô nào.
 *
 * Nội dung chỉ lấy từ bài "Dân tộc trong thời kỳ quá độ lên chủ nghĩa xã
 * hội". Bốn đáp án mỗi câu có độ dài và cấu trúc tương đương (chênh tối đa
 * 3 từ), đáp án đúng rải đều A/B/C/D. Sửa xong chạy `npm test`:
 * `validateQuestionBank()` sẽ kiểm tra lại toàn bộ các quy tắc này.
 */

export type QuestionDifficulty = "easy" | "medium" | "hard";
export type OptionId = "A" | "B" | "C" | "D";

export type QuestionOption = {
  id: OptionId;
  text: string;
};

export type GameQuestion = {
  id: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: QuestionOption[];
  correctAnswer: OptionId;
};

const OPTION_IDS: OptionId[] = ["A", "B", "C", "D"];

/** Dựng bốn đáp án theo đúng thứ tự A, B, C, D. */
function options(texts: string[]): QuestionOption[] {
  return texts.map((text, i) => ({ id: OPTION_IDS[i], text }));
}

export const QUESTION_POOL: GameQuestion[] = [
  {
    id: "Q001",
    difficulty: "medium",
    question: "Phát triển toàn diện vùng dân tộc và miền núi gồm những lĩnh vực nào?",
    options: options([
      "Chính trị, kinh tế, văn hóa, xã hội, du lịch quốc tế",
      "Chính trị, kinh tế, văn hóa, xã hội, an ninh – quốc phòng",
      "Kinh tế, văn hóa, xã hội, giáo dục, khai thác khoáng sản",
      "Chính trị, kinh tế, tôn giáo, xã hội, đô thị hóa",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q002",
    difficulty: "medium",
    question: "\"Tăng cường sức mạnh bảo vệ Tổ quốc\" thuộc chính sách dân tộc về lĩnh vực nào?",
    options: options([
      "Chính trị và trật tự xã hội",
      "Văn hóa – xã hội",
      "An ninh – quốc phòng",
      "Kinh tế – xã hội",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q003",
    difficulty: "medium",
    question: "Cụm \"các dân tộc được quyền tự quyết\" thuộc nội dung nào?",
    options: options([
      "Đặc điểm dân tộc ở Việt Nam hiện nay",
      "Chính sách dân tộc về lĩnh vực văn hóa",
      "Đặc trưng của dân tộc theo nghĩa tộc người",
      "Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q004",
    difficulty: "easy",
    question: "Theo quan điểm của Đảng, các dân tộc giúp nhau để làm gì?",
    options: options([
      "Cùng phát triển",
      "Cùng đồng hóa",
      "Cùng tách ra",
      "Cùng cạnh tranh",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q005",
    difficulty: "medium",
    question: "Khi dân tộc hình thành ở phương Đông, yếu tố nào còn phát triển chậm hơn?",
    options: options([
      "Cộng đồng kinh tế",
      "Tâm lý dân tộc",
      "Văn hóa dân tộc",
      "Ý thức cộng đồng",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q006",
    difficulty: "hard",
    question: "Nội dung nào là quan điểm của Đảng về vấn đề dân tộc, không phải Cương lĩnh?",
    options: options([
      "Các dân tộc lớn nhỏ đều hoàn toàn bình đẳng với nhau",
      "Ưu tiên đầu tư phát triển vùng dân tộc, miền núi",
      "Các dân tộc được quyền tự quyết vận mệnh",
      "Liên hiệp công nhân tất cả các dân tộc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q007",
    difficulty: "medium",
    question: "\"Thực hiện chính sách xã hội\" ở vùng đồng bào dân tộc thuộc nhóm chính sách nào?",
    options: options([
      "Chính sách dân tộc về chính trị",
      "Chính sách dân tộc về kinh tế",
      "Chính sách dân tộc về xã hội",
      "Chính sách dân tộc về quốc phòng",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q008",
    difficulty: "medium",
    question: "\"Bảo đảm an sinh xã hội vùng đồng bào dân tộc thiểu số\" thuộc lĩnh vực nào?",
    options: options([
      "Chính sách về kinh tế",
      "Chính sách về chính trị",
      "Chính sách về văn hóa",
      "Chính sách về xã hội",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q009",
    difficulty: "medium",
    question: "Đặc điểm \"trình độ phát triển không đồng đều\" nói về sự khác nhau ở mặt nào?",
    options: options([
      "Mức độ phát triển giữa các dân tộc",
      "Số dân giữa các dân tộc",
      "Nơi cư trú giữa các dân tộc",
      "Bản sắc văn hóa giữa các dân tộc",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q010",
    difficulty: "medium",
    question: "Nội dung nào thuộc Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin?",
    options: options([
      "Các dân tộc được quyền tự trị",
      "Các dân tộc được quyền đồng hóa",
      "Các dân tộc được quyền tách biệt",
      "Các dân tộc được quyền tự quyết",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q011",
    difficulty: "hard",
    question: "Cặp nội dung nào cùng thuộc chính sách dân tộc về an ninh – quốc phòng?",
    options: options([
      "Bảo vệ Tổ quốc; bảo đảm an sinh xã hội",
      "Ổn định chính trị; phát triển kinh tế miền núi",
      "Bảo vệ Tổ quốc; bảo đảm trật tự an toàn xã hội",
      "Bảo đảm an sinh xã hội; xây dựng văn hóa tiên tiến",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q012",
    difficulty: "medium",
    question: "Gọi một cộng đồng có ngôn ngữ, văn hóa, ý thức tự giác riêng là dân tộc, ta dùng nghĩa nào?",
    options: options([
      "Dân tộc theo nghĩa quốc gia",
      "Dân tộc theo nghĩa giai cấp",
      "Dân tộc theo nghĩa lãnh thổ",
      "Dân tộc theo nghĩa tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q013",
    difficulty: "medium",
    question: "Bản sắc văn hóa riêng của mỗi dân tộc góp phần tạo nên điều gì?",
    options: options([
      "Sự tách biệt, riêng rẽ của văn hóa từng vùng miền",
      "Sự phong phú, đa dạng của văn hóa Việt Nam thống nhất",
      "Sự đồng nhất, rập khuôn của văn hóa Việt Nam chung",
      "Sự chênh lệch, khác biệt về trình độ giữa các dân tộc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q014",
    difficulty: "easy",
    question: "Nhận định nào đúng về số đặc trưng của hai nghĩa dân tộc?",
    options: options([
      "Quốc gia – dân tộc có ba, tộc người có năm",
      "Quốc gia – dân tộc có năm, tộc người có ba",
      "Quốc gia – dân tộc có sáu, tộc người có ba",
      "Quốc gia – dân tộc có năm, tộc người có hai",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q015",
    difficulty: "medium",
    question: "\"Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc\" thuộc lĩnh vực nào?",
    options: options([
      "Lĩnh vực xã hội",
      "Lĩnh vực văn hóa",
      "Lĩnh vực kinh tế",
      "Lĩnh vực quốc phòng",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q016",
    difficulty: "hard",
    question: "Cặp nhận định nào đúng về sự hình thành dân tộc ở phương Đông?",
    options: options([
      "Kinh tế chín muồi; văn hóa còn kém phát triển",
      "Văn hóa chín muồi; kinh tế đã rất phát triển",
      "Văn hóa chín muồi; kinh tế còn kém phát triển",
      "Kinh tế thống nhất; văn hóa đã rất phát triển",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q017",
    difficulty: "medium",
    question: "Đặc trưng nào thuộc dân tộc theo nghĩa tộc người?",
    options: options([
      "Lãnh thổ chung ổn định",
      "Nhà nước dân tộc độc lập",
      "Ngôn ngữ chung của quốc gia",
      "Ý thức tự giác tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q018",
    difficulty: "medium",
    question: "Đặc trưng về kinh tế của quốc gia – dân tộc được diễn đạt thế nào?",
    options: options([
      "Chung một nghề truyền thống",
      "Chung một chủ sở hữu ruộng đất",
      "Chung một thị trường buôn bán quốc tế",
      "Chung phương thức sinh hoạt kinh tế",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q019",
    difficulty: "hard",
    question: "Nội dung nào dễ nhầm nhưng KHÔNG nằm trong Cương lĩnh dân tộc?",
    options: options([
      "Các dân tộc hoàn toàn bình đẳng",
      "Các dân tộc đoàn kết, tương trợ nhau",
      "Các dân tộc được quyền tự quyết",
      "Liên hiệp công nhân tất cả các dân tộc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q020",
    difficulty: "medium",
    question: "Phát triển toàn diện ở vùng dân tộc phải bao gồm cả lĩnh vực nào?",
    options: options([
      "Du lịch quốc tế",
      "An ninh – quốc phòng",
      "Thương mại điện tử",
      "Khai thác tài nguyên",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q021",
    difficulty: "easy",
    question: "Các dân tộc ở Việt Nam có truyền thống gì?",
    options: options([
      "Cạnh tranh, tách biệt lâu đời",
      "Biệt lập, khép kín lâu đời",
      "Đối đầu, xung đột lâu đời",
      "Đoàn kết, gắn bó lâu đời",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q022",
    difficulty: "medium",
    question: "Quyền tự quyết dân tộc bao gồm cặp quyền nào?",
    options: options([
      "Quyền tách ra lập quốc gia; quyền tự nguyện liên hiệp",
      "Quyền tách ra lập quốc gia; quyền đồng hóa dân tộc khác",
      "Quyền tự nguyện liên hiệp; quyền xâm chiếm lãnh thổ khác",
      "Quyền ly khai tùy ý; quyền can thiệp nước láng giềng",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q023",
    difficulty: "hard",
    question: "Một cộng đồng dân cư đấu tranh để có nhà nước riêng thể hiện điều gì?",
    options: options([
      "Xu hướng thứ hai của quan hệ dân tộc",
      "Nội dung liên hiệp công nhân các dân tộc",
      "Xu hướng thứ nhất của quan hệ dân tộc",
      "Đặc trưng ý thức tự giác của tộc người",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q024",
    difficulty: "medium",
    question: "Nội dung thứ ba của Cương lĩnh dân tộc nhấn mạnh sự liên hiệp của ai?",
    options: options([
      "Công nhân tất cả các dân tộc",
      "Nông dân tất cả các dân tộc",
      "Trí thức tất cả các dân tộc",
      "Nhà nước tất cả các dân tộc",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q025",
    difficulty: "medium",
    question: "Nhận định nào đúng về sự ra đời của dân tộc ở phương Tây?",
    options: options([
      "Ra đời khi tư bản chủ nghĩa thay thế phong kiến",
      "Ra đời khi văn hóa phát triển trước kinh tế",
      "Ra đời khi chế độ phong kiến vừa mới hình thành",
      "Ra đời khi xã hội chủ nghĩa giành thắng lợi",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q026",
    difficulty: "medium",
    question: "Phong trào đòi thành lập quốc gia độc lập phản ánh xu hướng nào?",
    options: options([
      "Xu hướng liên hiệp tất cả các dân tộc với nhau",
      "Xu hướng tách ra hình thành dân tộc độc lập",
      "Xu hướng đồng hóa các dân tộc thiểu số",
      "Xu hướng hòa nhập vào một dân tộc lớn",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q027",
    difficulty: "easy",
    question: "Xu hướng thứ hai trong sự phát triển quan hệ dân tộc là gì?",
    options: options([
      "Các dân tộc muốn tách ra sống riêng biệt",
      "Các dân tộc muốn đồng hóa dân tộc khác",
      "Các dân tộc muốn liên hiệp lại với nhau",
      "Các dân tộc muốn đóng cửa với bên ngoài",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q028",
    difficulty: "medium",
    question: "Quốc gia – dân tộc chịu sự quản lý của chủ thể nào?",
    options: options([
      "Một tổ chức tôn giáo lớn",
      "Một hội đồng đại diện các tộc người",
      "Một liên minh các dòng họ",
      "Một nhà nước dân tộc độc lập",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q029",
    difficulty: "medium",
    question: "\"Tôn trọng, giúp nhau cùng phát triển\" thuộc chính sách dân tộc về mặt nào?",
    options: options([
      "Thuộc mặt chính trị",
      "Thuộc mặt kinh tế",
      "Thuộc mặt xã hội",
      "Thuộc mặt quốc phòng",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q030",
    difficulty: "medium",
    question: "Một tộc người chưa có chữ viết có được coi là có cộng đồng ngôn ngữ không?",
    options: options([
      "Không, vì bắt buộc phải có chữ viết",
      "Có, vì có thể chỉ riêng ngôn ngữ nói",
      "Không, vì phải dùng ngôn ngữ quốc gia",
      "Có, nhưng chỉ khi được nhà nước công nhận",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q031",
    difficulty: "medium",
    question: "\"Cộng đồng về văn hóa\" là đặc trưng của dân tộc hiểu theo nghĩa nào?",
    options: options([
      "Theo nghĩa quốc gia – dân tộc",
      "Theo nghĩa giai cấp",
      "Theo nghĩa nhà nước",
      "Theo nghĩa tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q032",
    difficulty: "medium",
    question: "Vấn đề dân tộc và đoàn kết dân tộc có vị trí như thế nào?",
    options: options([
      "Chiến lược ngắn hạn, tạm thời, không cấp bách",
      "Vấn đề cục bộ, riêng của các tỉnh miền núi",
      "Vấn đề thứ yếu, có thể giải quyết về sau",
      "Chiến lược cơ bản, lâu dài, đồng thời cấp bách",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q033",
    difficulty: "easy",
    question: "Đặc trưng về ngôn ngữ của tộc người được gọi là gì?",
    options: options([
      "Cộng đồng về ngôn ngữ",
      "Cộng đồng về lãnh thổ",
      "Cộng đồng về kinh tế",
      "Cộng đồng về chính trị",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q034",
    difficulty: "hard",
    question: "Một chủ trương bảo đảm trật tự an toàn xã hội ở vùng dân tộc thuộc lĩnh vực nào?",
    options: options([
      "Chính sách về an ninh – quốc phòng",
      "Chính sách về an sinh, trật tự xã hội",
      "Chính sách về văn hóa và xã hội",
      "Chính sách về chính trị và đoàn kết",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q035",
    difficulty: "medium",
    question: "Địa bàn dân tộc thiểu số có vị trí chiến lược, nên phát triển vùng này cần gắn với gì?",
    options: options([
      "Gắn phát triển với di dân xuống đồng bằng",
      "Gắn phát triển với thu hẹp vùng cư trú",
      "Gắn phát triển với an ninh – quốc phòng",
      "Gắn phát triển với đóng cửa biên giới",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q036",
    difficulty: "medium",
    question: "Ngôn ngữ, văn hóa, ý thức tự giác là ba đặc trưng của khái niệm nào?",
    options: options([
      "Dân tộc với nghĩa là quốc gia",
      "Dân tộc với nghĩa là giai cấp",
      "Dân tộc với nghĩa là tộc người",
      "Dân tộc với nghĩa là nhà nước",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q037",
    difficulty: "hard",
    question: "Nhóm nào gồm toàn đặc trưng của quốc gia – dân tộc?",
    options: options([
      "Kinh tế chung, lãnh thổ chung, ý thức tộc người",
      "Ngôn ngữ tộc người, văn hóa tộc người, lãnh thổ chung",
      "Kinh tế chung, lãnh thổ chung, nhà nước độc lập",
      "Nhà nước độc lập, ý thức tộc người, văn hóa riêng",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q038",
    difficulty: "easy",
    question: "Lãnh thổ của quốc gia – dân tộc có đặc điểm gì?",
    options: options([
      "Lãnh thổ thay đổi theo mùa",
      "Lãnh thổ chung và ổn định",
      "Lãnh thổ riêng của từng dòng họ",
      "Lãnh thổ chia theo tôn giáo",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q039",
    difficulty: "hard",
    question: "Cặp đặc trưng nào cùng thuộc dân tộc theo nghĩa quốc gia – dân tộc?",
    options: options([
      "Lãnh thổ chung ổn định và ý thức tự giác tộc người",
      "Ngôn ngữ chung quốc gia và ý thức tự giác tộc người",
      "Lãnh thổ chung ổn định và ngôn ngữ chung quốc gia",
      "Cộng đồng về văn hóa và ý thức tự giác tộc người",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q040",
    difficulty: "easy",
    question: "Xu hướng \"liên hiệp\" nói về mong muốn của chủ thể nào?",
    options: options([
      "Các dân tộc",
      "Các tôn giáo",
      "Các dòng họ",
      "Các giai cấp",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q041",
    difficulty: "medium",
    question: "Truyền thống đoàn kết của các dân tộc ở Việt Nam gắn với cộng đồng nào?",
    options: options([
      "Cộng đồng quốc gia thống nhất",
      "Cộng đồng tôn giáo chung toàn quốc",
      "Cộng đồng dòng họ lớn",
      "Cộng đồng từng vùng riêng",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q042",
    difficulty: "medium",
    question: "Chủ trương ưu tiên đầu tư vùng dân tộc, miền núi xuất phát từ đặc điểm nào?",
    options: options([
      "Các dân tộc cư trú xen kẽ với nhau",
      "Trình độ phát triển không đồng đều",
      "Mỗi dân tộc có bản sắc riêng",
      "Truyền thống đoàn kết lâu đời",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q043",
    difficulty: "hard",
    question: "Nội dung nào thuộc chính sách về văn hóa, KHÔNG thuộc chính sách về xã hội?",
    options: options([
      "Bảo đảm an sinh xã hội vùng đồng bào thiểu số",
      "Thực hiện chính sách xã hội ở vùng dân tộc",
      "Xây dựng văn hóa tiên tiến, đậm đà bản sắc",
      "Bảo đảm trật tự an toàn xã hội ở vùng dân tộc",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q044",
    difficulty: "hard",
    question: "Cặp nội dung nào cùng thuộc đặc điểm dân tộc ở Việt Nam?",
    options: options([
      "Cư trú xen kẽ; mỗi dân tộc có lãnh thổ riêng",
      "Cư trú xen kẽ; trình độ phát triển không đồng đều",
      "Số dân ngang nhau; trình độ phát triển không đồng đều",
      "Cư trú tách biệt; có truyền thống đoàn kết lâu đời",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q045",
    difficulty: "medium",
    question: "Sự gắn bó lâu đời của các dân tộc được thể hiện qua đặc điểm nào?",
    options: options([
      "Sự chênh lệch số dân giữa các tộc người",
      "Trình độ phát triển không đồng đều giữa các dân tộc",
      "Truyền thống đoàn kết trong quốc gia thống nhất",
      "Sự phân bố ở địa bàn chiến lược",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q046",
    difficulty: "medium",
    question: "Nội dung nào phản ánh đúng ba đặc trưng của dân tộc theo nghĩa tộc người?",
    options: options([
      "Ngôn ngữ, lãnh thổ, ý thức tự giác tộc người",
      "Kinh tế, văn hóa, ý thức tự giác tộc người",
      "Ngôn ngữ, văn hóa, ý thức tự giác tộc người",
      "Ngôn ngữ, văn hóa, nhà nước dân tộc độc lập",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q047",
    difficulty: "medium",
    question: "Chính sách dân tộc về kinh tế tập trung vào nội dung nào?",
    options: options([
      "Phát triển kinh tế – xã hội miền núi, vùng đồng bào thiểu số",
      "Phát triển kinh tế – xã hội đô thị, vùng ven biển lớn",
      "Phát triển kinh tế – xã hội khu công nghiệp tập trung",
      "Phát triển kinh tế – xã hội vùng đồng bằng trù phú",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q048",
    difficulty: "hard",
    question: "Đặc điểm nào cho thấy văn hóa Việt Nam thống nhất mà vẫn đa dạng?",
    options: options([
      "Mỗi dân tộc có bản sắc văn hóa riêng",
      "Các dân tộc có trình độ không đồng đều",
      "Các dân tộc thiểu số ở địa bàn chiến lược",
      "Có sự chênh lệch số dân giữa các tộc người",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q049",
    difficulty: "easy",
    question: "Đặc điểm nào nói về nơi sinh sống của các dân tộc ở Việt Nam?",
    options: options([
      "Các dân tộc có bản sắc riêng",
      "Các dân tộc có truyền thống đoàn kết",
      "Các dân tộc phát triển không đồng đều",
      "Các dân tộc cư trú xen kẽ nhau",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q050",
    difficulty: "hard",
    question: "Cặp nội dung nào nêu đúng hai xu hướng khách quan?",
    options: options([
      "Tách ra hình thành dân tộc độc lập; đồng hóa các dân tộc khác",
      "Tách ra hình thành dân tộc độc lập; liên hiệp lại với nhau",
      "Hòa tan thành một dân tộc; liên hiệp lại với nhau",
      "Cạnh tranh giành lãnh thổ riêng; liên hiệp lại với nhau",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q051",
    difficulty: "easy",
    question: "Ở phương Tây, dân tộc xuất hiện gắn với sự chuyển biến nào?",
    options: options([
      "Phương thức sản xuất tư bản chủ nghĩa thay thế phong kiến",
      "Phương thức sản xuất phong kiến thay thế chiếm hữu nô lệ",
      "Phương thức sản xuất xã hội chủ nghĩa thay thế tư bản",
      "Phương thức sản xuất chiếm hữu nô lệ thay thế công xã",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q052",
    difficulty: "easy",
    question: "Người Tày, người Thái hay người Mông ở Việt Nam là dân tộc hiểu theo nghĩa nào?",
    options: options([
      "Dân tộc theo nghĩa quốc gia – dân tộc",
      "Một quốc gia độc lập có chủ quyền",
      "Một bộ lạc thời công xã nguyên thủy",
      "Dân tộc theo nghĩa tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q053",
    difficulty: "medium",
    question: "Theo quan điểm của Đảng, quan hệ giữa các dân tộc được xây dựng thế nào?",
    options: options([
      "Bình đẳng, cạnh tranh, tự lực, mỗi dân tộc tự phát triển",
      "Đoàn kết, hòa nhập, đồng hóa thành một dân tộc chung",
      "Bình đẳng, đoàn kết, tương trợ, giúp nhau cùng phát triển",
      "Tự quản, tách biệt, mỗi vùng phát triển theo cách riêng",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q054",
    difficulty: "medium",
    question: "Từ nào KHÔNG nằm trong cụm \"bình đẳng, đoàn kết, tương trợ, giúp nhau cùng phát triển\"?",
    options: options([
      "Bình đẳng",
      "Cạnh tranh",
      "Đoàn kết",
      "Tương trợ",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q055",
    difficulty: "medium",
    question: "Theo Cương lĩnh dân tộc, quyền nào của các dân tộc được khẳng định?",
    options: options([
      "Quyền đồng hóa",
      "Quyền tự quyết",
      "Quyền chiếm hữu",
      "Quyền ưu tiên tuyệt đối",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q056",
    difficulty: "medium",
    question: "Xu hướng thứ nhất trong sự phát triển quan hệ dân tộc là gì?",
    options: options([
      "Các dân tộc muốn liên hiệp lại với nhau",
      "Các dân tộc muốn hòa tan vào dân tộc lớn",
      "Cộng đồng dân cư muốn sáp nhập vào một quốc gia khác",
      "Cộng đồng dân cư muốn tách ra thành dân tộc độc lập",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q057",
    difficulty: "hard",
    question: "\"Bảo đảm ổn định chính trị\" thuộc chính sách dân tộc về lĩnh vực nào?",
    options: options([
      "Về chính trị và đoàn kết dân tộc",
      "Về xã hội và an sinh",
      "Về văn hóa và bản sắc",
      "Về an ninh – quốc phòng",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q058",
    difficulty: "hard",
    question: "Điểm khác biệt cơ bản của sự hình thành dân tộc ở phương Đông so với phương Tây là gì?",
    options: options([
      "Phương Đông dựa trên kinh tế tư bản phát triển trước",
      "Phương Đông dựa trên văn hóa, tâm lý chín muồi trước",
      "Phương Đông dựa trên thị trường thống nhất hình thành trước",
      "Phương Đông dựa trên nhà nước liên bang ra đời trước",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q059",
    difficulty: "medium",
    question: "Theo nghĩa quốc gia – dân tộc, đặc trưng về ngôn ngữ được hiểu là gì?",
    options: options([
      "Ngôn ngữ riêng của từng tộc người",
      "Ngôn ngữ chung của quốc gia",
      "Ngôn ngữ nói của từng địa phương",
      "Ngôn ngữ viết của tầng lớp trí thức",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q060",
    difficulty: "medium",
    question: "\"Cư trú xen kẽ nhau\" là đặc điểm của đối tượng nào?",
    options: options([
      "Dân tộc theo nghĩa tộc người nói chung",
      "Quốc gia – dân tộc ở phương Tây",
      "Các nước trong liên minh dân tộc",
      "Các dân tộc ở Việt Nam",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q061",
    difficulty: "hard",
    question: "Cặp nội dung nào cùng thuộc Cương lĩnh dân tộc?",
    options: options([
      "Dân tộc bình đẳng; ưu tiên đầu tư vùng miền núi",
      "Dân tộc bình đẳng; liên hiệp công nhân các dân tộc",
      "Quyền tự quyết; bảo đảm an sinh vùng dân tộc",
      "Quyền tự quyết; xây dựng nền văn hóa đậm đà bản sắc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q062",
    difficulty: "hard",
    question: "Cộng đồng về ngôn ngữ của tộc người có thể gồm những gì?",
    options: options([
      "Ngôn ngữ viết và nói, hoặc chỉ ngôn ngữ viết",
      "Chỉ ngôn ngữ viết đã được nhà nước công nhận",
      "Chỉ ngôn ngữ chung của quốc gia đa dân tộc",
      "Ngôn ngữ nói và viết, hoặc chỉ ngôn ngữ nói",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q063",
    difficulty: "hard",
    question: "Chính sách dân tộc về chính trị nhấn mạnh nội dung nào?",
    options: options([
      "Phát triển toàn diện kinh tế – xã hội vùng đồng bào thiểu số",
      "Xây dựng văn hóa tiên tiến, đậm đà bản sắc dân tộc",
      "Bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển",
      "Bảo đảm an sinh xã hội vùng đồng bào thiểu số",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q064",
    difficulty: "easy",
    question: "Các dân tộc ở Việt Nam cư trú theo hình thức nào?",
    options: options([
      "Cư trú tách biệt nhau",
      "Cư trú theo từng tỉnh riêng",
      "Cư trú theo từng tôn giáo",
      "Cư trú xen kẽ nhau",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q065",
    difficulty: "hard",
    question: "Nội dung nào KHÔNG thuộc Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin?",
    options: options([
      "Các dân tộc hoàn toàn bình đẳng",
      "Ưu tiên đầu tư vùng dân tộc và miền núi",
      "Các dân tộc được quyền tự quyết",
      "Liên hiệp công nhân tất cả các dân tộc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q066",
    difficulty: "easy",
    question: "\"Liên hiệp công nhân tất cả các dân tộc\" phản ánh sự thống nhất giữa hai mặt nào?",
    options: options([
      "Lợi ích dân tộc với lợi ích tôn giáo",
      "Kinh tế thị trường với kinh tế tự nhiên",
      "Văn hóa phương Đông với văn hóa phương Tây",
      "Giải phóng dân tộc với giải phóng giai cấp",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q067",
    difficulty: "hard",
    question: "Cặp đặc trưng nào cùng thuộc dân tộc theo nghĩa tộc người?",
    options: options([
      "Cộng đồng văn hóa và lãnh thổ chung ổn định",
      "Ý thức tự giác tộc người và nhà nước độc lập",
      "Cộng đồng ngôn ngữ và phương thức kinh tế chung",
      "Cộng đồng văn hóa và ý thức tự giác tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q068",
    difficulty: "medium",
    question: "Nhận định nào đúng về vị trí của vấn đề dân tộc và đoàn kết dân tộc?",
    options: options([
      "Chỉ lâu dài, không cấp bách",
      "Vừa lâu dài, vừa cấp bách",
      "Chỉ cấp bách, không lâu dài",
      "Không lâu dài, không cấp bách",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q069",
    difficulty: "medium",
    question: "Chủ thể của xu hướng thứ nhất được nêu là gì?",
    options: options([
      "Giai cấp công nhân",
      "Nhà nước liên bang",
      "Các tổ chức quốc tế",
      "Cộng đồng dân cư",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q070",
    difficulty: "hard",
    question: "\"Ngôn ngữ chung của quốc gia\" và \"cộng đồng về ngôn ngữ\" được phân biệt thế nào?",
    options: options([
      "Cái trước thuộc quốc gia – dân tộc, cái sau thuộc tộc người",
      "Cái trước thuộc tộc người, cái sau thuộc quốc gia – dân tộc",
      "Cả hai cùng thuộc dân tộc theo nghĩa quốc gia – dân tộc",
      "Cả hai cùng thuộc dân tộc theo nghĩa tộc người",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q071",
    difficulty: "easy",
    question: "Nội dung đầu tiên trong Cương lĩnh dân tộc là gì?",
    options: options([
      "Các dân tộc hoàn toàn bình đẳng",
      "Các dân tộc được quyền tự quyết",
      "Liên hiệp công nhân các dân tộc",
      "Ưu tiên phát triển miền núi",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q072",
    difficulty: "medium",
    question: "\"Các dân tộc hoàn toàn bình đẳng\" là nội dung nào?",
    options: options([
      "Nội dung thứ hai của Cương lĩnh dân tộc",
      "Nội dung thứ ba của Cương lĩnh dân tộc",
      "Đặc điểm thứ nhất của dân tộc Việt Nam",
      "Nội dung thứ nhất của Cương lĩnh dân tộc",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q073",
    difficulty: "easy",
    question: "Cặp ghép nào đúng giữa nội dung và lĩnh vực của chính sách dân tộc?",
    options: options([
      "Bảo đảm an sinh xã hội – chính sách xã hội",
      "Bảo đảm an sinh xã hội – chính sách kinh tế",
      "Bản sắc văn hóa dân tộc – chính sách chính trị",
      "Ổn định chính trị – chính sách văn hóa",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q074",
    difficulty: "easy",
    question: "Ở phương Đông, văn hóa và tâm lý dân tộc khi dân tộc hình thành ở trạng thái nào?",
    options: options([
      "Còn sơ khai và chưa định hình",
      "Chưa hề xuất hiện",
      "Đã tương đối chín muồi",
      "Đang bị phân tán",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q075",
    difficulty: "medium",
    question: "Đặc trưng nào thuộc dân tộc theo nghĩa quốc gia – dân tộc?",
    options: options([
      "Có lãnh thổ chung ổn định",
      "Có ý thức tự giác tộc người",
      "Có chung một tín ngưỡng tôn giáo",
      "Có chung nguồn gốc huyết thống",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q076",
    difficulty: "medium",
    question: "Mục đích của xu hướng tách ra là gì?",
    options: options([
      "Hình thành liên minh nhiều dân tộc",
      "Hình thành một dân tộc thống nhất chung",
      "Hình thành cộng đồng dân tộc độc lập",
      "Hình thành cộng đồng tôn giáo riêng",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q077",
    difficulty: "medium",
    question: "Khi hiểu dân tộc là một cộng đồng chính trị – xã hội, ta đang dùng nghĩa nào?",
    options: options([
      "Nghĩa tộc người",
      "Nghĩa giai cấp xã hội",
      "Nghĩa quốc gia – dân tộc",
      "Nghĩa cộng đồng tôn giáo",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q078",
    difficulty: "hard",
    question: "Nhóm nào gồm toàn đặc điểm của dân tộc ở Việt Nam?",
    options: options([
      "Cư trú xen kẽ, lãnh thổ riêng, truyền thống đoàn kết",
      "Số dân ngang nhau, bản sắc riêng, cư trú xen kẽ",
      "Trình độ đồng đều, bản sắc riêng, cư trú xen kẽ",
      "Cư trú xen kẽ, bản sắc riêng, truyền thống đoàn kết",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q079",
    difficulty: "medium",
    question: "Việc các thành viên tự nhận mình thuộc về một cộng đồng thể hiện đặc trưng nào?",
    options: options([
      "Ý thức tự giác tộc người",
      "Cộng đồng về ngôn ngữ",
      "Cộng đồng về văn hóa",
      "Lãnh thổ chung ổn định",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q080",
    difficulty: "medium",
    question: "Khi dân tộc hình thành ở phương Đông, cộng đồng kinh tế nhìn chung ra sao?",
    options: options([
      "Đạt trình độ cao và đã thống nhất rộng khắp cả nước",
      "Chưa hình thành và chưa có bất kỳ sự liên kết",
      "Phát triển vượt trước văn hóa và tâm lý dân tộc",
      "Đạt mức nhất định nhưng còn kém phát triển, phân tán",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q081",
    difficulty: "medium",
    question: "Yếu tố nào tạo nên bản sắc của dân tộc theo nghĩa quốc gia – dân tộc?",
    options: options([
      "Nét tâm lý và văn hóa chung",
      "Lãnh thổ chung và ổn định",
      "Nhà nước dân tộc độc lập",
      "Phương thức sinh hoạt kinh tế",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q082",
    difficulty: "medium",
    question: "Vì sao ở Việt Nam không dân tộc nào có lãnh thổ tách biệt?",
    options: options([
      "Vì các dân tộc có số dân bằng nhau",
      "Vì các dân tộc cùng một tôn giáo",
      "Vì các dân tộc cư trú xen kẽ nhau",
      "Vì các dân tộc cùng một ngôn ngữ",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q083",
    difficulty: "easy",
    question: "Các dân tộc thiểu số ở Việt Nam phân bố chủ yếu ở đâu?",
    options: options([
      "Địa bàn có mật độ dân cư rất cao",
      "Địa bàn có nhiều đô thị lớn phát triển",
      "Địa bàn có khí hậu ôn hòa ổn định",
      "Địa bàn có vị trí chiến lược quan trọng",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q084",
    difficulty: "medium",
    question: "Theo nghĩa quốc gia – dân tộc, cộng đồng chính trị – xã hội có chung điều gì?",
    options: options([
      "Phương thức thờ cúng tổ tiên",
      "Phương thức tổ chức gia đình",
      "Phương thức sinh hoạt kinh tế",
      "Phương thức canh tác nông nghiệp",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q085",
    difficulty: "medium",
    question: "Nhận định nào đúng về trình độ phát triển của các dân tộc ở Việt Nam?",
    options: options([
      "Các dân tộc có trình độ phát triển ngang bằng nhau",
      "Các dân tộc có trình độ phát triển tăng đều mỗi năm",
      "Các dân tộc có trình độ phát triển không đồng đều",
      "Các dân tộc có trình độ phát triển chỉ khác ngôn ngữ",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q086",
    difficulty: "easy",
    question: "Quyền tự quyết của các dân tộc được hiểu đúng nhất là gì?",
    options: options([
      "Quyền làm chủ vận mệnh của dân tộc mình",
      "Quyền can thiệp vào công việc nước khác",
      "Quyền chiếm thêm lãnh thổ của dân tộc khác",
      "Quyền được miễn trừ mọi nghĩa vụ chung",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q087",
    difficulty: "easy",
    question: "Theo nguyên tắc bình đẳng, dân tộc đông người và dân tộc ít người có quan hệ thế nào?",
    options: options([
      "Dân tộc đông người có nhiều quyền hơn",
      "Dân tộc ít người được miễn mọi nghĩa vụ",
      "Có quyền lợi và nghĩa vụ ngang nhau",
      "Quyền lợi chia theo trình độ phát triển",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q088",
    difficulty: "hard",
    question: "Đặc trưng nào KHÔNG thuộc dân tộc theo nghĩa tộc người?",
    options: options([
      "Cộng đồng về ngôn ngữ nói và viết",
      "Cộng đồng về văn hóa",
      "Ý thức tự giác tộc người",
      "Sự quản lý của nhà nước độc lập",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q089",
    difficulty: "hard",
    question: "Nhóm nào là ba nội dung của Cương lĩnh dân tộc?",
    options: options([
      "Bình đẳng, đoàn kết, tương trợ giúp nhau phát triển",
      "Bình đẳng, tự quyết, ưu tiên đầu tư miền núi",
      "Bình đẳng, tự quyết, liên hiệp công nhân các dân tộc",
      "Đoàn kết, tự quyết, liên hiệp công nhân các dân tộc",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q090",
    difficulty: "medium",
    question: "Công tác dân tộc là nhiệm vụ của chủ thể nào?",
    options: options([
      "Toàn Đảng, toàn dân và toàn bộ hệ thống chính trị",
      "Riêng cơ quan chuyên trách công tác dân tộc",
      "Riêng chính quyền các tỉnh có đông đồng bào thiểu số",
      "Riêng đồng bào các dân tộc thiểu số ở miền núi",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q091",
    difficulty: "medium",
    question: "Ở phương Đông, dân tộc hình thành chủ yếu trên nền tảng nào?",
    options: options([
      "Cộng đồng kinh tế thống nhất đã phát triển rất cao",
      "Văn hóa và tâm lý dân tộc đã tương đối chín muồi",
      "Thị trường chung của cả nước đã hình thành vững chắc",
      "Nhà nước tập quyền đã hoàn thiện về nhiều mặt",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q092",
    difficulty: "medium",
    question: "Quan điểm phát triển toàn diện ở vùng dân tộc KHÔNG nhắc tới lĩnh vực nào?",
    options: options([
      "Lĩnh vực tôn giáo",
      "Lĩnh vực chính trị",
      "Lĩnh vực kinh tế",
      "Lĩnh vực văn hóa",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q093",
    difficulty: "hard",
    question: "Nhận định nào SAI về dân tộc ở Việt Nam?",
    options: options([
      "Các dân tộc thiểu số tập trung chủ yếu ở đô thị",
      "Các dân tộc thiểu số ở địa bàn chiến lược quan trọng",
      "Các dân tộc có truyền thống đoàn kết, gắn bó lâu đời",
      "Các dân tộc có bản sắc văn hóa riêng của mình",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q094",
    difficulty: "medium",
    question: "Đặc điểm nào cho thấy quy mô các tộc người ở Việt Nam khác nhau?",
    options: options([
      "Chênh lệch về số dân giữa các tộc người",
      "Trình độ phát triển không đồng đều",
      "Bản sắc văn hóa riêng của mỗi dân tộc",
      "Các dân tộc cư trú xen kẽ nhau",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q095",
    difficulty: "easy",
    question: "Cương lĩnh dân tộc được nêu trong bài thuộc hệ thống lý luận nào?",
    options: options([
      "Chủ nghĩa duy tâm khách quan",
      "Chủ nghĩa Mác – Lênin",
      "Chủ nghĩa tự do",
      "Chủ nghĩa dân túy",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q096",
    difficulty: "easy",
    question: "Ý thức tự giác tộc người là đặc trưng của khái niệm nào?",
    options: options([
      "Quốc gia – dân tộc",
      "Tộc người",
      "Giai cấp công nhân",
      "Nhà nước dân tộc",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q097",
    difficulty: "medium",
    question: "Các dân tộc xích lại gần nhau, hợp tác cùng phát triển phản ánh xu hướng nào?",
    options: options([
      "Xu hướng cộng đồng dân cư tách ra độc lập",
      "Xu hướng các dân tộc tự cô lập với nhau",
      "Xu hướng các dân tộc liên hiệp lại với nhau",
      "Xu hướng các dân tộc hòa tan làm một",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q098",
    difficulty: "medium",
    question: "Đặc điểm nào nói về số dân của các dân tộc ở Việt Nam?",
    options: options([
      "Có số dân tương đương nhau giữa các tộc người",
      "Có số dân tăng đều nhau giữa các tộc người",
      "Có số dân giảm dần ở các tộc người thiểu số",
      "Có sự chênh lệch về số dân giữa các tộc người",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q099",
    difficulty: "easy",
    question: "Ngoài là vấn đề chiến lược lâu dài, vấn đề dân tộc còn là vấn đề gì?",
    options: options([
      "Vấn đề cấp bách",
      "Vấn đề thứ yếu",
      "Vấn đề tạm thời",
      "Vấn đề cục bộ",
    ]),
    correctAnswer: "A",
  },
  {
    id: "Q100",
    difficulty: "hard",
    question: "Đặc trưng nào KHÔNG thuộc dân tộc theo nghĩa quốc gia – dân tộc?",
    options: options([
      "Ngôn ngữ chung của quốc gia",
      "Ý thức tự giác tộc người",
      "Lãnh thổ chung ổn định",
      "Sự quản lý của nhà nước độc lập",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q101",
    difficulty: "medium",
    question: "Nhận định nào đúng về hai xu hướng khách quan?",
    options: options([
      "Cả hai xu hướng đều hướng tới tách ra",
      "Cả hai xu hướng đều hướng tới đồng hóa",
      "Một xu hướng tách ra, một xu hướng liên hiệp",
      "Một xu hướng đồng hóa, một xu hướng tách ra",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q102",
    difficulty: "hard",
    question: "Cặp nội dung nào cùng thuộc quan điểm của Đảng về vấn đề dân tộc?",
    options: options([
      "Chiến lược cơ bản, lâu dài; liên hiệp công nhân các dân tộc",
      "Chiến lược cơ bản, lâu dài; ưu tiên đầu tư miền núi",
      "Quyền tự quyết dân tộc; ưu tiên đầu tư miền núi",
      "Cư trú xen kẽ nhau; ưu tiên đầu tư miền núi",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q103",
    difficulty: "medium",
    question: "Theo Cương lĩnh dân tộc, quan hệ giữa các dân tộc về địa vị là gì?",
    options: options([
      "Các dân tộc lớn được ưu tiên",
      "Các dân tộc nhỏ phụ thuộc",
      "Các dân tộc hoàn toàn bình đẳng",
      "Các dân tộc tùy trình độ phát triển",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q104",
    difficulty: "medium",
    question: "Trong hai xu hướng khách quan, xu hướng nào hướng tới sự gắn kết?",
    options: options([
      "Cộng đồng dân cư tách ra độc lập",
      "Các dân tộc tự khép kín lại",
      "Các dân tộc liên hiệp lại với nhau",
      "Các dân tộc giữ khoảng cách",
    ]),
    correctAnswer: "C",
  },
  {
    id: "Q105",
    difficulty: "hard",
    question: "Nội dung nào KHÔNG thuộc sáu đặc điểm của dân tộc ở Việt Nam?",
    options: options([
      "Các dân tộc cư trú xen kẽ nhau",
      "Mỗi dân tộc có lãnh thổ và nhà nước riêng",
      "Các dân tộc có trình độ phát triển không đồng đều",
      "Có sự chênh lệch về số dân giữa các tộc người",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q106",
    difficulty: "medium",
    question: "Cộng đồng có nhà nước độc lập, lãnh thổ chung, ngôn ngữ chung là dân tộc theo nghĩa nào?",
    options: options([
      "Dân tộc theo nghĩa tộc người",
      "Một liên minh nhiều tộc người cùng lãnh thổ",
      "Một cộng đồng văn hóa vùng",
      "Dân tộc theo nghĩa quốc gia – dân tộc",
    ]),
    correctAnswer: "D",
  },
  {
    id: "Q107",
    difficulty: "easy",
    question: "Đảng ưu tiên đầu tư phát triển kinh tế – xã hội ở vùng nào?",
    options: options([
      "Vùng đô thị và ven biển",
      "Vùng dân tộc và miền núi",
      "Vùng đồng bằng và trung du",
      "Vùng khu công nghiệp tập trung",
    ]),
    correctAnswer: "B",
  },
  {
    id: "Q108",
    difficulty: "medium",
    question: "Nội dung nào mô tả đúng quốc gia – dân tộc?",
    options: options([
      "Cộng đồng chính trị – xã hội có nhà nước độc lập",
      "Cộng đồng tộc người có ý thức tự giác riêng",
      "Cộng đồng tôn giáo có giáo lý thống nhất chung",
      "Cộng đồng dòng họ có chung nguồn gốc huyết thống",
    ]),
    correctAnswer: "A",
  },
];

/** Số câu tối thiểu để một ván dài vẫn không phải lặp câu. */
export const MIN_POOL_SIZE = 100;

const BY_ID = new Map(QUESTION_POOL.map((q) => [q.id, q]));

export function questionById(id: string): GameQuestion | undefined {
  return BY_ID.get(id);
}

const BANNED_PHRASES = ["tất cả đáp án", "không đáp án nào", "không có đáp án nào", "cả a và b", "cả a, b"];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Kiểm tra toàn bộ ngân hàng câu hỏi. Trả về danh sách lỗi (rỗng = PASS):
 * id duy nhất, đề không trùng, đúng 4 đáp án không trùng nhau, độ dài đáp án
 * lệch ≤ 3 từ, correctAnswer hợp lệ, không lặp bộ đáp án, phân bố A/B/C/D
 * cân bằng và pool đủ ≥ 100 câu.
 */
export function validateQuestionBank(questions: GameQuestion[] = QUESTION_POOL): string[] {
  const errors: string[] = [];

  const ids = questions.map((q) => q.id);
  if (new Set(ids).size !== ids.length) errors.push("Question IDs are not unique");

  const texts = questions.map((q) => q.question.trim().toLowerCase());
  if (new Set(texts).size !== texts.length) errors.push("Duplicate question text");

  const answerSets = new Set<string>();
  for (const q of questions) {
    if (q.options.length !== 4) {
      errors.push(`Question ${q.id} does not have exactly 4 options`);
      continue;
    }
    const optionTexts = q.options.map((o) => o.text.trim().toLowerCase());
    if (optionTexts.some((t) => t.length === 0)) errors.push(`Question ${q.id} has an empty option`);
    if (new Set(optionTexts).size !== 4) errors.push(`Question ${q.id} has duplicate options`);
    if (!q.options.some((o) => o.id === q.correctAnswer)) {
      errors.push(`Question ${q.id} has an invalid correctAnswer`);
    }
    if (optionTexts.some((t) => BANNED_PHRASES.some((p) => t.includes(p)))) {
      errors.push(`Question ${q.id} uses a give-away option`);
    }
    const counts = q.options.map((o) => wordCount(o.text));
    if (Math.max(...counts) - Math.min(...counts) > 3) {
      errors.push(`Question ${q.id} has unbalanced option length`);
    }
    const key = [...optionTexts].sort().join("|");
    if (answerSets.has(key)) errors.push(`Question ${q.id} repeats another answer set`);
    answerSets.add(key);
  }

  const distribution: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of questions) distribution[q.correctAnswer]++;
  const values = Object.values(distribution);
  if (Math.max(...values) - Math.min(...values) > Math.max(2, Math.ceil(questions.length * 0.04))) {
    errors.push(
      `Correct answer distribution is unbalanced: A=${distribution.A} B=${distribution.B} C=${distribution.C} D=${distribution.D}`,
    );
  }

  // Chống mẹo "đáp án dài nhất là đáp án đúng" trên toàn ngân hàng: đáp án
  // đúng chỉ được là phương án dài nhất (theo ký tự) ở tối đa 25% số câu —
  // tức không nhiều hơn mức ngẫu nhiên.
  const longestIsCorrect = questions.filter((q) => {
    const right = q.options.find((o) => o.id === q.correctAnswer);
    if (!right) return false;
    return q.options.every((o) => o.id === right.id || o.text.length < right.text.length);
  }).length;
  if (questions.length >= 20 && longestIsCorrect > questions.length * 0.25) {
    errors.push(
      `Correct answer is the longest option in ${longestIsCorrect}/${questions.length} questions`,
    );
  }

  if (questions === QUESTION_POOL && questions.length < MIN_POOL_SIZE) {
    errors.push(`Question pool has ${questions.length} questions (< ${MIN_POOL_SIZE})`);
  }

  return errors;
}
