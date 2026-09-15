'use client';

import { useState } from 'react';
import AISmartInputBar from '@/components/ui/AISmartInputBar';

export default function AIPersonalizeInputSection({ onProfileCreated }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [showMenuSection, setShowMenuSection] = useState(true);

  // Drive Link verification state
  const [driveChecking, setDriveChecking] = useState(false);
  const [driveStatus, setDriveStatus] = useState(null);

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

  const [formData, setFormData] = useState({
    id: '',
    partyTitle: 'LỄ THÀNH HÔN',
    groomName: '',
    brideName: '',
    phone: '',
    eventDate: '',
    eventTime: '11:00 AM',
    floorId: 'FLOOR_2',
    customNotes: '',
    driveLink: '',
    ledTemplateId: 'led-cosmic-milkyway',
    ledFont: 'ballet',
    ledBrideGroomFontSize: 59,
    ledTitleFontSize: 32,
    ledDateFontSize: 24,
    selectedMusic: [],
    youtubeLinks: {},
    khaiViText: '',
    monChinhText: '',
    trangMiengText: '',
    doUongText: '',
    isExistingProfile: false
  });

  const handleParsed = async (parsedData) => {
    let groom = parsedData.groomName || '';
    let bride = parsedData.brideName || '';

    if (!groom || !bride) {
      if (parsedData.brideGroomNames) {
        const bg = parsedData.brideGroomNames.replace(/chú rể|cô dâu/gi, '').split(/&|và|-|\+/i);
        if (bg.length >= 2) {
          groom = groom || bg[0].trim();
          bride = bride || bg[1].trim();
        } else {
          groom = groom || parsedData.brideGroomNames.trim();
        }
      } else if (parsedData.name) {
        groom = groom || parsedData.name.replace(/anh|chị|khách|cô|bác|ông|bà/gi, '').trim();
      }
    }

    let floor = 'FLOOR_2';
    if (parsedData.venue) {
      const v = parsedData.venue.toLowerCase();
      if (v.includes('1')) floor = 'FLOOR_1';
      else if (v.includes('2')) floor = 'FLOOR_2';
      else if (v.includes('4')) floor = 'FLOOR_4';
      else floor = 'FLOOR_3';
    }

    const cleanPhone = (parsedData.phone || '').replace(/[^0-9]/g, '');

    // Query existing profile by phone number
    let existingProfile = null;
    if (cleanPhone.length >= 8) {
      try {
        const res = await fetch(`/api/personalize?phone=${encodeURIComponent(cleanPhone)}&t=${Date.now()}`, { cache: 'no-store' });
        const resData = await res.json();
        if (resData.success && resData.profile) {
          existingProfile = resData.profile;
        }
      } catch (e) {
        console.error('Error checking existing profile:', e);
      }
    }

    const parsedKhaiVi = parsedData.khaiVi ? parsedData.khaiVi.join('\n') : '';
    const parsedMonChinh = parsedData.monChinh ? parsedData.monChinh.join('\n') : '';
    const parsedTrangMieng = parsedData.trangMieng ? parsedData.trangMieng.join('\n') : '';
    const parsedDoUong = parsedData.doUong ? parsedData.doUong.join('\n') : '';

    if (existingProfile) {
      // PRESERVE EXISTING PROFILE SETTINGS (LED Backdrop, Music, Custom Notes, Registration Fields)
      const groomFinal = existingProfile.groomName || groom;
      const brideFinal = existingProfile.brideName || bride;

      let titleFinal = existingProfile.partyTitle || parsedData.partyTitle || 'LỄ THÀNH HÔN';
      if (groomFinal) titleFinal = titleFinal.replace(new RegExp(groomFinal, 'gi'), '');
      if (brideFinal) titleFinal = titleFinal.replace(new RegExp(brideFinal, 'gi'), '');
      titleFinal = titleFinal.replace(/&|và|\+|-/gi, '').replace(/\s+/g, ' ').trim();
      if (!titleFinal || titleFinal.length < 2) titleFinal = 'LỄ THÀNH HÔN';

      setFormData({
        id: existingProfile.id,
        partyTitle: titleFinal,
        groomName: groomFinal,
        brideName: brideFinal,
        phone: existingProfile.phone || parsedData.phone || '',
        eventDate: existingProfile.eventDate || parsedData.eventDate || new Date().toISOString().split('T')[0],
        eventTime: existingProfile.eventTime || '11:00 AM',
        floorId: existingProfile.floorId || floor,
        customNotes: existingProfile.customNotes || '', // ABSOLUTELY PRESERVE EXISTING CUSTOM NOTES (MUSIC/SCRIPT)!
        driveLink: existingProfile.driveLink || '',
        ledTemplateId: existingProfile.ledTemplateId || 'led-cosmic-milkyway',
        ledFont: existingProfile.ledFont || 'ballet',
        ledBrideGroomFontSize: existingProfile.ledBrideGroomFontSize || 59,
        ledTitleFontSize: existingProfile.ledTitleFontSize || 32,
        ledDateFontSize: existingProfile.ledDateFontSize || 24,
        selectedMusic: existingProfile.selectedMusic || [],
        youtubeLinks: existingProfile.youtubeLinks || {},
        // MERGE / SUPPLEMENT MISSING MENU CATEGORIES (Prioritize newly parsed AI dishes from image)
        khaiViText: parsedKhaiVi || existingProfile.khaiViText || '',
        monChinhText: parsedMonChinh || existingProfile.monChinhText || '',
        trangMiengText: parsedTrangMieng || existingProfile.trangMiengText || '',
        doUongText: parsedDoUong || existingProfile.doUongText || '',
        isExistingProfile: true
      });

      setStatusMsg(`✦ Nhận diện SĐT ${parsedData.phone || cleanPhone} đã có hồ sơ! Giữ nguyên Phông LED & Kịch bản cũ, bổ sung Thực đơn tiệc.`);
    } else {
      // NEW PROFILE DETECTED
      let titleFinal = parsedData.partyTitle || 'LỄ THÀNH HÔN';
      if (groom) titleFinal = titleFinal.replace(new RegExp(groom, 'gi'), '');
      if (bride) titleFinal = titleFinal.replace(new RegExp(bride, 'gi'), '');
      titleFinal = titleFinal.replace(/&|và|\+|-/gi, '').replace(/\s+/g, ' ').trim();
      if (!titleFinal || titleFinal.length < 2) titleFinal = 'LỄ THÀNH HÔN';

      if (!groom && !bride && !parsedData.phone) {
        alert('⚠️ AI chưa nhận diện được tên hoặc SĐT từ hình ảnh. Vui lòng kiểm tra lại ảnh hoặc dán tin nhắn.');
      }

      setFormData({
        id: '',
        partyTitle: titleFinal,
        groomName: groom || '',
        brideName: bride || '',
        phone: parsedData.phone || '',
        eventDate: parsedData.eventDate || new Date().toISOString().split('T')[0],
        eventTime: '11:00 AM',
        floorId: floor,
        customNotes: '', // Clean notes reserved for user's music script (DO NOT dump contract notes)
        driveLink: '',
        ledTemplateId: 'led-cosmic-milkyway', // Default LED Stage Backdrop
        ledFont: 'ballet', // Default Font
        ledBrideGroomFontSize: 59,
        ledTitleFontSize: 32,
        ledDateFontSize: 24,
        selectedMusic: [],
        youtubeLinks: {},
        khaiViText: parsedKhaiVi,
        monChinhText: parsedMonChinh,
        trangMiengText: parsedTrangMieng,
        doUongText: parsedDoUong,
        isExistingProfile: false
      });

      setStatusMsg(`✨ SĐT mới hoàn toàn! Tự động tạo Phông LED mặc định + Điền đầy đủ thông tin & Thực đơn tiệc.`);
    }

    setIsOpenModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setStatusMsg('🎉 Đã tạo & cập nhật hồ sơ Kỹ thuật & LED thành công!');
        setTimeout(() => {
          setIsOpenModal(false);
          setStatusMsg('');
          if (onProfileCreated) onProfileCreated();
        }, 1000);
      } else {
        alert(data.message || 'Không thể lưu hồ sơ');
      }
    } catch (err) {
      console.error('Error saving personalize profile:', err);
      alert('Lỗi kết nối khi lưu hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-stone-900/90 border border-amber-500/30 p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">photo_camera</span>
          <div>
            <h3 className="text-sm font-bold text-amber-300">Nhập Hồ Sơ Kỹ Thuật Siêu Tốc bằng AI (MB Style)</h3>
            <p className="text-[11px] text-stone-400">Chụp ảnh hợp đồng, tải ảnh Zalo hoặc dán tin nhắn để AI tự tạo phông màn LED & Kịch bản</p>
          </div>
        </div>
      </div>

      {/* Smart Input Component */}
      <AISmartInputBar onParsed={handleParsed} />

      {/* Confirmation Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 text-stone-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <div>
                <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>Xác Nhận Hồ Sơ Kỹ Thuật (Sân Khấu & LED & Menu Tiệc)</span>
                </h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  formData.isExistingProfile
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {formData.isExistingProfile
                    ? `✦ Đã tìm thấy SĐT ${formData.phone} (Khách đã đăng ký) - Bổ sung thông tin còn thiếu`
                    : '✨ SĐT mới chưa từng đăng ký - Tự động thiết kế Phông LED mặc định'}
                </span>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-stone-400 hover:text-white font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
              {/* Registration Fields */}
              <div className="space-y-3 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-800 pb-2">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>Bảng Đăng Ký Thông Tin Tiệc Cưới</span>
                </div>

                <div>
                  <label className="block text-amber-200/90 font-bold mb-1">Tên Tiệc Cưới & Tiêu Đề <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.partyTitle}
                    onChange={(e) => setFormData({ ...formData, partyTitle: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none font-bold"
                    placeholder="VD: LỄ THÀNH HÔN ĐỨC HOÀNG & THU HƯƠNG"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Tên Chú Rể <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.groomName}
                      onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                      placeholder="VD: Đức Hoàng"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Tên Cô Dâu <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.brideName}
                      onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                      placeholder="VD: Thu Hương"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Số Điện Thoại Liên Hệ <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 font-mono text-amber-300 focus:border-amber-400 outline-none font-bold"
                      placeholder="0912345678"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Địa Điểm Tầng Tổ Chức</label>
                    <select
                      value={formData.floorId}
                      onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none font-bold"
                    >
                      <option value="FLOOR_1">Tầng 1</option>
                      <option value="FLOOR_2">Tầng 2</option>
                      <option value="FLOOR_3">Tầng 3</option>
                      <option value="FLOOR_4">Tầng 4</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Ngày Tổ Chức Cưới</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/90 font-bold mb-1">Thời Gian Đón Khách / Làm Lễ</label>
                    <input
                      type="text"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                      placeholder="11:00 AM"
                    />
                  </div>
                </div>

                {/* Link Google Drive / Cloud chứa Ảnh & Video Cưới (LIVE VERIFICATION MATCHING WEB) */}
                <div className="bg-stone-900 p-3.5 rounded-xl border border-blue-500/30 space-y-1.5 mt-2">
                  <label className="block text-blue-300 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">cloud_upload</span>
                      <span>Link Google Drive / Cloud chứa Ảnh & Video Cưới (Không bắt buộc):</span>
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
                    value={formData.driveLink || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, driveLink: val });
                      if (driveStatus) setDriveStatus(null);
                    }}
                    onBlur={() => {
                      if (formData.driveLink && formData.driveLink.trim()) {
                        verifyDriveLink(formData.driveLink);
                      }
                    }}
                    placeholder="Dán link Google Drive / Dropbox (VD: https://drive.google.com/drive/folders/...)"
                    className={`w-full bg-stone-950 border rounded-lg px-3.5 py-2 text-white font-mono outline-none text-xs transition-colors ${
                      driveStatus && !driveStatus.isPublic
                        ? 'border-amber-500 bg-amber-500/10'
                        : driveStatus && driveStatus.isPublic
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-stone-700 focus:border-blue-400'
                    }`}
                  />
                  
                  <p className="text-[11px] text-stone-400 italic flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs text-blue-400">info</span>
                    Vui lòng mở quyền chia sẻ "Bất kỳ ai có liên kết" để kỹ thuật xem được file
                  </p>

                  {/* Drive Check Status Badges & Warnings */}
                  {driveChecking && (
                    <p className="text-[11px] text-cyan-300 italic flex items-center gap-1.5 mt-1.5 animate-pulse bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/60">
                      <span className="material-symbols-outlined text-sm animate-spin text-cyan-400">sync</span>
                      Đang tự động kiểm tra quyền truy cập link Drive...
                    </p>
                  )}

                  {!driveChecking && driveStatus && driveStatus.isPublic && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-1.5 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/40">
                      <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                      <span>{driveStatus.message || 'Link Google Drive đã được mở công khai hợp lệ'}</span>
                    </div>
                  )}

                  {!driveChecking && driveStatus && !driveStatus.isPublic && (
                    <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5 mt-1.5 bg-amber-950/60 p-2.5 rounded-lg border border-amber-500/50 animate-pulse">
                      <span className="material-symbols-outlined text-base text-amber-400">warning</span>
                      <span>{driveStatus.error || 'Link Google Drive đang bị khóa riêng tư! Vui lòng bật "Bất kỳ ai có liên kết"'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* LED Stage Backdrop Status Section */}
              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">tv</span>
                  <div>
                    <span className="font-bold text-amber-300 block">Phông Màn LED Sân Khấu</span>
                    <span className="text-[11px] text-stone-300">
                      {formData.isExistingProfile
                        ? '🎨 Giữ nguyên mẫu phông LED cũ đã tùy chỉnh của khách'
                        : '✨ Tự động thiết kế Phông LED mặc định (Vũ trụ Cosmic Milkyway - Font Ballet)'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono text-[11px] rounded-lg border border-amber-500/40">
                  {formData.ledTemplateId}
                </span>
              </div>

              {/* Menu Categories Accordion/Section */}
              <div className="space-y-3 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                    <span>Thực Đơn Menu Tiệc Cưới (Tự Động Điền Vào Menu Bàn Tiệc)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMenuSection(!showMenuSection)}
                    className="text-stone-400 hover:text-amber-300 text-xs flex items-center gap-1"
                  >
                    <span>{showMenuSection ? 'Thu gọn' : 'Mở rộng'}</span>
                    <span className="material-symbols-outlined text-sm">
                      {showMenuSection ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {showMenuSection && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-stone-300 font-bold mb-1 text-[11px]">1. Món Khai Vị (mỗi món 1 dòng)</label>
                      <textarea
                        rows={3}
                        value={formData.khaiViText}
                        onChange={(e) => setFormData({ ...formData, khaiViText: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none text-xs font-sans"
                        placeholder="VD: Súp gà ngô nấm&#10;Salad trứng cá hồi"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-bold mb-1 text-[11px]">2. Món Chính (mỗi món 1 dòng)</label>
                      <textarea
                        rows={3}
                        value={formData.monChinhText}
                        onChange={(e) => setFormData({ ...formData, monChinhText: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none text-xs font-sans"
                        placeholder="VD: Gà hấp lá chanh&#10;Tôm ủ mây&#10;Cá lăng hấp xì dầu"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-bold mb-1 text-[11px]">3. Tráng Miệng</label>
                      <textarea
                        rows={2}
                        value={formData.trangMiengText}
                        onChange={(e) => setFormData({ ...formData, trangMiengText: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none text-xs font-sans"
                        placeholder="VD: Caramen / Trái cây"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-bold mb-1 text-[11px]">4. Đồ Uống (chỉ tên đồ uống)</label>
                      <textarea
                        rows={2}
                        value={formData.doUongText}
                        onChange={(e) => setFormData({ ...formData, doUongText: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none text-xs font-sans"
                        placeholder="VD: Nước suối&#10;Bia sài gòn"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Music Script / Custom Notes (Dedicated for Music & Script) */}
              <div>
                <label className="block text-amber-200/90 font-bold mb-1 flex items-center justify-between">
                  <span>Ghi Chú Âm Nhạc / Kịch Bản Tiệc Cưới</span>
                  <span className="text-[10px] text-stone-400 font-normal">💡 Dành riêng cho Kịch bản & Bài hát yêu cầu</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.customNotes}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 outline-none"
                  placeholder="Ví dụ: Mở bài Beautiful in White khi chú rể đón cô dâu lên sân khấu..."
                />
              </div>

              {statusMsg && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-bold flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Lưu Hồ Sơ Kỹ Thuật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

