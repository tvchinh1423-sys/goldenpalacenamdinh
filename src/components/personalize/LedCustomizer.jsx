'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

const EVENT_TITLE_OPTIONS = [
  'LỄ THÀNH HÔN',
  'LỄ VU QUY',
  'LỄ TÂN HÔN',
  'LỄ BÁO HỶ',
  'LỄ ĐÍNH HÔN',
  'TIỆC SINH NHẬT',
  'TIỆC KỶ NIỆM'
];

export default function LedCustomizer({ 
  groomName, 
  setGroomName, 
  brideName, 
  setBrideName, 
  eventDate, 
  setEventDate, 
  eventTypeTitle: propEventTypeTitle, 
  setEventTypeTitle: propSetEventTypeTitle,
  selectedFloorId: propSelectedFloorId,
  setSelectedFloorId: propSetSelectedFloorId,
  onSave 
}) {
  const [localFloor, setLocalFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3 (7.04x3.84m)
  const activeFloorId = propSelectedFloorId || localFloor.id;
  const selectedFloor = LED_SCREEN_FLOORS.find(f => f.id === activeFloorId) || LED_SCREEN_FLOORS[0];

  const handleFloorSelect = (floor) => {
    if (propSetSelectedFloorId) {
      propSetSelectedFloorId(floor.id);
    } else {
      setLocalFloor(floor);
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [designMode, setDesignMode] = useState('masterpiece');
  const [customUploadUrl, setCustomUploadUrl] = useState(null);

  // Local fallback state if props not provided
  const [localEventTypeTitle, setLocalEventTypeTitle] = useState('LỄ THÀNH HÔN');
  const eventTypeTitle = propEventTypeTitle !== undefined ? propEventTypeTitle : localEventTypeTitle;
  const setEventTypeTitle = propSetEventTypeTitle || setLocalEventTypeTitle;

  const [showRings, setShowRings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle custom image upload from Canva/Photoshop
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomUploadUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Format Date to xx.xx.xxxx format (e.g. 28.12.2025) strictly Arabic digits
  const formatDateDot = (dateStr) => {
    if (!dateStr) return '28.12.2025';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Sảnh & Kích thước Màn LED: ${selectedFloor.name} (${selectedFloor.widthMeters}m x ${selectedFloor.heightMeters}m)
Tiêu đề tiệc: ${eventTypeTitle}
Tên Dâu Rể: ${brideName || 'Thu Hương'} & ${groomName || 'Đức Hoàng'}
Ngày Cưới: ${formatDateDot(eventDate)}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCanvaLink = () => {
    const widthPx = Math.round(selectedFloor.widthMeters * 1000);
    const heightPx = Math.round(selectedFloor.heightMeters * 1000);
    return `https://www.canva.com/design/play?width=${widthPx}&height=${heightPx}&units=px`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">stars</span>
          Thiết Kế Phông Màn LED Sân Khấu
        </h3>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-[#1a1a1a] p-1.5 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => setDesignMode('masterpiece')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              designMode === 'masterpiece'
                ? 'bg-gradient-to-r from-[#e3a638] to-[#b8860b] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Mẫu Tiệc Cưới Hoàn Hảo</span>
          </button>
          <button
            type="button"
            onClick={() => setDesignMode('canva')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              designMode === 'canva'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            <span>Tải Ảnh Canva / File Riêng</span>
          </button>
        </div>

        {/* 1. Select Floor & LED Dimensions */}
        <div className="mb-5 bg-[#1f1f1f] p-3.5 rounded-xl border border-amber-500/20">
          <label className="block text-amber-300 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">aspect_ratio</span>
            <span>1. Kích Thước Màn LED Theo Tầng (Mét - m)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LED_SCREEN_FLOORS.map((floor) => {
              const active = selectedFloor.id === floor.id;
              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => handleFloorSelect(floor)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/20 text-amber-300 shadow-[0_0_12px_rgba(227,166,56,0.35)]'
                      : 'border-gray-800 bg-[#161616] text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span className="font-bold text-[12px]">{floor.shortName}</span>
                  <span className="text-[10px] font-mono text-amber-200/90 font-bold mt-0.5">{floor.widthMeters}m × {floor.heightMeters}m</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE 1: MASTERPIECE DESIGNER CONTROLS */}
        {designMode === 'masterpiece' && (
          <div className="space-y-4 text-sm">
            
            {/* UNIFIED INPUT: TÊN TIỆC CƯỚI & TIÊU ĐỀ (TẦNG 1) */}
            <div className="bg-[#1a1a1a] p-3.5 rounded-xl border border-amber-500/30">
              <label className="block text-[#e3a638] text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">title</span>
                TÊN TIỆC CƯỚI (*)
              </label>
              
              {/* Quick Suggestion Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {EVENT_TITLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEventTypeTitle(opt)}
                    className={`py-1.5 px-2.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      eventTypeTitle === opt
                        ? 'border-amber-400 bg-amber-400/25 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'border-gray-800 bg-[#141414] text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <input
                type="text"
                value={eventTypeTitle}
                onChange={(e) => setEventTypeTitle(e.target.value)}
                placeholder="VD: LỄ THÀNH HÔN"
                className="w-full bg-[#141414] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none text-xs font-bold tracking-wider transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                  Tên Cô Dâu / Chủ Tiệc
                </label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="VD: Thu Hương"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                  Tên Chú Rể
                </label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="VD: Đức Hoàng"
                  className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wider">
                Ngày Cử Hành Lễ
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none text-xs transition-colors"
              />
            </div>

            {/* Symbol Selector */}
            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                BIỂU TƯỢNG GIỮA 2 TÊN
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowRings(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !showRings
                      ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                      : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  <span>& Ký Tự Trắng Bạc (Mẫu Ảnh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRings(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    showRings
                      ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                      : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  <span>💍 Cặp Nhẫn Đen Trắng</span>
                </button>
              </div>
            </div>

            {/* Starry Background Presets (MINIMAL CLEAN TEXT LIKE IMAGE 3) */}
            <div className="pt-4 border-t border-gray-800">
              <label className="block text-gray-300 text-xs font-semibold mb-2.5 uppercase tracking-wider">
                CHỌN NỀN BẦU TRỜI SAO LẤP LÁNH
              </label>
              <div className="space-y-2">
                {LED_STAGE_TEMPLATES.map((tmpl) => {
                  const active = selectedTemplate.id === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        active
                          ? 'border-[#e3a638] bg-[#e3a638]/10 shadow-[0_0_15px_rgba(227,166,56,0.25)]'
                          : 'border-gray-800 bg-[#161616] hover:border-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                        {tmpl.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* MODE 2: CANVA UPLOAD MODE (ONLY SHOWS THE 2 UPLOAD SECTIONS MATCHING IMAGE 4 EXACTLY) */}
        {designMode === 'canva' && (
          <div className="space-y-4">
            
            {/* Box 1: Open Canva link with dimensions */}
            <div className="bg-cyan-950/60 border border-cyan-500/40 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">
                <span className="material-symbols-outlined text-lg">open_in_new</span>
                <span>Tự Thiết Kế Trên Canva ({selectedFloor.shortName})</span>
              </div>
              <p className="text-xs text-gray-300 mb-3 font-medium">
                Mở Canva thiết kế đúng tỷ lệ mét: <span className="font-bold text-cyan-200">{selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m</span>
              </p>
              <a
                href={getCanvaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">design_services</span>
                <span>MỞ CANVA TỶ LỆ {selectedFloor.widthMeters}M × {selectedFloor.heightMeters}M</span>
              </a>
            </div>

            {/* Box 2: File Upload */}
            <div className="bg-[#161616] p-4 rounded-2xl border border-amber-500/30">
              <label className="block text-amber-300 text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>TẢI TỆP ẢNH THIẾT KẾ ĐÃ XUẤT</span>
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="canva-image-input-21"
                className="hidden"
              />

              <label
                htmlFor="canva-image-input-21"
                className="w-full py-4 px-4 bg-[#202020] hover:bg-[#2a2a2a] border border-dashed border-amber-500/50 hover:border-amber-400 rounded-xl text-xs text-gray-200 flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-xl text-amber-400">add_photo_alternate</span>
                <span className="font-bold text-xs">Bấm chọn tệp PNG / JPG từ Canva</span>
              </label>

              {customUploadUrl && (
                <div className="mt-3 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                    Đã tải tệp ảnh lên thành công!
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomUploadUrl(null)}
                    className="text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Right Column: Live LED Screen Visualizer (HIDDEN IN CANVA MODE AS REQUESTED IN IMAGE 4) */}
      {designMode === 'masterpiece' ? (
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Stage Header Info Banner */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#e3a638] animate-pulse text-base">live_tv</span>
              <span className="text-xs font-bold tracking-wider uppercase font-playfair text-amber-300">
                Phông Màn LED Sân Khấu {selectedFloor.name}
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 font-bold">
              Kích thước mét: {selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m
            </span>
          </div>

          {/* LED Stage Screen Canvas Container */}
          <div 
            className="w-full relative rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.95)] bg-[#050508] transition-all duration-500"
            style={{ aspectRatio: `${selectedFloor.widthMeters} / ${selectedFloor.heightMeters}` }}
          >
            
            {/* STARRY BACKGROUND */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${selectedTemplate.bgImage})` }}
            ></div>
            <div className="absolute inset-0 bg-black/25"></div>

            {/* VERTICAL SPOTLIGHT GLOW BEAM */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.25)_0%,_rgba(255,255,255,0.08)_45%,_transparent_75%)] pointer-events-none z-10"></div>

            {/* TOP-LEFT CORNER: Golden Palace Pure Transparent PNG Logo Icon ONLY */}
            <div className="absolute top-3 left-4 sm:top-5 sm:left-6 z-40">
              <img 
                src="/logo-icon.png" 
                alt="Golden Palace Icon Logo" 
                className="h-7 sm:h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(227,166,56,0.85)]" 
              />
            </div>

            {/* FOREGROUND CONTENT LAYER: JUSTIFY-EVENLY FOR 100% EQUAL VERTICAL SPACING ACROSS 70% HEIGHT */}
            <div className="relative z-30 w-full h-[70%] flex flex-col items-center justify-evenly text-center px-4 py-2">

              {/* TẦNG 1: EVENT TITLE HEADER ("LỄ THÀNH HÔN") */}
              <div className="w-full flex items-center justify-center z-20">
                <div 
                  className="text-base sm:text-2xl md:text-3xl lg:text-4xl text-slate-50 font-black tracking-wider uppercase drop-shadow-[0_4px_18px_rgba(0,0,0,0.98)]"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  {eventTypeTitle || 'LỄ THÀNH HÔN'}
                </div>
              </div>

              {/* TẦNG 2: COUPLE NAMES ("Đức Hoàng & Thu Hương") */}
              <div className="w-[75%] max-w-[75%] flex items-center justify-center z-20">
                <div 
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-slate-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.98)] leading-tight whitespace-nowrap flex items-center justify-center"
                  style={{ fontFamily: "'Ballet', 'Great Vibes', cursive" }}
                >
                  <span>{groomName || 'Đức Hoàng'}</span>
                  
                  {showRings ? (
                    /* BLACK & WHITE / MONOCHROME LINE ART WEDDING RINGS */
                    <span className="inline-flex items-center mx-3 sm:mx-5 align-middle">
                      <svg 
                        className="w-8 h-8 sm:w-12 sm:h-12 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" 
                        viewBox="0 0 100 100" 
                        fill="none"
                      >
                        <ellipse cx="38" cy="46" rx="26" ry="15" transform="rotate(-28 38 46)" stroke="#000000" strokeWidth="8" fill="none" />
                        <ellipse cx="60" cy="56" rx="26" ry="15" transform="rotate(18 60 56)" stroke="#000000" strokeWidth="8" fill="none" />
                        <ellipse cx="38" cy="46" rx="26" ry="15" transform="rotate(-28 38 46)" stroke="#ffffff" strokeWidth="4.5" fill="none" />
                        <ellipse cx="38" cy="46" rx="20" ry="10" transform="rotate(-28 38 46)" stroke="#ffffff" strokeWidth="3" fill="none" />
                        <polygon points="26,30 32,25 38,30 32,35" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                        <ellipse cx="60" cy="56" rx="26" ry="15" transform="rotate(18 60 56)" stroke="#ffffff" strokeWidth="4.5" fill="none" />
                        <ellipse cx="60" cy="56" rx="20" ry="10" transform="rotate(18 60 56)" stroke="#ffffff" strokeWidth="3" fill="none" />
                        <polygon points="68,62 74,57 80,62 74,67" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                      </svg>
                    </span>
                  ) : (
                    /* AMPERSAND & IN ELEGANT DIDONE ITALIC */
                    <span 
                      className="text-slate-100 text-lg sm:text-2xl md:text-3xl mx-3 sm:mx-4 font-serif italic font-light tracking-normal"
                      style={{ fontFamily: "'Playfair Display', 'Bodoni Moda', Didot, serif" }}
                    >
                      &
                    </span>
                  )}

                  <span>{brideName || 'Thu Hương'}</span>
                </div>
              </div>

              {/* TẦNG 3: WEDDING DATE ("28.12.2025") */}
              <div className="z-20 w-full flex flex-col items-center">
                <div 
                  className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-50 font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] px-6 font-bold inline-block"
                  style={{ 
                    fontFamily: "'Playfair Display', Didot, 'Times New Roman', serif",
                    fontVariantNumeric: "lining-nums tabular-nums",
                    letterSpacing: "0.14em"
                  }}
                >
                  {formatDateDot(eventDate)}
                </div>
              </div>

            </div>

            {/* INDICATOR OVERLAY: EXACTLY Bottom 30% Empty Space */}
            <div className="absolute bottom-0 inset-x-0 h-[30%] bg-gradient-to-t from-[#020204] via-[#050508]/80 to-transparent flex items-end justify-center pb-2 pointer-events-none z-20">
              <span className="text-[9px] text-amber-200/60 uppercase font-mono tracking-widest bg-black/60 px-3 py-0.5 rounded-full border border-amber-400/20 font-bold">
                Khu Vực Để Trống Đáy Màn LED (Đúng 30% cho Dâu Rể & MC đứng)
              </span>
            </div>

          </div>

          {/* Action Buttons below Visualizer */}
          <div className="w-full flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleCopyConfig}
              className="flex-1 px-5 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white text-xs uppercase font-bold tracking-wider rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-amber-400">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              {copied ? 'Đã Sao Chép Cấu Hình!' : 'Sao Chép Cấu Hình Kỹ Thuật LED'}
            </button>

            {onSave && (
              <button
                onClick={() => onSave({ template: selectedTemplate, floor: selectedFloor, groomName, brideName, eventDate, customUploadUrl })}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">bookmark</span>
                Lưu Vào Dự Toán
              </button>
            )}
          </div>
        </div>
      ) : (
        /* IN CANVA MODE: HIDE THE LIVE LED PREVIEW SCREEN AND SHOW A CLEAN COMPACT SUMMARY IN RIGHT COL */
        <div className="lg:col-span-7 bg-[#141414] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-center items-center text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-cyan-400">cloud_done</span>
          <h4 className="text-lg font-bold text-white">Chế Độ Tải File Riêng / Canva</h4>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            Bạn có thể dùng nút <strong className="text-cyan-300">MỞ CANVA</strong> ở bên trái để thiết kế đúng kích thước <span className="text-amber-300 font-bold">{selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m</span>, sau đó tải tệp ảnh lên.
          </p>
        </div>
      )}

    </div>
  );
}
