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

export default function InvitationBuilder({ 
  groomName, 
  setGroomName, 
  brideName, 
  setBrideName, 
  eventDate, 
  setEventDate,
  eventTime,
  setEventTime,
  selectedFloor,
  setSelectedFloor
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(INVITATION_TEMPLATES[0]);
  
  // Separate Parents Fields
  const [groomFather, setGroomFather] = useState('Ông: Trần Văn A');
  const [groomMother, setGroomMother] = useState('Bà: Nguyễn Thị B');
  const [brideFather, setBrideFather] = useState('Ông: Lê Văn C');
  const [brideMother, setBrideMother] = useState('Bà: Phạm Thị D');
  
  // Optional Guest Name & Guest List Upload
  const [guestName, setGuestName] = useState(''); // Single optional guest name
  const [guestListRaw, setGuestListRaw] = useState(''); // Textarea for uploading/pasting multiple guest names

  const [invitationNote, setInvitationNote] = useState('Trân trọng kính mời Quý khách tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi!');
  
  const [createdSlug, setCreatedSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedVenueObj = VENUE_FLOOR_OPTIONS.find(v => v.id === selectedFloor || v.idLed === selectedFloor) || VENUE_FLOOR_OPTIONS[0];

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
      groomName: groomName || 'Đức Hoàng',
      brideName: brideName || 'Thu Hương',
      groomFather,
      groomMother,
      brideFather,
      brideMother,
      eventDate: eventDate || '2026-11-20',
      eventTime: eventTime || '11:00 AM',
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

  // BUILD DYNAMIC INVITATION URL WITH ALL CUSTOMIZATION PARAMS ACCURATELY
  const buildInvitationUrlWithParams = (gName = '') => {
    const base = getBaseInvitationUrl();
    const params = new URLSearchParams();
    if (groomName) params.set('groom', groomName);
    if (brideName) params.set('bride', brideName);
    if (groomFather) params.set('gf', groomFather);
    if (groomMother) params.set('gm', groomMother);
    if (brideFather) params.set('bf', brideFather);
    if (brideMother) params.set('bm', brideMother);
    if (eventDate) params.set('date', eventDate);
    if (eventTime) params.set('time', eventTime);
    if (selectedFloor) params.set('floor', selectedFloor);
    if (selectedTemplate?.id) params.set('tmpl', selectedTemplate.id);
    if (invitationNote) params.set('note', invitationNote);

    const targetGuest = gName.trim() || guestName.trim();
    if (targetGuest) params.set('guest', targetGuest);

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const getFinalInvitationUrl = () => {
    return buildInvitationUrlWithParams();
  };

  const handleCopyLink = (customUrl = null) => {
    const targetUrl = customUrl || getFinalInvitationUrl();
    navigator.clipboard.writeText(targetUrl);
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
        
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">mark_email_read</span>
          Tạo Thiệp Cưới Điện Tử Online
        </h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Tùy chỉnh thông tin nhà trai, nhà gái, giờ đón khách và địa điểm. Mọi thông tin sẽ được đóng gói chuẩn 100% vào Link thiệp!
        </p>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="block text-amber-300 text-xs font-bold mb-2.5 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">palette</span>
            Chọn Giao Diện Theme Thiệp Cưới
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {INVITATION_TEMPLATES.map((tmpl) => {
              const active = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/15 shadow-[0_0_15px_rgba(227,166,56,0.25)]'
                      : 'border-gray-800 bg-[#161616] hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{tmpl.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.accentColor }}></span>
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
                placeholder="VD: Đức Hoàng"
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
                placeholder="VD: Thu Hương"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          {/* OPTIONAL GUEST NAME & GUEST LIST UPLOAD */}
          <div className="p-4 bg-[#1b1b1b] border border-[#e3a638]/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#e3a638] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Tùy Chọn Tên Khách Mời (Không Bắt Buộc)
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

          {/* Địa điểm Sảnh (3-WAY SYNCHRONIZED WITH TOP FORM & LED CUSTOMIZER) */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
              Địa Điểm Tổ Chức (Tầng 2, 3, 4) (*)
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
            
            {/* GIỜ ĐÓN KHÁCH (2-WAY SYNCHRONIZED WITH TOP FORM TIME) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Giờ Đón Khách (*)
              </label>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="VD: 11:00 AM"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-amber-300 font-bold outline-none"
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
            {loading ? 'Đang Đóng Gói Thiệp...' : 'Tạo & Đóng Gói Link Thiệp Điện Tử'}
          </button>

          {/* Copy Link Output Box */}
          <div className="mt-4 p-3.5 bg-[#1a1a1a] rounded-xl border border-amber-500/30 space-y-2">
            <div className="text-[11px] text-gray-300 font-bold flex items-center justify-between">
              <span>LINK THIỆP CƯỚI ĐÃ ĐÓNG GÓI ĐẦY ĐỦ THÔNG TIN:</span>
              {guestName.trim() && <span className="text-amber-300 text-[10px]">Đã gắn tên khách</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getFinalInvitationUrl()}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2 text-amber-300 font-mono text-[11px] outline-none select-all"
              />
              <button
                onClick={() => handleCopyLink()}
                className="px-4 py-2 bg-[#e3a638] hover:bg-[#c98e27] text-black font-bold text-[11px] uppercase rounded-lg transition-all shrink-0 cursor-pointer"
              >
                {copiedLink ? 'Đã Chép!' : 'Sao Chép'}
              </button>
            </div>

            {/* If user pasted multiple guest names, list individual links */}
            {parsedGuestNames.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-300 block">
                  DANH SÁCH LINK RIÊNG CHO TỪNG KHÁCH ({parsedGuestNames.length} khách):
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {parsedGuestNames.map((g, idx) => {
                    const guestUrl = buildInvitationUrlWithParams(g);
                    return (
                      <div key={idx} className="flex items-center justify-between bg-[#121212] p-2 rounded border border-gray-800 text-[11px]">
                        <span className="font-semibold text-white truncate max-w-[150px]">{g}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={guestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline text-[10px]"
                          >
                            Xem
                          </a>
                          <button
                            onClick={() => handleCopyLink(guestUrl)}
                            className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded text-[10px] font-bold hover:bg-amber-400/30 cursor-pointer"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right E-Card Preview Column */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-playfair flex items-center gap-1">
            <span className="material-symbols-outlined text-base">visibility</span>
            Xem Trước Thiệp Cưới Điện Tử Thực Tế
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            {selectedTemplate.name}
          </span>
        </div>

        {/* E-Card Interactive Preview Screen */}
        <div className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 ${selectedTemplate.bgClass || 'bg-[#faf6f0]'} ${selectedTemplate.cardBorder} relative overflow-hidden transition-all duration-500 text-stone-800`}>
          <FloralOrnaments theme={selectedTemplate.floralTheme} />

          {/* Logo Golden Palace */}
          <div className="absolute top-4 left-5 flex items-center gap-1.5 z-20">
            <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-6 w-auto object-contain" />
            <span className="text-[8px] font-playfair tracking-[0.2em] text-amber-800 font-bold uppercase">
              GOLDEN PALACE
            </span>
          </div>

          <div className="pt-4 text-center relative z-10">
            <div className={`font-script text-3xl ${selectedTemplate.nameColor || 'text-amber-800'} mb-1`}>
              We Do
            </div>
            <div className={`text-[9px] tracking-[0.3em] uppercase ${selectedTemplate.headerColor || 'text-amber-900'} font-bold mb-3 border-b border-amber-300/40 pb-2`}>
              TRÂN TRỌNG KÍNH MỜI
            </div>
          </div>

          {/* GUEST NAME IF ENTERED */}
          {guestName.trim() && (
            <div className={`w-full ${selectedTemplate.boxBg || 'bg-white/80'} rounded-xl p-2.5 my-2 text-center shadow-xs`}>
              <span className={`text-[9px] tracking-[0.2em] uppercase ${selectedTemplate.headerColor || 'text-amber-800'} font-bold block`}>
                KÍNH MỜI QUÝ KHÁCH
              </span>
              <span className={`text-base font-playfair font-bold ${selectedTemplate.nameColor || 'text-amber-900'}`}>
                {guestName}
              </span>
            </div>
          )}

          <div className="text-center space-y-0.5 my-3 relative z-10">
            <h4 className={`text-lg font-playfair font-bold ${selectedTemplate.nameColor || 'text-amber-800'} tracking-wider uppercase`}>
              WEDDING CEREMONY
            </h4>
            <p className="text-[10px] text-stone-600 font-serif italic">
              dự bữa cơm thân mật cùng gia đình
            </p>
          </div>

          {/* Couple Names */}
          <div className={`w-full ${selectedTemplate.boxBg || 'bg-white/80'} rounded-xl p-4 text-center my-3`}>
            <div className={`font-script text-3xl ${selectedTemplate.nameColor || 'text-amber-800'} leading-tight`}>
              {groomName || 'Đức Hoàng'}
            </div>
            <div className={`my-0.5 ${selectedTemplate.nameColor || 'text-amber-800'} font-serif italic text-lg`}>&</div>
            <div className={`font-script text-3xl ${selectedTemplate.nameColor || 'text-amber-800'} leading-tight`}>
              {brideName || 'Thu Hương'}
            </div>
          </div>

          {/* Parents */}
          <div className="w-full grid grid-cols-2 gap-2 text-[10px] border-y border-amber-300/50 py-3 my-3 font-serif">
            <div className="text-center border-r border-amber-300/40 pr-1 space-y-0.5">
              <div className={`font-bold ${selectedTemplate.headerColor || 'text-amber-800'} uppercase text-[9px]`}>NHÀ TRAI</div>
              <div className="text-stone-800">{groomFather}</div>
              <div className="text-stone-800">{groomMother}</div>
            </div>
            <div className="text-center pl-1 space-y-0.5">
              <div className={`font-bold ${selectedTemplate.headerColor || 'text-amber-800'} uppercase text-[9px]`}>NHÀ GÁI</div>
              <div className="text-stone-800">{brideFather}</div>
              <div className="text-stone-800">{brideMother}</div>
            </div>
          </div>

          {/* Event Time & Venue Floor */}
          <div className="space-y-2 text-center text-[10px] my-3">
            <div className={`p-2.5 ${selectedTemplate.boxBg || 'bg-white/80'} rounded-lg`}>
              <div className={`${selectedTemplate.headerColor || 'text-amber-800'} text-[9px] font-bold uppercase`}>Thời Gian Cử Hành</div>
              <div className="text-sm font-bold text-stone-900 font-mono mt-0.5">{eventTime || '11:00 AM'}</div>
              <div className="text-stone-700 font-medium">{eventDate || '2026-11-20'}</div>
            </div>

            <div className={`p-2.5 ${selectedTemplate.boxBg || 'bg-white/80'} rounded-lg`}>
              <div className={`${selectedTemplate.headerColor || 'text-amber-800'} text-[9px] font-bold uppercase`}>Địa Điểm Tổ Chức</div>
              <div className="text-sm font-bold text-stone-900 font-playfair uppercase">
                {selectedVenueObj.shortName || 'Tầng 3'}
              </div>
              <div className={`${selectedTemplate.headerColor || 'text-amber-800'} font-bold text-[9px] uppercase`}>GOLDEN PALACE NAM ĐỊNH</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
