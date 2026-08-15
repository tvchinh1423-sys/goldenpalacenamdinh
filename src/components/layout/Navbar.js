'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [khongGianOpen, setKhongGianOpen] = useState(false);
  const [dichVuOpen, setDichVuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs font-montserrat">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo-icon.png" alt="Golden Palace Emblem" className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="text-[#a66a3a] font-playfair text-xl tracking-widest uppercase font-semibold">Golden Palace</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-sm tracking-wider uppercase font-medium text-gray-700">
          <Link href="/" className="hover:text-[#a66a3a] transition-colors py-2">Trang chủ</Link>
          
          {/* Dropdown: KHÔNG GIAN */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setKhongGianOpen(true)}
            onMouseLeave={() => setKhongGianOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#a66a3a] transition-colors uppercase cursor-pointer">
              Không gian
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>

            <div className={`absolute left-0 top-full w-64 bg-white border border-[#e3a638]/20 shadow-2xl rounded-lg py-3 flex flex-col transition-all duration-200 ${khongGianOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <Link href="/khong-gian/tang-2" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🏛️</span> Hội trường Tầng 2
              </Link>
              <Link href="/khong-gian/tang-3" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🏛️</span> Hội trường Tầng 3
              </Link>
              <Link href="/khong-gian/tang-4" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🏛️</span> Hội trường Tầng 4
              </Link>
              <div className="my-1 border-t border-gray-100"></div>
              <Link href="/khong-gian/quay-bar" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🍸</span> Quầy Bar Tầng 1
              </Link>
              <Link href="/khong-gian/phong-vip" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>👑</span> Phòng VIP
              </Link>
            </div>
          </div>

          {/* Dropdown: DỊCH VỤ */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setDichVuOpen(true)}
            onMouseLeave={() => setDichVuOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#a66a3a] transition-colors uppercase cursor-pointer">
              Dịch vụ
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>

            <div className={`absolute left-0 top-full w-64 bg-white border border-[#e3a638]/20 shadow-2xl rounded-lg py-3 flex flex-col transition-all duration-200 ${dichVuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <Link href="/dich-vu/tiec-cuoi" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>💍</span> Tiệc cưới
              </Link>
              <Link href="/dich-vu/to-chuc-su-kien" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🏢</span> Tổ chức sự kiện
              </Link>
              <Link href="/dich-vu/sinh-nhat-ky-niem" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🎂</span> Tiệc sinh nhật & Kỷ niệm
              </Link>
              <Link href="/dich-vu/phong-an-rieng" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors flex items-center gap-2.5 text-xs font-medium">
                <span>🍷</span> Phòng ăn riêng
              </Link>
            </div>
          </div>

          <Link href="/thuc-don" className="hover:text-[#a66a3a] transition-colors py-2">Thực đơn</Link>
          <Link href="/khuyen-mai" className="hover:text-[#a66a3a] transition-colors py-2">Ưu đãi</Link>
          <Link href="/tin-tuc" className="hover:text-[#a66a3a] transition-colors py-2">Tin tức</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/du-toan-chi-phi" className="px-5 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white hover:opacity-90 font-montserrat text-xs tracking-widest uppercase transition-all font-semibold rounded-md shadow-sm">
            Dự toán chi phí
          </Link>
        </div>
      </div>
    </nav>
  );
}
