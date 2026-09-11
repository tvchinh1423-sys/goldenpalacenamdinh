'use client';

import React from 'react';

/**
 * 1-to-1 Wedding Menu Card Canvas built on Image 2 background template
 * Synchronized 100% between On-Screen Live Preview & A4 Landscape Printer Output.
 * Base Dimensions: 297mm x 210mm (Exact A4 Landscape)
 */

// Image 1 Divider Component
const WeddingSectionDivider = () => (
  <div className="flex items-center justify-center my-2 opacity-90">
    {/* eslint-disable-next-html-element-suppress */}
    <img
      src="/images/wedding-divider.png"
      alt="Wedding Section Divider"
      className="h-3.5 max-w-[200px] object-contain"
    />
  </div>
);

// Dynamic font size calculator for Bride & Groom names so content is NEVER truncated (...)
const getBrideGroomFontSize = (nameStr) => {
  const len = nameStr ? nameStr.length : 0;
  if (len > 35) return 'text-[26px]';
  if (len > 28) return 'text-[30px]';
  if (len > 22) return 'text-[35px]';
  if (len > 16) return 'text-[40px]';
  return 'text-[46px]';
};

// Dynamic font size calculator for Drinks line so long lists stay on 1 line without truncation (...)
const getDrinkFontSize = (drinkStr) => {
  const len = drinkStr ? drinkStr.length : 0;
  if (len > 55) return 'text-[11px]';
  if (len > 45) return 'text-[12px]';
  if (len > 35) return 'text-[13px]';
  return 'text-[14.5px]';
};

export default function WeddingMenuCardCanvas({
  title = 'Lễ Thành Hôn',
  brideGroomNames = 'Minh Quang & Thu Hiền',
  eventDate = '02/08/2026',
  khaiViList = [],
  monChinhList = [],
  trangMiengList = [],
  doUongList = [],
  footerText = 'Chúc Quý Khách Ngon Miệng!',
  menuPreviewRef
}) {
  return (
    <div
      ref={menuPreviewRef}
      id="printable-wedding-menu"
      className="w-[297mm] h-[210mm] min-w-[297mm] min-h-[210mm] relative select-none bg-white overflow-hidden shadow-2xl shrink-0 border border-stone-300"
      style={{
        fontFamily: `'Cormorant Garamond', 'Lora', 'Playfair Display', Georgia, serif`,
        boxSizing: 'border-box'
      }}
    >
      {/* 1. ULTRA HIGH-RES BACKGROUND TEMPLATE IMAGE (IMAGE 2 REPLICA - 2560x1705 Crisp) */}
      {/* Rendered as <img> so Chrome/Safari print engines never strip it even if "Đồ họa nền" is unchecked */}
      {/* eslint-disable-next-html-element-suppress */}
      <img
        src="/images/wedding-menu-bg.png"
        alt="Wedding Menu Background Template"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* 2. DYNAMIC CONTENT OVERLAY */}
      <div className="absolute inset-0 flex flex-row z-10 w-full h-full">
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 (LEFT): DISH MENU CONTENT PAGE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-[36px] py-[32px] relative flex flex-col justify-between text-center box-border">
          
          {/* DISH SECTIONS CONTAINER */}
          <div className="my-auto space-y-2 px-2 py-1 relative z-10">
            
            {/* 1. KHAI VỊ */}
            {khaiViList.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[34px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Khai vị
                </h3>
                <div className="space-y-0.5 text-[15px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {khaiViList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 2. MÓN CHÍNH */}
            {monChinhList.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[34px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Món chính
                </h3>
                <div className="space-y-0.5 text-[15px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {monChinhList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 3. TRÁNG MIỆNG */}
            {trangMiengList.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[34px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Tráng miệng
                </h3>
                <div className="space-y-0.5 text-[15px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {trangMiengList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 4. ĐỒ UỐNG - ALWAYS SINGLE LINE & FULL TEXT WITHOUT TRUNCATION */}
            {doUongList.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[34px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Đồ uống
                </h3>
                <div className="space-y-0.5 font-serif text-stone-900 font-semibold italic leading-snug px-1">
                  {doUongList.map((item, idx) => (
                    <p key={idx} className={`${getDrinkFontSize(item)} whitespace-nowrap text-center inline-block max-w-full`}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BLESSING WISH */}
          <div className="pb-4 pt-1 z-10">
            <p className="font-serif text-[18px] font-bold italic text-stone-900 tracking-wide">
              {footerText}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 2 (RIGHT): DYNAMIC COVER OVERLAY PAGE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-[36px] py-[32px] relative flex flex-col justify-between text-center box-border">
          
          {/* Top Spacing to account for pre-printed Logo & WEDDING MENU header in image 2 */}
          <div className="h-[270px]"></div>

          {/* DYNAMIC WEDDING DETAILS (PARTY TITLE + FULL BRIDE & GROOM NAMES + DATE) */}
          <div className="my-auto space-y-3.5 py-1 z-10 flex flex-col items-center justify-center">
            
            {/* 1. Event Type Title (Lễ Thành Hôn / Lễ Vu Quy) */}
            <p className="text-[40px] text-stone-900 font-normal italic leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
              {title}
            </p>

            {/* 2. Full Bride & Groom Names (Dynamic Font Size to NEVER Truncate) */}
            <h2
              className={`${getBrideGroomFontSize(brideGroomNames)} text-stone-900 font-bold px-2 py-0.5 leading-snug tracking-wide text-center break-words max-w-[420px]`}
              style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}
            >
              {brideGroomNames}
            </h2>

            {/* 3. Event Date (NO TOP AND BOTTOM BORDER LINES) */}
            <div className="pt-3">
              <span className="font-serif text-[20px] font-bold text-stone-900 tracking-wider">
                {eventDate}
              </span>
            </div>
          </div>

          {/* Bottom Spacing to account for pre-printed Divider & Footer address in image 2 */}
          <div className="h-[135px]"></div>

        </div>
      </div>
    </div>
  );
}

/**
 * Universal Print Trigger Helper Function
 * Clones `#printable-wedding-menu` to `document.body` as a direct child
 * so Chrome / Safari print preview renders exact A4 Landscape without blank/shrunken pages.
 */
export const printWeddingMenuCard = () => {
  const elem = document.getElementById('printable-wedding-menu');
  if (!elem) {
    window.print();
    return;
  }

  // Remove existing print mount host if any
  const oldHost = document.getElementById('print-mount-point');
  if (oldHost && oldHost.parentNode) {
    oldHost.parentNode.removeChild(oldHost);
  }

  const printHost = document.createElement('div');
  printHost.id = 'print-mount-point';

  const clone = elem.cloneNode(true);
  clone.id = 'printable-wedding-menu-clone';

  // Ensure transform is stripped on clone for 1-to-1 paper print
  clone.style.transform = 'none';
  clone.style.margin = '0';
  
  printHost.appendChild(clone);
  document.body.appendChild(printHost);

  // Trigger browser print dialog
  window.print();

  // Cleanup print host after printing
  setTimeout(() => {
    if (document.body.contains(printHost)) {
      document.body.removeChild(printHost);
    }
  }, 1500);
};
