'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedFloor, setSelectedFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3 (7.04x3.84m)
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [coupleFont, setCoupleFont] = useState("font-greatvibes"); // 100% Vietnamese Accent Calligraphy Font
  const [copied, setCopied] = useState(false);

  // Extract initial letters for Monogram (e.g., "Anh Thư" & "Văn Mạnh" -> "T" and "M", or "Mỹ Duyên" & "Đức Minh" -> "D" and "M")
  const getInitial = (name, fallback) => {
    if (!name || !name.trim()) return fallback;
    const parts = name.trim().split(' ');
    const lastWord = parts[parts.length - 1];
    return lastWord.charAt(0).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  const brideInitial = getInitial(brideName, 'T');
  const groomInitial = getInitial(groomName, 'M');

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Sảnh & Kích thước Màn LED: ${selectedFloor.name} (${selectedFloor.specText})
Monogram Logo: Trắng bạc phát sáng (Luminescent Silver), Căn giữa 40% trên
Typography: Calligraphy Script chuẩn Tiếng Việt, Ký tự & đồng màu trắng bạc
Ánh sáng: Backlight Halo Glow + Hạt bụi sáng Antigravity (Bỏ viền bo góc)
Không gian: Để trống hoàn toàn 1/3 chân màn hình (Bottom 35% empty space)
Chú Rể: ${groomName || 'Văn Mạnh'}
Cô Dâu: ${brideName || 'Anh Thư'}
Ngày cử hành: ${eventDate || '2026-11-20'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">tune</span>
          Tùy Chỉnh Phông Màn LED Sân Khấu
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Monogram lồng ghép trắng bạc phát sáng, ánh sáng Backlight Halo Glow 3D, hạt kim tuyến Antigravity và để trống 1/3 chân màn hình.
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
                onClick={() => setCoupleFont("font-greatvibes")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                  coupleFont === "font-greatvibes"
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Great Vibes ✒️</div>
                <div className="text-[10px] opacity-75">Bay bổng mềm mại</div>
              </button>

              <button
                type="button"
                onClick={() => setCoupleFont("font-playfair italic")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                  coupleFont === "font-playfair italic"
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Playfair Script 👑</div>
                <div className="text-[10px] opacity-75">Nghiêng sang trọng</div>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Background Selector */}
        <div className="mt-5 pt-4 border-t border-gray-800">
          <label className="block text-gray-300 text-xs font-semibold mb-2.5 uppercase tracking-wider">
            Chọn Nền Bầu Trời Sao & Hào Quang Halo Glow
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

        {/* LED Stage Screen Canvas Container (Bỏ hoàn toàn khung viền bo góc màu vàng bao quanh theo yêu cầu) */}
        <div className={`w-full relative ${selectedFloor.aspectClass} rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)] bg-[#020308] transition-all duration-500`}>
          
          {/* Real Background Image Overlay (Starry Night / Bokeh Stars) */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${selectedTemplate.bgImage})` }}
          ></div>
          <div className="absolute inset-0 bg-black/25"></div>

          {/* BACKLIGHT HALO GLOW EFFECT: Tập trung ngay sau khối Monogram tạo độ tương phản nổi khối 3D */}
          <div className="absolute top-1/12 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35)_0%,_rgba(255,255,255,0.1)_40%,_transparent_70%)] blur-2xl pointer-events-none z-10"></div>

          {/* ANTIGRAVITY SILVER DUST PARTICLES EFFECT: Dải hạt bụi kim tuyến mịn rơi lơ lửng */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.25)_0%,_transparent_60%)] pointer-events-none z-15"></div>

          {/* TOP-LEFT CORNER: Golden Palace Icon Logo ONLY (No text, No background frame) */}
          <div className="absolute top-3 left-4 sm:top-5 sm:left-6 z-40">
            <img 
              src="/logo-icon.png" 
              alt="Golden Palace Icon Logo" 
              className="h-6 sm:h-9 md:h-11 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" 
            />
          </div>

          {/* FOREGROUND CONTENT LAYER: GOM TẤT CẢ VÀO 40% PHẦN TRÊN CỦA MÀN HÌNH (DEEP BOTTOM 35%+ EMPTY) */}
          <div className="relative z-30 w-full h-full flex flex-col items-center justify-start pt-3 sm:pt-6 md:pt-8 pb-[40%] text-center">

            {/* 1. MONOGRAM LOGO ("TM" / "MD"): Interlocked Didone Serif in Luminescent Silver (Trắng Bạc Phát Sáng Đồng Nhất) */}
            <div className="h-[28%] flex items-center justify-center my-0.5">
              <div className="relative h-full aspect-square flex items-center justify-center">
                <div 
                  className="relative flex items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white select-none drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]"
                  style={{ fontFamily: "'Cinzel Decorative', 'Bodoni Moda', Didot, serif" }}
                >
                  {/* First Initial (Bride "T" / "M") */}
                  <span className="font-black transform -translate-x-2 sm:-translate-x-3 text-white italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                    {brideInitial}
                  </span>
                  {/* Second Initial (Groom "M" / "D") Interlocked */}
                  <span className="font-light transform translate-x-2 sm:translate-x-3 -ml-5 sm:-ml-8 md:-ml-10 text-slate-100 italic opacity-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    {groomInitial}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. MAIN COUPLE NAMES ("Anh Thư & Văn Mạnh"): Modern Calligraphy Script (100% Luminescent Silver / White including '&') */}
            <div className="w-[90%] sm:w-[65%] h-[20%] flex items-center justify-center my-1">
              <div className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-wide text-slate-50 drop-shadow-[0_3px_20px_rgba(0,0,0,0.95)] leading-tight whitespace-nowrap ${coupleFont}`}>
                {brideName || 'Anh Thư'} 
                <span className="text-slate-100 text-lg sm:text-2xl md:text-3xl mx-2 sm:mx-3 font-serif italic font-light">&</span> 
                {groomName || 'Văn Mạnh'}
              </div>
            </div>

            {/* 3. SUBTEXT / DATE: Didone Old-style Serif (e.g. "20 / 11 / 2026" or "31 / 01 / 2026") */}
            <div 
              className="text-[10px] sm:text-xs md:text-sm text-slate-200 tracking-[0.3em] font-serif mt-1 drop-shadow-md border-t border-slate-400/30 pt-1.5 px-6"
              style={{ fontFamily: "'Bodoni Moda', 'Didot', 'Cinzel Decorative', serif" }}
            >
              {eventDate 
                ? new Date(eventDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ') 
                : '20 / 11 / 2026'}
            </div>

          </div>

          {/* INDICATOR OVERLAY: Bottom 35%+ Completely Empty Space with Backlight Glow Transition */}
          <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center pb-2 pointer-events-none z-20">
            <span className="text-[9px] text-slate-300/60 uppercase font-mono tracking-widest bg-black/60 px-3 py-0.5 rounded-full border border-slate-500/20">
              Khu Vực Để Trống Dưới Đáy Màn LED (Không có chữ hay họa tiết lớn che chắn)
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
