'use client';

import { useState, useRef } from 'react';
import { MUSIC_CATEGORIES, MUSIC_TRACKS, VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

export default function MusicSelector({ selectedTracks, setSelectedTracks, customNotes, setCustomNotes }) {
  // Party Info Form State (Required before selecting music)
  const [partyName, setPartyName] = useState('Tiệc cưới Anh Thư & Văn Mạnh');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [session, setSession] = useState('TRƯA'); // 'TRƯA' | 'CHIỀU'
  const [selectedFloor, setSelectedFloor] = useState(VENUE_FLOOR_OPTIONS[1].id);
  const [phone, setPhone] = useState('0912 345 678');
  
  const [step, setStep] = useState('INFO'); // 'INFO' | 'SELECT'
  const [activeTab, setActiveTab] = useState('welcome');
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [albumSaved, setAlbumSaved] = useState(false);
  const audioRef = useRef(null);

  const selectedVenueObj = VENUE_FLOOR_OPTIONS.find(v => v.id === selectedFloor) || VENUE_FLOOR_OPTIONS[1];

  // Validate if eventDate is within 30 days before wedding
  const getDaysUntilWedding = () => {
    if (!eventDate) return 30;
    const today = new Date();
    const wedding = new Date(eventDate);
    const diffTime = wedding - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilWedding();
  const isAllowedToRegister = daysLeft <= 30 && daysLeft >= -1; // Within 30 days before and up to 1 day after

  const handlePlayPause = (track) => {
    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.audioUrl);
      audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      setPlayingTrackId(track.id);

      audioRef.current.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  const toggleTrack = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const filteredTracks = MUSIC_TRACKS.filter(t => t.catId === activeTab);
  const currentCategory = MUSIC_CATEGORIES.find(c => c.id === activeTab);

  const handleSaveAlbumForTechTeam = () => {
    const albumData = {
      partyName,
      eventDate,
      session,
      floorName: selectedVenueObj.name,
      phone,
      selectedTrackIds: selectedTracks,
      selectedTrackDetails: MUSIC_TRACKS.filter(t => selectedTracks.includes(t.id)),
      customNotes,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(new Date(eventDate).getTime() + 86400000).toISOString() // Auto cleanup 1 day after wedding
    };
    localStorage.setItem(`gp_music_album_${phone}`, JSON.stringify(albumData));
    setAlbumSaved(true);
    setTimeout(() => setAlbumSaved(false), 4000);
  };

  return (
    <div className="font-montserrat">
      
      {/* Policy Banner: 30-day window & 1-day post wedding cleanup */}
      <div className="bg-gradient-to-r from-[#1c1407] via-[#2d200b] to-[#1c1407] border border-amber-500/30 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-amber-400">schedule</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Quy Định Đăng Ký & Quản Lý Dung Lượng Âm Nhạc
            </h3>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              Hệ thống mở đăng ký chọn nhạc <strong>trước đám cưới 1 tháng</strong> và <strong>tự động xóa album sau ngày cưới 1 ngày</strong> để giải phóng dung lượng.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#141414] rounded-xl border border-gray-700 text-center shrink-0">
          <div className="text-xs font-bold text-amber-400 font-mono">
            {daysLeft > 0 ? `Còn ${daysLeft} ngày tới Lễ Cưới` : 'Hôm nay là Ngày Cưới!'}
          </div>
          <div className="text-[10px] text-gray-400 uppercase mt-0.5">Trạng Thái Lưu Trữ Album</div>
        </div>
      </div>

      {/* Step 1: Party Registration Form */}
      {step === 'INFO' ? (
        <div className="max-w-2xl mx-auto bg-[#141414] border border-[#e3a638]/20 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <span className="material-symbols-outlined text-3xl text-[#e3a638] mb-1">badge</span>
            <h3 className="text-xl font-playfair font-bold text-white">
              Đăng Ký Thông Tin Tiệc Cưới Chọn Nhạc
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Điền thông tin tiệc để Đội Kỹ Thuật Âm Thanh Golden Palace khởi tạo Album nhạc riêng cho buổi lễ của bạn.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                Tên Tiệc Cưới (*)
              </label>
              <input
                type="text"
                required
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="VD: Tiệc cưới Anh Thư & Văn Mạnh"
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-3 text-white outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Ngày Tổ Chức Cưới (*)
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Thời Gian Tổ Chức (*)
                </label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-amber-300 font-bold outline-none cursor-pointer"
                >
                  <option value="TRƯA" className="bg-[#1f1f1f] text-white">Buổi Trưa (11:00 AM)</option>
                  <option value="CHIỀU" className="bg-[#1f1f1f] text-white">Buổi Chiều / Tối (17:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Địa Điểm Tầng Tổ Chức (*)
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-amber-300 font-bold outline-none cursor-pointer"
                >
                  {VENUE_FLOOR_OPTIONS.map((floor) => (
                    <option key={floor.id} value={floor.id} className="bg-[#1f1f1f] text-white">
                      {floor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Số Điện Thoại Liên Hệ Gia Chủ (*)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('SELECT')}
              className="w-full py-4 mt-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-widest rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>Tiếp Tục Chọn Kịch Bản Nhạc Cho Tiệc</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Music Selection & Technical Album Export */
        <div>
          {/* Party Info Summary Header */}
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[#e3a638]">event_available</span>
              <div>
                <div className="text-sm font-bold text-white">{partyName}</div>
                <div className="text-xs text-amber-300 font-medium mt-0.5">
                  {selectedVenueObj.shortName} • {session === 'TRƯA' ? 'Buổi Trưa' : 'Buổi Chiều/Tối'} • {eventDate ? new Date(eventDate).toLocaleDateString('vi-VN') : '20/11/2026'} • SĐT: {phone}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('INFO')}
              className="px-4 py-2 bg-[#222] hover:bg-[#333] text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 transition-colors"
            >
              ✎ Đổi Thông Tin Tiệc
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-4 mb-6 scrollbar-none border-b border-gray-800">
            {MUSIC_CATEGORIES.map((cat) => {
              const count = MUSIC_TRACKS.filter(t => t.catId === cat.id && selectedTracks.includes(t.id)).length;
              const active = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                    active
                      ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-amber-400 shadow-[0_0_15px_rgba(227,166,56,0.3)]'
                      : 'bg-[#181818] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-black/40 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Description Banner */}
          <div className="bg-[#141414] border-l-4 border-[#e3a638] p-4 rounded-r-xl mb-6">
            <h4 className="text-sm font-semibold text-white mb-1">{currentCategory?.label}</h4>
            <p className="text-xs text-gray-400">{currentCategory?.desc}</p>
          </div>

          {/* Track List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredTracks.map((track) => {
              const isSelected = selectedTracks.includes(track.id);
              const isPlaying = playingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#e3a638]/10 border-[#e3a638] shadow-[0_0_15px_rgba(227,166,56,0.15)]'
                      : 'bg-[#161616] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => handlePlayPause(track)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                      isPlaying
                        ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse'
                        : 'bg-[#242424] text-amber-400 hover:bg-[#303030]'
                    }`}
                    title={isPlaying ? 'Tạm dừng demo' : 'Nghe thử demo'}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate flex items-center gap-2">
                      {track.title}
                      {isPlaying && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-1.5 py-0.5 rounded uppercase">
                          Đang phát
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      {track.artist} • <span className="font-mono text-gray-500">{track.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTrack(track.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                        : 'bg-[#222] text-gray-300 border-gray-700 hover:border-amber-400/60'
                    }`}
                  >
                    {isSelected ? 'Đã Chọn ✓' : '+ Chọn'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Special Request Notes & Export Section */}
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 mb-6">
            <label className="block text-gray-300 text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-base">edit_note</span>
              Ghi Chú Kịch Bản & Yêu Cầu Riêng Cho Đội Kỹ Thuật
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ghi chú cụ thể thời điểm phát bài (VD: Phát bài 'Beautiful in White' khi Chú Rể dắt Cô Dâu vào sảnh sân khấu)..."
              className="w-full bg-[#1c1c1c] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3.5 text-xs text-white outline-none transition-colors leading-relaxed mb-4"
            />

            {/* Technical Album Export Actions */}
            <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                Lưu kịch bản này để Kỹ Thuật Viên Âm Thanh mở trực tiếp tại sảnh {selectedVenueObj.shortName}.
              </div>

              <button
                onClick={handleSaveAlbumForTechTeam}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-base">cloud_done</span>
                {albumSaved ? 'Đã Lưu Album Kỹ Thuật!' : 'Lưu Album Kịch Bản Cho Kỹ Thuật'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
