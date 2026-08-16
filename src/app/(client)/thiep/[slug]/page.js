'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { INVITATION_TEMPLATES } from '@/lib/personalize-data';

export default function PublicInvitationPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || 'thiep-cuoi';

  // State for RSVP Form
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default mock wedding data based on slug
  const template = INVITATION_TEMPLATES[0];

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationSlug: slug,
          guestName,
          phone,
          attending,
          guestCount: Number(guestCount),
          wishes
        })
      });
      setRsvpSubmitted(true);
    } catch (err) {
      setRsvpSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f8fafc] font-montserrat flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-[#e3a638] selection:text-white">
      
      {/* Background Lighting Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-black to-black pointer-events-none"></div>

      {/* Main E-Card Envelope Frame */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#1a140b] via-[#241a0d] to-[#120e08] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(227,166,56,0.2)] relative z-10 my-6">
        
        {/* Golden Palace Branding Header */}
        <div className="text-center pb-6 border-b border-amber-500/20 mb-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-bold mb-1">
            GOLDEN PALACE WEDDING INVITATION
          </div>
          <h2 className="text-[#e3a638] font-playfair text-xs uppercase tracking-widest font-semibold">
            Thiệp Cưới Điện Tử Trân Trọng
          </h2>
        </div>

        {/* Ceremony Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] uppercase font-bold tracking-widest rounded-full">
            TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white tracking-wide pt-2">
            LỄ THÀNH HÔN
          </h1>
        </div>

        {/* Couple Names Section */}
        <div className="bg-[#120d06]/80 border border-amber-500/30 rounded-2xl p-6 text-center shadow-inner mb-8">
          <div className="text-2xl sm:text-3xl font-bold font-playfair text-amber-300 tracking-wide">
            Trần Văn Chinh
          </div>
          <div className="my-2 text-amber-400 font-serif italic text-xl">&</div>
          <div className="text-2xl sm:text-3xl font-bold font-playfair text-amber-300 tracking-wide">
            Nguyễn Thu Hà
          </div>
        </div>

        {/* Event Time & Location Details */}
        <div className="space-y-4 text-center text-xs mb-8">
          <div className="p-4 bg-[#1a150c] border border-amber-500/20 rounded-xl">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Thời Gian Cử Hành
            </div>
            <div className="text-lg font-bold text-white font-mono">11:00 AM</div>
            <div className="text-gray-300 font-medium mt-0.5">Chủ Nhật, Ngày 20 Tháng 11 Năm 2026</div>
          </div>

          <div className="p-4 bg-[#1a150c] border border-amber-500/20 rounded-xl">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Địa Điểm Tổ Chức
            </div>
            <div className="text-sm font-bold text-white font-playfair">Sảnh Hoàng Gia - Tầng 3</div>
            <div className="text-amber-300 font-semibold text-xs mt-0.5">GOLDEN PALACE NAM ĐỊNH</div>
            <div className="text-gray-400 text-[11px] mt-1">98 Đông A, KĐT Hòa Vượng, TP. Nam Định</div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=98+Đông+A,+KĐT+Hòa+Vượng,+Nam+Định"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-3 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase rounded-lg hover:bg-amber-500/30 transition-all"
            >
              <span className="material-symbols-outlined text-xs">map</span>
              Xem Bản Đồ Chỉ Đường
            </a>
          </div>
        </div>

        {/* RSVP Form Section */}
        <div className="pt-6 border-t border-amber-500/20">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold font-playfair text-[#e3a638] uppercase tracking-wider">
              Xác Nhận Tham Dự (RSVP)
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Sự hiện diện của Quý khách là niềm vinh hạnh lớn cho gia đình chúng tôi!
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="p-5 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center animate-fade-in">
              <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2">task_alt</span>
              <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                Gửi Phản Hồi Thành Công!
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Gia đình xin chân thành cảm ơn tình cảm và sự hiện diện của bạn. Rất hân hạnh được đón tiếp!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Họ & Tên Quý Khách (*)
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nhập họ tên của bạn"
                  className="w-full bg-[#120d06] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-[#120d06] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Số Người Đi Cùng
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-[#120d06] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value={1}>1 người (Tôi)</option>
                    <option value={2}>2 người</option>
                    <option value={3}>3 người</option>
                    <option value={4}>4+ người</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Xác Nhận Tham Dự
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                      attending
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#120d06] text-gray-400 border-gray-800'
                    }`}
                  >
                    ✓ Sẽ Tham Dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                      !attending
                        ? 'bg-rose-700 text-white border-rose-600'
                        : 'bg-[#120d06] text-gray-400 border-gray-800'
                    }`}
                  >
                    ✕ Rất Tiếc Vắng Mặt
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Lời Chúc Gửi Tới Cặp Đôi
                </label>
                <textarea
                  rows={2}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder="Gửi những lời chúc mừng hạnh phúc trăm năm..."
                  className="w-full bg-[#120d06] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3 text-white outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all mt-2"
              >
                {loading ? 'Đang Gửi Phản Hồi...' : 'Xác Nhận Phản Hồi RSVP'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Branding */}
        <div className="mt-8 pt-4 border-t border-amber-500/20 text-center text-[10px] text-gray-400">
          Powered by <strong className="text-amber-400">Golden Palace Nam Định</strong>
        </div>

      </div>

    </div>
  );
}
