'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LedCustomizer from '@/components/personalize/LedCustomizer';
import MusicSelector from '@/components/personalize/MusicSelector';
import InvitationBuilder from '@/components/personalize/InvitationBuilder';
import { VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

function PersonalizePageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState('led'); // 'led' | 'music' | 'invitation'

  useEffect(() => {
    if (tabParam === 'music' || tabParam === 'invitation' || tabParam === 'led') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Shared global state across all personalization tools
  const [partyTitle, setPartyTitle] = useState('Tiệc cưới Anh Thư & Văn Mạnh');
  const [groomName, setGroomName] = useState('Văn Mạnh');
  const [brideName, setBrideName] = useState('Anh Thư');
  const [phone, setPhone] = useState('0912345678');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [eventTime, setEventTime] = useState('Buổi Trưa (11:00 AM)');
  const [selectedFloor, setSelectedFloor] = useState('FLOOR_3');
  const [driveLink, setDriveLink] = useState('');

  // Tracking section modifications
  const [ledModified, setLedModified] = useState(false);
  const [musicModified, setMusicModified] = useState(false);

  // Music selector state (Empty by default per user request)
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState({ welcome: '', entrance: '', toast: '', dining: '' });
  const [customNotes, setCustomNotes] = useState('');

  // Saving state & Notification
  const [saving, setSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Auto-parse Bride & Groom names when Party Title changes
  const handlePartyTitleChange = (val) => {
    setPartyTitle(val);
    if (!val) return;

    const cleanStr = val.replace(/tiệc\s*cưới|đám\s*cưới|lễ\s*thành\s*hôn/gi, '').trim();
    if (cleanStr.includes('&')) {
      const parts = cleanStr.split('&');
      if (parts[0]?.trim()) setBrideName(parts[0].trim());
      if (parts[1]?.trim()) setGroomName(parts[1].trim());
    } else if (cleanStr.includes('và')) {
      const parts = cleanStr.split('và');
      if (parts[0]?.trim()) setBrideName(parts[0].trim());
      if (parts[1]?.trim()) setGroomName(parts[1].trim());
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        partyTitle,
        groomName,
        brideName,
        phone,
        eventDate,
        eventTime,
        floorId: selectedFloor,
        driveLink,
        ledStatus: ledModified ? 'Đã tùy chỉnh phông LED' : 'Không có yêu cầu gì',
        musicStatus: (selectedTracks.length > 0 || Object.values(youtubeLinks).some(Boolean)) ? 'Đã chọn danh sách nhạc' : 'Không có yêu cầu gì',
        selectedMusic: selectedTracks,
        youtubeLinks,
        customNotes: customNotes || 'Không có ghi chú thêm',
        invitationSlug: `thiep-${(groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}-${(brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}-2026`
      };

      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSavedNotification(true);
        setTimeout(() => setSavedNotification(false), 4500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 font-montserrat pb-24 selection:bg-[#e3a638] selection:text-white">
      
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-400">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">Lưu Hồ Sơ Thành Công!</div>
            <div className="text-[11px] text-emerald-100">Thông tin đã được chuyển tới Đội Kỹ Thuật Golden Palace.</div>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative py-16 px-4 sm:px-6 bg-gradient-to-b from-[#1c1509] via-[#120f09] to-[#0d0d0d] border-b border-[#e3a638]/20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-amber-500/10 via-amber-300/15 to-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-14 sm:h-16 w-auto object-contain mb-4 drop-shadow-[0_0_20px_rgba(227,166,56,0.5)]" />
          
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e3a638]/10 border border-[#e3a638]/30 text-[#e3a638] text-xs uppercase font-bold tracking-[0.2em] mb-4">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Đặc Quyền Cá Nhân Hóa Tiệc Cưới Golden Palace
          </span>

          <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-4 tracking-tight">
            Thiết Kế Đám Cưới Trong Mơ Của Bạn
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Nhập thông tin tiệc một lần duy nhất – hệ thống tự động đồng bộ Phông Màn LED Sân Khấu, Kịch Bản Nhạc Tiệc và Thiệp Cưới Điện Tử.
          </p>

          {/* Unified Global Registration Form */}
          <div className="w-full max-w-3xl mt-10 bg-[#161616] border border-[#e3a638]/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-[#e3a638]">
                <span className="material-symbols-outlined text-2xl">badge</span>
                <h3 className="text-base sm:text-lg font-playfair font-bold">Đăng Ký Thông Tin Tiệc Cưới Dùng Chung</h3>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                Đồng Bộ Real-time 3 Tính Năng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Tên Tiệc Cưới (Đồng Bộ Với Phông LED) */}
              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Tên Tiệc Cưới (*)
                </label>
                <input
                  type="text"
                  value={partyTitle}
                  onChange={(e) => handlePartyTitleChange(e.target.value)}
                  placeholder="VD: LỄ THÀNH HÔN"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-amber-300 font-bold outline-none transition-colors text-xs"
                />
              </div>

              {/* Tên Chú Rể & Cô Dâu */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Tên Chú Rể
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="VD: Đức Hoàng"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Tên Cô Dâu
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="VD: Thu Hương"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white font-semibold outline-none"
                />
              </div>

              {/* Ngày Tổ Chức */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Ngày Tổ Chức Cưới (*)
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>

              {/* Buổi / Thời Gian */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Thời Gian Tổ Chức (*)
                </label>
                <select
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none cursor-pointer"
                >
                  <option value="Buổi Trưa (11:00 AM)">Buổi Trưa (11:00 AM)</option>
                  <option value="Buổi Chiều (17:30 PM)">Buổi Chiều (17:30 PM)</option>
                </select>
              </div>

              {/* Địa Điểm Tầng */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Địa Điểm Tầng Tổ Chức (*)
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-[#e3a638] font-bold outline-none cursor-pointer"
                >
                  {VENUE_FLOOR_OPTIONS.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      {floor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SĐT Liên Hệ */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Số Điện Thoại Liên Hệ Gia Chủ (*)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none"
                />
              </div>

              {/* Link Google Drive chứa Ảnh / Video Cưới (Gọn gàng siêu ít chữ như Ảnh 1) */}
              <div className="sm:col-span-2 bg-[#1b1b1b] p-3.5 rounded-xl border border-blue-500/30 space-y-1.5">
                <label className="block text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  LINK GOOGLE DRIVE / CLOUD CHỨA ẢNH & VIDEO CƯỚI:
                </label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="Dán link Google Drive / Dropbox (VD: https://drive.google.com/drive/folders/...)"
                  className="w-full bg-[#121212] border border-gray-700 focus:border-blue-400 rounded-lg px-3.5 py-2 text-white font-mono outline-none"
                />
              </div>

            </div>

            {/* Global Submit / Save Profile Button */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400 italic">
                * Thông tin này sẽ tự động điền vào Phông LED, Playlist nhạc & Thiệp cưới bên dưới.
              </p>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                {saving ? 'Đang Lưu...' : 'Lưu Hồ Sơ & Gửi Đội Kỹ Thuật'}
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <button
              onClick={() => setActiveTab('led')}
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
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
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
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
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                activeTab === 'invitation'
                  ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white border-amber-300 shadow-[0_0_20px_rgba(227,166,56,0.4)]'
                  : 'bg-[#181818] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">mark_email_read</span>
              3. Thiệp Cưới Online
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
            eventTypeTitle={partyTitle}
            setEventTypeTitle={setPartyTitle}
            onSave={() => {
              setLedModified(true);
              handleSaveProfile();
            }}
          />
        )}

        {activeTab === 'music' && (
          <MusicSelector
            selectedTracks={selectedTracks}
            setSelectedTracks={(tracks) => {
              setSelectedTracks(tracks);
              setMusicModified(true);
            }}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
            youtubeLinks={youtubeLinks}
            setYoutubeLinks={setYoutubeLinks}
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
      </section>

    </div>
  );
}

export default function PersonalizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] text-white p-12 text-center">Đang tải trang cá nhân hóa...</div>}>
      <PersonalizePageContent />
    </Suspense>
  );
}
