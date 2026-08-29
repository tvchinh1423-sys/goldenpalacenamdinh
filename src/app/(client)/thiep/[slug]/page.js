'use client';

import { use, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

function PublicInvitationContent({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  // Dynamic values extracted from searchParams with elegant fallbacks
  const groomName = searchParams.get('groom') || 'Trần Văn Chinh';
  const brideName = searchParams.get('bride') || 'Nguyễn Thu Hà';
  const groomFather = searchParams.get('gf') || 'Ông: Trần Văn A';
  const groomMother = searchParams.get('gm') || 'Bà: Nguyễn Thị B';
  const brideFather = searchParams.get('bf') || 'Ông: Lê Văn C';
  const brideMother = searchParams.get('bm') || 'Bà: Phạm Thị D';
  const eventDateStr = searchParams.get('date') || '2026-11-20';
  const eventTime = searchParams.get('time') || '11:00 AM';
  const floorId = searchParams.get('floor') || 'FLOOR_3';
  const guestName = searchParams.get('guest') || '';
  const customNote = searchParams.get('note') || 'Trân trọng kính mời Quý khách tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi!';

  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Find venue object
  const venueObj = VENUE_FLOOR_OPTIONS.find(v => v.id === floorId || v.idLed === floorId) || VENUE_FLOOR_OPTIONS[0];

  // Format Date in Vietnamese
  const formatDateVN = (dStr) => {
    if (!dStr) return 'Ngày 20 Tháng 11 Năm 2026';
    try {
      const date = new Date(dStr);
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayOfWeek = days[date.getDay()];
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${dayOfWeek}, Ngày ${day} Tháng ${month} Năm ${year}`;
    } catch (e) {
      return 'Ngày 20 Tháng 11 Năm 2026';
    }
  };

  // Calendar Event Data
  const eventDetails = {
    title: `Tiệc Cưới ${groomName} & ${brideName} - Golden Palace Nam Định`,
    description: customNote,
    location: `Golden Palace Nam Định - ${venueObj.shortName}, 98 Đông A, KĐT Hòa Vượng, TP. Nam Định`,
    startDate: eventDateStr.replace(/-/g, '') + 'T040000Z',
    endDate: eventDateStr.replace(/-/g, '') + 'T070000Z'
  };

  const handleGoogleCalendar = () => {
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    window.open(gcalUrl, '_blank');
  };

  const handleDownloadIcal = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Golden Palace Nam Dinh//Wedding Invitation//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tiec-cuoi-golden-palace.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        </svg>

        {/* Logo Golden Palace */}
        <Link href="/" target="_blank" className="absolute top-4 left-5 flex items-center gap-1.5 z-20 hover:opacity-80 transition-opacity">
          <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-8 w-auto object-contain drop-shadow-xs" />
          <span className="text-[9px] font-playfair tracking-[0.2em] text-[#a66a3a] font-bold uppercase">
            GOLDEN PALACE
          </span>
        </Link>

        {/* Header Spacing */}
        <div className="pt-6 w-full text-center relative z-10">
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] mb-1">
            We Do
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#a66a3a] font-bold mb-4 border-b border-amber-200/80 pb-3">
            TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
          </div>
        </div>

        {/* GUEST NAME DISPLAY */}
        {guestName && (
          <div className="w-full bg-[#fdfbf7] border border-[#d4af37]/60 rounded-2xl p-4 my-2 text-center shadow-xs relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#a66a3a] font-serif font-bold block mb-1">
              KÍNH MỜI QUÝ KHÁCH
            </span>
            <span className="text-xl sm:text-2xl font-playfair font-bold text-[#b8860b] drop-shadow-xs">
              {guestName}
            </span>
          </div>
        )}

        {/* Ceremony Title */}
        <div className="text-center space-y-1 my-4 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#b8860b] tracking-wider uppercase">
            WEDDING CEREMONY
          </h1>
          <p className="text-[11px] text-stone-600 font-serif italic">
            vui lòng đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>
        </div>

        {/* Couple Calligraphy Names DYNAMIC */}
        <div className="w-full bg-[#fdfbf7] border border-[#e3a638]/30 rounded-2xl p-6 text-center shadow-xs mb-6 relative z-10">
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] leading-tight drop-shadow-xs">
            {groomName}
          </div>
          <div className="my-1 text-[#b8860b] font-serif italic text-2xl">&</div>
          <div className="font-script text-4xl sm:text-5xl text-[#b8860b] leading-tight drop-shadow-xs">
            {brideName}
          </div>
        </div>

        {/* Groom & Bride Parents DYNAMIC */}
        <div className="w-full grid grid-cols-2 gap-3 text-xs border-y border-amber-200/80 py-4 mb-6 font-serif relative z-10">
          <div className="text-center border-r border-amber-200/60 pr-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ TRAI</div>
            <div className="text-stone-800 font-medium">{groomFather}</div>
            <div className="text-stone-800 font-medium">{groomMother}</div>
          </div>
          <div className="text-center pl-2 space-y-1">
            <div className="font-bold text-[#a66a3a] uppercase text-[10px] tracking-wider">NHÀ GÁI</div>
            <div className="text-stone-800 font-medium">{brideFather}</div>
            <div className="text-stone-800 font-medium">{brideMother}</div>
          </div>
        </div>

        {/* Event Time & Venue Floor Details DYNAMIC */}
        <div className="w-full space-y-3 text-center text-xs mb-6 relative z-10">
          <div className="p-4 bg-[#fdfbf7] border border-[#e3a638]/30 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Thời Gian Cử Hành / Giờ Đón Khách
            </div>
            <div className="text-xl font-bold text-stone-900 font-mono">{eventTime}</div>
            <div className="text-stone-700 font-medium mt-0.5">{formatDateVN(eventDateStr)}</div>
          </div>

          <div className="p-4 bg-[#fdfbf7] border border-[#e3a638]/30 rounded-xl">
            <div className="text-[#a66a3a] text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Địa Điểm Tổ Chức
            </div>
            <div className="text-xl font-bold text-stone-900 font-playfair uppercase">
              {venueObj.shortName || 'Tầng 3'}
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

        {/* Calendar Add Button */}
        <div className="w-full mb-6 relative z-10">
          <button
            onClick={() => setShowCalendarModal(!showCalendarModal)}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span>THÊM VÀO LỊCH</span>
          </button>

          {showCalendarModal && (
            <div className="mt-3 p-4 bg-white border border-[#e3a638]/40 rounded-2xl shadow-xl space-y-2 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="text-[11px] font-bold text-stone-900 block mb-2 border-b pb-1.5">
                Chọn ứng dụng lịch trên điện thoại của bạn:
              </span>
              
              <button
                onClick={handleDownloadIcal}
                className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-950 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-lg">phone_iphone</span>
                  <span>iPhone / Apple Calendar / Outlook (.ics)</span>
                </div>
                <span className="material-symbols-outlined text-base text-amber-700">download</span>
              </button>

              <button
                onClick={handleGoogleCalendar}
                className="w-full p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-950 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700 text-lg">event</span>
                  <span>Google Calendar (Android / PC)</span>
                </div>
                <span className="material-symbols-outlined text-base text-blue-700">open_in_new</span>
              </button>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="w-full pt-4 border-t border-amber-200/80 text-center space-y-2 relative z-10">
          <p className="text-xs text-stone-600 italic font-serif leading-relaxed">
            {customNote}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] text-stone-500 relative z-10">
          <Link href="/" target="_blank" className="hover:text-[#a66a3a] transition-colors underline font-medium">
            Golden Palace Wedding & Convention Center • Hotline: 0228 659 5959
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function PublicInvitationPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf6f0] flex items-center justify-center text-stone-600 text-xs">Đang tải thiệp cưới...</div>}>
      <PublicInvitationContent params={params} />
    </Suspense>
  );
}
