'use client';

import { useState } from 'react';
import Link from 'next/link';
import LedCustomizer from '@/components/personalize/LedCustomizer';
import MusicSelector from '@/components/personalize/MusicSelector';
import InvitationBuilder from '@/components/personalize/InvitationBuilder';

export default function PersonalizePage() {
  const [activeTab, setActiveTab] = useState('led'); // 'led' | 'music' | 'invitation'
  
  // Shared state across tools
  const [groomName, setGroomName] = useState('Văn Chinh');
  const [brideName, setBrideName] = useState('Thu Hà');
  const [eventDate, setEventDate] = useState('2026-11-20');

  // Music selector state
  const [selectedTracks, setSelectedTracks] = useState(['m1', 'm5', 'm10', 'm12']);
  const [customNotes, setCustomNotes] = useState('');

  // Notification Toast state
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveAllToEstimate = () => {
    // Save state to LocalStorage for Integration with Estimate Lead
    const personalizationData = {
      groomName,
      brideName,
      eventDate,
      selectedTracks,
      customNotes,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('golden_palace_personalize', JSON.stringify(personalizationData));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 font-montserrat pb-24 selection:bg-[#e3a638] selection:text-white">
      
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            Đã Lưu Cấu Hình Cá Nhân Hóa Vào Dự Toán Của Bạn!
          </span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative py-16 px-4 sm:px-6 bg-gradient-to-b from-[#1c1509] via-[#120f09] to-[#0d0d0d] border-b border-[#e3a638]/20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-amber-500/10 via-amber-300/15 to-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e3a638]/10 border border-[#e3a638]/30 text-[#e3a638] text-xs uppercase font-bold tracking-[0.2em] mb-4">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Đặc Quyền Cá Nhân Hóa Tiệc Cưới
          </span>

          <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-4 tracking-tight">
            Thiết Kế Đám Cưới Trong Mơ Của Bạn
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm trực quan phông màn LED sân khấu, chọn danh sách nhạc đong đầy cảm xúc và tạo thiệp cưới điện tử độc quyền chỉ có tại Golden Palace Nam Định.
          </p>

          {/* Nav Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <button
              onClick={() => setActiveTab('led')}
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTab === 'led'
                  ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-amber-300 shadow-[0_0_20px_rgba(227,166,56,0.4)]'
                  : 'bg-[#181818] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">live_tv</span>
              1. Phông Màn LED Sân Khấu
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-amber-300 shadow-[0_0_20px_rgba(227,166,56,0.4)]'
                  : 'bg-[#181818] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">music_note</span>
              2. Playlist Nhạc Tiệc Cưới ({selectedTracks.length})
            </button>

            <button
              onClick={() => setActiveTab('invitation')}
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTab === 'invitation'
                  ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-amber-300 shadow-[0_0_20px_rgba(227,166,56,0.4)]'
                  : 'bg-[#181818] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">mark_email_read</span>
              3. Thiệp Cưới Online & RSVP
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {activeTab === 'led' && (
          <LedCustomizer
            groomName={groomName}
            setGroomName={setGroomName}
            brideName={brideName}
            setBrideName={setBrideName}
            eventDate={eventDate}
            setEventDate={setEventDate}
            onSave={handleSaveAllToEstimate}
          />
        )}

        {activeTab === 'music' && (
          <MusicSelector
            selectedTracks={selectedTracks}
            setSelectedTracks={setSelectedTracks}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
          />
        )}

        {activeTab === 'invitation' && (
          <InvitationBuilder
            groomName={groomName}
            setGroomName={setGroomName}
            brideName={brideName}
            setBrideName={setBrideName}
            eventDate={eventDate}
            setEventDate={setEventDate}
          />
        )}

        {/* Global Save Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#17140b] via-[#261d0f] to-[#17140b] border border-amber-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl text-amber-400">task_alt</span>
            </div>
            <div>
              <h4 className="text-lg font-playfair font-bold text-white">Lưu Kịch Bản Cá Nhân Hóa Vào Dự Toán</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">
                Lưu lại toàn bộ tùy chỉnh màn LED, danh sách bài hát đã chọn và thông tin thiệp để đính kèm khi bạn gửi yêu cầu dự toán tới nhân viên Golden Palace.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleSaveAllToEstimate}
              className="px-6 py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all whitespace-nowrap"
            >
              Lưu Cấu Hình Hiện Tại
            </button>
            <Link
              href="/du-toan-chi-phi"
              className="px-6 py-3.5 bg-[#222] hover:bg-[#333] text-gray-200 text-xs uppercase font-bold tracking-wider rounded-xl border border-gray-700 transition-all text-center whitespace-nowrap"
            >
              Chuyển Sang Trang Dự Toán →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
