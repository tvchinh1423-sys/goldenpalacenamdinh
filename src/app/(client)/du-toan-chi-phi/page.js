'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useEstimate } from '@/components/guest/EstimateContext';

export default function CostEstimateStep1() {
  const { estimateData, updateEstimate } = useEstimate();
  const { guestCount, session, date } = estimateData;

  const [groomName, setGroomName] = useState(estimateData.groomName || '');
  const [brideName, setBrideName] = useState(estimateData.brideName || '');
  const [phone, setPhone] = useState(estimateData.phone || '');

  const tableCount = Math.ceil(guestCount / 10);

  const handleNextStep = (e) => {
    updateEstimate({
      eventType: 'WEDDING',
      groomName,
      brideName,
      phone
    });
  };

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen pt-24 pb-28">
      
      {/* Header Progress Indicator */}
      <div className="max-w-5xl mx-auto px-6 mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300 text-[#a66a3a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <span>Bước 1 / 4: Thông Tin Đặt Tiệc Cưới & Quy Mô</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-gray-900 leading-tight">
          Dự Toán Chi Phí Tiệc Cưới Trọn Gói
        </h1>
        <p className="text-gray-600 font-light text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
          Cùng Golden Palace lập dự trù ngân sách minh bạch, nhanh chóng và trải nghiệm quy trình phục vụ tiệc cưới tiêu chuẩn 5 sao.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* FORM THÔNG TIN CƠ BẢN */}
        <div className="bg-white border border-[#e3a638]/40 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8">
          
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs text-[#a66a3a] uppercase tracking-widest font-bold block mb-1">Thông tin ban đầu</span>
            <h2 className="text-2xl font-playfair font-bold text-gray-900">Thông Tin Khách Hàng & Quy Mô Tiệc</h2>
          </div>

          {/* 1. HỌ TÊN CÔ DÂU CHÚ RỂ & SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">
                Tên Chú Rể
              </label>
              <input 
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="VD: Văn Chinh"
                className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl p-3 text-xs font-semibold focus:border-[#e3a638] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">
                Tên Cô Dâu
              </label>
              <input 
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="VD: Thu Hà"
                className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl p-3 text-xs font-semibold focus:border-[#e3a638] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">
                Số Điện Thoại Zalo <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0945857996"
                className="w-full bg-[#fcf9f2] border border-gray-300 rounded-xl p-3 text-xs font-semibold focus:border-[#e3a638] focus:outline-none"
              />
            </div>
          </div>

          {/* 2. NGÀY CƯỚI & CA TIỆC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">
                Ngày Đám Cưới Dự Kiến
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => updateEstimate({ date: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-semibold focus:border-[#e3a638] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-gray-800 mb-1.5">
                Ca Tiệc Cưới
              </label>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                {['Trưa', 'Tối'].map((s) => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => updateEstimate({ session: s })}
                    className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      session === s 
                        ? 'bg-white shadow-md text-[#a66a3a]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. QUY MÔ TIỆC & SỐ LƯỢNG KHÁCH / MÂM */}
          <div className="bg-[#fcf9f2] p-6 rounded-2xl border border-gray-200/80 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-gray-800">Quy Mô Tiệc Cưới Dự Kiến *</label>
                <span className="text-[11px] text-gray-500 font-light">Kéo thanh trượt để chọn số lượng khách tham dự</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-playfair font-bold text-[#a66a3a]">{guestCount}</span>
                <span className="text-xs font-semibold text-gray-600"> khách</span>
              </div>
            </div>

            <div>
              <input 
                type="range" 
                min="50" max="800" step="10" 
                value={guestCount}
                onChange={(e) => updateEstimate({ guestCount: Number(e.target.value) })}
                className="w-full accent-[#e3a638] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-gray-500 text-[11px] font-medium mt-1">
                <span>50 khách (Quầy Bar / Tiệc nhỏ)</span>
                <span>100-300 (Tầng 4)</span>
                <span>300-750 (Tầng 2 & 3 Hoàng gia)</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-center gap-2 text-xs font-medium text-gray-800">
              <span className="material-symbols-outlined text-[#e3a638]">table_restaurant</span>
              <span>Tương đương <strong className="text-[#a66a3a] text-sm font-bold">{tableCount}</strong> mâm tiệc cưới (10 khách / mâm)</span>
            </div>
          </div>

          {/* CHUYỂN BƯỚC 2 */}
          <div className="pt-2 flex justify-center">
            <Link href="/du-toan-chi-phi/venues" onClick={handleNextStep}>
              <button 
                type="button" 
                className="bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <span>Xem & So Sánh Hội Trường Phù Hợp</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </Link>
          </div>

        </div>

        {/* GIỚI THIỆU QUY TRÌNH LÀM VIỆC & DỊCH VỤ CƯỚI GOLDEN PALACE */}
        <div className="bg-white rounded-3xl border border-[#e3a638]/30 shadow-xl p-8 sm:p-10 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Quy trình chuẩn 5 sao</span>
            <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900">
              Quy Trình Đặt Tiệc Cưới Tại Golden Palace
            </h3>
            <div className="w-12 h-[1px] bg-[#e3a638] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fcf9f2] border border-amber-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md">
                  1
                </div>
                <h4 className="text-lg font-playfair font-bold text-gray-900 mb-2">Giai Đoạn 1: Khảo Sát & Giữ Ngày</h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Quý khách khảo sát thực tế 4 hội trường hoàng gia, chọn ngày tiệc và đặt cọc 5.000.000 VNĐ để giữ sảnh và khóa ngày đẹp.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#a66a3a] mt-4 block">Trước ngày cưới 3 tháng</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#fcf9f2] border border-amber-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md">
                  2
                </div>
                <h4 className="text-lg font-playfair font-bold text-gray-900 mb-2">Giai Đoạn 2: Chốt Menu & Hợp Đồng</h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Chốt số lượng mâm chính thức, chọn set menu ẩm thực tinh hoa 10 món, ký hợp đồng kinh tế và đặt cọc 50% tổng giá trị tiệc.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#a66a3a] mt-4 block">Trước ngày cưới 1 tháng</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#fcf9f2] border border-amber-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md">
                  3
                </div>
                <h4 className="text-lg font-playfair font-bold text-gray-900 mb-2">Giai Đoạn 3: Bàn Giao & Đón Tiệc</h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Bàn giao danh sách khách VIP, kịch bản âm thanh ánh sáng, phông LED trình chiếu và chạy tổng duyệt trước giờ đón khách.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#a66a3a] mt-4 block">Trước ngày cưới 1 ngày</span>
            </div>
          </div>

          {/* DỊCH VỤ CƯỚI NỔI BẬT */}
          <div className="pt-6 border-t border-gray-100">
            <div className="text-center mb-8">
              <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">Điểm đến lý tưởng</span>
              <h3 className="text-2xl font-playfair font-bold text-gray-900">
                Đặc Quyền Tiệc Cưới Trọn Gói Golden Palace
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="material-symbols-outlined text-3xl text-[#a66a3a] mb-2">curtains</span>
                <h5 className="font-playfair font-bold text-sm text-gray-900 mb-1">Không Gian Trần 7m</h5>
                <p className="text-[11px] text-gray-600 font-light">Thiết kế hoàn toàn không cột chắn, tầm nhìn 360 độ hoàn hảo</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="material-symbols-outlined text-3xl text-[#a66a3a] mb-2">tv</span>
                <h5 className="font-playfair font-bold text-sm text-gray-900 mb-1">Màn LED 30m² P2.5</h5>
                <p className="text-[11px] text-gray-600 font-light">Màn hình LED siêu nét trình chiếu album ảnh & video cưới kỷ niệm</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="material-symbols-outlined text-3xl text-[#a66a3a] mb-2">restaurant_menu</span>
                <h5 className="font-playfair font-bold text-sm text-gray-900 mb-1">18 Set Menu Tinh Hoa</h5>
                <p className="text-[11px] text-gray-600 font-light">Thực đơn 10 món truyền thống kết hợp hiện đại chỉn chu</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="material-symbols-outlined text-3xl text-[#a66a3a] mb-2">card_giftcard</span>
                <h5 className="font-playfair font-bold text-sm text-gray-900 mb-1">Cá Nhân Hóa Miễn Phí</h5>
                <p className="text-[11px] text-gray-600 font-light">Thiệp cưới điện tử online & kịch bản âm nhạc tiệc cưới riêng</p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
