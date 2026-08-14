"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatModal from './AIChatModal';

export default function FloatingCTA() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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
    <>
      <aside aria-label="Kênh hỗ trợ & Liên hệ cao cấp" className="fixed right-5 bottom-8 z-50 flex flex-col items-end gap-3.5 group">
        
        {/* 🌟 1. NÚT AI CHAT - NGÔI SAO NỔI BẬT NHẤT */}
        <div className="relative flex items-center justify-end">
          {/* Glowing Aura Radar Effect */}
          <span className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-[#e3a638] via-[#a66a3a] to-[#e3a638] opacity-75 animate-ping duration-1000"></span>
          
          <button
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className="group/ai relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#2a2419] to-[#0d0d0d] text-white shadow-[0_0_30px_rgba(227,166,56,0.6)] hover:shadow-[0_0_40px_rgba(227,166,56,0.9)] hover:scale-110 transition-all duration-300 ring-2 ring-[#e3a638] cursor-pointer"
            title="Hỏi đáp 24/7 cùng Trợ lý AI Golden Palace"
          >
            {/* Inner Rotating Gold Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#e3a638]/60 animate-spin [animation-duration:12s]"></div>
            
            {/* Logo Emblem */}
            <div className="w-10 h-10 rounded-full bg-black/90 flex items-center justify-center p-1.5 shadow-inner border border-[#e3a638]/40">
              <img src="/logo-icon.png" alt="AI Consultant" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(227,166,56,0.8)]" />
            </div>

            {/* Sparkle Icon */}
            <span className="absolute -top-1 -left-1 text-amber-300 text-sm animate-pulse">✨</span>

            {/* Floating Luxury Pill Label */}
            <span className="absolute -top-2.5 right-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full border border-white/80 shadow-md uppercase tracking-wider whitespace-nowrap">
              TRỢ LÝ AI 24/7
            </span>

            {/* Expandable Hover Tooltip */}
            <span className="absolute right-18 bg-black/95 text-[#fcf9f2] font-montserrat text-xs px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover/ai:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl border border-[#e3a638]/40 backdrop-blur-md font-medium translate-x-2 group-hover/ai:translate-x-0">
              💬 Chat ngay với <strong className="text-[#e3a638] font-semibold">Trợ lý AI Golden Palace</strong>
            </span>
          </button>
        </div>

        {/* 📅 2. Dự toán chi phí & Đặt lịch */}
        <Link 
          href="/du-toan-chi-phi" 
          className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.5)] hover:scale-108 transition-all duration-300 border border-white/20"
          title="Dự toán chi phí & Đặt lịch hẹn"
        >
          <span className="material-symbols-outlined text-2xl drop-shadow-sm">calendar_month</span>
          <span className="absolute right-15 bg-black/90 text-white font-montserrat text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
            Dự toán & Đặt lịch tiệc
          </span>
        </Link>

        {/* 📞 3. Hotline Trực tiếp */}
        <a 
          href="tel:02286595959" 
          className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1917] text-[#e3a638] shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] hover:scale-108 transition-all duration-300 border border-[#e3a638]/40"
          title="Hotline tư vấn nhanh"
        >
          <span className="material-symbols-outlined text-2xl">call</span>
          <span className="absolute right-15 bg-black/90 text-white font-montserrat text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
            Hotline: <strong className="text-[#e3a638]">0228 659 5959</strong>
          </span>
        </a>

        {/* ⚡ 4. Facebook Messenger */}
        <a 
          href="https://m.me/goldenpalaceweddingnamdinh" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white shadow-lg hover:shadow-[0_0_20px_rgba(0,132,255,0.5)] hover:scale-108 transition-all duration-300 border border-white/20"
          title="Nhắn tin Facebook Messenger"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.206V22l3.415-1.874c.91.252 1.876.39 2.851.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.042 12.433l-2.55-2.721-4.977 2.721 5.474-5.81 2.616 2.72 4.911-2.72-5.474 5.81z"/>
          </svg>
          <span className="absolute right-15 bg-black/90 text-white font-montserrat text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
            Messenger Fanpage
          </span>
        </a>

        {/* 📍 5. Chỉ đường Maps */}
        <a 
          href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group/item relative flex items-center justify-center w-12 h-12 rounded-full bg-[#064e3b] text-emerald-300 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-108 transition-all duration-300 border border-emerald-500/30"
          title="Chỉ đường Google Maps"
        >
          <span className="material-symbols-outlined text-2xl">location_on</span>
          <span className="absolute right-15 bg-black/90 text-white font-montserrat text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
            Chỉ đường 98 Đông A
          </span>
        </a>

        {/* 🔝 6. Nút cuộn lên đầu trang */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="group/item relative flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-gray-900 shadow-md hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200 backdrop-blur-sm mt-1 cursor-pointer"
            title="Lên đầu trang"
          >
            <span className="material-symbols-outlined text-xl">arrow_upward</span>
            <span className="absolute right-15 bg-black/90 text-white font-montserrat text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl font-medium">
              Về đầu trang
            </span>
          </button>
        )}

      </aside>

      {/* AI Chat Window Modal */}
      <AIChatModal 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </>
  );
}
