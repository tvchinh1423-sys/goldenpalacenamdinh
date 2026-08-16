"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatModal from './AIChatModal';
import BookingConsultationModal from './BookingConsultationModal';

export default function FloatingCTA() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // State for Mobile / Desktop collapse toggle
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Floating Action Container with Auto-Collapse on Idle */}
      <aside 
        aria-label="Kênh hỗ trợ & Liên hệ cao cấp" 
        className="fixed right-4 bottom-[88px] sm:bottom-6 z-50 flex flex-col items-end gap-3 font-montserrat"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        
        {/* EXPANDED ACTION BUTTONS (Shown when hovered on PC or toggled open on Mobile) */}
        <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          isExpanded ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-4 hidden'
        }`}>

          {/* 1. NÚT AI CHAT */}
          <div className="relative flex items-center justify-end">
            <button
              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
              className="group/ai relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#2a2419] to-[#0d0d0d] text-white shadow-xl hover:scale-110 transition-all duration-300 ring-2 ring-[#e3a638] cursor-pointer"
              title="Hỏi đáp 24/7 cùng Trợ lý AI Golden Palace"
            >
              <div className="w-8 h-8 rounded-full bg-black/90 flex items-center justify-center p-1 shadow-inner border border-[#e3a638]/40">
                <img src="/logo-icon.png" alt="AI Consultant" className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(227,166,56,0.8)]" />
              </div>

              <span className="absolute -top-1 -left-1 text-amber-300 text-xs animate-pulse">✨</span>

              <span className="absolute right-15 bg-black/95 text-[#fcf9f2] text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover/ai:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl border border-[#e3a638]/40 backdrop-blur-md font-medium">
                💬 Chat ngay với <strong className="text-[#e3a638]">Trợ lý AI 24/7</strong>
              </span>
            </button>
          </div>

          {/* 2. NÚT ĐẶT LỊCH TƯ VẤN */}
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="group/item relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white shadow-lg hover:scale-110 transition-all duration-300 border border-white/30 cursor-pointer"
            title="Đặt lịch tư vấn Online & Trực tiếp tại nhà hàng"
          >
            <span className="material-symbols-outlined text-xl drop-shadow-sm">edit_calendar</span>
            <span className="absolute right-14 bg-black/95 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-[#e3a638]/40 backdrop-blur-md font-medium">
              📅 Đặt lịch tư vấn <strong className="text-[#e3a638]">Online & Trực tiếp</strong>
            </span>
          </button>

          {/* 3. Dự toán chi phí */}
          <Link 
            href="/du-toan-chi-phi" 
            className="group/item relative flex items-center justify-center w-11 h-11 rounded-full bg-[#1c1917] text-[#e3a638] shadow-lg hover:scale-108 transition-all duration-300 border border-[#e3a638]/40"
            title="Dự toán chi phí sự kiện"
          >
            <span className="material-symbols-outlined text-xl">calculate</span>
            <span className="absolute right-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
              🧮 Dự toán chi phí sự kiện
            </span>
          </Link>

          {/* 4. Hotline Trực tiếp */}
          <a 
            href="tel:02286595959" 
            className="group/item relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-amber-950 to-gray-900 text-[#e3a638] shadow-lg hover:scale-108 transition-all duration-300 border border-[#e3a638]/40"
            title="Hotline tư vấn nhanh"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            <span className="absolute right-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
              📞 Hotline: <strong className="text-[#e3a638] whitespace-nowrap">0228 659 5959</strong>
            </span>
          </a>

          {/* 5. Facebook Messenger */}
          <a 
            href="https://m.me/goldenpalaceweddingnamdinh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group/item relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] text-white shadow-lg hover:scale-108 transition-all duration-300 border border-white/20"
            title="Nhắn tin Facebook Messenger"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.206V22l3.415-1.874c.91.252 1.876.39 2.851.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.042 12.433l-2.55-2.721-4.977 2.721 5.474-5.81 2.616 2.72 4.911-2.72-5.474 5.81z"/>
            </svg>
            <span className="absolute right-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
              💬 Messenger Fanpage
            </span>
          </a>

          {/* 6. Chỉ đường Maps */}
          <a 
            href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group/item relative flex items-center justify-center w-11 h-11 rounded-full bg-[#064e3b] text-emerald-300 shadow-lg hover:scale-108 transition-all duration-300 border border-emerald-500/30"
            title="Chỉ đường Google Maps"
          >
            <span className="material-symbols-outlined text-xl">location_on</span>
            <span className="absolute right-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10 backdrop-blur-sm font-medium">
              📍 Chỉ đường 98 Đông A
            </span>
          </a>

          {/* 7. Nút cuộn lên đầu trang */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="group/item relative flex items-center justify-center w-9 h-9 rounded-full bg-white text-gray-900 shadow-md hover:scale-110 transition-all duration-200 border border-gray-200 cursor-pointer"
              title="Lên đầu trang"
            >
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
          )}

        </div>

        {/* COMPACT MAIN TRIGGER BUTTON (Visible when collapsed, toggles on click / hover) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`group/main relative flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl border transition-all duration-300 cursor-pointer ${
            isExpanded 
              ? 'bg-gray-900 text-amber-300 border-[#e3a638]' 
              : 'bg-gradient-to-r from-[#1c1917] via-[#2a2419] to-[#0d0d0d] text-white border-[#e3a638]/70 opacity-90 hover:opacity-100 hover:scale-105'
          }`}
          title="Bấm để xem/ẩn Kênh Hỗ Trợ Golden Palace"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-[#e3a638] flex items-center justify-center">
            <img src="/logo-icon.png" alt="Golden Palace" className="w-4 h-4 object-contain" />
          </div>
          
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200 whitespace-nowrap">
            {isExpanded ? 'Đóng Menu' : 'Hỗ Trợ 24/7'}
          </span>

          <span className="material-symbols-outlined text-base text-[#e3a638] transition-transform duration-300">
            {isExpanded ? 'expand_more' : 'unfold_more'}
          </span>

          {!isExpanded && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          )}
        </button>

      </aside>

      {/* AI Chat Window Modal */}
      <AIChatModal 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />

      {/* Booking Consultation Modal */}
      <BookingConsultationModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
