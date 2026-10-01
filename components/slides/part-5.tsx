import { SlideFrame } from "./frame";
import { PolicyTabs, type Policy } from "./policy-tabs";

export const POLICIES: Policy[] = [
  {
    tab: "CHÍNH TRỊ",
    heading: "Về chính trị",
    text: "Thực hiện bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển giữa các dân tộc.",
  },
  {
    tab: "KINH TẾ",
    heading: "Về kinh tế",
    text: "Các chủ trương, chính sách phát triển kinh tế – xã hội miền núi, vùng đồng bào các dân tộc thiểu số.",
  },
  {
    tab: "XÃ HỘI",
    heading: "Về xã hội",
    text: "Thực hiện chính sách xã hội, bảo đảm an sinh xã hội trong vùng đồng bào dân tộc thiểu số.",
  },
  {
    tab: "VĂN HÓA",
    heading: "Về văn hóa",
    text: "Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc.",
  },
  {
    tab: "AN NINH – QUỐC PHÒNG",
    heading: "Về an ninh – quốc phòng",
    text: "Tăng cường sức mạnh bảo vệ Tổ quốc trên cơ sở bảo đảm ổn định chính trị, an ninh chính trị và trật tự an toàn xã hội.",
  },
];

export function PolicySlide() {
  return (
    <SlideFrame
      title="Chính sách dân tộc"
      subtitle="của Đảng và Nhà nước Việt Nam"
    >
      <PolicyTabs policies={POLICIES} />
    </SlideFrame>
  );
}
