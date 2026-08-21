'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedFloor, setSelectedFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3 (7.04x3.84m)
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [fontChoice, setFontChoice] = useState('greatvibes'); // 100% Vietnamese Accent Calligraphy Font
  const [copied, setCopied] = useState(false);

  // Extract initial letters for Didone Monogram (e.g., "Mỹ Duyên" & "Đức Minh" -> "M" and "D")
  const getInitial = (name, fallback) => {
    if (!name || !name.trim()) return fallback;
    const parts = name.trim().split(' ');
    const lastWord = parts[parts.length - 1];
    return lastWord.charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  const brideInitial = getInitial(brideName, 'M');
  const groomInitial = getInitial(groomName, 'D');

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Sảnh & Kích thước Màn LED: ${selectedFloor.name} (${selectedFloor.specText})
Phông chữ Tiếng Việt: ${fontChoice}
Bố cục: Đẩy lùi lên 2/3 phía trên (Để trống 1/3 chân màn hình cho dâu rể đứng)
Chú Rể: ${groomName || 'Đức Minh'}
Cô Dâu: ${brideName || 'Mỹ Duyên'}
Ngày cử hành: ${eventDate || '2026-01-31'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Font class mapping ensuring 100% FULL Vietnamese diacritics support without glyph fallback error
  const getFontClass = () => {
    if (fontChoice === 'playfair') return 'font-playfair italic';
    if (fontChoice === 'lora') return 'font-lora italic';
    return 'font-greatvibes'; // Default
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">tune</span>
          Tùy Chỉnh Phông Màn LED
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Đã chuẩn hóa 100% phông chữ Tiếng Việt không bị lỗi font, bỏ hiệu ứng phát sáng mờ, đẩy nội dung lên 2/3 trên và để trống 1/3 chân màn LED cho Dâu Rể đứng.
        </p>

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

        {/* 2. Names & Date */}
        <div className="space-y-3.5 text-sm">
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wider">
              Tên Cô Dâu
            </label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="VD: Mỹ Duyên"
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
              placeholder="VD: Đức Minh"
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
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontChoice('greatvibes')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                  fontChoice === 'greatvibes'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Great Vibes ✒️</div>
                <div className="text-[9px] opacity-75 font-serif italic">Bay bổng chuẩn dấu</div>
              </button>

              <button
                type="button"
                onClick={() => setFontChoice('playfair')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                  fontChoice === 'playfair'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Playfair 👑</div>
                <div className="text-[9px] opacity-75 font-serif italic">Cổ điển nghiêng</div>
              </button>

              <button
                type="button"
                onClick={() => setFontChoice('lora')}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                  fontChoice === 'lora'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Lora Script 🌹</div>
                <div className="text-[9px] opacity-75 font-serif italic">Thần thái lãng mạn</div>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Background Selector */}
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

        {/* LED Stage Screen Canvas Container (Dynamic Ratio based on Floor) */}
        <div className={`w-full relative ${selectedFloor.aspectClass} rounded-2xl overflow-hidden border-4 border-amber-500/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] bg-black transition-all duration-500`}>
          
          {/* Real Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${selectedTemplate.bgImage})` }}
          ></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* TOP-LEFT CORNER: Golden Palace Logo Icon ONLY (NO text, NO background frame as requested) */}
          <div className="absolute top-3 left-4 sm:top-5 sm:left-6 z-40">
            <img 
              src="/logo-icon.png" 
              alt="Golden Palace Icon Logo" 
              className="h-7 sm:h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
            />
          </div>

          {/* FOREGROUND CONTENT LAYER: PUSHED TO TOP 2/3, LEAVING BOTTOM 1/3 (35%) EMPTY FOR STAGE COUPLE */}
          <div className="relative z-30 w-full h-full flex flex-col items-center justify-start pt-4 sm:pt-6 pb-[35%] text-center">

            {/* 1. MONOGRAM LOGO ("DM" / "MD"): Crisp Didone Serif Interlocked, NO fuzzy glow */}
            <div className="h-[30%] flex items-center justify-center my-0.5">
              <div className="relative h-full aspect-square flex items-center justify-center">
                <div className="relative flex items-center justify-center font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] select-none">
                  {/* First Initial (Bride "M") */}
                  <span className="font-black transform -translate-x-2 sm:-translate-x-3 text-white italic">
                    {brideInitial}
                  </span>
                  {/* Second Initial (Groom "D") Interlocked */}
                  <span className="font-light transform translate-x-2 sm:translate-x-3 -ml-4 sm:-ml-7 md:-ml-9 text-amber-200/90 italic opacity-95">
                    {groomInitial}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. COUPLE NAMES ("Mỹ Duyên & Đức Minh"): 100% Full Vietnamese Accent Calligraphy */}
            <div className="w-[90%] sm:w-[65%] flex items-center justify-center my-1">
              <div className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-white drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)] leading-tight whitespace-nowrap ${getFontClass()}`}>
                {brideName || 'Mỹ Duyên'} 
                <span className="text-amber-300 text-lg sm:text-2xl md:text-3xl mx-2 sm:mx-3 font-serif italic font-light">&</span> 
                {groomName || 'Đức Minh'}
              </div>
            </div>

            {/* 3. WEDDING DATE ("31/01/2026"): Old-style Didone Serif */}
            <div className="text-[10px] sm:text-xs md:text-sm text-stone-200 tracking-[0.25em] font-playfair mt-1 drop-shadow-md border-t border-amber-300/30 pt-1 px-6">
              {eventDate 
                ? new Date(eventDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ') 
                : '31 / 01 / 2026'}
            </div>

          </div>

          {/* INDICATOR OVERLAY: Stage Floor Empty Area (Bottom 1/3 Empty Space) */}
          <div className="absolute bottom-0 inset-x-0 h-[33%] border-t border-dashed border-amber-400/30 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2 pointer-events-none z-20">
            <span className="text-[9px] text-amber-200/60 uppercase font-mono tracking-widest bg-black/50 px-3 py-0.5 rounded-full border border-amber-400/20">
              Khu Vực Sân Khấu (Để trống 1/3 bên dưới cho Dâu Rể & MC đứng)
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
              onClick={() => onSave({ template: selectedTemplate, floor: selectedFloor, groomName, brideName, eventDate })}
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
