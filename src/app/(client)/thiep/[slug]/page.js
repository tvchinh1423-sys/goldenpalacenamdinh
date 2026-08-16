'use client';

import { use } from 'react';
import Link from 'next/link';

export default function PublicInvitationPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || 'thiep-cuoi';

  return (
    <div className="min-h-screen bg-[#faf6f0] text-gray-800 font-montserrat flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-[#e3a638] selection:text-white relative">
      
      {/* Delicate floral & gold background accent */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-amber-50/20 to-[#faf6f0] pointer-events-none"></div>

      {/* Main E-Card Light Envelope Frame */}
      <div className="w-full max-w-md bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_15px_60px_rgba(217,162,60,0.2)] relative z-10 my-6 flex flex-col items-center">
        
        {/* Logo Golden Palace ở góc trái trên cùng (Absolute Top-Left) */}
        <div className="absolute top-4 left-5 flex items-center gap-1.5 z-20">
          <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-8 w-auto object-contain drop-shadow-xs" />
          <span className="text-[9px] font-playfair tracking-[0.2em] text-[#a66a3a] font-bold uppercase">
            GOLDEN PALACE
          </span>
        </div>

        {/* Header Spacing for Logo */}
        <div className="pt-6 w-full text-center">
          <div className="text-3xl font-serif italic text-[#b8860b] mb-1">
            We Do
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#a66a3a] font-bold mb-4 border-b border-amber-200 pb-3">
            TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
          </div>
        </div>

        {/* Ceremony Header Title */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-gray-900 tracking-wide">
            LỄ THÀNH HÔN
          </h1>
          <p className="text-[11px] text-gray-500 font-serif italic">
            vui lòng đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>
        </div>

        {/* Couple Names Card */}
        <div className="w-full bg-[#fdfbf7] border border-amber-200 rounded-2xl p-6 text-center shadow-xs mb-6">
          <div className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 tracking-wide">
            Trần Văn Chinh
          </div>
          <div className="my-1.5 text-[#b8860b] font-serif italic text-xl">&</div>
          <div className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 tracking-wide">
            Nguyễn Thu Hà
          </div>
        </div>

        {/* Groom & Bride Parents (Nhà Trai / Nhà Gái) */}
        <div className="w-full grid grid-cols-2 gap-3 text-xs border-y border-amber-200 py-4 mb-6 font-serif">
          <div className="text-center border-r border-amber-100 pr-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ TRAI</div>
            <div className="text-gray-800 font-medium">Ông: Trần Văn A</div>
            <div className="text-gray-800 font-medium">Bà: Nguyễn Thị B</div>
          </div>
          <div className="text-center pl-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ GÁI</div>
            <div className="text-gray-800 font-medium">Ông: Lê Văn C</div>
            <div className="text-gray-800 font-medium">Bà: Phạm Thị D</div>
          </div>
        </div>

        {/* Event Time & Location Details */}
        <div className="w-full space-y-3 text-center text-xs mb-6">
          <div className="p-4 bg-[#fdfbf7] border border-amber-200 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Thời Gian Cử Hành
            </div>
            <div className="text-xl font-bold text-gray-900 font-mono">11:00 AM</div>
            <div className="text-gray-700 font-medium mt-0.5">Chủ Nhật, Ngày 20 Tháng 11 Năm 2026</div>
          </div>

          <div className="p-4 bg-[#fdfbf7] border border-amber-200 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Địa Điểm Tổ Chức
            </div>
            <div className="text-base font-bold text-gray-900 font-playfair uppercase">
              Tầng 3 - Sảnh Hoàng Gia
            </div>
            <div className="text-[#a66a3a] font-bold text-xs mt-0.5 uppercase">
              GOLDEN PALACE NAM ĐỊNH
            </div>
            <div className="text-gray-600 text-[11px] mt-1">98 Đông A, KĐT Hòa Vượng, TP. Nam Định</div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 bg-[#e3a638]/10 border border-[#e3a638]/40 text-[#a66a3a] text-[11px] font-bold uppercase rounded-lg hover:bg-[#e3a638]/20 transition-all"
            >
              <span className="material-symbols-outlined text-xs">map</span>
              Xem Bản Đồ Chỉ Đường
            </a>
          </div>
        </div>

        {/* Honor Note (No RSVP) */}
        <div className="w-full pt-4 border-t border-amber-200 text-center space-y-2">
          <p className="text-xs text-gray-600 italic font-serif">
            "Sự hiện diện của Quý vị là niềm vinh hạnh lớn cho gia đình chúng tôi!"
          </p>
        </div>

        {/* Footer Branding */}
        <div className="mt-6 pt-3 border-t border-gray-100 text-center text-[10px] text-gray-500">
          Thiệp cưới điện tử độc quyền từ <strong className="text-[#a66a3a]">Golden Palace Nam Định</strong>
        </div>

      </div>

    </div>
  );
}
