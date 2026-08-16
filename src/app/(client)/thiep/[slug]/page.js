'use client';

import { use } from 'react';
import Link from 'next/link';

export default function PublicInvitationPage({ params }) {
  const resolvedParams = use(params);

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-800 font-montserrat flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-[#e3a638] selection:text-white relative">
      
      {/* Delicate floral & gold background accent */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-amber-50/20 to-[#faf6f0] pointer-events-none"></div>

      {/* Main E-Card Light Envelope Frame */}
      <div className="w-full max-w-md bg-[#faf6f0] border-2 border-[#d4af37]/60 rounded-3xl p-6 sm:p-8 shadow-[0_15px_60px_rgba(217,162,60,0.2)] relative z-10 my-6 flex flex-col items-center text-center">
        
        {/* SVG Floral Corner Ornaments */}
        <svg className="absolute top-2 left-2 w-20 h-20 pointer-events-none opacity-80" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
          <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill="#d4af37" opacity="0.6" />
          <path d="M15 25 C8 30, 12 40, 22 35 C25 25, 18 18, 15 25 Z" fill="#d4af37" opacity="0.6" />
        </svg>
        <svg className="absolute top-2 right-2 w-20 h-20 pointer-events-none opacity-80 transform scale-x-[-1]" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
          <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill="#d4af37" opacity="0.6" />
        </svg>
        <svg className="absolute bottom-2 left-2 w-20 h-20 pointer-events-none opacity-80 transform scale-y-[-1]" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
        </svg>
        <svg className="absolute bottom-2 right-2 w-20 h-20 pointer-events-none opacity-80 transform scale-x-[-1] scale-y-[-1]" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
        </svg>

        {/* Logo Golden Palace ở góc trái trên cùng (Absolute Top-Left) */}
        <div className="absolute top-4 left-5 flex items-center gap-1.5 z-20">
          <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-8 w-auto object-contain drop-shadow-xs" />
          <span className="text-[9px] font-playfair tracking-[0.2em] text-[#a66a3a] font-bold uppercase">
            GOLDEN PALACE
          </span>
        </div>

        {/* Header Spacing for Logo */}
        <div className="pt-6 w-full text-center relative z-10">
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] mb-1">
            We Do
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#a66a3a] font-bold mb-4 border-b border-amber-200/80 pb-3">
            TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
          </div>
        </div>

        {/* Ceremony Header Title - WEDDING CEREMONY */}
        <div className="text-center space-y-1 mb-6 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#b8860b] tracking-wider uppercase">
            WEDDING CEREMONY
          </h1>
          <p className="text-[11px] text-stone-600 font-serif italic">
            vui lòng đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>
        </div>

        {/* Couple Calligraphy Names - Soft, Floating & Romantic */}
        <div className="w-full bg-[#fdfbf7] border border-[#e3a638]/30 rounded-2xl p-6 text-center shadow-xs mb-6 relative z-10">
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] leading-tight drop-shadow-xs">
            Trần Văn Chinh
          </div>
          <div className="my-1 text-[#b8860b] font-serif italic text-2xl">&</div>
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] leading-tight drop-shadow-xs">
            Nguyễn Thu Hà
          </div>
        </div>

        {/* Groom & Bride Parents (Nhà Trai / Nhà Gái) */}
        <div className="w-full grid grid-cols-2 gap-3 text-xs border-y border-amber-200/80 py-4 mb-6 font-serif relative z-10">
          <div className="text-center border-r border-amber-200/60 pr-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ TRAI</div>
            <div className="text-stone-800 font-medium">Ông: Trần Văn A</div>
            <div className="text-stone-800 font-medium">Bà: Nguyễn Thị B</div>
          </div>
          <div className="text-center pl-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ GÁI</div>
            <div className="text-stone-800 font-medium">Ông: Lê Văn C</div>
            <div className="text-stone-800 font-medium">Bà: Phạm Thị D</div>
          </div>
        </div>

        {/* Event Time & Clean Floor Venue Details */}
        <div className="w-full space-y-3 text-center text-xs mb-6 relative z-10">
          <div className="p-4 bg-[#fdfbf7] border border-[#e3a638]/30 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Thời Gian Cử Hành
            </div>
            <div className="text-xl font-bold text-stone-900 font-mono">11:00 AM</div>
            <div className="text-stone-700 font-medium mt-0.5">Chủ Nhật, Ngày 20 Tháng 11 Năm 2026</div>
          </div>

          <div className="p-4 bg-[#fdfbf7] border border-[#e3a638]/30 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Địa Điểm Tổ Chức
            </div>
            <div className="text-xl font-bold text-stone-900 font-playfair uppercase">
              Tầng 3
            </div>
            <div className="text-[#a66a3a] font-bold text-xs mt-0.5 uppercase">
              GOLDEN PALACE NAM ĐỊNH
            </div>
            <div className="text-stone-600 text-[11px] mt-1">98 Đông A, KĐT Hòa Vượng, TP. Nam Định</div>

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

        {/* Honor Note formatted with line break before 'cho' */}
        <div className="w-full pt-4 border-t border-amber-200/80 text-center space-y-2 relative z-10">
          <p className="text-xs text-stone-600 italic font-serif leading-relaxed">
            Sự hiện diện của Quý vị là niềm vinh hạnh lớn<br />
            cho gia đình chúng tôi!
          </p>
        </div>

        {/* Footer Branding */}
        <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] text-stone-500 relative z-10">
          Thiệp cưới điện tử độc quyền từ <strong className="text-[#a66a3a]">Golden Palace Nam Định</strong>
        </div>

      </div>

    </div>
  );
}
