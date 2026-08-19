'use client';

import { useState } from 'react';
import { INVITATION_TEMPLATES, VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

// Helper component for Floral SVG Corner Ornaments
function FloralOrnaments({ theme }) {
  let strokeColor = '#d4af37';
  if (theme === 'rose-blush') strokeColor = '#e8a5b8';
  if (theme === 'emerald-leaf') strokeColor = '#74c69d';
  if (theme === 'champagne-lace') strokeColor = '#e5c158';
  if (theme === 'crimson-rose') strokeColor = '#d90429';
  if (theme === 'minimal-silver') strokeColor = '#a8a29e';

  return (
    <>
      {/* Top Left Corner Floral SVG */}
      <svg className="absolute top-2 left-2 w-16 h-16 pointer-events-none opacity-80" viewBox="0 0 100 100" fill="none">
        <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill={strokeColor} />
        <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill={strokeColor} opacity="0.6" />
        <path d="M15 25 C8 30, 12 40, 22 35 C25 25, 18 18, 15 25 Z" fill={strokeColor} opacity="0.6" />
      </svg>

      {/* Top Right Corner Floral SVG */}
      <svg className="absolute top-2 right-2 w-16 h-16 pointer-events-none opacity-80 transform scale-x-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill={strokeColor} />
        <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill={strokeColor} opacity="0.6" />
        <path d="M15 25 C8 30, 12 40, 22 35 C25 25, 18 18, 15 25 Z" fill={strokeColor} opacity="0.6" />
      </svg>

      {/* Bottom Left Corner Floral SVG */}
      <svg className="absolute bottom-2 left-2 w-16 h-16 pointer-events-none opacity-80 transform scale-y-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill={strokeColor} />
        <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill={strokeColor} opacity="0.6" />
      </svg>

      {/* Bottom Right Corner Floral SVG */}
      <svg className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none opacity-80 transform scale-x-[-1] scale-y-[-1]" viewBox="0 0 100 100" fill="none">
        <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill={strokeColor} />
        <path d="M25 15 C30 8, 40 12, 35 22 C25 25, 18 18, 25 15 Z" fill={strokeColor} opacity="0.6" />
      </svg>
    </>
  );
}

export default function InvitationBuilder({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(INVITATION_TEMPLATES[0]);
  
  // Separate Parents Fields
  const [groomFather, setGroomFather] = useState('Ông: Trần Văn A');
  const [groomMother, setGroomMother] = useState('Bà: Nguyễn Thị B');
  const [brideFather, setBrideFather] = useState('Ông: Lê Văn C');
  const [brideMother, setBrideMother] = useState('Bà: Phạm Thị D');
  
  // Optional Guest Name & Guest List Upload
  const [guestName, setGuestName] = useState(''); // Single optional guest name
  const [guestListRaw, setGuestListRaw] = useState(''); // Textarea for uploading/pasting multiple guest names

  // Venue floor selection
  const [selectedFloor, setSelectedFloor] = useState(VENUE_FLOOR_OPTIONS[2].id);
  const [eventTime, setEventTime] = useState('11:00 AM');
  const [invitationNote, setInvitationNote] = useState('Trân trọng kính mời Quý khách tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi!');
  
  const [createdSlug, setCreatedSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedVenueObj = VENUE_FLOOR_OPTIONS.find(v => v.id === selectedFloor) || VENUE_FLOOR_OPTIONS[2];

  const generateSlug = () => {
    const groomClean = (groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const brideClean = (brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const year = eventDate ? new Date(eventDate).getFullYear() : '2026';
    return `thiep-${groomClean}-${brideClean}-${year}`;
  };

  const handleCreateInvitation = async () => {
    setLoading(true);
    const slug = generateSlug();
    const payload = {
      slug,
      groomName: groomName || 'Trần Văn Chinh',
      brideName: brideName || 'Nguyễn Thu Hà',
      groomFather,
      groomMother,
      brideFather,
      brideMother,
      eventDate: eventDate || '2026-11-20',
      eventTime,
      floorId: selectedFloor,
      venueName: selectedVenueObj.name,
      templateId: selectedTemplate.id,
      invitationNote
    };

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCreatedSlug(data.slug || slug);
      } else {
        setCreatedSlug(slug);
      }
    } catch (e) {
      setCreatedSlug(slug);
    } finally {
      setLoading(false);
    }
  };

  const getBaseInvitationUrl = () => {
    const slugStr = createdSlug || generateSlug();
    return typeof window !== 'undefined'
      ? `${window.location.origin}/thiep/${slugStr}`
      : `/thiep/${slugStr}`;
  };

  const getFinalInvitationUrl = () => {
    const base = getBaseInvitationUrl();
    if (guestName.trim()) {
      return `${base}?guest=${encodeURIComponent(guestName.trim())}`;
    }
    return base;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getFinalInvitationUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Parse Guest List lines if user uploaded multiple names
  const parsedGuestNames = guestListRaw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Form Controls Column */}
      <div className="lg:col-span-6 bg-[#141414] border border-[#e3a638]/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">mark_email_read</span>
          Khởi Tạo Thiệp Cưới Điện Tử Nền Sáng Sang Trọng
        </h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Tự chọn phong cách thiệp cao cấp, phông chữ bay bổng & hoa văn tinh tế để tạo link gửi Zalo/Facebook.
        </p>

        {/* 6 Template Selector Grid */}
        <div className="mb-6">
          <label className="block text-gray-300 text-xs font-semibold mb-3 uppercase tracking-wider">
            1. Chọn Mẫu Thiệp Cưới Nền Sáng (6 Phong Cách)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {INVITATION_TEMPLATES.map((tmpl) => {
              const active = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/20 shadow-[0_0_15px_rgba(227,166,56,0.3)] ring-1 ring-[#e3a638]'
                      : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white truncate flex items-center justify-between">
                    <span className="truncate">{tmpl.name}</span>
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-1 truncate">{tmpl.badge}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-xs">
          
          {/* Tên Chú Rể & Cô Dâu */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Tên Chú Rể
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="VD: Trần Văn Chinh"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Tên Cô Dâu
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="VD: Nguyễn Thu Hà"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          {/* OPTIONAL GUEST NAME & GUEST LIST UPLOAD */}
          <div className="p-4 bg-[#1b1b1b] border border-[#e3a638]/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#e3a638] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Tùy Chọn Cá Nhân Hóa Tên Khách Mời (Không Bắt Buộc)
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded">Tùy chọn</span>
            </div>

            <div>
              <label className="block text-gray-300 text-[11px] font-semibold mb-1">
                Tên Khách Mời Cụ Thể (Điền 1 khách):
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="VD: Anh Nam & Chị Mai (Để trống nếu gửi link chung)"
                className="w-full bg-[#121212] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3.5 py-2 text-amber-300 font-medium outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-[11px] font-semibold mb-1">
                Hoặc Upload / Nhập Danh Sách Khách Mời (Mỗi dòng 1 tên khách):
              </label>
              <textarea
                rows={3}
                value={guestListRaw}
                onChange={(e) => setGuestListRaw(e.target.value)}
                placeholder={"Ví dụ:\nAnh Nam & Chị Mai\nBạn Hoàng (Lớp Cấp 3)\nGia đình Bác Hùng"}
                className="w-full bg-[#121212] border border-gray-700 focus:border-[#e3a638] rounded-lg p-3 text-gray-200 font-mono text-xs outline-none leading-relaxed"
              />
              <span className="text-[10px] text-gray-400 block mt-1">
                💡 Nhập danh sách tên khách mời để tạo hàng loạt Link Thiệp riêng biệt trân trọng nhất.
              </span>
            </div>
          </div>

          {/* Gia Đình Nhà Trai */}
          <div className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl space-y-3">
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              Gia Đình Nhà Trai
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-[10px] mb-1">Bố Chú Rể</label>
                <input
                  type="text"
                  value={groomFather}
                  onChange={(e) => setGroomFather(e.target.value)}
                  placeholder="Ông: Trần Văn A"
                  className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3 py-1.5 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] mb-1">Mẹ Chú Rể</label>
                <input
                  type="text"
                  value={groomMother}
                  onChange={(e) => setGroomMother(e.target.value)}
                  placeholder="Bà: Nguyễn Thị B"
                  className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3 py-1.5 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gia Đình Nhà Gái */}
          <div className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-xl space-y-3">
            <div className="text-pink-400 font-bold uppercase tracking-wider text-[11px]">
              Gia Đình Nhà Gái
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-[10px] mb-1">Bố Cô Dâu</label>
                <input
                  type="text"
                  value={brideFather}
                  onChange={(e) => setBrideFather(e.target.value)}
                  placeholder="Ông: Lê Văn C"
                  className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3 py-1.5 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[10px] mb-1">Mẹ Cô Dâu</label>
                <input
                  type="text"
                  value={brideMother}
                  onChange={(e) => setBrideMother(e.target.value)}
                  placeholder="Bà: Phạm Thị D"
                  className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3 py-1.5 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Địa điểm Sảnh Tầng 1, 2, 3, 4 */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
              Chọn Địa Điểm Tổ Chức (Tầng 1, 2, 3, 4)
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-[#e3a638] font-bold outline-none cursor-pointer"
            >
              {VENUE_FLOOR_OPTIONS.map((floor) => (
                <option key={floor.id} value={floor.id} className="bg-[#1f1f1f] text-white">
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Ngày Tổ Chức
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Giờ Đón Khách
              </label>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="11:00 AM hoặc 17:30 PM"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
              Lời Mời Thân Thương
            </label>
            <textarea
              rows={2}
              value={invitationNote}
              onChange={(e) => setInvitationNote(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3 text-white outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Generate Link Button */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={handleCreateInvitation}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">insert_link</span>
            {loading ? 'Đang Khởi Tạo Link Thiệp...' : 'Khởi Tạo Link Thiệp Cưới Điện Tử'}
          </button>
        </div>

        {/* Shareable Link Result Box */}
        {createdSlug && (
          <div className="mt-5 p-4 bg-[#1b1910] border border-amber-500/40 rounded-xl text-center space-y-4 animate-fade-in">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Link Thiệp Cưới Điện Tử Đã Sẵn Sàng!
            </div>
            
            <input
              type="text"
              readOnly
              value={getFinalInvitationUrl()}
              className="w-full bg-[#121212] border border-gray-700 text-amber-400 font-mono text-xs px-3 py-2 rounded-lg text-center select-all"
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-amber-400 text-black text-xs font-bold uppercase rounded-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                {copiedLink ? 'Đã Copy Link!' : 'Copy Link Thiệp'}
              </button>
              <a
                href={getFinalInvitationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-[#2a2a2a] text-white text-xs font-semibold uppercase rounded-lg border border-gray-700 hover:bg-[#333] transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Xem Thiệp Trực Tiếp
              </a>
            </div>

            {/* Batch List Links if Guest List Raw was provided */}
            {parsedGuestNames.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800 text-left space-y-2">
                <span className="text-xs font-bold text-amber-300 block">
                  📋 Danh Sách Link Thiệp Riêng Cho {parsedGuestNames.length} Khách Mời:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedGuestNames.map((gName, gIdx) => {
                    const gUrl = `${getBaseInvitationUrl()}?guest=${encodeURIComponent(gName)}`;
                    return (
                      <div key={gIdx} className="flex items-center justify-between bg-[#121212] p-2 rounded-lg text-xs border border-gray-800">
                        <span className="font-semibold text-gray-200 truncate max-w-[160px]">{gName}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(gUrl);
                            alert(`✅ Đã copy link thiệp cho ${gName}!`);
                          }}
                          className="px-2.5 py-1 bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-black rounded text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Copy Link
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Right Column: Live E-Card Preview */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[#e3a638]">visibility</span>
            <span className="text-sm font-semibold tracking-wider uppercase font-playfair">
              Xem Trước Thiệp Cưới (Live Card)
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-mono font-medium">{selectedTemplate.name}</span>
        </div>

        {/* Mobile Device Frame */}
        <div className="w-full max-w-sm rounded-[36px] p-3 bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 border-4 border-amber-400/50 shadow-[0_15px_50px_rgba(0,0,0,0.4)] relative">
          
          {/* Top Notch Bar */}
          <div className="w-24 h-3 bg-stone-800 mx-auto rounded-full mb-3"></div>

          {/* E-Card Canvas dynamically rendered according to selected template */}
          <div className={`w-full rounded-[24px] overflow-hidden p-6 text-center ${selectedTemplate.bgClass} ${selectedTemplate.cardBorder} relative shadow-xl transition-all duration-500 min-h-[500px] flex flex-col justify-between`}>
            
            {/* SVG Floral Corner Ornaments */}
            <FloralOrnaments theme={selectedTemplate.floralTheme} />

            {/* Logo Golden Palace ở góc trái trên cùng */}
            <div className="absolute top-3 left-4 flex items-center gap-1.5 z-20">
              <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-7 w-auto object-contain drop-shadow" />
              <span className="text-[8px] font-playfair tracking-[0.2em] text-[#a66a3a] font-bold uppercase">
                GOLDEN PALACE
              </span>
            </div>

            {/* Top Space for Logo */}
            <div className="pt-6"></div>

            {/* Optional Guest Name Banner if typed */}
            {guestName.trim() && (
              <div className="my-1.5 p-2 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-xl relative z-10 text-center">
                <span className="text-[9px] uppercase tracking-widest text-[#a66a3a] font-bold block">TRÂN TRỌNG KÍNH MỜI</span>
                <span className="text-xs font-bold text-stone-900 font-playfair">{guestName.trim()}</span>
              </div>
            )}

            {/* Header Motif & English Ceremony Title */}
            <div className="my-2 relative z-10">
              <div className="font-script text-4xl sm:text-5xl text-[#b8860b] mb-1" style={{ color: selectedTemplate.accentColor }}>
                We Do
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-serif font-bold text-stone-600 mb-2">
                TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
              </div>
              
              {/* WEDDING CEREMONY (English) */}
              <h2 className="text-xl sm:text-2xl font-playfair font-bold uppercase tracking-wider my-1" style={{ color: selectedTemplate.accentColor }}>
                WEDDING CEREMONY
              </h2>
              <div className="text-[9px] italic font-serif text-stone-500">
                vui lòng đến dự buổi tiệc chung vui cùng gia đình chúng tôi
              </div>
            </div>

            {/* Couple Calligraphy Names */}
            <div className={`my-3 p-4 rounded-2xl ${selectedTemplate.boxBg} relative z-10 shadow-xs`}>
              <div className="font-script text-4xl sm:text-5xl leading-tight drop-shadow-xs" style={{ color: selectedTemplate.accentColor }}>
                {groomName || 'Trần Văn Chinh'}
              </div>
              <div className="text-xl font-serif italic my-0.5" style={{ color: selectedTemplate.accentColor }}>&</div>
              <div className="font-script text-4xl sm:text-5xl leading-tight drop-shadow-xs" style={{ color: selectedTemplate.accentColor }}>
                {brideName || 'Nguyễn Thu Hà'}
              </div>
            </div>

            {/* Groom & Bride Parents */}
            <div className="grid grid-cols-2 gap-2 text-[10px] border-y border-stone-300/60 py-3 my-2 text-stone-700 font-serif relative z-10">
              <div className="space-y-0.5 border-r border-stone-200 pr-1">
                <div className="font-bold uppercase text-[9px]" style={{ color: selectedTemplate.accentColor }}>NHÀ TRAI</div>
                <div className="truncate font-medium">{groomFather || 'Ông: Trần Văn A'}</div>
                <div className="truncate font-medium">{groomMother || 'Bà: Nguyễn Thị B'}</div>
              </div>
              <div className="space-y-0.5 pl-1">
                <div className="font-bold uppercase text-[9px]" style={{ color: selectedTemplate.accentColor }}>NHÀ GÁI</div>
                <div className="truncate font-medium">{brideFather || 'Ông: Lê Văn C'}</div>
                <div className="truncate font-medium">{brideMother || 'Bà: Phạm Thị D'}</div>
              </div>
            </div>

            {/* Event Time & Floor Venue */}
            <div className={`rounded-xl p-3 ${selectedTemplate.boxBg} shadow-xs my-2 text-xs relative z-10`}>
              <div className="text-stone-500 text-[9px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                THỜI GIAN CỬ HÀNH
              </div>
              <div className="font-bold text-sm font-mono text-stone-900">
                {eventTime} • {eventDate ? new Date(eventDate).toLocaleDateString('vi-VN') : '20/11/2026'}
              </div>
              <div className="text-stone-500 text-[9px] uppercase font-bold tracking-wider mt-2 mb-0.5 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                ĐỊA ĐIỂM TỔ CHỨC
              </div>
              <div className="font-bold text-sm font-playfair uppercase text-stone-900">
                {selectedVenueObj.shortName}
              </div>
              <div className="font-bold text-[10px] mt-0.5 uppercase" style={{ color: selectedTemplate.accentColor }}>
                GOLDEN PALACE NAM ĐỊNH
              </div>
              <div className="text-[9px] text-stone-500 mt-0.5">
                98 Đông A, KĐT Hòa Vượng, TP. Nam Định
              </div>
            </div>

            {/* Honor Note formatted with explicit line break before 'cho' */}
            <div className="pt-2 border-t border-stone-200/80 text-[10px] text-stone-600 font-serif italic relative z-10 leading-relaxed">
              Sự hiện diện của Quý vị là niềm vinh hạnh lớn<br />
              cho gia đình chúng tôi!
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="w-16 h-1 bg-stone-500 mx-auto rounded-full mt-2"></div>
        </div>
      </div>

    </div>
  );
}
