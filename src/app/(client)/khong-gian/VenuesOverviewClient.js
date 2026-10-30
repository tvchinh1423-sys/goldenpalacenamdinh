'use client';

import Link from 'next/link';

export default function VenuesOverviewClient({ venues = [] }) {
  return (
    <div className="bg-[#fcf9f2] text-gray-900 font-montserrat min-h-screen flex flex-col pt-24 pb-20 w-full overflow-x-hidden">
      
      {/* 1. HEADER TỐI GIẢN */}
      <section className="text-center pt-6 sm:pt-10 pb-8 px-4 max-w-3xl mx-auto">
        <span className="text-[#a66a3a] uppercase tracking-[0.25em] text-[11px] font-bold block mb-1.5">
          GOLDEN PALACE NAM ĐỊNH
        </span>
        <h1 className="text-2xl sm:text-4xl font-playfair font-bold text-gray-900 mb-2.5">
          Hệ Thống 5 Không Gian Sảnh Tiệc
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
          Kiến trúc hoàng gia trần cao 7m không cột chắn, sức chứa từ 10 đến 750 khách. Nhấp vào sảnh để xem chi tiết và album ảnh thực tế.
        </p>
      </section>

      {/* 2. GRID 5 KHÔNG GIAN GỌN GÀNG, TRỰC QUAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {venues.map((venue) => (
            <div
              key={venue.slug}
              className="bg-white rounded-2xl sm:rounded-3xl border border-amber-200/70 hover:border-[#e3a638] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Ảnh đại diện (Ảnh số 1 trong album) */}
              <Link href={`/khong-gian/${venue.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900 block">
                <img
                  src={venue.heroImage}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Badge Tầng */}
                <span className="absolute top-3 left-3 bg-[#1c1917]/90 text-[#e3a638] border border-[#e3a638]/50 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {venue.floorTag}
                </span>

                {/* Badge Số ảnh thực tế */}
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-black/75 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                  <span className="material-symbols-outlined text-xs text-[#e3a638]">photo_library</span>
                  <span>{venue.photoCount || 20} ảnh HD</span>
                </span>
              </Link>

              {/* Thông tin sảnh */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link href={`/khong-gian/${venue.slug}`}>
                      <h2 className="text-lg sm:text-xl font-playfair font-bold text-gray-900 group-hover:text-[#a66a3a] transition-colors">
                        {venue.name}
                      </h2>
                    </Link>
                  </div>
                  <p className="text-gray-500 text-xs font-light mb-4 line-clamp-1">
                    {venue.subTitle}
                  </p>

                  {/* Thông số cốt lõi */}
                  <div className="space-y-2 text-xs text-gray-700 bg-[#fcf9f2] rounded-xl p-3 border border-amber-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#a66a3a]">groups</span>
                        Sức chứa:
                      </span>
                      <strong className="text-gray-900 font-bold">{venue.capacityGuests}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#a66a3a]">table_restaurant</span>
                        Quy mô:
                      </span>
                      <strong className="text-[#a66a3a] font-semibold">{venue.capacityTables}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-100">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#a66a3a]">tv</span>
                        Điểm nhấn:
                      </span>
                      <span className="text-gray-800 font-medium truncate max-w-[170px]" title={venue.ledHighlight}>
                        {venue.ledHighlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/khong-gian/${venue.slug}`}
                    className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>Khám Phá Sảnh</span>
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>

                  <Link
                    href="/du-toan-chi-phi/venues"
                    className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-[#a66a3a] border border-[#e3a638]/40 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    Dự Toán
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOOTER HỖ TRỢ NHANH TINH GỌN */}
      <section className="max-w-3xl mx-auto px-4 mt-12 sm:mt-16 text-center w-full">
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-playfair font-bold text-base text-gray-900">
              Cần tư vấn trực tiếp chọn sảnh tiệc?
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Địa chỉ: 98 Đông A, TP Nam Định • Mở cửa 8h00 - 21h00
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:02286595959"
              className="px-4 py-2.5 bg-gray-900 hover:bg-black text-[#e3a638] border border-[#e3a638]/50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>0228 659 5959</span>
            </a>
            <Link
              href="/du-toan-chi-phi"
              className="px-4 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Dự Toán Online
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
