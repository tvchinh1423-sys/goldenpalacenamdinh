'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MUSIC_TRACKS, MUSIC_CATEGORIES, LED_STAGE_TEMPLATES } from '@/lib/personalize-data';

export default function AdminPersonalizePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // State for Fullscreen LED visualizer modal
  const [fullscreenLed, setFullscreenLed] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/personalize');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      (p.partyTitle && p.partyTitle.toLowerCase().includes(term)) ||
      (p.groomName && p.groomName.toLowerCase().includes(term)) ||
      (p.brideName && p.brideName.toLowerCase().includes(term)) ||
      (p.phone && p.phone.includes(term)) ||
      (p.venueName && p.venueName.toLowerCase().includes(term))
    );
  });

  // Find LED Template Object for selected profile
  const currentLedTemplate = selectedProfile
    ? (LED_STAGE_TEMPLATES.find(t => t.id === selectedProfile.ledTemplateId) || LED_STAGE_TEMPLATES[0])
    : LED_STAGE_TEMPLATES[0];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
            <span className="material-symbols-outlined text-sm">construction</span>
            Bảng Điều Khiển Đội Kỹ Thuật Golden Palace
          </div>
          <h1 className="text-2xl font-playfair font-bold text-white">Quản Lý Cá Nhân Hóa & Trình Chiếu Sân Khấu</h1>
          <p className="text-xs text-stone-400 mt-1">
            Phát nhạc tiệc cưới trực tiếp, chiếu phông LED P3 Full HD và xuất kịch bản kỹ thuật âm thanh.
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Làm Mới Danh Sách
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <span className="material-symbols-outlined text-gray-400">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo Tên tiệc, Chú rể, Cô dâu, SĐT hoặc Tầng sảnh tổ chức..."
          className="w-full text-sm outline-none bg-transparent text-gray-800"
        />
      </div>

      {/* Table of Saved Profiles */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Đang tải dữ liệu hồ sơ cá nhân hóa...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chưa có hồ sơ cá nhân hóa nào được đăng ký.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tên Tiệc Cưới & Gia Chủ</th>
                  <th className="p-4">Ngày Cưới & Giờ</th>
                  <th className="p-4">Địa Điểm Sảnh</th>
                  <th className="p-4">SĐT Liên Hệ</th>
                  <th className="p-4">Phông LED & Nhạc</th>
                  <th className="p-4 text-center">Thao Tác Kỹ Thuật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredProfiles.map((prof) => (
                  <tr key={prof.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-stone-900">{prof.partyTitle}</div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        Chú Rể: <strong>{prof.groomName}</strong> • Cô Dâu: <strong>{prof.brideName}</strong>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium">
                      <div>{prof.eventDate}</div>
                      <div className="text-[11px] text-gray-500">{prof.eventTime}</div>
                    </td>
                    <td className="p-4 font-bold text-amber-700">
                      {prof.venueName || 'Tầng 3'}
                    </td>
                    <td className="p-4 font-mono">
                      <a href={`tel:${prof.phone}`} className="text-blue-600 font-bold hover:underline">
                        {prof.phone}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold">
                          LED: {prof.ledTemplateId || 'Standard'}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                          Playlist Trực Tiếp
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProfile(prof)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg text-[11px] hover:brightness-110 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">play_circle</span>
                          Mở Kịch Bản & Phát Nhạc
                        </button>
                        {prof.invitationSlug && (
                          <Link
                            href={`/thiep/${prof.invitationSlug}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-stone-800 text-white font-medium rounded-lg text-[11px] hover:bg-stone-700 transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                            Thiệp
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Interactive Technical Workstation Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-stone-950 w-full max-w-4xl rounded-3xl shadow-2xl border border-amber-500/40 text-stone-100 overflow-hidden animate-fade-in my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-stone-900 border-b border-amber-500/30 p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <span className="material-symbols-outlined text-xl">graphic_eq</span>
                </div>
                <div>
                  <div className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                    TRẠM ĐỒNG BỘ KỸ THUẬT SÂN KHẤU • GOLDEN PALACE
                  </div>
                  <h3 className="text-xl font-bold font-playfair text-white">{selectedProfile.partyTitle}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow text-xs">
              
              {/* Event Info Header Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-900/90 border border-stone-800 rounded-2xl">
                <div>
                  <span className="text-gray-400 block text-[10px]">Ngày & Buổi Tổ Chức:</span>
                  <strong className="text-sm font-mono text-amber-300">{selectedProfile.eventDate} ({selectedProfile.eventTime})</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Sảnh Tiệc:</span>
                  <strong className="text-sm text-white font-bold">{selectedProfile.venueName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Gia Chủ (Chú Rể & Cô Dâu):</span>
                  <strong className="text-amber-400 font-bold">{selectedProfile.groomName} ❤️ {selectedProfile.brideName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Hotline Gia Chủ:</span>
                  <strong className="text-blue-400 font-mono">{selectedProfile.phone}</strong>
                </div>
              </div>

              {/* SECTION 1: PHÔNG MÀN LED SÂN KHẤU (LIVE PREVIEW & FULLSCREEN BUTTON) */}
              <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-base">live_tv</span>
                    Phông Màn LED Sân Khấu P3 Full HD
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFullscreenLed(true)}
                      className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">fullscreen</span>
                      Mở Trình Chiếu LED Fullscreen
                    </button>
                  </div>
                </div>

                {/* Mini LED Canvas Visualizer */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-inner bg-black flex items-center justify-center">
                  <div className={`w-full h-full bg-gradient-to-br ${currentLedTemplate.bgGradient} relative flex flex-col items-center justify-center p-4 text-center`}>
                    
                    {/* Logo Golden Palace Top-Left */}
                    <div className="absolute top-2 left-3 flex items-center gap-1 z-20">
                      <img src="/logo-icon.png" alt="Golden Palace" className="h-5 w-auto object-contain" />
                      <span className="text-[8px] tracking-widest font-playfair uppercase text-amber-300 font-bold">
                        GOLDEN PALACE
                      </span>
                    </div>

                    {/* LED Inner Frame */}
                    <div className={`w-[90%] h-[80%] rounded-lg flex flex-col items-center justify-center p-4 relative ${currentLedTemplate.frameStyle}`}>
                      <div className="text-[8px] tracking-widest uppercase text-amber-200 font-semibold mb-1">
                        LỄ THÀNH HÔN • WEDDING CEREMONY
                      </div>
                      <div className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wider my-1 drop-shadow-md">
                        {selectedProfile.groomName} & {selectedProfile.brideName}
                      </div>
                      <div className="text-[9px] font-mono text-amber-300 mt-1">
                        {selectedProfile.eventDate} • GOLDEN PALACE {selectedProfile.venueName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BẢNG PHÁT NHẠC TRỰC TIẾP (DIRECT AUDIO PLAYER) */}
              <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-base">volume_up</span>
                    Kịch Bản & Trình Phát Nhạc Trực Tiếp Tại Sảnh
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Hệ thống tích hợp Trình phát âm thanh 4 Giai Đoạn
                  </span>
                </div>

                {/* 4 Phases Tracklists with Audio Players */}
                <div className="space-y-4">
                  {MUSIC_CATEGORIES.map((cat, idx) => {
                    const catTracks = MUSIC_TRACKS.filter(t => t.catId === cat.id);
                    return (
                      <div key={cat.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-amber-300 text-xs flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            {cat.label}
                          </div>
                          <span className="text-[10px] text-gray-400">{catTracks.length} bài hát chọn sẵn</span>
                        </div>

                        {/* Tracks List with HTML5 Audio Player */}
                        <div className="space-y-2">
                          {catTracks.map((track) => (
                            <div key={track.id} className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-xs text-amber-400">music_note</span>
                                  {track.title}
                                </div>
                                <div className="text-[10px] text-gray-400">{track.artist} ({track.duration})</div>
                              </div>

                              {/* Interactive Audio Player Component */}
                              <div className="flex items-center gap-2 shrink-0">
                                <audio controls className="h-8 max-w-[200px] sm:max-w-[240px] opacity-90">
                                  <source src={track.audioUrl} type="audio/mpeg" />
                                  Trình duyệt không hỗ trợ phát audio
                                </audio>
                                <a
                                  href={track.audioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-xs">download</span>
                                  Tải MP3
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-gray-400">
                Golden Palace Audio/Visual Technical Operations System
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  Xuất Kịch Bản PDF / In
                </button>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 bg-stone-800 text-gray-300 text-xs font-bold uppercase rounded-xl hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN STAGE LED SCREEN MODAL FOR STAGE PROJECTOR / DISPLAY COMPUTER */}
      {fullscreenLed && selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setFullscreenLed(false)}
            className="absolute top-6 right-6 z-50 px-4 py-2 bg-stone-900/90 text-white font-bold text-xs uppercase rounded-full border border-amber-500/40 hover:bg-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">fullscreen_exit</span>
            Thoát Chiếu Fullscreen
          </button>

          {/* Fullscreen LED Canvas */}
          <div className={`w-full max-w-6xl aspect-video rounded-3xl border-4 border-amber-500/60 shadow-[0_0_80px_rgba(227,166,56,0.3)] bg-gradient-to-br ${currentLedTemplate.bgGradient} relative flex flex-col items-center justify-center p-8 text-center`}>
            
            {/* Spotlight Lighting FX */}
            <div className="absolute top-0 left-1/4 w-48 h-96 bg-gradient-to-b from-white/20 to-transparent blur-3xl transform -rotate-12 pointer-events-none"></div>
            <div className="absolute top-0 right-1/4 w-48 h-96 bg-gradient-to-b from-amber-300/20 to-transparent blur-3xl transform rotate-12 pointer-events-none"></div>

            {/* Logo Top-Left */}
            <div className="absolute top-6 left-8 flex items-center gap-2 z-20">
              <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(227,166,56,0.8)]" />
              <span className="text-xs sm:text-sm font-playfair tracking-[0.3em] uppercase text-amber-300 font-bold">
                GOLDEN PALACE
              </span>
            </div>

            {/* Inner Frame */}
            <div className={`w-[92%] h-[85%] rounded-2xl flex flex-col items-center justify-center p-8 relative backdrop-blur-xs ${currentLedTemplate.frameStyle}`}>
              <div className="text-xs sm:text-sm tracking-[0.4em] uppercase text-amber-200 font-semibold mb-2 drop-shadow-md">
                LỄ THÀNH HÔN • WEDDING CEREMONY
              </div>
              <h1 className="text-4xl sm:text-7xl font-playfair font-bold text-white tracking-wider my-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {selectedProfile.groomName} <span className="text-amber-400 font-serif italic font-normal">&</span> {selectedProfile.brideName}
              </h1>
              <div className="text-sm sm:text-lg font-mono text-amber-300 mt-2 tracking-wide">
                {selectedProfile.eventDate} • GOLDEN PALACE NAM ĐỊNH ({selectedProfile.venueName})
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
