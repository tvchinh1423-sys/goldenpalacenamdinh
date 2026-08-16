'use client';

import { useState } from 'react';
import { INVITATION_TEMPLATES } from '@/lib/personalize-data';

export default function InvitationBuilder({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(INVITATION_TEMPLATES[0]);
  const [groomParents, setGroomParents] = useState('Ông: Trần Văn A - Bà: Nguyễn Thị B');
  const [brideParents, setBrideParents] = useState('Ông: Lê Văn C - Bà: Phạm Thị D');
  const [eventTime, setEventTime] = useState('11:00 AM');
  const [invitationNote, setInvitationNote] = useState('Trân trọng kính mời Quý khách tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi!');
  const [createdSlug, setCreatedSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const generateSlug = () => {
    const groomClean = (groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const brideClean = (brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const year = eventDate ? new Date(eventDate).getFullYear() : '2026';
    return `${groomClean}-${brideClean}-${year}`;
  };

  const handleCreateInvitation = async () => {
    setLoading(true);
    const slug = generateSlug();
    const payload = {
      slug,
      groomName: groomName || 'Trần Văn Chinh',
      brideName: brideName || 'Nguyen Thu Hà',
      groomParents,
      brideParents,
      eventDate: eventDate || '2026-11-20',
      eventTime,
      templateId: selectedTemplate.id,
      invitationNote,
      venueName: 'Trung tâm Tiệc cưới & Sự kiện Golden Palace Nam Định',
      venueAddress: '98 Đông A, KĐT Hòa Vượng, TP Nam Định'
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
        // Fallback in case of mock offline
        setCreatedSlug(slug);
      }
    } catch (e) {
      setCreatedSlug(slug);
    } finally {
      setLoading(false);
    }
  };

  const invitationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/thiep/${createdSlug || generateSlug()}`
    : `/thiep/${generateSlug()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Form Controls Column */}
      <div className="lg:col-span-6 bg-[#141414] border border-[#e3a638]/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">mail</span>
          Thiết Kế Thiệp Cưới Điện Tử
        </h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Tạo link thiệp online gửi tới bạn bè & người thân qua Zalo/Facebook. Tích hợp sẵn bản đồ địa điểm và nút thu thập xác nhận tham dự (RSVP).
        </p>

        {/* Template Selector Grid */}
        <div className="mb-6">
          <label className="block text-gray-300 text-xs font-semibold mb-3 uppercase tracking-wider">
            1. Chọn Mẫu Thiệp Cưới Điện Tử
          </label>
          <div className="grid grid-cols-2 gap-3">
            {INVITATION_TEMPLATES.map((tmpl) => {
              const active = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/10 shadow-[0_0_15px_rgba(227,166,56,0.2)]'
                      : 'border-gray-800 bg-[#181818] hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white truncate flex items-center justify-between">
                    <span>{tmpl.name}</span>
                    {active && <span className="text-amber-400 text-xs">✓</span>}
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-1 truncate">{tmpl.badge}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Details */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
                Tên Chú Rể
              </label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="VD: Văn Chinh"
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
                placeholder="VD: Thu Hà"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
              Gia Đình Nhà Trai
            </label>
            <input
              type="text"
              value={groomParents}
              onChange={(e) => setGroomParents(e.target.value)}
              placeholder="VD: Ông: Trần Văn A - Bà: Nguyễn Thị B"
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1 uppercase tracking-wider">
              Gia Đình Nhà Gái
            </label>
            <input
              type="text"
              value={brideParents}
              onChange={(e) => setBrideParents(e.target.value)}
              placeholder="VD: Ông: Lê Văn C - Bà: Phạm Thị D"
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2 text-white outline-none"
            />
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

        {/* Generate Button */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={handleCreateInvitation}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">insert_link</span>
            {loading ? 'Đang Khởi Tạo Link Thiệp...' : 'Khởi Tạo Link Thiệp Cưới Điện Tử'}
          </button>
        </div>

        {/* Shareable Link Result Box */}
        {createdSlug && (
          <div className="mt-5 p-4 bg-[#1b1910] border border-amber-500/40 rounded-xl text-center animate-fade-in">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Link Thiệp Cưới Điện Tử Đã Sẵn Sàng!
            </div>
            <input
              type="text"
              readOnly
              value={invitationUrl}
              className="w-full bg-[#121212] border border-gray-700 text-amber-400 font-mono text-xs px-3 py-2 rounded-lg text-center select-all mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 bg-amber-400 text-black text-xs font-bold uppercase rounded-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                {copiedLink ? 'Đã Coppy!' : 'Copy Link'}
              </button>
              <a
                href={invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-[#2a2a2a] text-white text-xs font-semibold uppercase rounded-lg border border-gray-700 hover:bg-[#333] transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Xem Thiệp Trực Tiếp
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Live E-Card Preview Column */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[#e3a638]">visibility</span>
            <span className="text-sm font-semibold tracking-wider uppercase font-playfair">
              Xem Trước Thiệp Điện Tử (Mobile Card)
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Template: {selectedTemplate.name}</span>
        </div>

        {/* Mobile Device Frame */}
        <div className="w-full max-w-sm rounded-[36px] p-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black border-4 border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Top Notch Bar */}
          <div className="w-28 h-4 bg-black mx-auto rounded-full mb-3 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
          </div>

          {/* E-Card Canvas */}
          <div className={`w-full rounded-[24px] overflow-hidden p-6 text-center ${selectedTemplate.themeClass} transition-all duration-500 border border-white/10 shadow-inner`}>
            
            {/* Header Motif */}
            <div className="text-amber-400 text-xs font-serif tracking-[0.3em] uppercase mb-2">
              ✦ TRÂN TRỌNG KÍNH MỜI ✦
            </div>

            {/* Groom & Bride Parents */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300 border-y border-white/10 py-3 my-3">
              <div>
                <div className="font-bold text-amber-300">NHÀ TRAI</div>
                <div className="truncate mt-0.5">{groomParents}</div>
              </div>
              <div>
                <div className="font-bold text-amber-300">NHÀ GÁI</div>
                <div className="truncate mt-0.5">{brideParents}</div>
              </div>
            </div>

            <div className="text-[10px] uppercase tracking-widest text-amber-300/80 my-2">
              LỄ THÀNH HÔN CỦA HAI CHÚNG TÔI
            </div>

            {/* Couple Names */}
            <div className="my-4">
              <div className="text-2xl font-bold font-playfair tracking-wide text-white drop-shadow-md">
                {groomName || 'Văn Chinh'}
              </div>
              <div className="text-amber-400 font-serif italic text-lg my-1">&</div>
              <div className="text-2xl font-bold font-playfair tracking-wide text-white drop-shadow-md">
                {brideName || 'Thu Hà'}
              </div>
            </div>

            {/* Event Time & Location */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 my-4 text-xs">
              <div className="text-amber-300 font-semibold font-mono text-sm mb-1">
                {eventTime} • {eventDate ? new Date(eventDate).toLocaleDateString('vi-VN') : '20/11/2026'}
              </div>
              <div className="text-white font-semibold text-xs mt-1">
                GOLDEN PALACE NAM ĐỊNH
              </div>
              <div className="text-[10px] text-gray-300 mt-0.5">
                98 Đông A, KĐT Hòa Vượng, TP. Nam Định
              </div>
            </div>

            {/* Invitation Note */}
            <p className="text-[11px] text-gray-300 italic leading-relaxed my-3 px-2">
              "{invitationNote}"
            </p>

            {/* RSVP Button Demo */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="w-full py-2.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-[11px] font-bold uppercase rounded-xl tracking-wider shadow-md">
                Xác Nhận Tham Dự (RSVP)
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="w-20 h-1 bg-gray-700 mx-auto rounded-full mt-3"></div>
        </div>
      </div>

    </div>
  );
}
