/**
 * Tiêu đề và lời thuyết trình của 15 slide, giữ nguyên theo bản Word
 * của nhóm. Lời thuyết trình chỉ hiện ở màn hình người trình bày và
 * ghi chú (phím N), không hiện trên TV.
 *
 * Bài trên web đã tách thành nhiều màn hình hơn bản Word; content/slides.tsx
 * gắn từng đoạn lời dưới đây vào màn hình tương ứng.
 */
export type SlideScript = {
  title: string;
  speech: string[];
  /** Câu chuyển người ở slide cuối của mỗi thành viên. */
  handoff?: string;
};

export const SCRIPT: Record<number, SlideScript> = {
  1: {
    title: "Sự hình thành dân tộc",
    speech: [
      "Em xin chào thầy cô và các bạn. Nhóm em trình bày về dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội. Bài trình bày gồm ba phần: khái niệm và đặc trưng của dân tộc, quan điểm của chủ nghĩa Mác – Lênin, và dân tộc cùng quan hệ dân tộc ở Việt Nam.",
      "Trước hết là sự hình thành dân tộc. Theo tài liệu, ở phương Tây, dân tộc xuất hiện khi phương thức sản xuất tư bản chủ nghĩa được xác lập, thay thế phương thức sản xuất phong kiến. Ở phương Đông, tài liệu nhấn mạnh nền tảng văn hóa và tâm lý dân tộc đã phát triển tương đối chín muồi, trong khi cộng đồng kinh tế nhìn chung còn kém phát triển và phân tán.",
    ],
  },
  2: {
    title: "Dân tộc theo nghĩa quốc gia dân tộc",
    speech: [
      "Tiếp theo, khái niệm dân tộc được hiểu theo hai nghĩa cơ bản. Với nghĩa thứ nhất, dân tộc được hiểu là quốc gia dân tộc, tức một cộng đồng chính trị – xã hội.",
      "Tài liệu nêu năm đặc trưng của cộng đồng này: chung phương thức sinh hoạt kinh tế, chung lãnh thổ ổn định, có sự quản lý của một nhà nước dân tộc độc lập, có ngôn ngữ chung của quốc gia và có nét tâm lý thể hiện qua văn hóa dân tộc. Khi trình bày, chúng ta có thể ghi nhớ theo năm ý: kinh tế, lãnh thổ, nhà nước, ngôn ngữ và bản sắc văn hóa.",
    ],
  },
  3: {
    title: "Dân tộc theo nghĩa tộc người",
    speech: [
      "Với nghĩa thứ hai, dân tộc được hiểu là tộc người. Tài liệu nêu ba đặc trưng: cộng đồng về ngôn ngữ, cộng đồng về văn hóa và ý thức tự giác tộc người.",
      "Về ngôn ngữ, tài liệu ghi rõ có thể gồm cả ngôn ngữ nói và ngôn ngữ viết, hoặc chỉ riêng ngôn ngữ nói. Như vậy, khi sử dụng từ dân tộc, chúng ta cần làm rõ đang nói theo nghĩa quốc gia dân tộc hay theo nghĩa tộc người.",
    ],
    handoff:
      "Sau khi làm rõ khái niệm, em xin mời bạn tiếp theo trình bày quan điểm Mác – Lênin về vấn đề dân tộc.",
  },
  4: {
    title: "Hai xu hướng phát triển quan hệ dân tộc",
    speech: [
      "Sau phần khái niệm, em xin trình bày quan điểm của chủ nghĩa Mác – Lênin về vấn đề dân tộc. Trước hết, tài liệu đề cập hai xu hướng khách quan trong sự phát triển quan hệ dân tộc.",
      "Xu hướng thứ nhất là cộng đồng dân cư muốn tách ra để hình thành cộng đồng dân tộc độc lập. Xu hướng thứ hai là các dân tộc muốn liên hiệp lại với nhau. Đây là hai nội dung cần phân biệt rõ khi trình bày phần này: hình thành cộng đồng độc lập và liên hiệp giữa các dân tộc.",
    ],
  },
  5: {
    title: "Cương lĩnh dân tộc và nội dung bình đẳng",
    speech: [
      "Tiếp theo là Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin. Tài liệu trình bày cương lĩnh thành ba nội dung. Em xin bắt đầu với nội dung thứ nhất: các dân tộc hoàn toàn bình đẳng.",
      "Khi đưa lên slide, nhóm giữ nguyên cụm từ hoàn toàn bình đẳng để thể hiện đúng nội dung tài liệu. Đây là ý thứ nhất cần ghi nhớ trước khi chuyển sang nội dung về quyền tự quyết.",
    ],
  },
  6: {
    title: "Cương lĩnh dân tộc và quyền tự quyết",
    speech: [
      "Nội dung thứ hai trong cương lĩnh là các dân tộc được quyền tự quyết. Như vậy, hai nội dung đọc rõ được trong ảnh tài liệu là: các dân tộc hoàn toàn bình đẳng và các dân tộc được quyền tự quyết.",
    ],
    handoff:
      "Sau phần quan điểm lý luận, em xin mời bạn tiếp theo trình bày đặc điểm dân tộc ở Việt Nam.",
  },
  7: {
    title: "Đặc điểm dân tộc ở Việt Nam về dân cư",
    speech: [
      "Tiếp nối phần lý luận, em trình bày các đặc điểm dân tộc ở Việt Nam. Trước hết là hai đặc điểm về dân cư.",
      "Đặc điểm thứ nhất là có sự chênh lệch về số dân giữa các tộc người. Đặc điểm thứ hai là các dân tộc cư trú xen kẽ nhau. Khi ghi trên slide, nhóm tách riêng hai ý này để phân biệt rõ đặc điểm về số dân và đặc điểm về cư trú.",
    ],
  },
  8: {
    title: "Đặc điểm về địa bàn và trình độ phát triển",
    speech: [
      "Hai đặc điểm tiếp theo liên quan đến địa bàn phân bố và trình độ phát triển. Tài liệu nêu các dân tộc thiểu số ở Việt Nam phân bố chủ yếu ở những địa bàn có vị trí chiến lược quan trọng.",
      "Bên cạnh đó, các dân tộc ở Việt Nam có trình độ phát triển không đồng đều. Ở phần này, nhóm giữ nội dung ở mức khái quát như tài liệu, gồm vị trí địa bàn và sự không đồng đều trong phát triển.",
    ],
  },
  9: {
    title: "Truyền thống đoàn kết và bản sắc văn hóa",
    speech: [
      "Hai đặc điểm cuối cùng là truyền thống đoàn kết và bản sắc văn hóa. Các dân tộc Việt Nam có truyền thống đoàn kết, gắn bó lâu đời trong một cộng đồng quốc gia thống nhất.",
      "Đồng thời, mỗi dân tộc có bản sắc văn hóa riêng, góp phần tạo nên sự phong phú và đa dạng của văn hóa Việt Nam thống nhất. Như vậy, phần đặc điểm đã đề cập sáu nội dung: số dân, cư trú, địa bàn, trình độ phát triển, đoàn kết và văn hóa.",
    ],
    handoff:
      "Từ các đặc điểm vừa trình bày, em xin mời bạn tiếp theo nói về quan điểm của Đảng và Nhà nước.",
  },
  10: {
    title: "Vị trí của vấn đề dân tộc và nguyên tắc quan hệ",
    speech: [
      "Từ những đặc điểm vừa trình bày, em chuyển sang quan điểm của Đảng và Nhà nước về vấn đề dân tộc. Tài liệu xác định vấn đề dân tộc và đoàn kết dân tộc là vấn đề chiến lược cơ bản, lâu dài, đồng thời cũng là vấn đề cấp bách.",
      "Trong quan hệ giữa các dân tộc, tài liệu nhấn mạnh bình đẳng, đoàn kết, tương trợ và giúp nhau cùng phát triển. Đây là những nội dung nhóm giữ lại làm trọng tâm của slide này.",
    ],
  },
  11: {
    title: "Phát triển toàn diện và ưu tiên đầu tư",
    speech: [
      "Quan điểm tiếp theo là phát triển toàn diện trên địa bàn vùng dân tộc và miền núi. Các lĩnh vực được tài liệu nêu gồm chính trị, kinh tế, văn hóa, xã hội và an ninh, quốc phòng.",
      "Cùng với đó là ưu tiên đầu tư phát triển kinh tế – xã hội vùng dân tộc và miền núi. Vì vậy, nội dung trên slide được chia thành hai ý rõ ràng: phát triển toàn diện các lĩnh vực và ưu tiên đầu tư phát triển kinh tế – xã hội.",
    ],
  },
  12: {
    title: "Trách nhiệm thực hiện công tác dân tộc",
    speech: [
      "Cuối cùng trong phần quan điểm là trách nhiệm thực hiện. Tài liệu xác định công tác dân tộc và thực hiện chính sách dân tộc là nhiệm vụ của toàn Đảng, toàn dân, các cấp, các ngành và toàn bộ hệ thống chính trị.",
      "Đến đây, phần quan điểm đã làm rõ vị trí của vấn đề dân tộc, các nội dung trong quan hệ giữa các dân tộc, định hướng phát triển và trách nhiệm thực hiện. Tiếp theo, bạn trong nhóm sẽ trình bày các chính sách theo từng lĩnh vực.",
    ],
  },
  13: {
    title: "Chính sách dân tộc về chính trị và kinh tế",
    speech: [
      "Em xin trình bày phần cuối là chính sách dân tộc theo từng lĩnh vực. Trước hết, về chính trị, tài liệu nêu thực hiện bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển giữa các dân tộc.",
      "Về kinh tế, nội dung tập trung vào các chủ trương và chính sách phát triển kinh tế – xã hội ở miền núi, vùng đồng bào các dân tộc thiểu số. Trên slide, nhóm trình bày hai lĩnh vực này thành hai ý riêng để dễ theo dõi.",
    ],
  },
  14: {
    title: "Chính sách dân tộc về văn hóa và xã hội",
    speech: [
      "Tiếp theo là chính sách về văn hóa và xã hội. Về văn hóa, tài liệu nêu xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc.",
      "Về xã hội, nội dung là thực hiện chính sách xã hội và bảo đảm an sinh xã hội trong vùng đồng bào dân tộc thiểu số. Như vậy, slide này gồm hai trọng tâm: xây dựng văn hóa và bảo đảm an sinh xã hội.",
    ],
  },
  15: {
    title: "Chính sách về an ninh quốc phòng và tổng kết",
    speech: [
      "Lĩnh vực cuối cùng là an ninh và quốc phòng. Tài liệu nêu tăng cường sức mạnh bảo vệ Tổ quốc trên cơ sở bảo đảm ổn định chính trị, thực hiện tốt an ninh chính trị và trật tự an toàn xã hội.",
      "Nhóm em đã trình bày ba phần chính: khái niệm và đặc trưng của dân tộc, quan điểm Mác – Lênin về vấn đề dân tộc, và dân tộc cùng quan hệ dân tộc ở Việt Nam. Phần chính sách gồm chính trị, kinh tế, văn hóa, xã hội và an ninh, quốc phòng. Nhóm em xin kết thúc bài trình bày và cảm ơn thầy cô cùng các bạn đã lắng nghe.",
    ],
  },
};

/**
 * Gợi ý lời nói cho các màn hình mới (bản Word chưa có lời cho các màn hình
 * này). Viết lại từ chính chữ trên màn hình, không thêm ý mới. Nhóm có thể
 * sửa hoặc thay bằng lời của mình.
 */
export const HINTS = {
  selfDetermination:
    "Đọc định nghĩa trên màn hình, nhấn hai ý: tự quyết định vận mệnh và tự lựa chọn con đường phát triển. Quyền tự quyết có hai nhánh: quyền tách ra để thành lập quốc gia dân tộc độc lập, và quyền tự nguyện liên hiệp với dân tộc khác trên cơ sở bình đẳng. Vì vậy tự quyết không chỉ có tách ra.",
  workersUnion:
    "Nội dung thứ ba của cương lĩnh là liên hiệp công nhân tất cả các dân tộc. Nội dung này nhấn mạnh sự đoàn kết và liên hiệp giữa công nhân thuộc các dân tộc khác nhau.",
  diversityUnity:
    "Chốt lại phần đặc điểm: các dân tộc đa dạng về bản sắc nhưng thống nhất trong cộng đồng quốc gia.",
};
