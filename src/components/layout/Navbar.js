'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [khongGianOpen, setKhongGianOpen] = useState(false);
  const [dichVuOpen, setDichVuOpen] = useState(false);
  const [thucDonOpen, setThucDonOpen] = useState(false);

  // Mobile Accordion states
  const [mobileKhongGian, setMobileKhongGian] = useState(false);
  const [mobileDichVu, setMobileDichVu] = useState(false);
  const [mobileThucDon, setMobileThucDon] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs font-montserrat">
      
      {/* Top Bar - Hotline & Address */}
      <div className="bg-[#1c1917] text-white py-1.5 px-3 sm:px-4 text-[11px] font-medium border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <a href="tel:02286595959" className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold whitespace-nowrap shrink-0">
            <span className="material-symbols-outlined text-xs">call</span>
            <span>Hotline:</span>
            <strong className="text-white">0228 659 5959</strong>
          </a>

          <a 
            href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-gray-300 hover:text-amber-300 transition-colors text-[10px] sm:text-[11px] font-medium truncate"
          >
            <span className="material-symbols-outlined text-xs text-amber-400 shrink-0">location_on</span>
            <span className="truncate">98 Đông A, KĐT Hòa Vượng, TP Nam Định</span>
          </a>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img src="/logo-icon.png" alt="Golden Palace Emblem" className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="text-[#a66a3a] font-playfair text-base sm:text-xl tracking-widest uppercase font-bold whitespace-nowrap">
            Golden Palace
          </span>
        </Link>

        {/* Center Pill Button for Mobile - Like Trống Đồng Palace */}
        <div className="flex md:hidden items-center justify-center shrink-0">
          <Link 
            href="/du-toan-chi-phi" 
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md hover:opacity-90 transition-all whitespace-nowrap border border-amber-300/40"
          >
            Dự Tính Chi Phí
          </Link>
        </div>

        {/* Desktop Links */}
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

            <div className={`absolute left-0 top-full w-64 bg-white border border-[#e3a638]/20 shadow-2xl rounded-xl py-3 flex flex-col transition-all duration-200 ${khongGianOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <Link href="/khong-gian/tang-2" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Hội trường Tầng 2
              </Link>
              <Link href="/khong-gian/tang-3" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Hội trường Tầng 3
              </Link>
              <Link href="/khong-gian/tang-4" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Hội trường Tầng 4
              </Link>
              <div className="my-1 border-t border-gray-100"></div>
              <Link href="/khong-gian/quay-bar" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Quầy Bar Tầng 1
              </Link>
              <Link href="/khong-gian/phong-vip" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Phòng VIP
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

            <div className={`absolute left-0 top-full w-64 bg-white border border-[#e3a638]/20 shadow-2xl rounded-xl py-3 flex flex-col transition-all duration-200 ${dichVuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <Link href="/dich-vu/tiec-cuoi" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Tiệc cưới
              </Link>
              <Link href="/dich-vu/to-chuc-su-kien" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Tổ chức sự kiện
              </Link>
              <Link href="/dich-vu/sinh-nhat-ky-niem" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Tiệc sinh nhật & Kỷ niệm
              </Link>
              <Link href="/dich-vu/phong-an-rieng" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Phòng ăn riêng
              </Link>
            </div>
          </div>

          {/* Dropdown: THỰC ĐƠN */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setThucDonOpen(true)}
            onMouseLeave={() => setThucDonOpen(false)}
          >
            <Link href="/thuc-don" className="flex items-center gap-1 hover:text-[#a66a3a] transition-colors uppercase cursor-pointer">
              Thực đơn
              <span className="material-symbols-outlined text-base">expand_more</span>
            </Link>

            <div className={`absolute left-0 top-full w-72 bg-white border border-[#e3a638]/20 shadow-2xl rounded-xl py-3 flex flex-col transition-all duration-200 ${thucDonOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <Link href="/thuc-don?tab=SET_TIEC" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Set Menu Tiệc Cưới & Hội Nghị
              </Link>
              <Link href="/thuc-don?tab=CHUYEN_MON" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Menu Chuyên Món Đặc Sản
              </Link>
              <Link href="/thuc-don?tab=TRE_EM" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Menu Trẻ Em & Học Sinh
              </Link>
              <Link href="/thuc-don?tab=ALACARTE" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Menu Chọn Món A la carte
              </Link>
              <div className="my-1 border-t border-gray-100"></div>
              <Link href="/thuc-don?tab=DO_UONG" className="px-5 py-2.5 hover:bg-[#e3a638]/10 hover:text-[#a66a3a] transition-colors text-xs font-medium">
                Bảng Giá Đồ Uống & Phí Mang Vào
              </Link>
            </div>
          </div>

          {/* Link: CÁ NHÂN HÓA */}
          <Link href="/ca-nhan-hoa" className="hover:text-[#a66a3a] transition-colors py-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-[#e3a638]">auto_awesome</span>
            <span>Cá Nhân Hóa</span>
          </Link>
        </div>

        {/* Desktop CTA Pill */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link href="/ca-nhan-hoa" className="px-4 py-2 border border-[#e3a638] text-[#a66a3a] hover:bg-[#e3a638]/10 font-montserrat text-xs tracking-wider uppercase transition-all font-semibold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#e3a638]">auto_awesome</span>
            Cá Nhân Hóa
          </Link>
          <Link href="/du-toan-chi-phi" className="px-5 py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white hover:opacity-90 font-montserrat text-xs tracking-widest uppercase transition-all font-semibold rounded-full shadow-md">
            Dự Toán Chi Phí
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-100 cursor-pointer shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Side Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-white border-b border-gray-200 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto font-montserrat">
          <div className="p-5 space-y-4">
            
            {/* Primary Action Button inside Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/ca-nhan-hoa" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 border border-[#e3a638] text-[#a66a3a] bg-amber-50/50 font-bold uppercase text-[11px] tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Cá Nhân Hóa
              </Link>
              <Link 
                href="/du-toan-chi-phi" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold uppercase text-[11px] tracking-wider rounded-xl shadow-md"
              >
                Dự Tính Chi Phí
              </Link>
            </div>

            <div className="space-y-1 text-xs uppercase tracking-wider font-semibold text-gray-800 pt-2">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-3 rounded-lg hover:bg-amber-50 hover:text-[#a66a3a] transition-colors border-b border-gray-100"
              >
                Trang Chủ
              </Link>

              {/* Accordion: KHÔNG GIAN */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setMobileKhongGian(!mobileKhongGian)}
                  className="w-full py-3 px-3 flex justify-between items-center text-left hover:text-[#a66a3a] cursor-pointer uppercase font-semibold"
                >
                  <span>Không Gian</span>
                  <span className="material-symbols-outlined text-base">{mobileKhongGian ? 'expand_less' : 'expand_more'}</span>
                </button>
                {mobileKhongGian && (
                  <div className="pl-6 pb-3 space-y-2 text-xs font-normal normal-case text-gray-600">
                    <Link href="/khong-gian/tang-2" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Hội trường Tầng 2 (350 - 750 khách)</Link>
                    <Link href="/khong-gian/tang-3" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Hội trường Tầng 3 (300 - 650 khách)</Link>
                    <Link href="/khong-gian/tang-4" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Hội trường Tầng 4 (100 - 300 khách)</Link>
                    <Link href="/khong-gian/quay-bar" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Quầy Bar Tầng 1 (50 - 100 khách)</Link>
                    <Link href="/khong-gian/phong-vip" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Phòng VIP (10 - 50 khách)</Link>
                  </div>
                )}
              </div>

              {/* Accordion: DỊCH VỤ */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setMobileDichVu(!mobileDichVu)}
                  className="w-full py-3 px-3 flex justify-between items-center text-left hover:text-[#a66a3a] cursor-pointer uppercase font-semibold"
                >
                  <span>Dịch Vụ</span>
                  <span className="material-symbols-outlined text-base">{mobileDichVu ? 'expand_less' : 'expand_more'}</span>
                </button>
                {mobileDichVu && (
                  <div className="pl-6 pb-3 space-y-2 text-xs font-normal normal-case text-gray-600">
                    <Link href="/dich-vu/tiec-cuoi" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Tiệc cưới Hoàng Gia</Link>
                    <Link href="/dich-vu/to-chuc-su-kien" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Tổ chức sự kiện công ty</Link>
                    <Link href="/dich-vu/sinh-nhat-ky-niem" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Tiệc sinh nhật & Kỷ niệm</Link>
                    <Link href="/dich-vu/phong-an-rieng" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Phòng ăn riêng VIP</Link>
                  </div>
                )}
              </div>

              {/* Accordion: THỰC ĐƠN */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setMobileThucDon(!mobileThucDon)}
                  className="w-full py-3 px-3 flex justify-between items-center text-left hover:text-[#a66a3a] cursor-pointer uppercase font-semibold"
                >
                  <span>Thực Đơn</span>
                  <span className="material-symbols-outlined text-base">{mobileThucDon ? 'expand_less' : 'expand_more'}</span>
                </button>
                {mobileThucDon && (
                  <div className="pl-6 pb-3 space-y-2 text-xs font-normal normal-case text-gray-600">
                    <Link href="/thuc-don?tab=SET_TIEC" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Set Menu Tiệc Cưới & Hội Nghị</Link>
                    <Link href="/thuc-don?tab=CHUYEN_MON" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Menu Chuyên Món Đặc Sản</Link>
                    <Link href="/thuc-don?tab=TRE_EM" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Menu Trẻ Em & Học Sinh</Link>
                    <Link href="/thuc-don?tab=ALACARTE" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Menu Chọn Món A la carte</Link>
                    <Link href="/thuc-don?tab=DO_UONG" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#a66a3a]">Bảng Giá Đồ Uống & Phí Mang Vào</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Hotline & Address Box in Mobile Menu */}
            <div className="bg-[#1c1917] text-white p-4 rounded-xl space-y-2 text-xs">
              <span className="text-[#e3a638] uppercase font-bold text-[10px] tracking-wider block">Hotline Hỗ Trợ 24/7</span>
              <a href="tel:02286595959" className="text-white font-bold text-sm block whitespace-nowrap">
                📞 Hotline: 0228 659 5959
              </a>
              <p className="text-gray-300 text-[11px] font-light">
                📍 98 Đông A, KĐT Hòa Vượng, TP Nam Định
              </p>
            </div>

          </div>
        </div>
      )}

    </nav>
  );
}
