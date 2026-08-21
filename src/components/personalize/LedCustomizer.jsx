'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES, LED_SCREEN_FLOORS } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedFloor, setSelectedFloor] = useState(LED_SCREEN_FLOORS[0]); // Default Tầng 3
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [fontOption, setFontOption] = useState('font-greatvibes'); // Calligraphy script default
  const [copied, setCopied] = useState(false);

  // Extract initials for dynamic Interlocked Monogram (e.g. "Đức Minh" & "Mỹ Duyên" -> "D" and "M")
  const getInitial = (name, fallback) => {
    if (!name || !name.trim()) return fallback;
    const parts = name.trim().split(' ');
    const lastWord = parts[parts.length - 1];
    return lastWord.charAt(0).toUpperCase();
  };

  const groomInitial = getInitial(groomName, 'M');
  const brideInitial = getInitial(brideName, 'D');

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Sảnh & Kích thước: ${selectedFloor.name} (${selectedFloor.specText})
Chú Rể: ${groomName || 'Đức Minh'}
Cô Dâu: ${brideName || 'Mỹ Duyên'}
Ngày cử hành: ${eventDate || '2026-01-31'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls, Floor Selector & Template Selector */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">tune</span>
          Thiết Kế Phông Màn LED Sân Khấu
        </h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Tùy chỉnh tên dâu rể, chọn tầng sảnh và phong cách phông LED sân khấu thiết kế chuẩn tỷ lệ kỹ thuật màn hình P3 Full HD.
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
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
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
              Kiểu Phông Chữ Tên Dâu Rể
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontOption('font-greatvibes')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-greatvibes'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Bay Bổng ✒️
              </button>
              <button
                type="button"
                onClick={() => setFontOption('font-playfair')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-playfair'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Cổ Điển 👑
              </button>
              <button
                type="button"
                onClick={() => setFontOption('font-serif')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-serif'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Lãng Mạn ✨
              </button>
            </div>
          </div>
        </div>

        {/* 3. Template Selector */}
        <div className="mt-5 pt-4 border-t border-gray-800">
          <label className="block text-gray-300 text-xs font-semibold mb-2.5 uppercase tracking-wider">
            Chọn Phong Cách Phông Màn LED
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

      {/* Right Column: Live Stage LED Visualizer */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        {/* Stage Header Banner */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[#e3a638] animate-pulse text-base">live_tv</span>
            <span className="text-xs font-bold tracking-wider uppercase font-playfair text-amber-300">
              Mô Phỏng Sân Khấu {selectedFloor.name}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            {selectedFloor.widthMeters}m × {selectedFloor.heightMeters}m (P3 LED)
          </span>
        </div>

        {/* LED Stage Screen Canvas Box */}
        <div className={`w-full relative ${selectedFloor.aspectClass} rounded-2xl overflow-hidden border-4 border-amber-500/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] bg-black transition-all duration-500 flex items-center justify-center`}>
          
          {/* Spotlight Effects */}
          <div className="absolute top-0 left-1/5 w-40 h-80 bg-gradient-to-b from-amber-200/25 via-white/10 to-transparent blur-3xl transform -rotate-12 pointer-events-none z-10"></div>
          <div className="absolute top-0 right-1/5 w-40 h-80 bg-gradient-to-b from-amber-200/25 via-white/10 to-transparent blur-3xl transform rotate-12 pointer-events-none z-10"></div>

          {/* TEMPLATE DYNAMIC VISUAL BACKGROUNDS */}
          
          {/* Mẫu 1: Nhung Đen & Thảm Kim Tuyến (Matching Image 1) */}
          {selectedTemplate.bgStyle === 'stardust-curtain' && (
            <div className="absolute inset-0 bg-[#050508] overflow-hidden">
              {/* Velvet Stage Curtain effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/60 via-[#0a0a0f] to-black opacity-90"></div>
              
              {/* Top Sparkles Falling Dust */}
              <div className="absolute top-0 inset-x-0 h-1/3 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4)_0%,_transparent_75%)] blur-xs opacity-70"></div>
              
              {/* Bottom Glitter Stage Floor Particles */}
              <div className="absolute bottom-0 inset-x-0 h-2/5 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.5)_0%,_rgba(200,200,255,0.2)_40%,_transparent_80%)] blur-2xs opacity-90"></div>
              <div className="absolute bottom-0 inset-x-0 h-1/4 bg-[radial-gradient(ellipse_at_center_bottom,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
            </div>
          )}

          {/* Mẫu 2: Bầu Trời Sao Đêm Galaxy (Matching Image 2) */}
          {selectedTemplate.bgStyle === 'galaxy-starry' && (
            <div className="absolute inset-0 bg-[#020308] overflow-hidden">
              {/* Cosmic Starry Night */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,41,59,0.5)_0%,_#020308_80%)]"></div>
              
              {/* Glowing Stars Field */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.6)_0%,_transparent_15%),radial-gradient(circle_at_70%_30%,_rgba(255,255,255,0.5)_0%,_transparent_10%),radial-gradient(circle_at_50%_70%,_rgba(255,255,255,0.7)_0%,_transparent_20%)] blur-2xs animate-pulse duration-1000"></div>
            </div>
          )}

          {/* Mẫu 3: Hoàng Gia Vàng Ánh Kim 3D */}
          {selectedTemplate.bgStyle === 'golden-royal' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200] via-[#3a2903] to-[#1a1200] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(227,166,56,0.3)_0%,_transparent_70%)]"></div>
            </div>
          )}

          {/* Mẫu 4: Pha Lê Bạch Kim */}
          {selectedTemplate.bgStyle === 'crystal-white' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.3)_0%,_transparent_70%)]"></div>
            </div>
          )}


          {/* FOREGROUND CONTENT LAYER */}
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            
            {/* Top Branding: Golden Palace Official Logo */}
            <div className="absolute top-2.5 sm:top-4 flex items-center justify-center gap-1.5 z-30">
              <img 
                src="/logo-icon.png" 
                alt="Golden Palace Logo" 
                className="h-5 sm:h-7 w-auto object-contain drop-shadow-[0_0_12px_rgba(227,166,56,0.9)]" 
              />
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] font-playfair uppercase text-amber-300 font-bold drop-shadow">
                GOLDEN PALACE
              </span>
            </div>

            {/* CENTER MONOGRAM LOGO (Interlocked Initials like Reference Image 1 & 2) */}
            <div className="relative my-1 sm:my-2 flex items-center justify-center">
              {/* Outer Monogram Glow Circle */}
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border border-amber-300/40 shadow-[0_0_30px_rgba(255,215,0,0.4)] flex items-center justify-center backdrop-blur-2xs bg-black/20">
                {/* Interlocked Monogram SVG / Typography */}
                <div className="font-serif italic font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tighter text-amber-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] flex items-center justify-center">
                  <span className="transform -translate-x-1 sm:-translate-x-2 text-white font-playfair">{groomInitial}</span>
                  <span className="transform translate-x-1 sm:translate-x-2 -ml-3 sm:-ml-5 text-amber-300 font-serif font-light">{brideInitial}</span>
                </div>
              </div>
            </div>

            {/* Couple Names (Stylized Calligraphy matching Reference Images) */}
            <div className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold my-1 sm:my-2 tracking-wide drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] text-white ${fontOption} leading-tight`}>
              {groomName || 'Đức Minh'} 
              <span className="text-amber-300 text-lg sm:text-2xl md:text-3xl mx-2 sm:mx-3 font-serif italic font-light">&</span> 
              {brideName || 'Mỹ Duyên'}
            </div>

            {/* Event Date (Formatted clean like 31/01/2026 or 26.01.2026) */}
            <div className="text-[11px] sm:text-xs md:text-sm text-stone-200 tracking-[0.2em] font-mono mt-1 drop-shadow-md">
              {eventDate 
                ? new Date(eventDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ') 
                : '31 / 01 / 2026'}
            </div>

            {/* Bottom Subtext */}
            <div className="text-[8px] sm:text-[10px] text-amber-300/80 uppercase tracking-[0.3em] font-medium mt-1">
              TRUNG TÂM TIỆC CƯỚI & SỰ KIỆN GOLDEN PALACE
            </div>

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
