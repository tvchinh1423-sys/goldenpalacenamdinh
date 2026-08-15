'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTA from '@/components/layout/FloatingCTA';
import BookingConsultationModal from '@/components/layout/BookingConsultationModal';

const MENU_CATEGORIES = [
  { id: 'SET_TIEC', label: 'Set Menu Tiệc Cưới & Hội Nghị', icon: 'restaurant_menu', count: '6 Set cỗ mẫu' },
  { id: 'CHUYEN_MON', label: 'Menu Chuyên Món Đặc Sản', icon: 'workspace_premium', count: '8 Menu đặc sản' },
  { id: 'TRE_EM', label: 'Menu Trẻ Em & Học Sinh', icon: 'child_care', count: '5 Combo ưu đãi' },
  { id: 'ALACARTE', label: 'Menu Chọn Món A la Carte', icon: 'menu_book', count: 'Món lẻ tự chọn' },
  { id: 'DO_UONG', label: 'Menu Đồ Uống & Rượu', icon: 'wine_bar', count: 'Rượu & Thức uống' },
];

const SET_MENUS = [
  {
    title: 'SET MENU TIỆC 1',
    price: '320.000 VNĐ',
    unit: '/ 1 Khách',
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
    price: '340.000 VNĐ',
    unit: '/ 1 Khách',
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
    price: '345.000 VNĐ',
    unit: '/ 1 Khách',
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
    price: '375.000 VNĐ',
    unit: '/ 1 Khách',
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
    price: '395.000 VNĐ',
    unit: '/ 1 Khách',
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
    price: '415.000 VNĐ',
    unit: '/ 1 Khách',
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
  { combo: 'COMBO 1 (Dành cho Cấp 1)', price: '130.000 VNĐ / suất', items: ['Khoai tây chiên giòn', 'Thăn lợn chiên vừng', 'Cánh gà lắc phô mai', 'Thịt xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Cơm cháy sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon'] },
  { combo: 'COMBO 2 (Dành cho Cấp 1)', price: '150.000 VNĐ / suất', items: ['Ngô chiên bơ', 'Khoai tây chiên', 'Mực chiên bơ tỏi', 'Đùi gà chiên giòn', 'Sườn nướng BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm', 'Nước ngọt: Coca hoặc Nước cam lon'] },
  { combo: 'COMBO 3 (Dành cho Cấp 1 + 2)', price: '160.000 VNĐ / suất', items: ['Ngô chiên bơ', 'Phô mai chiên giòn', 'Xúc xích lắc phô mai', 'Thăn heo chiên xù', 'Cơm cuộn Hàn Quốc', 'Mỳ xào bò hoặc Mỳ Ý sốt bò bằm', 'Cánh gà chiên mắm / chiên giòn', 'Tráng miệng: Bánh tuyết hoặc Caramel', 'Nước ngọt: Coca hoặc Nước cam lon'] },
  { combo: 'COMBO 4 (Dành cho Cấp 1 + 2)', price: '180.000 VNĐ / suất', items: ['Nem chua rán', 'Khoai tây chiên lắc phô mai', 'Sườn rang muối hoặc Sườn nướng thảo mộc', 'Xúc xích sốt phô mai bơ tỏi', 'Gà xiên nướng sốt BBQ', 'Cơm rang thập cẩm', 'Mỳ Ý sốt bò bằm hoặc Mỳ xào', 'Tráng miệng: Kem Caramel', 'Nước ngọt: Coca hoặc Nước cam lon'] },
  { combo: 'COMBO 5 (Hè Rực Rỡ VIP)', price: '190.000 VNĐ / suất', items: ['Ngô chiên bơ', 'Khoai tây chiên phô mai', 'Pizza Hải sản cỡ vừa', 'Gà chiên lắc phô mai', 'Mỳ Ý sốt bò bằm Bolognese', 'Bánh ngọt tráng miệng', 'Nước ép trái cây / Nước ngọt lon'] },
];

const ALACARTE_ITEMS = [
  { cat: 'Món Khai Vị', items: ['Súp hải sản rong biển - 60k', 'Súp tôm nấm - 65k', 'Salad rau má bắp bò - 90k', 'Salad lườn ngỗng xông khói - 110k', 'Nộm cổ hũ dừa tôm thịt - 120k', 'Nem hải sản chiên giòn - 120k'] },
  { cat: 'Hải Sản Tươi Sống', items: ['Cá lăng chiên riềng / om chuối đậu - 350k/đĩa', 'Cá quả hấp Thái / Nướng - 280k/con', 'Tôm thẻ 6 hoa chiên giòn - 220k/đĩa', 'Mực một nắng xào cần Mỹ - 250k/đĩa', 'Tôm sú bỏ lò phô mai - 320k/đĩa', 'Hải sản xào sốt X.O - 260k/đĩa'] },
  { cat: 'Thịt Bò / Bê / Dê', items: ['Bò xào lúc lắc hạnh nhân - 220k', 'Bò sốt tiêu đen + Bánh bao - 240k', 'Bê tái chanh Nam Định - 180k', 'Dê hấp lá tía tô - 250k', 'Dê chiên riềng - 250k', 'Bắp bò xào cổ hũ dừa - 200k'] },
  { cat: 'Món Gà / Lợn Mán', items: ['Gà rút xương sốt xì dầu - 220k', 'Gà hấp lá chanh - 200k', 'Gà quay da giòn - 230k', 'Chân giò hầm sen nấm - 190k', 'Thịt lợn mán nướng riềng mẻ - 180k'] },
  { cat: 'Canh / Lẩu & Cơm Xôi', items: ['Canh mọc hải sản - 120k', 'Cá lăng om chuối đậu - 280k', 'Lẩu cá măng chua - 350k', 'Cơm tám thơm - 40k/thố', 'Xôi sen dừa - 80k/đĩa', 'Xôi Hoàng Phố ruốc bông - 90k/đĩa', 'Xôi cốm vò - 90k/đĩa'] }
];

const BEVERAGE_ITEMS = [
  { type: 'Rượu Vang Nhập Khẩu', items: ['Chateau Margot Bordeaux (Pháp) - 1.850.000 VNĐ', 'Chianti Classico Riserva (Ý) - 1.450.000 VNĐ', 'Cabernet Sauvignon Reserve (Chile) - 850.000 VNĐ', 'Vang Nổ Rượu Sâm Panh Chúc Mừng - 450.000 VNĐ'] },
  { type: 'Rượu Truyền Thống Golden Palace', items: ['Rượu Tiết Mật Ba Ba Thượng Hạng - 350.000 VNĐ / hũ', 'Rượu Mông Kê Đặc Sản - 280.000 VNĐ / hũ', 'Rượu Nếp Hương Thảo Mộc - 180.000 VNĐ / hũ'] },
  { type: 'Bia & Nước Ngọt', items: ['Bia Heineken Silver (Thùng 24 lon) - 480.000 VNĐ', 'Bia Tiger Crystal (Thùng 24 lon) - 440.000 VNĐ', 'Bia Sài Gòn Special - 380.000 VNĐ', 'Coca Cola / Pepsi / 7Up (Lon) - 20.000 VNĐ', 'Nước suối chai thủy tinh - 15.000 VNĐ'] },
  { type: 'Nước Ép & Cocktail Bar Lounge', items: ['Nước ép Cam tươi nguyên chất - 45.000 VNĐ', 'Nước ép Dưa hấu / Chanh dây - 40.000 VNĐ', 'Cocktail Golden Sunset - 85.000 VNĐ', 'Mocktail Trái cây nhiệt đới - 65.000 VNĐ'] }
];

export default function MenuShowcasePage() {
  const [activeTab, setActiveTab] = useState('SET_TIEC');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-28">
        
        {/* Banner Title */}
        <section className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <span className="text-[#a66a3a] uppercase tracking-[0.25em] text-xs font-bold">
            Ẩm Thực Đỉnh Cao Golden Palace
          </span>
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-gray-900 mt-2 mb-4">
            Thực Đơn Tiệc & Đặc Sản Hoàng Gia
          </h1>
          <p className="text-gray-600 font-light text-sm max-w-3xl mx-auto leading-relaxed">
            Khám phá 5 bộ thực đơn phong phú từ các Set Cỗ Tiệc Cưới tinh tế, Menu Chuyên Món Đặc Sản thượng hạng, Combo Trẻ Em Hè Rực Rỡ đến Thực Đơn Đồ Uống & Rượu Nhập Khẩu.
          </p>
        </section>

        {/* 5 CATEGORY TABS SELECTOR */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white p-3 rounded-2xl shadow-xl border border-[#e3a638]/30">
            {MENU_CATEGORIES.map(cat => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
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

        {/* CONTENT TAB 1: SET MENU TIỆC CƯỚI & HỘI NGHỊ */}
        {activeTab === 'SET_TIEC' && (
          <section className="max-w-7xl mx-auto px-6 animate-fade-in space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900">Danh Sách 6 Set Cỗ Tiệc Cưới & Sự Kiện</h2>
              <p className="text-gray-500 text-xs font-light mt-1">Đầy đủ 12 món ăn được phối hợp hài hòa giữa Khai vị, Món chính và Tráng miệng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SET_MENUS.map((menu, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#e3a638]/30 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-[#e3a638] transition-all">
                  
                  {/* Header card */}
                  <div className="bg-gradient-to-r from-gray-900 via-amber-950 to-gray-900 text-white p-5 border-b border-[#e3a638]/40">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#e3a638] font-bold block">{menu.bestFor}</span>
                        <h3 className="text-xl font-playfair font-bold text-white mt-0.5">{menu.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#e3a638] font-playfair block">{menu.price}</span>
                        <span className="text-[10px] text-gray-300 font-light">{menu.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dishes List */}
                  <div className="p-6 space-y-2.5 flex-grow">
                    {menu.dishes.map((dish, dIdx) => (
                      <div key={dIdx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-800">{dIdx + 1}. {dish.name}</span>
                        <span className="text-[10px] font-semibold text-[#a66a3a] bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{dish.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-[#fcf9f2] border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[11px] text-gray-500 font-light">Mâm 10 khách chuẩn chỉnh</span>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-[#1c1917] text-amber-300 hover:bg-black text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Đặt Thực Đơn
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTENT TAB 2: MENU CHUYÊN MÓN ĐẶC SẢN */}
        {activeTab === 'CHUYEN_MON' && (
          <section className="max-w-7xl mx-auto px-6 animate-fade-in space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900">8 Bộ Menu Chuyên Món Đặc Sản Độc Đáo</h2>
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
                      className="w-full py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Đặt Tiệc Đặc Sản
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTENT TAB 3: MENU TRẺ EM & HỌC SINH */}
        {activeTab === 'TRE_EM' && (
          <section className="max-w-7xl mx-auto px-6 animate-fade-in space-y-8">
            <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-gray-900 text-white rounded-3xl p-8 shadow-2xl border border-[#e3a638]/40 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest inline-block mb-2">
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
                className="px-8 py-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:scale-105 transition-transform whitespace-nowrap cursor-pointer"
              >
                Đặt Tiệc Hè Rực Rỡ ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {KIDS_MENUS.map((kids, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg flex flex-col justify-between hover:border-[#e3a638] transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-playfair font-bold text-gray-900 text-base">{kids.combo}</h3>
                      <span className="text-sm font-bold text-[#a66a3a] font-playfair bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">{kids.price}</span>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      {kids.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#e3a638] text-sm">check_circle</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2.5 bg-gray-900 text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Chọn Combo Này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTENT TAB 4: MENU CHỌN MÓN A LA CARTE */}
        {activeTab === 'ALACARTE' && (
          <section className="max-w-7xl mx-auto px-6 animate-fade-in space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900">Thực Đơn Tự Chọn A la Carte</h2>
              <p className="text-gray-500 text-xs font-light mt-1">Chủ động lựa chọn món lẻ yêu thích để phối hợp mâm cỗ riêng theo đúng gu ẩm thực</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALACARTE_ITEMS.map((ala, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
                  <h3 className="text-lg font-playfair font-bold text-gray-900 pb-3 border-b border-[#e3a638]/30 flex items-center gap-2">
                    <span className="text-[#e3a638]">🍽️</span> {ala.cat}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {ala.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-0">
                        <span className="font-medium text-gray-800">{item.split(' - ')[0]}</span>
                        <span className="font-bold text-[#a66a3a] bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTENT TAB 5: MENU ĐỒ UỐNG & RƯỢU */}
        {activeTab === 'DO_UONG' && (
          <section className="max-w-7xl mx-auto px-6 animate-fade-in space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-900">Thực Đơn Đồ Uống & Rượu Nhập Khẩu</h2>
              <p className="text-gray-500 text-xs font-light mt-1">Rượu vang Pháp, Ý, Chile, Rượu truyền thống Golden Palace & Thức uống Bar Lounge</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BEVERAGE_ITEMS.map((bev, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#e3a638]/30 p-6 shadow-xl">
                  <h3 className="text-xl font-playfair font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-[#e3a638]">🥂</span> {bev.type}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {bev.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-50 last:border-0">
                        <span className="font-medium text-gray-800">{item.split(' - ')[0]}</span>
                        <span className="font-bold text-[#a66a3a] bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
      <FloatingCTA />

      <BookingConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
