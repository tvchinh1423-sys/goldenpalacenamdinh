'use client';

import React from 'react';

/**
 * 1-to-1 Wedding Menu Card Canvas built on Image 2 background template
 * Template file: /images/wedding-menu-bg.png (Ultra 4K Crisp)
 * Divider file: /images/wedding-divider.png (Image 1 replica)
 */

// Image 1 Divider Component
const WeddingSectionDivider = () => (
  <div className="flex items-center justify-center my-1.5 opacity-90">
    {/* eslint-disable-next-html-element-suppress */}
    <img
      src="/images/wedding-divider.png"
      alt="Wedding Section Divider"
      className="h-3 max-w-[160px] object-contain"
    />
  </div>
);

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
      className="w-[840px] h-[594px] min-w-[840px] min-h-[594px] relative select-none bg-white overflow-hidden shadow-2xl shrink-0"
      style={{
        fontFamily: `'Cormorant Garamond', 'Lora', 'Playfair Display', Georgia, serif`,
      }}
    >
      {/* 1. BACKGROUND TEMPLATE IMAGE (IMAGE 2 REPLICA - HIGH RES Crisp 2560x1705) */}
      {/* Rendered as <img> so Chrome/Safari print engines never strip it even if "Đồ họa nền" is unchecked */}
      {/* eslint-disable-next-html-element-suppress */}
      <img
        src="/images/wedding-menu-bg.png"
        alt="Wedding Menu Background Template"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* 2. DYNAMIC CONTENT OVERLAY */}
      <div className="absolute inset-0 flex flex-row z-10">
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 (LEFT): DISH MENU CONTENT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-7 py-7 relative flex flex-col justify-between text-center">
          
          {/* DISH SECTIONS CONTAINER */}
          <div className="my-auto space-y-1 px-2 py-0.5 relative z-10">
            
            {/* 1. KHAI VỊ */}
            {khaiViList.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[27px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Khai vị
                </h3>
                <div className="space-y-0.5 text-[13px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {khaiViList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 2. MÓN CHÍNH */}
            {monChinhList.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[27px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Món chính
                </h3>
                <div className="space-y-0.5 text-[13px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {monChinhList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 3. TRÁNG MIỆNG */}
            {trangMiengList.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[27px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Tráng miệng
                </h3>
                <div className="space-y-0.5 text-[13px] font-serif text-stone-900 font-semibold italic leading-snug">
                  {trangMiengList.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 4. ĐỒ UỐNG - ALWAYS SINGLE LINE WITHOUT WRAPPING */}
            {doUongList.length > 0 && (
              <div className="space-y-0.5">
                <h3 className="text-[27px] text-stone-900 tracking-wide font-normal leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                  Đồ uống
                </h3>
                <div className="space-y-0.5 text-[12px] font-serif text-stone-900 font-semibold italic leading-snug whitespace-nowrap overflow-hidden text-ellipsis px-1">
                  {doUongList.map((item, idx) => (
                    <p key={idx} className="whitespace-nowrap inline-block max-w-full truncate">{item}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BLESSING WISH */}
          <div className="pb-2 pt-1 z-10">
            <p className="font-serif text-[15px] font-bold italic text-stone-900 tracking-wide">
              {footerText}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 2 (RIGHT): DYNAMIC COVER OVERLAY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-7 py-8 relative flex flex-col justify-between text-center">
          
          {/* Top Spacing to account for pre-printed Logo & WEDDING MENU header in image 2 */}
          <div className="h-[195px]"></div>

          {/* DYNAMIC WEDDING DETAILS (PARTY TITLE + BRIDE & GROOM NAMES + DATE) */}
          <div className="my-auto space-y-2.5 py-1 z-10 flex flex-col items-center justify-center">
            
            {/* 1. Event Type Title (Lễ Thành Hôn / Lễ Vu Quy) */}
            <p className="text-[34px] text-stone-900 font-normal italic leading-tight" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
              {title}
            </p>

            {/* 2. Bride & Groom Names (Adjusted Size & Proportion) */}
            <h2 className="text-[36px] text-stone-900 font-bold px-2 py-0.5 leading-snug tracking-wide max-w-[340px] truncate" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
              {brideGroomNames}
            </h2>

            {/* 3. Event Date (NO TOP AND BOTTOM BORDER LINES) */}
            <div className="pt-2">
              <span className="font-serif text-[17px] font-bold text-stone-900 tracking-wider">
                {eventDate}
              </span>
            </div>
          </div>

          {/* Bottom Spacing to account for pre-printed Divider & Footer address in image 2 */}
          <div className="h-[95px]"></div>

        </div>
      </div>
    </div>
  );
}

/**
 * Universal Print Trigger Helper Function
 * Clones `#printable-wedding-menu` to `document.body` as a direct child
 * so Chrome / Safari print preview never renders a blank white page.
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
