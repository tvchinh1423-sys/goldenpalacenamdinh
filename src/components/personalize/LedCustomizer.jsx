'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedFloor, setSelectedFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3 (7.04x3.84m)
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [designMode, setDesignMode] = useState('masterpiece');
  const [customUploadUrl, setCustomUploadUrl] = useState(null);
  const [showRings, setShowRings] = useState(true);
  const [copied, setCopied] = useState(false);

  // Extract initial letters for Monogram
  const getInitial = (name, fallback) => {
    if (!name || !name.trim()) return fallback;
    const parts = name.trim().split(' ');
    const lastWord = parts[parts.length - 1];
    return lastWord.charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  const brideInitial = getInitial(brideName, 'T');
  const groomInitial = getInitial(groomName, 'M');
  const isSameInitial = brideInitial === groomInitial;

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

  // Format Date strictly to Arabic digits 20 . 11 . 2026 (never Roman II)
  const formatDateDots = (dateStr) => {
    if (!dateStr) return '20 . 11 . 2026';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day} . ${month} . ${year}`;
  };

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Sảnh & Kích thước Màn LED: ${selectedFloor.name} (${selectedFloor.widthMeters}m x ${selectedFloor.heightMeters}m)
Monogram: True Interlocking Crest (${brideInitial}${groomInitial})
Tên Dâu Rể: Phông Ballet Canva (Thu hẹp 65% width, tăng stroke weight nét đậm)
Ngày Cưới: ${formatDateDots(eventDate)} (Số Ả Rập 11 chuẩn, phông Playfair Didone)
Chú Rể: ${groomName || 'Văn Mạnh'}
Cô Dâu: ${brideName || 'Anh Thư'}`;
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
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">stars</span>
          Thiết Kế Phông Màn LED Sân Khấu
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Đã sửa lỗi số 11 Ả Rập chuẩn, tăng độ dày nét chữ Ballet từ xa, thu hẹp 65% khung tên giữ lề an toàn và Monogram TM lồng đan nghệ thuật.
        </p>

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
            <span>Chuẩn Đồ Họa 3D</span>
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
                  onClick={() => setSelectedFloor(floor)}
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
          <div className="text-[11px] text-amber-300 font-mono mt-2 text-center font-bold">
            Tỷ lệ màn hình mét: {selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m (Chuẩn tỷ lệ 100%)
          </div>
        </div>

        {/* 2. Names & Date Input */}
        <div className="space-y-3.5 text-sm">
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wider">
              Tên Cô Dâu
            </label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="VD: Anh Thư"
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
              placeholder="VD: Văn Mạnh"
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none text-xs transition-colors"
            />
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
              Biểu Tượng Nối Giữa 2 Tên
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowRings(true)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  showRings
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <span>💍 Cặp Nhẫn Đan Xen</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRings(false)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !showRings
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <span>& Ký Tự Trắng Bạc</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Starry Background Presets */}
        <div className="mt-5 pt-4 border-t border-gray-800">
          <label className="block text-gray-300 text-xs font-semibold mb-2.5 uppercase tracking-wider">
            Chọn Nền Bầu Trời Sao Lấp Lánh
          </label>
          <div className="space-y-2.5">
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
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                      {tmpl.name}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{tmpl.slogan}</div>
                  </div>
                  <span className="text-[9px] text-amber-400 font-mono px-2 py-0.5 bg-amber-400/10 rounded border border-amber-400/30 whitespace-nowrap">
                    {tmpl.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CANVA UPLOAD MODE */}
        {designMode === 'canva' && (
          <div className="mt-5 pt-4 border-t border-gray-800 space-y-3">
            <div className="bg-cyan-950/60 border border-cyan-500/30 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs mb-1">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Tự Thiết Kế Trên Canva ({selectedFloor.shortName})</span>
              </div>
              <p className="text-[10px] text-gray-300 mb-2 leading-relaxed">
                Mở Canva thiết kế đúng tỷ lệ mét: <span className="font-bold text-cyan-200">{selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m</span>
              </p>
              <a
                href={getCanvaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">design_services</span>
                <span>Mở Canva Tỷ Lệ {selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m</span>
              </a>
            </div>

            <div className="bg-[#1a1a1a] p-3 rounded-xl border border-gray-700">
              <label className="block text-gray-200 text-xs font-bold mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-amber-400">upload_file</span>
                <span>Tải Tệp Ảnh Thiết Kế Đã Xuất</span>
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="canva-image-input-8"
                className="hidden"
              />

              <label
                htmlFor="canva-image-input-8"
                className="w-full py-2.5 px-3 bg-[#252525] hover:bg-[#303030] border border-dashed border-gray-600 hover:border-amber-400 rounded-lg text-xs text-gray-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-amber-400">add_photo_alternate</span>
                <span className="font-semibold text-[11px]">Bấm chọn tệp PNG / JPG từ Canva</span>
              </label>

              {customUploadUrl && (
                <div className="mt-2 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg text-[11px] text-amber-300">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                    Đã tải ảnh thành công!
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

      {/* Right Column: Live LED Screen Visualizer */}
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
          
          {/* CUSTOM UPLOADED IMAGE FROM CANVA OR STARRY BACKGROUND */}
          {customUploadUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${customUploadUrl})` }}
            ></div>
          ) : (
            <>
              {/* REAL HIGH-RES STARRY NIGHT BACKGROUND IMAGE */}
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

              {/* FOREGROUND CONTENT LAYER: EQUAL VERTICAL SPACING ACROSS 70% HEIGHT (BOTTOM 30% EMPTY) */}
              <div className="relative z-30 w-full h-[70%] flex flex-col items-center justify-evenly text-center px-4 py-2">

                {/* TẦNG 1: TRUE INTERLOCKING MONOGRAM CREST (Letter T Weaved Directly Through M) */}
                <div className="h-[28%] flex items-center justify-center z-10">
                  <div className="relative h-full aspect-square flex items-center justify-center">
                    <div 
                      className="relative flex items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-normal select-none"
                      style={{ 
                        fontFamily: isSameInitial 
                          ? "'Bodoni Moda', 'Playfair Display', Didot, serif"
                          : "'Cinzel Decorative', 'Parfumerie Script', 'Playfair Display', serif"
                      }}
                    >
                      {/* First Initial (Bride Letter T) */}
                      <span className="font-black italic chrome-silver-text z-20 transform -translate-x-2 sm:-translate-x-3 drop-shadow-[0_4px_15px_rgba(255,255,255,0.7)]">
                        {brideInitial}
                      </span>

                      {isSameInitial ? (
                        <span className="text-amber-300/80 text-xl sm:text-3xl mx-1 font-light">&</span>
                      ) : null}

                      {/* Second Initial (Groom Letter M) Interlocked & Weaved */}
                      <span className="font-light italic chrome-silver-text z-10 transform translate-x-2 sm:translate-x-3 -ml-7 sm:-ml-11 md:-ml-14 opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                        {groomInitial}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TẦNG 2: COUPLE NAMES (Ballet Script, Narrowed to 65% Max-Width for Rich Side Margins & Enhanced Stroke Weight) */}
                <div className="w-[65%] max-w-[65%] flex items-center justify-center z-20">
                  <div 
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-slate-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.98)] leading-tight whitespace-nowrap"
                    style={{ 
                      fontFamily: "'Ballet', 'Great Vibes', cursive",
                      WebkitTextStroke: "0.4px rgba(255,255,255,0.85)"
                    }}
                  >
                    {brideName || 'Anh Thư'} 
                    
                    {showRings ? (
                      <span className="inline-flex items-center mx-3 sm:mx-4 text-amber-300 align-middle">
                        <svg className="w-6 h-6 sm:w-9 sm:h-9 text-amber-300 filter drop-shadow-[0_0_10px_rgba(227,166,56,0.85)]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2a6 6 0 0 0-5.65 4.02A6 6 0 1 0 12 14a6 6 0 0 0 5.65-4.02A6 6 0 0 0 12 2zm-3.5 6a3.5 3.5 0 1 1 3.5 3.5A3.5 3.5 0 0 1 8.5 8zm7 0a3.5 3.5 0 0 1-3.1 3.46 5.48 5.48 0 0 0 0-6.92A3.5 3.5 0 0 1 15.5 8z"/>
                        </svg>
                      </span>
                    ) : (
                      <span className="text-slate-100 text-lg sm:text-2xl md:text-3xl mx-3 sm:mx-4 font-serif italic font-light">&</span>
                    )}

                    {groomName || 'Văn Mạnh'}
                  </div>
                </div>

                {/* TẦNG 3: WEDDING DATE (STRICT ARABIC DIGITS 20 . 11 . 2026 - Didone Serif Font) */}
                <div className="z-20 w-full flex flex-col items-center">
                  <div 
                    className="text-base sm:text-2xl md:text-3xl lg:text-4xl text-amber-200 font-serif drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] border-t border-amber-300/40 pt-2 px-8 font-bold inline-block"
                    style={{ 
                      fontFamily: "'Playfair Display', Didot, 'Times New Roman', serif",
                      fontVariantNumeric: "lining-nums tabular-nums",
                      letterSpacing: "0.15em"
                    }}
                  >
                    {formatDateDots(eventDate)}
                  </div>
                </div>

              </div>
            </>
          )}

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

    </div>
  );
}
