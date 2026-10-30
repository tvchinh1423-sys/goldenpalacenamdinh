'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function VenuesOverviewClient({ venues = [] }) {
  const [activeTab, setActiveTab] = useState('ALL');

  const filterTabs = [
    { id: 'ALL', label: 'Tất Cả Không Gian', count: venues.length, icon: 'domain' },
    { id: 'LARGE', label: 'Đại Tiệc Lớn (300 - 750 khách)', count: 2, icon: 'workspace_premium' },
    { id: 'MEDIUM', label: 'Tiệc Ấm Cúng (100 - 300 khách)', count: 1, icon: 'celebration' },
    { id: 'INTIMATE', label: 'Tiệc Riêng Tư & Bar (10 - 100 khách)', count: 2, icon: 'local_bar' },
  ];

  const filteredVenues = useMemo(() => {
    if (activeTab === 'ALL') return venues;
    if (activeTab === 'LARGE') return venues.filter(v => v.category === 'LARGE');
    if (activeTab === 'MEDIUM') return venues.filter(v => v.category === 'MEDIUM');
    if (activeTab === 'INTIMATE') return venues.filter(v => v.category === 'INTIMATE');
    return venues;
  }, [activeTab, venues]);

  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col pt-24 pb-28 w-full overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#1c1917] via-[#2a2419] to-[#12100e] text-white py-16 sm:py-24 px-4 sm:px-6 border-b border-[#e3a638]/30 overflow-hidden">
        {/* Glow & Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e3a63815,transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e3a638]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#e3a638]/50 text-[#e3a638] text-xs uppercase tracking-[0.25em] font-semibold mb-4 backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">location_city</span>
            Hệ Thống Không Gian Sảnh Tiệc & Sự Kiện
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-white mb-4 leading-tight">
            Khám Phá <span className="text-[#e3a638]">5 Không Gian Đẳng Cấp</span><br className="hidden sm:inline" /> Tại Golden Palace
          </h1>

          <p className="text-gray-300 font-light text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-8">
            Tọa lạc tại vị trí đắc địa <strong>98 Đông A, KĐT Hòa Vượng, TP Nam Định</strong>. Golden Palace tự hào sở hữu kiến trúc trần cao 7m hoàn toàn không cột chắn, màn hình LED sắc nét cùng hệ thống âm thanh ánh sáng biểu diễn tiêu chuẩn, phục vụ hoàn hảo quy mô từ 10 đến 750 khách.
          </p>

          {/* Quick Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
              <span className="text-[#e3a638] material-symbols-outlined text-2xl mb-1 block">height</span>
              <div className="text-white font-bold text-base sm:text-lg">Trần Cao 7m</div>
              <div className="text-gray-400 text-xs">Không một cột chắn</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
              <span className="text-[#e3a638] material-symbols-outlined text-2xl mb-1 block">tv</span>
              <div className="text-white font-bold text-base sm:text-lg">Màn LED 30m²</div>
              <div className="text-gray-400 text-xs">P2.5 hiển thị 4K</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
              <span className="text-[#e3a638] material-symbols-outlined text-2xl mb-1 block">groups</span>
              <div className="text-white font-bold text-base sm:text-lg">10 - 750 Khách</div>
              <div className="text-gray-400 text-xs">Đa dạng 5 sảnh tiệc</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
              <span className="text-[#e3a638] material-symbols-outlined text-2xl mb-1 block">local_parking</span>
              <div className="text-white font-bold text-base sm:text-lg">500+ Xe Ô Tô</div>
              <div className="text-gray-400 text-xs">Bãi đỗ xe an toàn</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20 w-full mb-10">
        <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-[#e3a638]/40 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1c1917] via-[#2a2419] to-[#0d0d0d] text-[#e3a638] shadow-lg border border-[#e3a638]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-amber-50/70'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#e3a638]' : 'text-gray-400'}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. VENUE LIST CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 w-full">
        <div className="text-center mb-6">
          <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">
            Chi tiết từng không gian
          </span>
          <h2 className="text-2xl sm:text-4xl font-playfair font-bold text-gray-900">
            Chọn Không Gian Phù Hợp Cho Sự Kiện Của Bạn
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-2xl mx-auto">
            Nhấp vào bất kỳ không gian nào để khám phá trọn bộ ảnh thực tế HD, thông số chi tiết và sơ đồ sảnh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredVenues.map((venue, idx) => (
            <div
              key={venue.slug}
              className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-xl overflow-hidden hover:border-[#e3a638] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Badges Container */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gray-900">
                <img
                  src={venue.heroImage}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
                  <span className="bg-[#1c1917]/90 text-[#e3a638] border border-[#e3a638]/50 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    {venue.floorTag}
                  </span>
                  <span className="bg-red-600/90 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    {venue.badgeTag}
                  </span>
                </div>

                {/* Bottom Photo Count Badge */}
                <div className="absolute bottom-3.5 right-3.5 z-10">
                  <span className="inline-flex items-center gap-1 bg-black/70 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm text-[#e3a638]">photo_library</span>
                    <span>{venue.photoCount} ảnh HD thực tế</span>
                  </span>
                </div>

                {/* Title Overlay on Image Bottom */}
                <div className="absolute bottom-3.5 left-3.5 right-24 z-10 text-white">
                  <h3 className="text-xl sm:text-2xl font-playfair font-bold text-white group-hover:text-[#e3a638] transition-colors drop-shadow-md">
                    {venue.name}
                  </h3>
                  <p className="text-amber-200 text-xs font-light truncate drop-shadow-sm">
                    {venue.subTitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-[#fcf9f2] border border-amber-200/60 rounded-2xl p-3 sm:p-3.5 mb-5 text-center">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-medium">Sức Chứa</span>
                      <strong className="text-xs sm:text-sm text-gray-900 font-bold block mt-0.5">{venue.capacityGuests}</strong>
                    </div>
                    <div className="border-x border-amber-200/60">
                      <span className="text-[10px] text-gray-500 uppercase block font-medium">Quy Mô Bàn</span>
                      <strong className="text-xs sm:text-sm text-[#a66a3a] font-bold block mt-0.5">{venue.capacityTables}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-medium">Điểm Nhấn</span>
                      <strong className="text-xs sm:text-sm text-gray-900 font-bold block mt-0.5 truncate">{venue.ledHighlight}</strong>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed mb-5 line-clamp-3">
                    {venue.description}
                  </p>

                  {/* Key Highlights List */}
                  <div className="space-y-2 mb-6 border-t border-gray-100 pt-4">
                    {venue.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="material-symbols-outlined text-sm text-[#e3a638] shrink-0 mt-0.5">check_circle</span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/khong-gian/${venue.slug}`}
                    className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white hover:opacity-90 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Khám Phá Chi Tiết & Ảnh HD</span>
                    <span className="material-symbols-outlined text-base group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>

                  <Link
                    href={`/du-toan-chi-phi/venues`}
                    className="w-full sm:w-auto py-3 px-4 bg-amber-50 hover:bg-amber-100 text-[#a66a3a] border border-[#e3a638]/50 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all text-center whitespace-nowrap"
                  >
                    Dự Toán Sảnh Này
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUICK COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 w-full">
        <div className="bg-white rounded-3xl border border-[#e3a638]/40 shadow-xl p-5 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-bold block mb-1">
              So sánh nhanh
            </span>
            <h3 className="text-xl sm:text-3xl font-playfair font-bold text-gray-900">
              Bảng Tổng Quan 5 Không Gian Sảnh Tiệc
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Tổng hợp sức chứa, trang thiết bị và mức độ phù hợp cho từng loại hình sự kiện
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#1c1917] text-white uppercase text-[11px] sm:text-xs tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Không Gian Sảnh</th>
                  <th className="p-3.5">Sức Chứa Khách</th>
                  <th className="p-3.5">Số Mâm Cỗ</th>
                  <th className="p-3.5">Trang Thiết Bị Nổi Bật</th>
                  <th className="p-3.5">Phù Hợp Nhất Cho</th>
                  <th className="p-3.5 text-right rounded-r-xl">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {venues.map((v) => (
                  <tr key={v.slug} className="hover:bg-amber-50/50 transition-colors">
                    <td className="p-3.5">
                      <Link href={`/khong-gian/${v.slug}`} className="font-bold text-gray-900 hover:text-[#a66a3a] flex items-center gap-1.5">
                        <span>{v.name}</span>
                        <span className="material-symbols-outlined text-xs text-gray-400">open_in_new</span>
                      </Link>
                      <span className="text-[10px] text-gray-500 font-normal block">{v.floorTag}</span>
                    </td>
                    <td className="p-3.5 font-bold text-[#a66a3a] whitespace-nowrap">
                      {v.capacityGuests}
                    </td>
                    <td className="p-3.5 text-gray-700 whitespace-nowrap">
                      {v.capacityTables}
                    </td>
                    <td className="p-3.5 text-gray-600 font-light max-w-xs">
                      {v.ledHighlight}
                    </td>
                    <td className="p-3.5 text-gray-700 text-xs">
                      {v.bestFor}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/khong-gian/${v.slug}`}
                        className="inline-flex items-center gap-1 text-[#a66a3a] font-bold text-xs hover:underline whitespace-nowrap"
                      >
                        <span>Xem ảnh</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE GOLDEN PALACE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 w-full">
        <div className="bg-gradient-to-r from-gray-900 via-[#2a2419] to-gray-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-[#e3a638]/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#e3a638]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <span className="text-[#e3a638] uppercase tracking-[0.25em] text-xs font-bold block mb-2">
              Chuẩn mực tổ chức tiệc tại Nam Định
            </span>
            <h3 className="text-2xl sm:text-4xl font-playfair font-bold text-white mb-3">
              Tại Sao Khách Hàng Chọn Golden Palace?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
              Không chỉ là sảnh tiệc, Golden Palace mang lại trải nghiệm trọn vẹn từ không gian kiến trúc hoàng gia, ẩm thực tinh hoa đến công nghệ cá nhân hóa sự kiện độc quyền.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e3a638]/60 transition-colors">
              <span className="material-symbols-outlined text-3xl text-[#e3a638] mb-2 block">architecture</span>
              <h4 className="font-playfair font-bold text-base text-white mb-1">Kiến Trúc Không Cột</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Trần cao 7m hoàn toàn không có cột chắn, đảm bảo 100% khách mời đều nhìn rõ sân khấu chính.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e3a638]/60 transition-colors">
              <span className="material-symbols-outlined text-3xl text-[#e3a638] mb-2 block">smart_display</span>
              <h4 className="font-playfair font-bold text-base text-white mb-1">Màn LED & Ánh Sáng 4K</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Trang bị màn hình LED 30m² tiêu chuẩn P2.5 cùng hệ thống giàn đèn bướm & pha lê biểu diễn chuyên nghiệp.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e3a638]/60 transition-colors">
              <span className="material-symbols-outlined text-3xl text-[#e3a638] mb-2 block">room_service</span>
              <h4 className="font-playfair font-bold text-base text-white mb-1">18 Set Menu Đỉnh Cao</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Thực đơn phối hợp chuẩn vị 12 món ăn từ Khai vị đến Tráng miệng, nguồn thực phẩm tươi mới nhập hàng ngày.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e3a638]/60 transition-colors">
              <span className="material-symbols-outlined text-3xl text-[#e3a638] mb-2 block">celebration</span>
              <h4 className="font-playfair font-bold text-base text-white mb-1">Cá Nhân Hóa Miễn Phí</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Đặc quyền tự tạo thiệp cưới online, tự thiết kế phông LED và tự chọn kịch bản âm nhạc riêng cho dâu rể.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20 text-center w-full">
        <div className="bg-white rounded-3xl border-2 border-[#e3a638] p-8 sm:p-10 shadow-2xl">
          <span className="material-symbols-outlined text-4xl text-[#e3a638] mb-2">support_agent</span>
          <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 mb-2">
            Trực Tiếp Tham Quan Sảnh Tiệc Tại 98 Đông A
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm font-light max-w-xl mx-auto mb-6 leading-relaxed">
            Mở cửa đón khách tham quan trải nghiệm từ <strong>8h00 - 21h00</strong> hàng ngày. Đội ngũ chuyên viên Golden Palace luôn sẵn sàng dẫn Quý khách tham quan trực tiếp và tư vấn phương án tối ưu nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/du-toan-chi-phi"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Lập Dự Toán Chi Phí Tự Động ➔
            </Link>

            <a
              href="tel:02286595959"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-[#e3a638] border border-[#e3a638] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              📞 Hotline: 0228 659 5959
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
