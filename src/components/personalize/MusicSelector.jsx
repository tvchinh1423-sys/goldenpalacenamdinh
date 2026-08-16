'use client';

import { useState, useRef } from 'react';
import { MUSIC_CATEGORIES, MUSIC_TRACKS } from '@/lib/personalize-data';

export default function MusicSelector({ selectedTracks, setSelectedTracks, customNotes, setCustomNotes }) {
  const [activeTab, setActiveTab] = useState('welcome');
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(null);

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

  return (
    <div className="font-montserrat">
      
      {/* Top Banner & Active Playlist Counter */}
      <div className="bg-gradient-to-r from-[#1c1407] via-[#2d200b] to-[#1c1407] border border-[#e3a638]/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-xl font-playfair text-[#e3a638] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">library_music</span>
            Kịch Bản Âm Nhạc Tiệc Cưới Golden Palace
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
            Nghe thử và lựa chọn những giai điệu đong đầy xúc cảm cho 4 thời khắc quan trọng trong buổi lễ của bạn.
          </p>
        </div>

        <div className="bg-[#141414] px-5 py-3 rounded-xl border border-amber-500/20 text-center shrink-0">
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {selectedTracks.length} / {MUSIC_TRACKS.length}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
            Bài Hát Đã Chọn
          </div>
        </div>
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
              {/* Play / Pause button */}
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

              {/* Track Details */}
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

              {/* Selection Checkbox */}
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

      {/* Special Request Notes */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <label className="block text-gray-300 text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-base">edit_note</span>
          Ghi Chú Bài Hát Riêng Hoặc Yêu Cầu Kịch Bản Đặc Biệt
        </label>
        <textarea
          rows={3}
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Ví dụ: Cần phát bài 'Ngày Đầu Tiên' lúc chú rể tặng hoa cho cô dâu; yêu cầu thêm bài hát giao lưu acoustic..."
          className="w-full bg-[#1c1c1c] border border-gray-700 focus:border-[#e3a638] rounded-xl p-3.5 text-xs text-white outline-none transition-colors leading-relaxed"
        />
      </div>

    </div>
  );
}
