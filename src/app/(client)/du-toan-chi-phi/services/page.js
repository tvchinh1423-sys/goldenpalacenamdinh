'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

const MIN_BUDGET_PER_TABLE = 3200000; // Minimum limit 3.200.000 VNĐ / mâm

// Advanced / Add-on Services with photos and illustrative videos
const ADDON_SERVICES_WITH_MEDIA = [
  {
    id: 'addon-mc',
    name: 'MC Tiệc Cưới Chuyên Nghiệp',
    priceText: '1.500.000 VNĐ / Buổi',
    numericPrice: 1500000,
    desc: 'MC lịch thiệp, giọng phát âm chuẩn, dẫn dắt kịch bản lễ cưới lãng mạn và khuấy động không khí.',
    image: '/images/hd-venues/tang-3-hd-2.jpg',
    badge: 'Được lựa chọn nhiều nhất'
  },
  {
    id: 'addon-liveband',
    name: 'Nhóm Nhạc Liveband / Acoustic',
    priceText: '3.500.000 VNĐ / Tiệc',
    numericPrice: 3500000,
    desc: 'Ban nhạc 4 thành viên (Ca sĩ, Guitar, Keyboard, Cajon) biểu diễn trực tiếp đón khách và trong tiệc.',
    image: '/images/hd-venues/tang-2-hd-3.jpg',
    videoNote: 'Trình diễn nhạc sống Acoustic cao cấp'
  },
  {
    id: 'addon-[#photobooth]',
    name: 'PhotoBooth Chụp Ảnh Lấy Liền',
    priceText: '3.000.000 VNĐ / Tiệc',
    numericPrice: 3000000,
    desc: 'Góc chụp ảnh photobooth in ảnh lấy liền tại chỗ làm quà kỷ niệm độc đáo dành tặng quan khách.',
    image: '/images/hd-venues/quay-bar-hd-7.jpg',
    badge: 'In ảnh lấy ngay'
  },
  {
    id: 'addon-freshflower',
    name: 'Cổng Hoa Tươi Thiết Kế Concept',
    priceText: '4.000.000 VNĐ / Cổng',
    numericPrice: 4000000,
    desc: 'Cổng hoa tươi 100% cắm theo tông màu chủ đạo yêu cầu của cô dâu chú rể.',
    image: '/images/hd-venues/tang-3-hd-4.jpg'
  },
  {
    id: 'addon-car',
    name: 'Xe Rước Dâu Hoàng Gia Luxury',
    priceText: '2.500.000 VNĐ / Chuyến',
    numericPrice: 2500000,
    desc: 'Xe hoa rước dâu Mercedes / BMW trang trí hoa tươi sang trọng đón dâu tại Nam Định.',
    image: '/images/hero-banner.jpg'
  },
  {
    id: 'addon-media',
    name: 'Quay Phim & Chụp Hình Cưới HD',
    priceText: '4.500.000 VNĐ / Tiệc',
    numericPrice: 4500000,
    desc: 'Ê-kíp 2 nhiếp ảnh gia & quay phim ghi lại toàn bộ khoảnh khắc lễ cưới từ đón khách tới tàn tiệc.',
    image: '/images/hd-venues/tang-2-hd-1.jpg'
  }
];

// Beverage Options
const BEVERAGE_PACKAGES = [
  { id: 'bev-hanoi', name: 'Bia Hà Nội (24 lon/thùng)', priceText: '290.000 VNĐ / thùng', unitPrice: 290000 },
  { id: 'bev-heineken', name: 'Bia Heineken (24 lon/thùng)', priceText: '450.000 VNĐ / thùng', unitPrice: 450000 },
  { id: 'bev-soft', name: 'Nước ngọt Coca/Pepsi (24 lon/thùng)', priceText: '220.000 VNĐ / thùng', unitPrice: 220000 },
  { id: 'bev-water', name: 'Nước suối chai (24 chai/thùng)', priceText: '120.000 VNĐ / thùng', unitPrice: 120000 },
];

export default function Step3Services() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, budgetPerTable, selectedAddOns, selectedBeverages } = estimateData;

  const [currentBudget, setCurrentBudget] = useState(budgetPerTable || MIN_BUDGET_PER_TABLE);
  const [selectedAddonIds, setSelectedAddonIds] = useState(selectedAddOns || []);
  const [beverageSelection, setBeverageSelection] = useState(selectedBeverages || {});

  const tableCount = Math.ceil(guestCount / 10);

  // Synchronize budget changes with strict minimum floor
  const handleBudgetChange = (val) => {
    let num = Number(val);
    if (isNaN(num)) num = MIN_BUDGET_PER_TABLE;
    setCurrentBudget(num);
    updateEstimate({ budgetPerTable: Math.max(num, MIN_BUDGET_PER_TABLE) });
  };

  const handleBudgetBlur = () => {
    if (currentBudget < MIN_BUDGET_PER_TABLE) {
      setCurrentBudget(MIN_BUDGET_PER_TABLE);
      updateEstimate({ budgetPerTable: MIN_BUDGET_PER_TABLE });
    }
  };

  const toggleAddon = (id) => {
    let newIds = [];
    if (selectedAddonIds.includes(id)) {
      newIds = selectedAddonIds.filter(item => item !== id);
    } else {
      newIds = [...selectedAddonIds, id];
    }
    setSelectedAddonIds(newIds);
    updateEstimate({ selectedAddOns: newIds });
  };

  const updateBeverageQty = (bevId, qty) => {
    const newBev = { ...beverageSelection, [bevId]: Math.max(0, Number(qty)) };
    setBeverageSelection(newBev);
    updateEstimate({ selectedBeverages: newBev });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-40">
      
      {/* Navigation Sub-header */}
      <div className="bg-white border-b border-gray-200 shadow-xs py-3 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/du-toan-chi-phi/venues" className="flex items-center gap-1 text-[#a66a3a] hover:underline text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Đổi chọn sảnh</span>
          </Link>
          <span className="text-xs uppercase tracking-wider font-bold text-[#a66a3a]">
            Bước 3 / 4: Chọn Thực Đơn, Đồ Uống & Dịch Vụ Nâng Cao
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Bước 3 / 4</span>
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900">
            Thực Đơn, Đồ Uống & Dịch Vụ Nâng Cao
          </h2>
          <p className="text-gray-600 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Chọn ngân sách mâm cỗ tiệc cưới, tùy chọn đồ uống và các dịch vụ bổ sung đi kèm để hoàn thiện dự toán chi phí.
          </p>
        </div>

        {/* SECTION 1: GIỚI THIỆU THỰC ĐƠN & ĐIỀN NGÂN SÁCH MÂM CỖ */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs text-[#a66a3a] uppercase tracking-widest font-bold block mb-0.5">18 Set Menu Tinh Hoa</span>
              <h3 className="text-2xl font-playfair font-bold text-gray-900">1. Chọn Ngân Sách Mâm Cỗ Tiệc Cưới</h3>
            </div>
            <div className="bg-amber-100/80 text-[#a66a3a] px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-300">
              Quy mô: {tableCount} mâm ({guestCount} khách)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Golden Palace sở hữu 18 bộ thực đơn tiệc cưới cao cấp chế biến bởi đội ngũ đầu bếp 5 sao. Mỗi mâm cỗ gồm 10 món ăn tinh hoa kết hợp hài hòa giữa ẩm thực truyền thống Nam Định và phong cách hiện đại.
              </p>
              
              <div className="p-4 rounded-2xl bg-[#fcf9f2] border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#a66a3a]">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Mức ngân sách mâm niêm yết tối thiểu: {formatCurrency(MIN_BUDGET_PER_TABLE)} / mâm</span>
                </div>
                <p className="text-gray-500 text-[11px] font-light">
                  Mức ngân sách tối thiểu tại Golden Palace là 3.200.000 VNĐ / mâm 10 khách. Quý khách có thể tự do tăng ngân sách để nâng cấp các món hải sản & món đặc sắc.
                </p>
              </div>

              {/* NÚT CHỌN NGÂN SÁCH NHANH */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-2">Chọn mức ngân sách mâm gợi ý:</label>
                <div className="flex flex-wrap gap-2">
                  {[3200000, 3800000, 4500000, 6000000].map((amt) => (
                    <button 
                      key={amt}
                      type="button"
                      onClick={() => handleBudgetChange(amt)}
                      className={`py-2 px-4 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        currentBudget === amt 
                          ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-transparent shadow-md' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      {(amt / 1000000).toFixed(1)}M / mâm
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ô NHẬP NGÂN SÁCH CÓ GIỚI HẠN TỐI THIỂU */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1c1917] to-[#2a2419] p-6 rounded-3xl text-white shadow-xl space-y-4">
              <span className="text-[11px] uppercase tracking-widest text-[#e3a638] font-bold block">Ngân Sách Chọn</span>
              
              <div className="relative">
                <input 
                  type="number"
                  min={MIN_BUDGET_PER_TABLE}
                  step="100000"
                  value={currentBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  onBlur={handleBudgetBlur}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 px-4 text-xl font-bold text-white focus:border-[#e3a638] focus:outline-none"
                />
                <span className="absolute right-4 top-4 text-xs font-bold text-[#e3a638]">VNĐ / mâm</span>
              </div>

              {currentBudget < MIN_BUDGET_PER_TABLE && (
                <p className="text-[11px] text-red-400 font-semibold">
                  ⚠️ Ngân sách tối thiểu của nhà hàng là 3.200.000 VNĐ / mâm
                </p>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300">Tổng tiền mâm cỗ ({tableCount} mâm):</span>
                <span className="text-xl font-playfair font-bold text-[#e3a638]">
                  {formatCurrency(Math.max(currentBudget, MIN_BUDGET_PER_TABLE) * tableCount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BẢNG GIÁ ĐỒ UỐNG & PHÍ MANG VÀO (TÙY CHỌN) */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs text-[#a66a3a] uppercase tracking-widest font-bold block mb-0.5">Không bắt buộc</span>
            <h3 className="text-2xl font-playfair font-bold text-gray-900">2. Chọn Đồ Uống Tiệc Cưới (Tùy Chọn)</h3>
            <p className="text-gray-500 text-xs font-light mt-1">
              Đồ uống tính theo số lượng thực tế sử dụng. Khách có thể chọn dịch vụ đồ uống nhà hàng hoặc mang đồ uống ngoài vào.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BEVERAGE_PACKAGES.map(bev => {
              const currentQty = beverageSelection[bev.id] || 0;
              return (
                <div key={bev.id} className="p-4 rounded-2xl border border-gray-200 bg-[#fcf9f2] flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{bev.name}</h4>
                    <span className="text-xs font-bold text-[#a66a3a] block mt-1">{bev.priceText}</span>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => updateBeverageQty(bev.id, currentQty - 1)}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-gray-900">{currentQty} thùng</span>
                    <button 
                      type="button" 
                      onClick={() => updateBeverageQty(bev.id, currentQty + 1)}
                      className="w-7 h-7 rounded-lg bg-[#e3a638] text-white flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-700 text-lg flex-shrink-0 mt-0.5">info</span>
            <div>
              <strong className="block font-bold mb-0.5">Quy định mang đồ uống từ ngoài vào:</strong>
              <span>Khách có thể tự mang rượu/bia từ ngoài vào tiệc. Nhà hàng có áp dụng phí phục vụ ly đá & rửa ly tiêu chuẩn. Chi tiết vui lòng liên hệ Hotline 0228 659 5959.</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: DỊCH VỤ NÂNG CAO KÈM HÌNH ẢNH & VIDEO MINH HỌA */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs text-[#a66a3a] uppercase tracking-widest font-bold block mb-0.5">Minh họa trực quan</span>
            <h3 className="text-2xl font-playfair font-bold text-gray-900">3. Dịch Vụ Nâng Cao & Bổ Sung</h3>
            <p className="text-gray-500 text-xs font-light mt-1">
              Tích chọn các dịch vụ nâng cao để làm lễ cưới thêm hoành tráng và trọn vẹn cảm xúc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADDON_SERVICES_WITH_MEDIA.map(addon => {
              const isSelected = selectedAddonIds.includes(addon.id);
              return (
                <div 
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`rounded-3xl border shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer relative ${
                    isSelected 
                      ? 'border-2 border-[#e3a638] ring-2 ring-[#e3a638]/30 shadow-2xl bg-amber-50/20' 
                      : 'border-gray-200 bg-white hover:border-[#e3a638]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-20 bg-[#e3a638] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Đã Chọn
                    </div>
                  )}

                  {/* Media Thumbnail Header */}
                  <div className="relative h-48 overflow-hidden group">
                    <img src={addon.image} alt={addon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {addon.badge && (
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[#e3a638] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#e3a638]/40">
                        {addon.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold text-[#e3a638] block">{addon.priceText}</span>
                      <h4 className="text-lg font-playfair font-bold text-white leading-snug">{addon.name}</h4>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-grow">
                    <p className="text-xs text-gray-600 font-light leading-relaxed">{addon.desc}</p>
                  </div>

                  {/* Toggle Button */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button 
                      type="button"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-md' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-amber-400'
                      }`}
                    >
                      {isSelected ? '✓ Đã Chọn Dịch Vụ' : '+ Chọn Dịch Vụ Này'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* NÚT SANG BƯỚC 4 BÁO GIÁ */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#e3a638]/40 shadow-xl">
          <Link href="/du-toan-chi-phi/venues">
            <button type="button" className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Quay lại chọn sảnh
            </button>
          </Link>

          <Link href="/du-toan-chi-phi/estimate">
            <button 
              type="button"
              className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>Xem Bảng Báo Giá Chi Tiết</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
