'use client';

import { useState } from 'react';
import { MUSIC_CATEGORIES, MUSIC_TRACKS } from '@/lib/personalize-data';

function getYouTubeEmbedInfo(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    const videoId = match[2];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
  return {
    embedUrl: null,
    watchUrl: url
  };
}

export default function MusicSelector({
  selectedTracks = [],
  setSelectedTracks = () => {},
  customNotes = '',
  setCustomNotes = () => {},
  youtubeLinks = {},
  setYoutubeLinks = () => {},
  onSave
}) {
  const [activeTab, setActiveTab] = useState('welcome');
  const [previewTrack, setPreviewTrack] = useState(null); // { title: string, embedUrl: string, watchUrl: string }

  const toggleTrack = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleYoutubeLinkChange = (catId, val) => {
    setYoutubeLinks({
      ...youtubeLinks,
      [catId]: val
    });
  };

  const handleOpenPreview = (title, url) => {
    const info = getYouTubeEmbedInfo(url);
    if (info) {
      setPreviewTrack({ title, embedUrl: info.embedUrl, watchUrl: info.watchUrl });
    }
  };

  const filteredTracks = MUSIC_TRACKS.filter(t => t.catId === activeTab);
  const currentCategory = MUSIC_CATEGORIES.find(c => c.id === activeTab);

  return (
    <div className="font-montserrat space-y-6">
      
      {/* Policy Banner: 30-day window & 1-day post wedding cleanup */}
      <div className="bg-gradient-to-r from-[#1c1407] via-[#2d200b] to-[#1c1407] border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-amber-400">schedule</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Quy Định Đăng Ký & Quản Lý Dung Lượng Âm Nhạc
            </h3>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              Hệ thống mở chọn nhạc <strong>trước đám cưới 1 tháng</strong> và <strong>tự động xóa album sau ngày cưới 1 ngày</strong> để giải phóng dung lượng.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none border-b border-gray-800">
        {MUSIC_CATEGORIES.map((cat) => {
          const count = MUSIC_TRACKS.filter(t => t.catId === cat.id && selectedTracks.includes(t.id)).length;
          const active = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
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
      <div className="bg-[#141414] border-l-4 border-[#e3a638] p-4 rounded-r-xl">
        <h4 className="text-sm font-semibold text-white mb-1">{currentCategory?.label}</h4>
        <p className="text-xs text-gray-400">{currentCategory?.desc}</p>
      </div>

      {/* Track List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracks.map((track) => {
          const isSelected = selectedTracks.includes(track.id);

          return (
            <div
              key={track.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-[#e3a638]/10 border-[#e3a638] shadow-[0_0_15px_rgba(227,166,56,0.15)]'
                  : 'bg-[#161616] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-amber-400">music_note</span>
                  {track.title}
                </div>
                <div className="text-xs text-gray-400 truncate mt-1 flex items-center gap-2">
                  <span>{track.artist} ({track.duration})</span>
                  •
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(`${track.title} - ${track.artist}`, track.youtubeUrl)}
                    className="text-red-400 font-bold hover:text-red-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Nghe thử Video YouTube
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleTrack(track.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-400 shadow-sm font-bold'
                    : 'bg-[#222] text-gray-300 border-gray-700 hover:border-amber-400/60'
                }`}
              >
                {isSelected ? 'Đã Chọn ✓' : '+ Chọn Bài'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Lựa Chọn Khác: Chèn Link YouTube cho Giai Đoạn này */}
      <div className="p-4 bg-[#181818] border border-amber-500/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">link</span>
            Lựa Chọn Khác (Chèn Link YouTube bài hát yêu thích cho giai đoạn này):
          </label>
          {youtubeLinks[activeTab] && (
            <button
              type="button"
              onClick={() => handleOpenPreview(`Nhạc yêu thích: ${currentCategory?.label}`, youtubeLinks[activeTab])}
              className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">play_circle</span>
              Nghe thử link đã dán
            </button>
          )}
        </div>
        
        <input
          type="url"
          value={youtubeLinks[activeTab] || ''}
          onChange={(e) => handleYoutubeLinkChange(activeTab, e.target.value)}
          placeholder="Dán link YouTube (VD: https://www.youtube.com/watch?v=...)"
          className="w-full bg-[#121212] border border-gray-700 focus:border-[#e3a638] rounded-lg px-3.5 py-2 text-xs text-amber-300 font-mono outline-none"
        />
        <p className="text-[10px] text-gray-400 italic">
          * Đội Kỹ Thuật Âm Thanh sẽ mở đúng nhạc từ link YouTube này cho giai đoạn tương ứng trong lễ cưới của bạn.
        </p>
      </div>

      {/* GHI CHÚ KỊCH BẢN & YÊU CẦU RIÊNG CHO ĐỘI KỸ THUẬT */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-5">
        <label className="block text-gray-300 text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-base">edit_note</span>
          GHI CHÚ KỊCH BẢN & YÊU CẦU RIÊNG CHO ĐỘI KỸ THUẬT
        </label>
        <textarea
          rows={3}
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Nhập bất kỳ góp ý, lưu ý hoặc lời nhắn riêng nào cho đội ngũ Golden Palace (không bắt buộc)..."
          className="w-full bg-[#1c1c1c] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3.5 text-xs text-white outline-none transition-colors leading-relaxed"
        />
      </div>

      {onSave && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            Lưu Kịch Bản Nhạc Vào Hồ Sơ Kỹ Thuật
          </button>
        </div>
      )}

      {/* EMBEDDED YOUTUBE VIDEO PLAYER POPUP MODAL */}
      {previewTrack && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#141414] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-black p-4 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="material-symbols-outlined text-red-500 text-xl shrink-0">play_circle</span>
                <h3 className="font-bold text-xs sm:text-sm text-amber-300 truncate">
                  Đang nghe thử: {previewTrack.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTrack(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* iFrame Player Aspect 16:9 */}
            <div className="relative w-full aspect-video bg-black">
              {previewTrack.embedUrl ? (
                <iframe
                  src={previewTrack.embedUrl}
                  title={previewTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-300 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-amber-400">warning</span>
                  <p className="text-xs">Link YouTube này không cho phép nhúng trực tiếp.</p>
                  <a
                    href={previewTrack.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-500 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    Mở Xem Trực Tiếp Trên YouTube
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer with Direct YouTube Fallback Button */}
            <div className="p-3 bg-black/60 text-center text-xs text-gray-400 flex flex-wrap justify-between items-center gap-2 border-t border-gray-800/60">
              <span className="text-[11px] text-gray-400">
                Nếu video bị giới hạn bản quyền phát nhúng:
              </span>

              <div className="flex items-center gap-2">
                {previewTrack.watchUrl && (
                  <a
                    href={previewTrack.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-lg font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Mở Trên App YouTube
                  </a>
                )}
                
                <button
                  onClick={() => setPreviewTrack(null)}
                  className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Đóng Video
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
