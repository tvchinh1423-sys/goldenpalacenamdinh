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

// Smart helper to determine session period from time string (Trưa: 9-13:59, Chiều: 14-17:59, Tối: 18-20:00)
function getSessionFromTimeString(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?/);
  if (!match) return null;
  
  const hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  if (isNaN(hour)) return null;

  const totalMinutes = hour * 60 + minute;

  // Trưa: 9:00 (540m) to 13:59 (839m)
  if (totalMinutes >= 540 && totalMinutes < 840) {
    return 'Trưa';
  }
  // Chiều: 14:00 (840m) to 17:59 (1079m)
  if (totalMinutes >= 840 && totalMinutes < 1080) {
    return 'Chiều';
  }
  // Tối: 18:00 (1080m) to 20:00 (1200m) or above
  if (totalMinutes >= 1080) {
    return 'Tối';
  }
  if (totalMinutes < 540) {
    return 'Trưa';
  }
  
  return null;
}

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
  
  // 2-Box Split for Event Time with 2-Way Smart Auto Sync (Defaults: Trưa=11:00, Chiều=16:00, Tối=19:00)
  const [eventSession, setEventSession] = useState('Trưa');
  const [eventSpecificTime, setEventSpecificTime] = useState('11:00');
  const [eventTime, setEventTime] = useState('Trưa (11:00)');
  
  const [selectedFloor, setSelectedFloor] = useState('FLOOR_3');
  const [driveLink, setDriveLink] = useState('');

  // LED State
  const [selectedLedTemplate, setSelectedLedTemplate] = useState('led-starry-diamond');

  // Music selector state - EMPTY ARRAY BY DEFAULT (NO PRE-SELECTED TRACKS)
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState({ welcome: '', entrance: '', toast: '', dining: '' });
  const [customNotes, setCustomNotes] = useState('');

  // Validation display control (Only show warning badges on attempt submit or onBlur)
  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [validationError, setValidationError] = useState('');

  // Auto-Lookup Saved Profile by Phone Number (Phone acts as Customer ID)
  const [phoneLookupNotice, setPhoneLookupNotice] = useState('');
  const [isLookingUpPhone, setIsLookingUpPhone] = useState(false);

  const lookupProfileByPhone = async (phoneStr) => {
    const clean = (phoneStr || '').replace(/[^0-9]/g, '');
    if (clean.length < 8) {
      setPhoneLookupNotice('');
      return;
    }

    setIsLookingUpPhone(true);
    try {
      const res = await fetch(`/api/personalize?phone=${encodeURIComponent(clean)}&t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.profile) {
        const prof = data.profile;
        if (prof.partyTitle) setPartyTitle(prof.partyTitle);
        if (prof.groomName) setGroomName(prof.groomName);
        if (prof.brideName) setBrideName(prof.brideName);
        if (prof.eventDate) setEventDate(prof.eventDate);
        if (prof.floorId) setSelectedFloor(prof.floorId);
        if (prof.driveLink) setDriveLink(prof.driveLink);
        
        if (prof.selectedMusic && prof.selectedMusic.length > 0) setSelectedTracks(prof.selectedMusic);
        if (prof.youtubeLinks) setYoutubeLinks(prof.youtubeLinks);
        if (prof.customNotes) setCustomNotes(prof.customNotes);
        if (prof.ledTemplateId) setSelectedLedTemplate(prof.ledTemplateId);

        // Parse eventTime e.g. "Chiều (16:00)"
        if (prof.eventTime) {
          const rawTime = prof.eventTime;
          const matchSession = rawTime.match(/(Trưa|Chiều|Tối)/);
          const matchTime = rawTime.match(/(\d{1,2}:\d{2})/);
          if (matchSession) setEventSession(matchSession[1]);
          if (matchTime) setEventSpecificTime(matchTime[1]);
          setEventTime(rawTime);
        }

        setPhoneLookupNotice(`✨ Đã tự động điền lại toàn bộ thông tin tiệc cưới của SĐT ${prof.phone}! Anh/chị có thể bổ sung Link Drive hoặc chỉnh sửa thông tin bên dưới.`);
        setTimeout(() => setPhoneLookupNotice(''), 8000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLookingUpPhone(false);
    }
  };

  // Drive Accessibility Auto-Checker State
  const [driveChecking, setDriveChecking] = useState(false);
  const [driveStatus, setDriveStatus] = useState(null); // { isPublic: boolean, isGoogleDrive: boolean, error?: string, message?: string }

  const markTouched = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const shouldShowWarning = (field, val) => {
    const isEmpty = !val || (typeof val === 'string' && !val.trim());
    return isEmpty && (showErrors || touchedFields[field]);
  };

  // Check Drive Public Access
  const verifyDriveLink = async (linkUrl) => {
    if (!linkUrl || !linkUrl.trim()) {
      setDriveStatus(null);
      return;
    }
    setDriveChecking(true);
    try {
      const res = await fetch('/api/check-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkUrl })
      });
      const data = await res.json();
      setDriveStatus(data);
    } catch (err) {
      setDriveStatus({ isPublic: false, error: 'Không thể kiểm tra đường dẫn này' });
    } finally {
      setDriveChecking(false);
    }
  };

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
    setShowErrors(true);

    // STRICT VALIDATION: Check required fields (driveLink is OPTIONAL)
    const effectiveTitle = customOverrides.partyTitle || partyTitle;
    const effectiveGroom = customOverrides.groomName || groomName;
    const effectiveBride = customOverrides.brideName || brideName;
    const effectiveDate = customOverrides.eventDate || eventDate;
    const effectiveTime = customOverrides.eventTime || eventTime;
    const effectivePhone = customOverrides.phone || phone;

    const isMissingRequired = 
      !effectiveTitle?.trim() ||
      !effectiveGroom?.trim() ||
      !effectiveBride?.trim() ||
      !effectiveDate ||
      !effectiveTime?.trim() ||
      !effectivePhone?.trim();

    if (isMissingRequired) {
      setValidationError('⚠️ Vui lòng điền đầy đủ thông tin vào bảng đăng ký (Tên tiệc, Chú rể, Cô dâu, Ngày cưới, Giờ đón khách, SĐT) trước khi lưu!');
      setTimeout(() => setValidationError(''), 6000);
      return; // STRICTLY BLOCK SAVING IF REQUIRED FIELDS ARE MISSING!
    }

    // Verify drive link access if provided
    const effectiveDrive = customOverrides.driveLink !== undefined ? customOverrides.driveLink : driveLink;
    if (effectiveDrive && effectiveDrive.trim()) {
      if (!driveStatus || driveStatus.url !== effectiveDrive) {
        await verifyDriveLink(effectiveDrive);
      }
    }

    setValidationError('');
    setSaving(true);
    const currentFloorName = getFloorName(selectedFloor);

    // Music Status Check: Only say "Đã chọn..." if user actively selected tracks or pasted youtube links
    const hasUserMusic = (selectedTracks && selectedTracks.length > 0) || Object.values(youtubeLinks || {}).some(Boolean);
    const finalMusicStatus = customOverrides.musicStatus || (hasUserMusic ? `Đã chọn ${selectedTracks.length} bài hát kịch bản` : 'Không có yêu cầu gì');

    try {
      const payload = {
        partyTitle: effectiveTitle,
        groomName: effectiveGroom,
        brideName: effectiveBride,
        phone: effectivePhone,
        eventDate: effectiveDate,
        eventTime: effectiveTime,
        floorId: customOverrides.selectedFloor || selectedFloor,
        venueName: currentFloorName,
        driveLink: effectiveDrive,
        
        // LED & MUSIC CONFIGURATIONS
        ledStatus: customOverrides.ledStatus || `Đã thiết kế phông màn LED sân khấu (${currentFloorName})`,
        ledTemplateId: customOverrides.ledTemplateId || selectedLedTemplate || 'led-starry-diamond',
        ledFont: customOverrides.ledFont || 'ballet',
        ledBrideGroomFontSize: customOverrides.ledBrideGroomFontSize !== undefined ? customOverrides.ledBrideGroomFontSize : 59,
        ledTitleFontSize: customOverrides.ledTitleFontSize !== undefined ? customOverrides.ledTitleFontSize : 32,
        ledDateFontSize: customOverrides.ledDateFontSize !== undefined ? customOverrides.ledDateFontSize : 24,
        
        musicStatus: finalMusicStatus,
        selectedMusic: customOverrides.selectedMusic !== undefined ? customOverrides.selectedMusic : selectedTracks,
        youtubeLinks: customOverrides.youtubeLinks || youtubeLinks,
        customNotes: customOverrides.customNotes !== undefined ? customOverrides.customNotes : (customNotes || 'Không có ghi chú thêm'),
        
        invitationSlug: `thiep-${(effectiveGroom || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}-${(effectiveBride || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')}-2026`
      };

      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        try {
          localStorage.setItem('gp_saved_wedding_profile', JSON.stringify(payload));
        } catch (err) {}
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
      
      {/* Toast Success Notification */}
      {savedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-400">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">Lưu Hồ Sơ Thành Công!</div>
            <div className="text-[11px] text-emerald-100">Toàn bộ Phông LED, Playlist Nhạc & Thông tin đã được chuyển tới Đội Kỹ Thuật Admin Golden Palace.</div>
          </div>
        </div>
      )}

      {/* Toast Phone Auto-Lookup Notice */}
      {phoneLookupNotice && (
        <div className="fixed top-24 right-6 z-50 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse border border-blue-300 font-semibold text-xs max-w-md">
          <span className="material-symbols-outlined text-2xl shrink-0">history_edu</span>
          <div>{phoneLookupNotice}</div>
        </div>
      )}

      {/* Validation Warning Alert Toast */}
      {validationError && (
        <div className="fixed top-24 right-6 z-50 bg-amber-500 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse border border-amber-300 font-bold text-xs max-w-md">
          <span className="material-symbols-outlined text-2xl shrink-0">warning</span>
          <div>{validationError}</div>
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

          {/* Registration Form Block */}
          <div className="w-full max-w-3xl mt-10 bg-[#161616] border border-[#e3a638]/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-[#e3a638]">
                <span className="material-symbols-outlined text-2xl">badge</span>
                <h3 className="text-base sm:text-lg font-playfair font-bold">Đăng Ký Thông Tin</h3>
              </div>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 font-semibold">
                Đồng Bộ Real-time 3 Tính Năng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* 1. TÊN TIỆC CƯỚI & TIÊU ĐỀ */}
              <div className="sm:col-span-2 bg-[#1f1f1f] p-3.5 rounded-2xl border border-amber-500/30">
                <label className="block text-amber-300 font-bold mb-2 uppercase tracking-wider flex items-center justify-between text-xs">
                  <span>TÊN TIỆC CƯỚI & TIÊU ĐỀ (*)</span>
                  {shouldShowWarning('partyTitle', partyTitle) ? (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng điền tên tiệc
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-normal">Chọn gợi ý từ mũi tên hoặc nhập tự do</span>
                  )}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Ô 1: Dropdown chọn tên tiệc mẫu có mũi tên */}
                  <select
                    value={PARTY_TITLE_PRESETS.includes(partyTitle) ? partyTitle : 'Khác'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== 'Khác') {
                        setPartyTitle(val);
                      }
                      markTouched('partyTitle');
                    }}
                    className="w-full bg-[#161616] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3 py-2.5 text-amber-300 font-bold outline-none cursor-pointer text-xs"
                  >
                    <option value="" disabled>-- Chọn Tên Tiệc Gợi Ý --</option>
                    {PARTY_TITLE_PRESETS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="Khác">-- Tự Nhập Tên Tiệc Khác --</option>
                  </select>

                  {/* Ô 2: Điền tự do / Chỉnh sửa tên tiệc */}
                  <input
                    type="text"
                    value={partyTitle}
                    onChange={(e) => setPartyTitle(e.target.value)}
                    onBlur={() => markTouched('partyTitle')}
                    placeholder="VD: LỄ THÀNH HÔN"
                    className={`w-full bg-[#141414] border rounded-xl px-4 py-2.5 text-amber-300 font-bold outline-none text-xs tracking-wider transition-colors ${
                      shouldShowWarning('partyTitle', partyTitle) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                    }`}
                  />
                </div>
              </div>

              {/* Tên Chú Rể */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Tên Chú Rể (*)</span>
                  {shouldShowWarning('groomName', groomName) && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng nhập tên chú rể
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  onBlur={() => markTouched('groomName')}
                  placeholder="VD: Đức Hoàng"
                  className={`w-full bg-[#1f1f1f] border rounded-xl px-4 py-2.5 text-white font-semibold outline-none transition-colors ${
                    shouldShowWarning('groomName', groomName) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                  }`}
                />
              </div>

              {/* Tên Cô Dâu */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Tên Cô Dâu (*)</span>
                  {shouldShowWarning('brideName', brideName) && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng nhập tên cô dâu
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  onBlur={() => markTouched('brideName')}
                  placeholder="VD: Thu Hương"
                  className={`w-full bg-[#1f1f1f] border rounded-xl px-4 py-2.5 text-white font-semibold outline-none transition-colors ${
                    shouldShowWarning('brideName', brideName) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                  }`}
                />
              </div>

              {/* Ngày Tổ Chức */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Ngày Tổ Chức Cưới (*)</span>
                  {shouldShowWarning('eventDate', eventDate) && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng chọn ngày
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  onBlur={() => markTouched('eventDate')}
                  className={`w-full bg-[#1f1f1f] border rounded-xl px-4 py-2.5 text-white outline-none transition-colors ${
                    shouldShowWarning('eventDate', eventDate) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                  }`}
                />
              </div>

              {/* THỜI GIAN ĐÓN KHÁCH (SMART 2-WAY AUTO SYNC DEFAULTS: Trưa=11:00, Chiều=16:00, Tối=19:00) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Thời Gian Đón Khách (*)</span>
                  {shouldShowWarning('eventTime', eventTime) ? (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng nhập giờ
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-300 font-normal">Đồng bộ Thiệp</span>
                  )}
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* Ô 1: Buổi Trưa (11:00) / Chiều (16:00) / Tối (19:00) */}
                  <select
                    value={eventSession}
                    onChange={(e) => {
                      const session = e.target.value;
                      setEventSession(session);
                      markTouched('eventTime');
                      
                      let defaultTime = '11:00';
                      if (session === 'Trưa') defaultTime = '11:00';
                      if (session === 'Chiều') defaultTime = '16:00';
                      if (session === 'Tối') defaultTime = '19:00';

                      setEventSpecificTime(defaultTime);
                      setEventTime(`${session} (${defaultTime})`);
                    }}
                    className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-3 py-2.5 text-amber-300 font-bold outline-none cursor-pointer text-xs"
                  >
                    <option value="Trưa">Trưa</option>
                    <option value="Chiều">Chiều</option>
                    <option value="Tối">Tối</option>
                  </select>

                  {/* Ô 2: Giờ cụ thể tùy chỉnh & Tự động đồng bộ Buổi */}
                  <input
                    type="text"
                    value={eventSpecificTime}
                    onChange={(e) => {
                      const timeVal = e.target.value;
                      setEventSpecificTime(timeVal);
                      
                      // Auto-detect & sync matched session from typed time string (Trưa: 9-13:59, Chiều: 14-17:59, Tối: 18-20:00)
                      const detectedSession = getSessionFromTimeString(timeVal) || eventSession;
                      setEventSession(detectedSession);
                      setEventTime(`${detectedSession} (${timeVal})`);
                    }}
                    onBlur={() => markTouched('eventTime')}
                    placeholder="11:00"
                    className={`w-full bg-[#1f1f1f] border rounded-xl px-3 py-2.5 text-white font-semibold outline-none transition-colors text-xs text-center font-mono ${
                      shouldShowWarning('eventTime', eventTime) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                    }`}
                  />
                </div>
              </div>

              {/* ĐỊA ĐIỂM TẦNG */}
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

              {/* Số Điện Thoại (SỐ ĐIỆN THOẠI LÀ ID KHÁCH HÀNG - TỰ ĐỘNG LẤY LẠI HỒ SƠ ĐÃ LƯU) */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    Số Điện Thoại Liên Hệ Gia Chủ (*)
                    {isLookingUpPhone && <span className="material-symbols-outlined text-xs animate-spin text-amber-400">sync</span>}
                  </span>
                  {shouldShowWarning('phone', phone) && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Vui lòng nhập SĐT
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhone(val);
                    if (val.replace(/[^0-9]/g, '').length >= 9) {
                      lookupProfileByPhone(val);
                    }
                  }}
                  onBlur={() => {
                    markTouched('phone');
                    if (phone.replace(/[^0-9]/g, '').length >= 9) {
                      lookupProfileByPhone(phone);
                    }
                  }}
                  placeholder="Nhập số điện thoại của bạn..."
                  className={`w-full bg-[#1f1f1f] border rounded-xl px-4 py-2.5 text-white outline-none transition-colors ${
                    shouldShowWarning('phone', phone) ? 'border-amber-500/80 bg-amber-500/10' : 'border-gray-700 focus:border-[#e3a638]'
                  }`}
                />
                <p className="text-[11px] text-amber-300/80 italic flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-xs text-amber-400">info</span>
                  Nhập SĐT nếu bạn đã đăng ký thông tin trước đó
                </p>
              </div>

              {/* Link Google Drive (KHÔNG BẮT BUỘC - AUTOMATIC ACCESSIBILITY CHECK) */}
              <div className="sm:col-span-2 bg-[#1b1b1b] p-3.5 rounded-xl border border-blue-500/30 space-y-1.5">
                <label className="block text-blue-300 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    LINK GOOGLE DRIVE / CLOUD CHỨA ẢNH & VIDEO CƯỚI (KHÔNG BẮT BUỘC):
                  </span>
                  {driveChecking && (
                    <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                      Đang kiểm tra...
                    </span>
                  )}
                </label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => {
                    setDriveLink(e.target.value);
                    if (driveStatus) setDriveStatus(null);
                  }}
                  onBlur={() => {
                    markTouched('driveLink');
                    if (driveLink.trim()) {
                      verifyDriveLink(driveLink);
                    }
                  }}
                  placeholder="Dán link Google Drive / Dropbox (VD: https://drive.google.com/drive/folders/...)"
                  className={`w-full bg-[#121212] border rounded-lg px-3.5 py-2 text-white font-mono outline-none transition-colors ${
                    driveStatus && !driveStatus.isPublic
                      ? 'border-amber-500 bg-amber-500/10'
                      : driveStatus && driveStatus.isPublic
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 focus:border-blue-400'
                  }`}
                />
                
                <p className="text-[11px] text-blue-300/80 italic flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-xs text-blue-400">info</span>
                  Vui lòng mở quyền chia sẻ "Bất kỳ ai có liên kết" để kỹ thuật xem được file
                </p>

                {/* Drive Check Status Badges & Warnings */}
                {driveChecking && (
                  <p className="text-[11px] text-cyan-300 italic flex items-center gap-1.5 mt-1.5 animate-pulse">
                    <span className="material-symbols-outlined text-sm animate-spin text-cyan-400">sync</span>
                    Đang tự động kiểm tra quyền truy cập link Drive...
                  </p>
                )}

                {!driveChecking && driveStatus && driveStatus.isPublic && (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
                    <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                    {driveStatus.message || 'Link Google Drive đã được mở công khai hợp lệ!'}
                  </p>
                )}

                {!driveChecking && driveStatus && !driveStatus.isPublic && (
                  <div className="p-3 bg-amber-500/15 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-semibold space-y-1 mt-2 animate-pulse">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <span className="material-symbols-outlined text-lg">warning</span>
                      CẢNH BÁO: Link Google Drive đang ở chế độ Riêng Tư / Khóa Quyền!
                    </div>
                    <p className="text-[11px] text-amber-200/90 font-normal leading-relaxed">
                      Vui lòng mở ứng dụng Google Drive ➔ Nhấn nút <strong>Chia Sẻ (Share)</strong> ➔ Chuyển từ "Hạn chế" sang <strong>"Bất kỳ ai có liên kết" (Anyone with the link)</strong> để đội kỹ thuật có thể tải ảnh & video tiệc cưới.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Global Submit / Save Profile Button */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-gray-400 italic">
                * Nhập SĐT đã lưu để tự điền lại hồ sơ. Vui lòng nhập đủ các trường bắt buộc (*).
              </p>
              <button
                onClick={() => handleSaveProfile()}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    Đang Lưu Hồ Sơ...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    Lưu Hồ Sơ & Gửi Đội Kỹ Thuật
                  </>
                )}
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
                ledTemplateId: ledData?.template?.id || 'led-starry-diamond',
                ledFont: ledData?.ledFont || 'ballet',
                ledBrideGroomFontSize: ledData?.ledBrideGroomFontSize || 59,
                ledTitleFontSize: ledData?.ledTitleFontSize || 32,
                ledDateFontSize: ledData?.ledDateFontSize || 24
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
                musicStatus: selectedTracks.length > 0 ? `Đã chọn ${selectedTracks.length} bài hát & gửi kịch bản nhạc` : 'Không có yêu cầu gì',
                selectedMusic: selectedTracks
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
