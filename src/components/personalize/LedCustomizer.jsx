'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedFloor, setSelectedFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3 (7.04x3.84m)
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [designMode, setDesignMode] = useState('canva'); // Default to Canva / Custom Upload mode as requested by user
  const [customUploadUrl, setCustomUploadUrl] = useState(null);
  const [fontChoice, setFontChoice] = useState('greatvibes');
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

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Kích thước Màn LED: ${selectedFloor.name} (${selectedFloor.specText})
Chế độ thiết kế: ${designMode === 'canva' ? 'Tải ảnh từ Canva / Photoshop' : 'Tạo tự động trên Web'}
Chú Rể: ${groomName || 'Văn Mạnh'}
Cô Dâu: ${brideName || 'Anh Thư'}
Ngày cử hành: ${eventDate || '2026-11-20'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct Canva design link with pixel dimensions corresponding to screen size (e.g. 7040x3840px)
  const getCanvaLink = () => {
    const widthPx = Math.round(selectedFloor.widthMeters * 1000);
    const heightPx = Math.round(selectedFloor.heightMeters * 1000);
    return `https://www.canva.com/design/play?width=${widthPx}&height=${heightPx}&units=px`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls & Canva Mode Switcher */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">palette</span>
          Tùy Chỉnh Phông Màn LED
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Tự do kết nối Canva hoặc tải tệp ảnh thiết kế (PNG/JPG) lên màn LED chuẩn tỷ lệ thực tế.
        </p>

        {/* Mode Switcher: Canva Upload vs Auto Generator */}
        <div className="grid grid-cols-2 gap-2 mb-6 bg-[#1a1a1a] p-1.5 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => setDesignMode('canva')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              designMode === 'canva'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            <span>Tải Ảnh Canva / File Sau Chỉnh Sửa</span>
          </button>
          <button
            type="button"
            onClick={() => setDesignMode('auto')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              designMode === 'auto'
                ? 'bg-[#e3a638] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Tạo Tự Động Trên Web</span>
          </button>
        </div>

        {/* 1. Select Floor & LED Dimensions */}
        <div className="mb-5 bg-[#1f1f1f] p-3.5 rounded-xl border border-amber-500/20">
          <label className="block text-amber-300 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">aspect_ratio</span>
            <span>1. Chọn Sảnh & Kích Thước Màn LED</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LED_SCREEN_FLOORS.map((floor) => {
              const active = selectedFloor.id === floor.id;
              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => setSelectedFloor(floor)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/20 text-amber-300 shadow-[0_0_10px_rgba(227,166,56,0.3)]'
                      : 'border-gray-800 bg-[#161616] text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span className="font-bold text-[11px]">{floor.shortName}</span>
                  <span className="text-[9px] font-mono text-gray-400 mt-0.5">{floor.widthMeters}x{floor.heightMeters}m</span>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-amber-200/80 font-mono mt-2 text-center">
            {selectedFloor.specText}
          </div>
        </div>

        {/* CANVA INTEGRATION MODE */}
        {designMode === 'canva' && (
          <div className="space-y-4">
            
            {/* Direct Canva Launch Button */}
            <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs mb-1.5">
                <span className="material-symbols-outlined text-base">open_in_new</span>
                <span>Mở Canva Với Đúng Tỷ Lệ Màn LED {selectedFloor.shortName}</span>
              </div>
              <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                Tạo thiết kế chuẩn kích thước <span className="font-bold text-cyan-200">{selectedFloor.widthMeters * 1000} × {selectedFloor.heightMeters * 1000} px</span> trên Canva với đầy đủ phông chữ Calligraphy, Monogram và sticker phong phú.
              </p>
              <a
                href={getCanvaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">design_services</span>
                <span>Mở Canva Thiết Kế Màn LED ({selectedFloor.shortName})</span>
              </a>
            </div>

            {/* Custom Image Upload Input */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700">
              <label className="block text-gray-200 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-amber-400">upload_file</span>
                <span>Tải Ảnh Phông LED Từ Canva / Máy Tính</span>
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="canva-image-input"
                className="hidden"
              />

              <label
                htmlFor="canva-image-input"
                className="w-full py-3 px-4 bg-[#252525] hover:bg-[#303030] border-2 border-dashed border-gray-600 hover:border-amber-400 rounded-xl text-xs text-gray-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-amber-400">add_photo_alternate</span>
                <span className="font-semibold">Bấm vào đây để chọn tệp ảnh PNG / JPG</span>
                <span className="text-[10px] text-gray-500">Khuyên dùng xuất ảnh PNG/JPG từ Canva độ phân giải cao</span>
              </label>

              {customUploadUrl && (
                <div className="mt-3 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg text-xs text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                    Đã tải ảnh Canva thành công!
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomUploadUrl(null)}
                    className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* AUTO GENERATOR MODE */}
        {designMode === 'auto' && (
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
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2 text-white outline-none text-xs transition-colors"
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
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2 text-white outline-none text-xs transition-colors"
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
                className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2 text-white outline-none text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Phông Chữ Calligraphy Chuẩn Dấu Tiếng Việt
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFontChoice('greatvibes')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                    fontChoice === 'greatvibes'
                      ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                      : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">Great Vibes Calligraphy ✒️</div>
                  <div className="text-[10px] opacity-75 font-serif italic">Nét uốn lượn bay bổng chuẩn 100% tiếng Việt</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFontChoice('playfair')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                    fontChoice === 'playfair'
                      ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                      : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">Playfair Script 👑</div>
                  <div className="text-[10px] opacity-75 font-serif italic">Nghiêng sang trọng chuẩn tiếng Việt</div>
                </button>
              </div>
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
          <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            {selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m (P3 LED Full HD)
          </span>
        </div>

        {/* LED Stage Screen Canvas Container */}
        <div className={`w-full relative ${selectedFloor.aspectClass} rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.95)] bg-[#050508] transition-all duration-500`}>
          
          {/* CUSTOM UPLOADED IMAGE FROM CANVA OR DEFAULT BACKGROUND */}
          {customUploadUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${customUploadUrl})` }}
            ></div>
          ) : (
            <>
              {/* DEEP ONYX CHARCOAL BLACK BACKGROUND WITH SOFT GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#050508] to-[#020204]"></div>

              {/* VERTICAL SPOTLIGHT BACKLIGHT GLOW STREAM */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.22)_0%,_rgba(255,255,255,0.06)_45%,_transparent_75%)] pointer-events-none z-10"></div>

              {/* GLITTER / DUST BOKEH PARTICLES RAIN */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_50%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)] pointer-events-none z-15"></div>

              {/* TOP-LEFT CORNER: Golden Palace Pure Transparent PNG Logo Icon ONLY */}
              <div className="absolute top-3 left-4 sm:top-5 sm:left-6 z-40">
                <img 
                  src="/logo-icon.png" 
                  alt="Golden Palace Icon Logo" 
                  className="h-7 sm:h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(227,166,56,0.85)]" 
                />
              </div>

              {/* FOREGROUND CONTENT LAYER: GOM 40% NỬA TRÊN */}
              <div className="relative z-30 w-full h-full flex flex-col items-center justify-start pt-4 sm:pt-6 md:pt-8 pb-[38%] text-center">

                {/* 1. MONOGRAM LOGO ("TM" / "MD"): True Interlocking Didone Serif in Luminescent Chrome Silver */}
                <div className="h-[28%] flex items-center justify-center my-0.5">
                  <div className="relative h-full aspect-square flex items-center justify-center">
                    <div className="relative flex items-center justify-center font-didone-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter select-none">
                      <span className="font-black italic chrome-silver-text transform -translate-x-1.5 sm:-translate-x-2.5 z-10 drop-shadow-[0_4px_15px_rgba(255,255,255,0.6)]">
                        {brideInitial}
                      </span>
                      <span className="font-light italic chrome-silver-text transform translate-x-1.5 sm:translate-x-2.5 -ml-5 sm:-ml-8 md:-ml-10 z-20 opacity-95 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
                        {groomInitial}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. MAIN COUPLE NAMES ("Anh Thư & Văn Mạnh") */}
                <div className="w-[90%] sm:w-[70%] h-[20%] flex items-center justify-center my-1">
                  <div 
                    className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-slate-50 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] leading-tight whitespace-nowrap"
                    style={{
                      fontFamily: fontChoice === 'greatvibes' 
                        ? "var(--font-greatvibes), 'Great Vibes', 'Alex Brush', cursive" 
                        : "var(--font-playfair), 'Playfair Display', serif",
                      fontStyle: fontChoice === 'playfair' ? 'italic' : 'normal'
                    }}
                  >
                    {brideName || 'Anh Thư'} 
                    <span className="text-slate-100 text-lg sm:text-2xl md:text-3xl mx-2 sm:mx-3 font-serif italic font-light">&</span> 
                    {groomName || 'Văn Mạnh'}
                  </div>
                </div>

                {/* 3. WEDDING DATE ("20 / 11 / 2026") */}
                <div 
                  className="text-[10px] sm:text-xs md:text-sm text-slate-200 tracking-[0.3em] font-serif mt-1 drop-shadow-md border-t border-slate-400/30 pt-1.5 px-6"
                  style={{ fontFamily: "'Bodoni Moda', 'Didot', 'Cinzel Decorative', serif" }}
                >
                  {eventDate 
                    ? new Date(eventDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ') 
                    : '20 / 11 / 2026'}
                </div>

              </div>
            </>
          )}

          {/* INDICATOR OVERLAY: Bottom 35%+ Completely Empty Space (Pure Deep Onyx + Soft Light) */}
          <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-t from-[#020204] via-[#050508]/80 to-transparent flex items-end justify-center pb-2 pointer-events-none z-20">
            <span className="text-[9px] text-slate-400/60 uppercase font-mono tracking-widest bg-black/60 px-3 py-0.5 rounded-full border border-slate-500/20">
              Khu Vực Để Trống Dưới Đáy Màn LED (Cho Dâu Rể & MC đứng)
            </span>
          </div>

          {/* LED Grid Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-30"></div>
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
