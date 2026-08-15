'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingConsultationModal from '@/components/layout/BookingConsultationModal';

const MENU_CATEGORIES = [
  { id: 'SET_TIEC', label: 'Set Menu Tiệc Cưới & Hội Nghị', icon: 'restaurant_menu', count: '6 Set cỗ mẫu' },
  { id: 'CHUYEN_MON', label: 'Menu Chuyên Món Đặc Sản', icon: 'workspace_premium', count: '8 Menu đặc sản' },
  { id: 'TRE_EM', label: 'Menu Trẻ Em & Học Sinh', icon: 'child_care', count: '5 Combo ưu đãi' },
  { id: 'ALACARTE', label: 'Menu Chọn Món (3 Phần Chính)', icon: 'menu_book', count: 'Tích chọn tạo bản nháp' },
  { id: 'DO_UONG', label: 'Menu Đồ Uống & Phí Mang Vào', icon: 'wine_bar', count: 'Bảng giá chính thức' },
];

const SET_MENUS = [
  {
    title: 'SET MENU TIỆC 1',
    price: '320.000 VNĐ/khách',
    bestFor: 'Tiệc cưới & Tiệc mừng ấm cúng',
    dishes: [
      { type: 'Khai vị', name: 'Súp hải sản rong biển' },
      { type: 'Khai vị', name: 'Salad rau má bắp bò muối' },
      { type: 'Món chính', name: 'Cá quả nướng dân tộc' },
      { type: 'Món chính', name: 'Bò xào lúc lắc hạnh nhân' },
      { type: 'Món chính', name: 'Gà rút xương sốt xì dầu' },
      { type: 'Món chính', name: 'Mực một nắng xào cần Mỹ' },
      { type: 'Món chính', name: 'Chân giò hầm sen nấm' },
      { type: 'Món củ', name: 'Rau củ luộc chấm kho quẹt' },
      { type: 'Canh', name: 'Canh măng mọc' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi sen dừa' },
      { type: 'Tráng miệng', name: 'Kem Caramel' },
    ]
  },
  {
    title: 'SET MENU TIỆC 2',
    price: '340.000 VNĐ/khách',
    bestFor: 'Tiệc cưới & Hội nghị doanh nghiệp',
    dishes: [
      { type: 'Khai vị', name: 'Súp tôm nấm' },
      { type: 'Khai vị', name: 'Salad lườn ngỗng xông khói' },
      { type: 'Món chính', name: 'Cá quả hấp kiểu Thái' },
      { type: 'Món chính', name: 'Bê tái chanh' },
      { type: 'Món chính', name: 'Gà rút xương sốt nấm' },
      { type: 'Món chính', name: 'Tôm thẻ 6 hoa chiên giòn' },
      { type: 'Món chính', name: 'Hải sản xào sốt X.O' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi Hoàng Phố ruốc bông' },
      { type: 'Tráng miệng', name: 'Dưa hấu tươi' },
    ]
  },
  {
    title: 'SET MENU TIỆC 3',
    price: '345.000 VNĐ/khách',
    bestFor: 'Tiệc kỷ niệm & Hội khóa sang trọng',
    dishes: [
      { type: 'Khai vị', name: 'Súp tôm rong biển' },
      { type: 'Khai vị', name: 'Nộm cổ hũ dừa tôm thịt' },
      { type: 'Món chính', name: 'Cá trắm hấp mẻ' },
      { type: 'Món chính', name: 'Dê chiên riềng' },
      { type: 'Món chính', name: 'Gà hấp lá chanh' },
      { type: 'Món chính', name: 'Bò sốt tiêu đen + Bánh bao chiên' },
      { type: 'Món chính', name: 'Hải sản xào sốt X.O' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Canh mọc hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi cốm vò' },
      { type: 'Tráng miệng', name: 'Nho Mỹ nhập khẩu' },
    ]
  },
  {
    title: 'SET MENU TIỆC 4',
    price: '375.000 VNĐ/khách',
    bestFor: 'Đại tiệc cưới sang trọng & Đẳng cấp',
    dishes: [
      { type: 'Khai vị', name: 'Súp hải sản ngó xuân' },
      { type: 'Khai vị', name: 'Nộm rau má bắp bò muối' },
      { type: 'Món chính', name: 'Cá lăng chiên riềng' },
      { type: 'Món chính', name: 'Tôm thẻ 6 hoa chiên hạnh nhân' },
      { type: 'Món chính', name: 'Gà rút xương sốt bát bảo' },
      { type: 'Món chính', name: 'Dê hấp lá tía tô' },
      { type: 'Món chính', name: 'Bắp bò xào cổ hũ dừa' },
      { type: 'Món củ', name: 'Rau xào theo mùa' },
      { type: 'Canh', name: 'Cá lăng om chuối đậu' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm' },
      { type: 'Cơm / Xôi', name: 'Xôi sen dừa' },
      { type: 'Tráng miệng', name: 'Nho Mỹ cao cấp' },
    ]
  },
  {
    title: 'SET MENU TIỆC VIP 5',
    price: '395.000 VNĐ/khách',
    bestFor: 'Tiệc cưới VIP Hoàng Gia',
    dishes: [
      { type: 'Khai vị', name: 'Súp sụn vi cá hải sản' },
      { type: 'Khai vị', name: 'Salad hải sản sốt Chanh dây' },
      { type: 'Món chính', name: 'Cá lăng nướng riềng mẻ' },
      { type: 'Món chính', name: 'Tôm sú bỏ lò phô mai Pháp' },
      { type: 'Món chính', name: 'Bò nướng tảng sốt rượu vang' },
      { type: 'Món chính', name: 'Gà quay da giòn bánh bao' },
      { type: 'Món chính', name: 'Lườn ngỗng xông khói áp chảo' },
      { type: 'Món củ', name: 'Măng tây xào tỏi' },
      { type: 'Canh', name: 'Canh hải sản sâm bổ lượng' },
      { type: 'Cơm / Xôi', name: 'Cơm chiên hải sản Hoàng Kim' },
      { type: 'Cơm / Xôi', name: 'Xôi gấc hạt sen ruốc nướng' },
      { type: 'Tráng miệng', name: 'Hoa quả mùa cao cấp & Chè dưỡng nhan' },
    ]
  },
  {
    title: 'SET MENU TIỆC VVIP 6',
    price: '415.000 VNĐ/khách',
    bestFor: 'Tiệc VIP thượng lưu & Tiếp khách cao cấp',
    dishes: [
      { type: 'Khai vị', name: 'Súp lươn đồng xứ Nghệ' },
      { type: 'Khai vị', name: 'Salad bò Úc nướng sốt Balsamic' },
      { type: 'Món chính', name: 'Cá lăng hấp Hồng Kông nguyên con' },
      { type: 'Món chính', name: 'Tôm sú chiên hoàng kim trứng muối' },
      { type: 'Món chính', name: 'Thịt bê chao dầu vừng chiên' },
      { type: 'Món chính', name: 'Dê núi nướng tảng lá lốt' },
      { type: 'Món chính', name: 'Mực ống nhồi thịt sốt cay' },
      { type: 'Món củ', name: 'Rau mầm đá xào nấm tươi' },
      { type: 'Canh', name: 'Lẩu cá lăng măng chua / Canh hải sản' },
      { type: 'Cơm / Xôi', name: 'Cơm tám thơm nương' },
      { type: 'Cơm / Xôi', name: 'Xôi cốm làng Vòng dừa nạo' },
      { type: 'Tráng miệng', name: 'Panna Cotta mâm xôi & Nho ngón tay' },
    ]
  }
];

const SPECIALTY_MENUS = [
  {
    title: 'MENU CẦY HƯƠNG',
    subtitle: 'Đặc sản thượng hạng chế biến 5 món chuẩn vị',
    items: ['1. Tiết canh cầy hương', '2. Lòng nhồi đỗ xanh', '3. Cầy hương hấp lá mớ', '4. Canh xương khoai + Bún', '5. Cháo cầy hương']
  },
  {
    title: 'MENU MÒNG KÉT',
    subtitle: 'Chim mòng két thiên nhiên 11 món phong phú',
    items: ['1. Tiết canh mòng két', '2. Lòng xào hành hoa', '3. Hấp nguyên con', '4. Trộn thính lá chanh', '5. Nộm hành răm', '6. Chao dầu giòn', '7. Nhựa mận + Bánh mì', '8. Canh khoai + Bún', '9. Cháo mòng két', '10. Xôi chả', '11. Xào lăn']
  },
  {
    title: 'MENU CÁ LĂNG / CÁ TRẮM',
    subtitle: 'Cá tươi chọn lọc chế biến 6 món độc đáo',
    items: ['1. Súp cá tươi', '2. Gỏi cá chanh ớt', '3. Cá xào nấm đông cô', '4. Rang muối thảo mộc / Hấp Hồng Kông', '5. Nướng muối ớt dân tộc', '6. Lẩu cá măng chua + Bún']
  },
  {
    title: 'MENU BA BA HOÀNG GIA',
    subtitle: 'Ba ba sông trọn vị 6 món bổ dưỡng',
    items: ['1. Rượu tiết mật ba ba', '2. Ba ba tiềm thuốc bắc', '3. Ba ba xào gừng tươi', '4. Nướng lá lốt thơm lừng', '5. Ba ba rang muối hột', '6. Om chuối đậu + Bún + Hoa chuối']
  },
  {
    title: 'MENU DÚI NÚI',
    subtitle: 'Đặc sản dúi rừng 5 món hấp dẫn',
    items: ['1. Tiết canh dúi', '2. Dúi hấp lá tía tô', '3. Dúi xào lăn', '4. Lẩu dúi rau má', '5. Lòng dúi xào dưa chua']
  },
  {
    title: 'MENU VỊT TRỜI',
    subtitle: 'Vịt trời tự nhiên 5 món thơm ngọt',
    items: ['1. Tiết canh vịt trời', '2. Lòng xào giá hẹ', '3. Vịt trời hấp gừng', '4. Vịt trời nấu chao', '5. Vịt trời quay da giòn']
  },
  {
    title: 'MENU LỢN MÁN MẸT',
    subtitle: 'Lợn mán cắp nách 10 món đặc sắc',
    items: ['1. Tiết canh lợn mán', '2. Lòng nhồi đỗ phộng', '3. Cháo lòng', '4. Xào lăn sả ớt', '5. Lợn mán hấp lá mớ', '6. Chao dầu', '7. Tiết xương xông', '8. Nướng riềng mẻ', '9. Nhựa mận + Bánh mì', '10. Canh xương măng + Bún']
  },
  {
    title: 'MENU BÊ TẢNG',
    subtitle: 'Bê tươi Nam Định 7 món đậm đà',
    items: ['1. Bê tái chanh', '2. Bê nướng tảng nguyên miếng', '3. Bê xào lăn', '4. Bê cháy tỏi', '5. Bê ủ muối thảo mộc', '6. Bê hầm vang đỏ + Bánh mì', '7. Bê nhúng me chua ngọt']
  }
];

const KIDS_MENUS = [
  {
    code: 'COMBO 1',
    note: 'Dành cho học sinh cấp 1',
    price: '130.000 VNĐ / suất',
    items: ['Khoai tây chiên giòn', 'Thăn lợn chiên vừng', 'Cánh gà lắc phô mai', 'Thịt xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Cơm cháy sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 2',
    note: 'Dành cho học sinh cấp 1',
    price: '150.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Khoai tây chiên', 'Mực chiên bơ tỏi', 'Đùi gà chiên giòn', 'Sườn nướng BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 3',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '160.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Phô mai chiên giòn', 'Xúc xích lắc phô mai', 'Thăn heo chiên xù', 'Cơm cuộn Hàn Quốc', 'Mỳ xào bò hoặc Mỳ Ý sốt bò bằm', 'Cánh gà chiên mắm / chiên giòn', 'Tráng miệng: Bánh tuyết hoặc Caramel', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 4',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '180.000 VNĐ / suất',
    items: ['Nem chua rán', 'Khoai tây chiên lắc phô mai', 'Sườn rang muối hoặc Sườn nướng thảo mộc', 'Xúc xích sốt phô mai bơ tỏi', 'Gà xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm hoặc Mỳ xào', 'Tráng miệng: Kem Caramel', 'Nước ngọt: Coca hoặc Nước cam lon']
  },
  {
    code: 'COMBO 5',
    note: 'Dành cho học sinh cấp 1 & 2',
    price: '190.000 VNĐ / suất',
    items: ['Ngô chiên bơ', 'Khoai tây chiên phô mai', 'Pizza Hải sản cỡ vừa', 'Gà chiên lắc phô mai', 'Mỳ Ý sốt bò bằm Bolognese', 'Bánh ngọt tráng miệng', 'Nước ép trái cây / Nước ngọt lon']
  }
];

// MENU CHỌN MÓN STRUCTURED INTO 3 MAIN SECTIONS FOR EASY READING
const ALACARTE_3_SECTIONS = [
  {
    sectionTitle: 'I. KHAI VỊ & SALAD',
    sectionDesc: 'Các món súp nóng hổi, salad và nộm khai vị tinh tế',
    icon: 'soup_kitchen',
    groups: [
      {
        subTitle: 'Súp Khai Vị Bổ Dưỡng',
        dishes: [
          'Súp gà ngô nấm (bát tô)', 'Súp gà nấm đông trùng (bát tô)', 'Súp gà Hoàng Kim (bát tô)', 'Súp gà hải sâm (bát tô)', 'Súp dê bát bảo (bát tô)', 'Súp dê nấm tươi (bát tô)', 'Súp bò nấm tươi (bát tô)', 'Súp cua gỡ nấm tuyết (bát tô)', 'Súp cua gỡ rong biển (bát tô)', 'Súp cua gỡ măng tây (bát tô)', 'Súp nấm cua gỡ (bát tô)', 'Súp cua gỡ thảo mộc (MỚI)', 'Súp nấm Bạch Ngọc (bát tô)', 'Súp tôm nấm (bát tô)', 'Súp tôm bí đỏ (bát tô)', 'Súp lươn bát bảo (bát tô)', 'Súp bào ngư nấm đông trùng (bát tô)', 'Súp bào ngư nấm đông cô', 'Súp gà yến sâm (bát tô)'
        ]
      },
      {
        subTitle: 'Salad & Nộm Tươi Mát',
        dishes: [
          'Salad rau xanh bắp bò muối (đĩa)', 'Salad trứng cá hồi (đĩa)', 'Salad cá hồi chiên giòn (đĩa)', 'Salad lườn ngỗng xông khói (đĩa)', 'Salad rau mầm (đĩa)', 'Salad cá ngừ (đĩa)', 'Salad rau má bắp bò (đĩa)', 'Nộm bắp bò hoa chuối (đĩa)', 'Nộm bò nướng cay (đĩa)', 'Nộm miến hải sản sốt Thái (đĩa)', 'Nộm hải sản sốt Thái (đĩa)', 'Nộm gà hoa chuối (đĩa)', 'Nộm cổ hũ dừa tôm thịt (đĩa)', 'Nộm sứa hoa chuối (đĩa)', 'Nộm bắp bò rau tiến vua (đĩa)', 'Nộm rau tiến vua tai heo (đĩa)'
        ]
      }
    ]
  },
  {
    sectionTitle: 'II. MÓN CHÍNH & LẨU BẢO HẢO',
    sectionDesc: 'Đặc sản Hải sản, Thịt Bò - Bê - Dê - Lợn mán, Canh xào và Lẩu tươi nóng',
    icon: 'flatware',
    groups: [
      {
        subTitle: 'Đặc Sản Cá & Ba Ba Sông',
        dishes: [
          'Cá lăng chiên riềng mẻ (đĩa)', 'Cá lăng nướng dân tộc (đĩa)', 'Cá lăng om chuối đậu (nồi)', 'Cá lăng hấp Hồng Kông nguyên con', 'Cá quả nướng mắm ớt (con)', 'Cá quả hấp Thái (con)', 'Cá trắm hấp mẻ (đĩa)', 'Ba ba rang muối hột (con)', 'Ba ba om chuối đậu + Bún (nồi)', 'Ba ba xào gừng tươi (đĩa)', 'Ba ba nướng lá lốt (đĩa)'
        ]
      },
      {
        subTitle: 'Các Món Bò, Bê & Dê Núi',
        dishes: [
          'Bò xào lúc lắc hạnh nhân (đĩa)', 'Bò sốt tiêu đen + Bánh bao chiên (đĩa)', 'Bắp bò xào cổ hũ dừa (đĩa)', 'Bê tái chanh Nam Định (đĩa)', 'Bê nướng tảng nguyên miếng (đĩa)', 'Bê xào lăn sả ớt (đĩa)', 'Bê cháy tỏi (đĩa)', 'Bê ủ muối thảo mộc (đĩa)', 'Bê hầm vang đỏ + Bánh mì (đĩa)', 'Dê chiên riềng (đĩa)', 'Dê hấp lá tía tô (đĩa)', 'Dê nướng tảng mạ vàng (đĩa)', 'Dê tái chanh (đĩa)'
        ]
      },
      {
        subTitle: 'Tôm, Bề Bề, Ếch & Chân Giò / Sườn',
        dishes: [
          'Tôm thẻ 6 hoa chiên giòn (đĩa)', 'Tôm thẻ chiên hạnh nhân (đĩa)', 'Tôm sú bỏ lò phô mai Pháp (đĩa)', 'Tôm chiên hoàng kim trứng muối (đĩa)', 'Bề bề rang muối hột (đĩa)', 'Bề bề hấp sả ớt (đĩa)', 'Hải sản xào sốt X.O (đĩa)', 'Ếch rang muối thảo mộc (đĩa)', 'Ếch xào măng củ (đĩa)', 'Chân giò hầm sen nấm (đĩa)', 'Chân giò nướng giòn da (đĩa)', 'Sườn nướng sốt BBQ (đĩa)', 'Sườn rang muối (đĩa)'
        ]
      },
      {
        subTitle: 'Canh, Xào & Các Loại Lẩu Tươi',
        dishes: [
          'Canh măng mọc (tô)', 'Canh mọc hải sản (tô)', 'Rau củ luộc chấm kho quẹt (đĩa)', 'Rau xào theo mùa (đĩa)', 'Măng tây xào tỏi (đĩa)', 'Lẩu cá lăng măng chua (nồi)', 'Lẩu hải sản thập cẩm (nồi)', 'Lẩu riêu cua bắp bò (nồi)', 'Lẩu dê núi tía tô (nồi)'
        ]
      }
    ]
  },
  {
    sectionTitle: 'III. TRÁNG MIỆNG',
    sectionDesc: 'Hoa quả tươi theo mùa, bánh ngọt và kem chè tráng miệng thanh mát',
    icon: 'icecream',
    groups: [
      {
        subTitle: 'Hoa Quả Tươi & Món Ngọt',
        dishes: [
          'Bưởi da xanh (đĩa)', 'Nho Mỹ nhập khẩu (đĩa)', 'Nho xanh nhập khẩu (đĩa)', 'Cam Canh ngọt (đĩa)', 'Chuối ngự Nam Định (đĩa)', 'Hoa quả tươi theo mùa (đĩa)', 'Sữa chua nhà làm (10 hộp)', 'Kem Caramel (10 hộp)', 'Bánh tuyết Mochi (10 chiếc)'
        ]
      }
    ]
  }
];

const DRINK_PRICES_IMAGE4 = [
  { stt: 1, name: 'Coca', unitPrice: '15.000/lon' },
  { stt: 2, name: 'Nước cam', unitPrice: '12.000/lon' },
  { stt: 3, name: '7 up', unitPrice: '12.000/lon' },
  { stt: 4, name: 'Bò húc', unitPrice: '18.000/lon' },
  { stt: 5, name: 'Rượu ngâm', unitPrice: '120.000/lít' },
  { stt: 6, name: 'Dasani', unitPrice: '10.000/chai' },
  { stt: 7, name: 'Vodka đen', unitPrice: '230.000/chai' },
  { stt: 8, name: 'Vodka xanh', unitPrice: '120.000/chai' },
  { stt: 9, name: 'Vodka men', unitPrice: '110.000/chai' },
  { stt: 10, name: 'Heineken', unitPrice: '30.000/chai' },
  { stt: 11, name: 'Sài gòn lùn', unitPrice: '20.000/chai' },
  { stt: 12, name: 'Tiger', unitPrice: '25.000/chai' },
  { stt: 13, name: 'Rượu mạnh', unitPrice: 'Liên hệ' },
  { stt: 14, name: 'Rượu vang', unitPrice: 'Liên hệ' }
];

const BRING_DRINK_FEES = [
  { item: 'Rượu ngâm', fee: '30.000/lít' },
  { item: 'Rượu vodka', fee: '70.000/chai' },
  { item: 'Rượu vang', fee: '150.000/chai' },
  { item: 'Rượu mạnh', fee: '200.000/chai' },
  { item: 'Bia, nước ngọt, nước lọc', fee: '30.000/người' }
];

function MenuContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState('SET_TIEC');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);

  useEffect(() => {
    if (tabParam && MENU_CATEGORIES.some(c => c.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const toggleSelectDish = (dishName) => {
    if (selectedDishes.includes(dishName)) {
      setSelectedDishes(selectedDishes.filter(d => d !== dishName));
    } else {
      setSelectedDishes([...selectedDishes, dishName]);
    }
  };

  const handleShareZalo = () => {
    const text = `Họ tên khách: [Tên Khách]\nBẢN NHÁP THỰC ĐƠN ĐÃ CHỌN TẠI GOLDEN PALACE (${selectedDishes.length} món):\n` + 
      selectedDishes.map((d, i) => `${i + 1}. ${d}`).join('\n') + 
      `\n\nNhờ chuyên viên Golden Palace kiểm tra thời giá và báo giá chi tiết giúp em!`;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép bản nháp thực đơn! Bạn có thể dán (Paste) để gửi trực tiếp qua Zalo cho chuyên viên.');
    window.open('https://zalo.me/02286595959', '_blank');
  };

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col pt-24 pb-28">
      
      {/* Banner Title */}
      <section className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <span className="text-[#a66a3a] uppercase tracking-[0.25em] text-xs font-bold whitespace-nowrap">
          Ẩm Thực Đỉnh Cao Golden Palace
        </span>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-3">
          Thực Đơn Tiệc & Bảng Giá Chính Thức
        </h1>
        <p className="text-gray-600 font-light text-sm max-w-3xl mx-auto leading-relaxed">
          Khám phá trọn bộ 5 danh mục thực đơn từ các Set Cỗ Tiệc Cưới tinh tế, Menu Chuyên Món Đặc Sản, Combo Trẻ Em Hè Rực Rỡ, Menu Chọn Món (Chia 3 Phần Khai Vị, Món Chính & Tráng Miệng) đến Bảng Giá Đồ Uống & Phí Mang Đồ Vào Nhà Hàng.
        </p>
      </section>

      {/* 5 CATEGORY TABS SELECTOR */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white p-3 rounded-2xl shadow-xl border border-[#e3a638]/30">
          {MENU_CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-3.5 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#1c1917] via-[#2a2419] to-[#0d0d0d] text-white shadow-lg border border-[#e3a638]' 
                    : 'hover:bg-amber-50/60 text-gray-700'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl mb-1 ${isActive ? 'text-[#e3a638]' : 'text-[#a66a3a]'}`}>
                  {cat.icon}
                </span>
                <span className="font-playfair font-semibold text-xs leading-tight mb-1">{cat.label}</span>
                <span className={`text-[10px] font-light ${isActive ? 'text-amber-200/80' : 'text-gray-400'}`}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TAB 1: SET MENU TIỆC CƯỚI & HỘI NGHỊ */}
      {activeTab === 'SET_TIEC' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-900">Danh Sách 6 Set Cỗ Tiệc Cưới & Sự Kiện Mẫu</h2>
            <p className="text-gray-500 text-xs font-light mt-1">Liệt kê đầy đủ 12 món ăn được phối hợp tinh tế giữa Khai vị, Món chính và Tráng miệng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SET_MENUS.map((menu, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#e3a638]/30 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-[#e3a638] transition-all">
                <div className="bg-gradient-to-r from-gray-900 via-amber-950 to-gray-900 text-white p-5 border-b border-[#e3a638]/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#e3a638] font-bold block">{menu.bestFor}</span>
                      <h3 className="text-xl font-playfair font-bold text-white mt-0.5">{menu.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#e3a638] font-playfair block whitespace-nowrap">{menu.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-2.5 flex-grow">
                  {menu.dishes.map((dish, dIdx) => (
                    <div key={dIdx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-800">{dIdx + 1}. {dish.name}</span>
                      <span className="text-[10px] font-semibold text-[#a66a3a] bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0 ml-2 whitespace-nowrap">{dish.type}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#fcf9f2] border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-light whitespace-nowrap">Mâm 10 khách chuẩn chỉnh</span>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[#1c1917] text-amber-300 hover:bg-black text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Đặt Thực Đơn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: MENU CHUYÊN MÓN ĐẶC SẢN */}
      {activeTab === 'CHUYEN_MON' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-900">8 Bộ Menu Chuyên Món Đặc Sản</h2>
            <p className="text-gray-500 text-xs font-light mt-1">Cầy hương, Mòng két, Ba ba, Dúi, Vịt trời, Lợn mán, Bê tảng & Cá lăng sông</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALTY_MENUS.map((sp, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:border-[#e3a638] transition-all">
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-[#a66a3a] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-xl">workspace_premium</span>
                  </div>
                  <h3 className="text-lg font-playfair font-bold text-gray-900 mb-1">{sp.title}</h3>
                  <p className="text-xs text-[#a66a3a] font-medium mb-4">{sp.subtitle}</p>

                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    {sp.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2">
                        <span className="text-[#e3a638] font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                  >
                    Đặt Tiệc Đặc Sản
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: MENU TRẺ EM & HỌC SINH */}
      {activeTab === 'TRE_EM' && (
        <section className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-gray-900 text-white rounded-3xl p-8 shadow-2xl border border-[#e3a638]/40 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest inline-block mb-2 whitespace-nowrap">
                ☀️ CHƯƠNG TRÌNH MENU HÈ RỰC RỠ
              </span>
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">Ưu Đãi Đặc Biệt Cho Học Sinh & Thầy Cô</h2>
              <p className="text-amber-100/90 text-xs font-light max-w-2xl leading-relaxed">
                • Menu đã được giảm <strong>10%</strong> trực tiếp so với giá gốc.<br />
                • Giảm <strong>50%</strong> Phí dịch vụ sân khấu bao gồm: Âm thanh, Ánh sáng & Màn hình LED trình chiếu.<br />
                • Áp dụng từ 1/5 - 31/7 cho tiệc trẻ em & hội khóa học sinh.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
            >
              Đặt Tiệc Hè Rực RỠ ➔
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KIDS_MENUS.map((kids, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg flex flex-col justify-between hover:border-[#e3a638] transition-all">
                <div>
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <div>
                      <h3 className="font-playfair font-bold text-gray-900 text-lg">{kids.code}</h3>
                      <p className="text-xs text-[#a66a3a] font-medium mt-0.5">{kids.note}</p>
                    </div>
                    
                    <span className="bg-amber-100/90 border border-amber-300/60 text-[#a66a3a] font-bold text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                      {kids.price}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-4 mt-3">
                    {kids.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#e3a638] text-sm flex-shrink-0">check_circle</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 bg-gray-900 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Chọn Combo Này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: MENU CHỌN MÓN (DIVIDED INTO 3 MAIN SECTIONS: KHAI VỊ, MÓN CHÍNH, TRÁNG MIỆNG) */}
      {activeTab === 'ALACARTE' && (
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          
          {/* Prominent Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-md flex items-start gap-4 text-amber-900">
            <span className="material-symbols-outlined text-amber-700 text-3xl flex-shrink-0 mt-1">info</span>
            <div>
              <h3 className="font-playfair font-bold text-lg text-amber-950 mb-1">Lưu ý về Thực Đơn Chọn Món Tươi Sống:</h3>
              <p className="text-xs text-amber-900/90 font-light leading-relaxed">
                • <strong>Món ăn thực phẩm tươi sống được nhập mới hằng ngày, giá thay đổi theo thời giá thị trường.</strong> Do đó danh mục bên dưới hoàn toàn không niêm yết giá cố định.<br />
                • Thực đơn được chia thành <strong>3 phần chính: Khai vị, Món chính và Tráng miệng</strong>. Quý khách vui lòng <strong>tích chọn (✔) các món ăn ưa thích</strong> để tạo Bản Nháp Thực Đơn gửi trực tiếp cho chuyên viên báo giá.
              </p>
            </div>
          </div>

          {/* RENDER 3 MAIN SECTIONS */}
          <div className="space-y-12">
            {ALACARTE_3_SECTIONS.map((sec, secIdx) => (
              <div key={secIdx} className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
                
                {/* SECTION HEADER */}
                <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-[#e3a638]/40">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#a66a3a] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-2xl">{sec.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-gray-900">{sec.sectionTitle}</h2>
                    <p className="text-xs text-gray-500 font-light mt-0.5">{sec.sectionDesc}</p>
                  </div>
                </div>

                {/* SUB GROUPS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {sec.groups.map((grp, grpIdx) => (
                    <div key={grpIdx} className="bg-[#fcf9f2] rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-playfair font-bold text-gray-900 pb-2.5 border-b border-[#e3a638]/30 flex items-center gap-2">
                          <span className="text-[#e3a638] text-sm">✨</span> {grp.subTitle}
                        </h3>
                        
                        <div className="mt-4 space-y-2">
                          {grp.dishes.map((dish, dIdx) => {
                            const isChecked = selectedDishes.includes(dish);
                            return (
                              <div 
                                key={dIdx}
                                onClick={() => toggleSelectDish(dish)}
                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                  isChecked 
                                    ? 'bg-amber-100/80 border-[#e3a638] font-semibold text-gray-900 shadow-xs' 
                                    : 'bg-white border-gray-200/80 text-gray-700 hover:border-amber-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 pr-2">
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="accent-[#e3a638] w-4 h-4 cursor-pointer"
                                  />
                                  <span>{dish}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${isChecked ? 'bg-[#e3a638] text-white font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                  {isChecked ? 'Đã chọn' : '+ Chọn món'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* FLOATING DRAFT MENU BAR WHEN DISHES ARE SELECTED */}
          {selectedDishes.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1c1917] border-2 border-[#e3a638] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 max-w-xl w-full">
              <div className="flex-grow">
                <span className="text-[10px] uppercase tracking-widest text-[#e3a638] font-bold block">Bản Nháp Thực Đơn</span>
                <span className="text-sm font-semibold">Đã chọn <strong className="text-[#e3a638] font-bold text-base">{selectedDishes.length}</strong> món ăn</span>
              </div>
              
              <button
                onClick={() => setShowDraftModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                Xem Bản Nháp & Gửi Zalo
              </button>
            </div>
          )}

        </section>
      )}

      {/* TAB 5: MENU ĐỒ UỐNG STRICTLY MATCHING USER'S IMAGE 4 & EXACT USER NOTE TEXT */}
      {activeTab === 'DO_UONG' && (
        <section className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-900">Bảng Giá Đồ Uống & Phí Mang Đồ Vào Nhà Hàng</h2>
            <p className="text-gray-500 text-xs font-light mt-1">Bảng giá niêm yết chính thức áp dụng tại Golden Palace Nam Định</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* BẢNG 1: ĐỒ UỐNG BÁN TẠI NHÀ HÀNG */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3a638]/40">
                <span className="text-[#e3a638] text-xl">🍾</span>
                <h3 className="text-xl font-playfair font-bold text-gray-900">Đồ Uống Bán Tại Nhà Hàng</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="bg-gray-900 text-amber-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-lg w-12 text-center">STT</th>
                      <th className="p-3">Tên Món Ăn / Đồ Uống</th>
                      <th className="p-3 text-right rounded-r-lg">Đơn Giá (ĐVT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DRINK_PRICES_IMAGE4.map((row) => (
                      <tr key={row.stt} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3 text-center text-gray-400 font-mono text-[11px]">{row.stt}</td>
                        <td className="p-3 font-semibold text-gray-900">{row.name}</td>
                        <td className="p-3 text-right font-bold text-[#a66a3a] whitespace-nowrap">{row.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BẢNG 2: PHÍ MANG ĐỒ UỐNG VÀO NHÀ HÀNG & EXACT USER NOTE TEXT */}
            <div className="lg:col-span-5 bg-gradient-to-b from-amber-950 via-gray-900 to-black text-white rounded-2xl border-2 border-[#e3a638]/60 p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3a638]/40">
                  <span className="text-[#e3a638] text-xl">⚠️</span>
                  <h3 className="text-xl font-playfair font-bold text-[#e3a638]">Phí Mang Đồ Uống Vào Nhà Hàng</h3>
                </div>
                
                <p className="text-xs text-amber-200/80 font-light mb-4 leading-relaxed">
                  Quy định áp dụng đối với quý khách mang đồ uống từ bên ngoài vào sử dụng tại sảnh nhà hàng:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium">
                    <thead className="bg-[#e3a638]/20 text-[#e3a638] uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-lg">Loại Đồ Uống</th>
                        <th className="p-3 text-right rounded-r-lg">Mức Phí Quy Định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {BRING_DRINK_FEES.map((feeRow, fIdx) => (
                        <tr key={fIdx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-gray-200 font-medium">{feeRow.item}</td>
                          <td className="p-3 text-right font-bold text-amber-300 whitespace-nowrap">{feeRow.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EXACT NOTE TEXT REQUESTED BY USER IN IMAGE 1 */}
              <div className="mt-6 p-4 rounded-xl bg-white/10 border border-[#e3a638]/40 text-xs text-amber-100 leading-relaxed font-light">
                💡 <em>Ghi chú: Phí đã bao gồm đá lạnh, ly, cốc, nậm sứ đựng rượu mạnh hải cao cấp, nhân viên phục vụ.</em>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* DRAFT MENU MODAL FOR ALACARTE */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-montserrat">
          <div className="bg-white border border-gray-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-gray-900 text-white p-5 flex justify-between items-center border-b border-gray-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#e3a638] font-bold">Bản Nháp Thực Đơn Đã Chọn</span>
                <h3 className="text-xl font-playfair font-bold text-white mt-0.5">Danh Sách {selectedDishes.length} Món Ăn</h3>
              </div>
              <button onClick={() => setShowDraftModal(false)} className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
              {selectedDishes.map((dish, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-lg bg-[#fcf9f2] border border-[#e3a638]/20">
                  <span className="font-semibold text-gray-900">{idx + 1}. {dish}</span>
                  <button onClick={() => toggleSelectDish(dish)} className="text-red-600 hover:text-red-700 text-[11px] font-medium cursor-pointer">Xóa</button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center gap-3">
              <button onClick={() => setSelectedDishes([])} className="text-xs text-gray-500 hover:text-red-600 font-medium cursor-pointer">
                Xóa tất cả
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowDraftModal(false)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                  Đóng
                </button>
                <button onClick={handleShareZalo} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-md cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                  <span className="material-symbols-outlined text-base">share</span>
                  Sao Chép & Gửi Zalo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <BookingConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function MenuShowcasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center text-amber-900">Đang tải thực đơn...</div>}>
      <MenuContent />
    </Suspense>
  );
}
