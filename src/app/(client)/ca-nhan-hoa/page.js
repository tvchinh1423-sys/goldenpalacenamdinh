'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LedCustomizer from '@/components/personalize/LedCustomizer';
import MusicSelector from '@/components/personalize/MusicSelector';
import InvitationBuilder from '@/components/personalize/InvitationBuilder';
import { VENUE_FLOOR_OPTIONS } from '@/lib/personalize-data';

const PARTY_TITLE_PRESETS = [
  'LỄ THÀNH HÔN',
  'LỄ VU QUY',
  'LỄ TÂN HÔN',
  'LỄ BÁO HỶ',
  'LỄ ĐÍNH HÔN',
  'TIỆC SINH NHẬT',
  'TIỆC KỶ NIỆM'
];

function PersonalizePageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState('led'); // 'led' | 'music' | 'invitation'

  useEffect(() => {
    if (tabParam === 'music' || tabParam === 'invitation' || tabParam === 'led') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Shared global state across all personalization tools - Empty by default with placeholders
  const [partyTitle, setPartyTitle] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('FLOOR_3');
  const [driveLink, setDriveLink] = useState('');

  // LED State
  const [selectedLedTemplate, setSelectedLedTemplate] = useState('led-starry-diamond');

  // Music selector state (Defaults to 4 standard tracks if empty)
  const [selectedTracks, setSelectedTracks] = useState(['w1', 'e1', 't1', 'd1']);
  const [youtubeLinks, setYoutubeLinks] = useState({ welcome: '', entrance: '', toast: '', dining: '' });
  const [customNotes, setCustomNotes] = useState('');

  // Saving state & Notification
  const [saving, setSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Floor name helper
  const getFloorName = (code) => {
    if (code === 'FLOOR_1' || code === 'tang-1') return 'Tầng 1';
    if (code === 'FLOOR_2' || code === 'tang-2') return 'Tầng 2';
    if (code === 'FLOOR_4' || code === 'tang-4') return 'Tầng 4';
    return 'Tầng 3';
  };

  const handleSaveProfile = async (customOverrides = {}) => {
    setSaving(true);
    const currentFloorName = getFloorName(selectedFloor);

    try {
      const payload = {
        partyTitle: customOverrides.partyTitle || partyTitle || 'LỄ THÀNH HÔN',
        groomName: customOverrides.groomName || groomName || 'Chú rể',
        brideName: customOverrides.brideName || brideName || 'Cô dâu',
        phone: customOverrides.phone || phone || 'Chưa cung cấp',
        eventDate: customOverrides.eventDate || eventDate || new Date().toISOString().split('T')[0],
        eventTime: customOverrides.eventTime || eventTime || '11:00 AM',
        floorId: customOverrides.selectedFloor || selectedFloor,
        venueName: currentFloorName,
        driveLink: customOverrides.driveLink !== undefined ? customOverrides.driveLink : driveLink,
        
        // AUTOMATICALLY SAVE COMPLETE LED & MUSIC CONFIGURATIONS BY DEFAULT OR OVERRIDES
        ledStatus: customOverrides.ledStatus || `Đã thiết kế phông màn LED sân khấu (${currentFloorName})`,
        ledTemplateId: customOverrides.ledTemplateId || selectedLedTemplate || 'led-starry-diamond',
        
        musicStatus: customOverrides.musicStatus || (selectedTracks.length > 0 ? `Đã chọn ${selectedTracks.length} bài hát kịch bản` : 'Đã chọn kịch bản nhạc tiệc cưới chuẩn'),
        selectedMusic: customOverrides.selectedMusic || (selectedTracks.length > 0 ? selectedTracks : ['w1', 'e1', 't1', 'd1']),
        youtubeLinks: customOverrides.youtubeLinks || youtubeLinks,
        customNotes: customOverrides.customNotes !== undefined ? customOverrides.customNotes : (customNotes || 'Mở kịch bản chuẩn cho sảnh tiệc sân khấu'),
        
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

  // Floor mapping helper between LedCustomizer (tang-1, tang-2, tang-3, tang-4) and FLOOR_1, FLOOR_2, FLOOR_3, FLOOR_4
  const mapFloorToLedId = (floorCode) => {
    if (floorCode === 'FLOOR_1' || floorCode === 'tang-1') return 'tang-1';
    if (floorCode === 'FLOOR_2' || floorCode === 'tang-2') return 'tang-2';
    if (floorCode === 'FLOOR_4' || floorCode === 'tang-4') return 'tang-4';
    return 'tang-3';
  };

  const mapFloorFromLedId = (ledCode) => {
    if (ledCode === 'tang-1' || ledCode === 'FLOOR_1') return 'FLOOR_1';
    if (ledCode === 'tang-2' || ledCode === 'FLOOR_2') return 'FLOOR_2';
    if (ledCode === 'tang-4' || ledCode === 'FLOOR_4') return 'FLOOR_4';
    return 'FLOOR_3';
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 font-montserrat pb-24 selection:bg-[#e3a638] selection:text-white">
      
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-400">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">Lưu Hồ Sơ Thành Công!</div>
            <div className="text-[11px] text-emerald-100">Toàn bộ Phông LED, Nhạc tiệc & Thông tin đã được chuyển tới Đội Kỹ Thuật Admin Golden Palace.</div>
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
              
              {/* 1. TÊN TIỆC CƯỚI (WITH PRESETS + MANUAL INPUT, 2-WAY SYNC WITH LED TITLE) */}
              <div className="sm:col-span-2 bg-[#1f1f1f] p-3.5 rounded-2xl border border-amber-500/30">
                <label className="block text-amber-300 font-bold mb-2 uppercase tracking-wider flex items-center justify-between text-xs">
                  <span>Tên Tiệc Cưới & Tiêu Đề (Đồng Bộ Phông LED & Thiệp) (*)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Chọn gợi ý hoặc nhập tự do</span>
                </label>
                
                {/* Preset Option Buttons */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {PARTY_TITLE_PRESETS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPartyTitle(opt)}
                      className={`py-1.5 px-2.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        partyTitle === opt
                          ? 'border-amber-400 bg-amber-400/25 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'border-gray-800 bg-[#161616] text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Free Manual Input Box */}
                <input
                  type="text"
                  value={partyTitle}
                  onChange={(e) => setPartyTitle(e.target.value)}
                  placeholder="VD: LỄ THÀNH HÔN"
                  className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-amber-300 font-bold outline-none text-xs tracking-wider transition-colors"
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

              {/* 2. THỜI GIAN TỔ CHỨC (OPEN MANUAL INPUT + PRESETS, 2-WAY SYNC WITH INVITATION TIME) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Thời Gian / Giờ Đón Khách (*)</span>
                  <span className="text-[10px] text-amber-300 font-normal">Đồng bộ Thiệp</span>
                </label>
                
                <div className="flex items-center gap-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setEventTime('11:00 AM')}
                    className={`py-1 px-2 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      eventTime === '11:00 AM'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-gray-800 bg-[#1f1f1f] text-gray-400 hover:text-white'
                    }`}
                  >
                    11:00 AM (Trưa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventTime('17:30 PM')}
                    className={`py-1 px-2 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      eventTime === '17:30 PM'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-gray-800 bg-[#1f1f1f] text-gray-400 hover:text-white'
                    }`}
                  >
                    17:30 PM (Tối)
                  </button>
                </div>

                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="VD: 11:00 AM hoặc 10:30 AM"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white font-semibold outline-none transition-colors"
                />
              </div>

              {/* 3. ĐỊA ĐIỂM TẦNG (3-WAY SYNCHRONIZED ACROSS TOP FORM, LED SCREEN & INVITATION) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Địa Điểm Tầng Tổ Chức (*)</span>
                  <span className="text-[10px] text-amber-300 font-normal">Đồng bộ 3 nơi</span>
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

              {/* Link Google Drive */}
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
                onClick={() => handleSaveProfile()}
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
            selectedFloorId={mapFloorToLedId(selectedFloor)}
            setSelectedFloorId={(ledId) => setSelectedFloor(mapFloorFromLedId(ledId))}
            onSave={(ledData) => {
              setSelectedLedTemplate(ledData?.template?.id || 'led-starry-diamond');
              handleSaveProfile({
                ledStatus: `Đã thiết kế phông màn LED (${getFloorName(selectedFloor)}) - Mẫu: ${ledData?.template?.name || 'Sao đêm'}`,
                ledTemplateId: ledData?.template?.id || 'led-starry-diamond'
              });
            }}
          />
        )}

        {activeTab === 'music' && (
          <MusicSelector
            selectedTracks={selectedTracks}
            setSelectedTracks={(tracks) => {
              setSelectedTracks(tracks);
            }}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
            youtubeLinks={youtubeLinks}
            setYoutubeLinks={setYoutubeLinks}
            onSave={() => {
              handleSaveProfile({
                musicStatus: `Đã chọn ${selectedTracks.length} bài hát & gửi kịch bản nhạc`
              });
            }}
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
            eventTime={eventTime}
            setEventTime={setEventTime}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
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
