"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingCTA() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Kênh liên hệ nhanh" className="fixed right-4 bottom-8 z-50 flex flex-col items-end gap-3 group">
      
      {/* 1. Đặt lịch hẹn / Dự toán */}
      <Link 
        href="/du-toan-chi-phi" 
        className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/40"
        title="Dự toán chi phí & Đặt lịch hẹn"
      >
        <span className="material-symbols-outlined text-2xl">calendar_month</span>
        <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
          Dự toán & Đặt lịch
        </span>
      </Link>

      {/* 2. Gọi hotline */}
      <a 
        href="tel:02286595959" 
        className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-[#a66a3a] text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/40 animate-pulse"
        title="Gọi điện ngay"
      >
        <span className="material-symbols-outlined text-2xl">call</span>
        <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
          Hotline: 0228 659 5959
        </span>
      </a>

      {/* 3. Messenger Fanpage */}
      <a 
        href="https://m.me/goldenpalaceweddingnamdinh" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/40"
        title="Chat Messenger"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.206V22l3.415-1.874c.91.252 1.876.39 2.851.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.042 12.433l-2.55-2.721-4.977 2.721 5.474-5.81 2.616 2.72 4.911-2.72-5.474 5.81z"/>
        </svg>
        <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
          Chat Facebook Messenger
        </span>
      </a>

      {/* 4. Chat Zalo */}
      <a 
        href="https://zalo.me/02286595959" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/40"
        title="Chat Zalo"
      >
        <span className="font-bold text-xs tracking-tighter uppercase font-montserrat">Zalo</span>
        <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
          Chat Zalo tư vấn
        </span>
      </a>

      {/* 5. Chỉ đường Maps */}
      <a 
        href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-white/40"
        title="Chỉ đường Google Maps"
      >
        <span className="material-symbols-outlined text-2xl">location_on</span>
        <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
          Chỉ đường đến Golden Palace
        </span>
      </a>

      {/* 6. Nút cuộn lên đầu trang */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="group/item relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-200 border border-gray-200 mt-1"
          title="Lên đầu trang"
        >
          <span className="material-symbols-outlined text-xl">arrow_upward</span>
          <span className="absolute right-14 bg-gray-900/90 text-white font-montserrat text-xs px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md font-medium">
            Lên đầu trang
          </span>
        </button>
      )}

    </aside>
  );
}
