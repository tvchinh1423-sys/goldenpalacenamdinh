'use client';

import { useState } from 'react';
import { LED_STAGE_TEMPLATES } from '@/lib/personalize-data';

export default function LedCustomizer({ groomName, setGroomName, brideName, setBrideName, eventDate, setEventDate, onSave }) {
  const [selectedTemplate, setSelectedTemplate] = useState(LED_STAGE_TEMPLATES[0]);
  const [fontOption, setFontOption] = useState('font-playfair');
  const [copied, setCopied] = useState(false);

  const handleCopyConfig = () => {
    const info = `PHÔNG MÀN LED SÂN KHẤU - GOLDEN PALACE
Mẫu thiết kế: ${selectedTemplate.name}
Địa điểm sảnh: ${selectedTemplate.venue}
Chú Rể: ${groomName || 'Văn Chinh'}
Cô Dâu: ${brideName || 'Thu Hà'}
Ngày cử hành: ${eventDate || '2026-11-20'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-montserrat">
      
      {/* Left Column: Form Controls & Template Selector */}
      <div className="lg:col-span-5 bg-[#141414] border border-[#e3a638]/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-playfair text-[#e3a638] font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e3a638]">tune</span>
          Tùy Chỉnh Thông Tin Màn LED
        </h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Nhập tên Chú Rể, Cô Dâu và ngày cưới để xem trực quan hiển thị trên màn hình LED siêu sắc nét tại sân khấu sảnh tiệc.
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Tên Chú Rể
            </label>
            <input
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="VD: Văn Chinh"
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Tên Cô Dâu
            </label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="VD: Thu Hà"
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Ngày Cử Hành Lễ
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700 focus:border-[#e3a638] rounded-xl px-4 py-2.5 text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-semibold mb-2 uppercase tracking-wider">
              Phông Chữ Chữ Ký LED
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontOption('font-playfair')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-playfair'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Cổ Điển
              </button>
              <button
                type="button"
                onClick={() => setFontOption('font-serif')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-serif'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Lãng Mạn
              </button>
              <button
                type="button"
                onClick={() => setFontOption('font-sans')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  fontOption === 'font-sans'
                    ? 'border-[#e3a638] bg-[#e3a638]/20 text-[#e3a638]'
                    : 'border-gray-800 bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                Hiện Đại
              </button>
            </div>
          </div>
        </div>

        {/* Template List Selector */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <label className="block text-gray-300 text-xs font-semibold mb-3 uppercase tracking-wider">
            Chọn Phong Cách Phông Màn LED
          </label>
          <div className="space-y-3">
            {LED_STAGE_TEMPLATES.map((tmpl) => {
              const active = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'border-[#e3a638] bg-[#e3a638]/10 shadow-[0_0_15px_rgba(227,166,56,0.2)]'
                      : 'border-gray-800 bg-[#181818] hover:border-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.borderColor }}></span>
                      {tmpl.name}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{tmpl.slogan}</div>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono px-2 py-1 bg-amber-400/10 rounded border border-amber-400/30 whitespace-nowrap">
                    {tmpl.venue.split('-')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Live Visualizer Canvas & Stage Lighting Stage */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        {/* Stage Header Banner */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[#e3a638] animate-pulse">live_tv</span>
            <span className="text-sm font-semibold tracking-wider uppercase font-playfair">
              Khung Cảnh Sân Khấu {selectedTemplate.venue}
            </span>
          </div>
          <span className="text-xs text-amber-400/90 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            P3 Full HD Screen Simulation
          </span>
        </div>

        {/* LED Stage Screen Container */}
        <div className="w-full relative aspect-video rounded-2xl overflow-hidden border-4 border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black group">
          
          {/* Spotlight Effects */}
          <div className="absolute top-0 left-1/4 w-32 h-64 bg-gradient-to-b from-white/20 to-transparent blur-2xl transform -rotate-12 pointer-events-none z-10"></div>
          <div className="absolute top-0 right-1/4 w-32 h-64 bg-gradient-to-b from-amber-300/20 to-transparent blur-2xl transform rotate-12 pointer-events-none z-10"></div>

          {/* Dynamic LED Background Canvas */}
          <div className={`w-full h-full bg-gradient-to-br ${selectedTemplate.bgGradient} relative flex flex-col items-center justify-center p-6 text-center transition-all duration-700`}>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: selectedTemplate.pattern }}></div>
            
            {/* LED Frame Border */}
            <div className={`w-[90%] h-[85%] rounded-xl flex flex-col items-center justify-center p-6 relative backdrop-blur-xs transition-all duration-500 ${selectedTemplate.frameStyle}`}>
              
              {/* Logo Golden Palace ở góc trái trên cùng */}
              <div className="absolute top-3 left-4 flex items-center gap-1.5 z-20">
                <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-6 sm:h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(227,166,56,0.8)]" />
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-playfair uppercase text-amber-300 font-bold drop-shadow hidden sm:inline">
                  GOLDEN PALACE
                </span>
              </div>

              {/* Corner Ornaments */}
              <div className="absolute top-2 right-2 text-[#e3a638] text-xs font-serif opacity-70">❖</div>
              <div className="absolute bottom-2 left-2 text-[#e3a638] text-xs font-serif opacity-70">❖</div>
              <div className="absolute bottom-2 right-2 text-[#e3a638] text-xs font-serif opacity-70">❖</div>

              {/* Header Badge */}
              <div className="text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-amber-200/90 font-semibold mb-1 drop-shadow-md mt-2 sm:mt-0">
                LỄ THÀNH HÔN • WEDDING CEREMONY
              </div>

              {/* Groom & Bride Names */}
              <div className={`text-2xl sm:text-4xl md:text-5xl font-bold my-3 tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] ${fontOption} transition-all`} style={{ color: selectedTemplate.accentColor }}>
                {groomName || 'VĂN CHINH'}
                <span className="text-amber-400 text-xl sm:text-3xl mx-3 font-serif italic font-light">&</span>
                {brideName || 'THU HÀ'}
              </div>

              {/* Decorative Line */}
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#e3a638] to-transparent my-2"></div>

              {/* Event Date & Location */}
              <div className="text-xs sm:text-sm text-gray-200 tracking-widest font-mono mt-1 drop-shadow">
                {eventDate ? new Date(eventDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '20 . 11 . 2026'}
              </div>
              <div className="text-[10px] sm:text-xs text-amber-300/80 uppercase tracking-widest mt-1 font-medium">
                GOLDEN PALACE NAM ĐỊNH
              </div>
            </div>

            {/* Subtext LED Branding Footer */}
            <div className="absolute bottom-2 right-4 text-[9px] text-gray-400 font-mono tracking-widest opacity-60">
              LED DESIGN BY GOLDEN PALACE
            </div>
          </div>
        </div>

        {/* Action Buttons below Visualizer */}
        <div className="w-full flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleCopyConfig}
            className="flex-1 px-6 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white text-xs uppercase font-bold tracking-wider rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base text-amber-400">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            {copied ? 'Đã Sao Chép Cấu Hình!' : 'Sao Chép Cấu Hình LED'}
          </button>

          {onSave && (
            <button
              onClick={() => onSave({ template: selectedTemplate, groomName, brideName, eventDate })}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all flex items-center justify-center gap-2"
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
