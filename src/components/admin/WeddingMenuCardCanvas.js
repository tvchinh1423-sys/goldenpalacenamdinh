'use client';

import React from 'react';

/**
 * 1-to-1 Wedding Menu Card Canvas built on Image 2 background template
 * Supports interactive font size customization for each section.
 * Base Dimensions: 297mm x 210mm (Exact A4 Landscape)
 */

// Image 1 Divider Component
const WeddingSectionDivider = () => (
  <div className="flex items-center justify-center my-2.5 opacity-90">
    {/* eslint-disable-next-html-element-suppress */}
    <img
      src="/images/wedding-divider.png"
      alt="Wedding Section Divider"
      className="h-4 max-w-[220px] object-contain"
    />
  </div>
);

// Helper to enforce precomposed Vietnamese Unicode (NFC) - prevents spaced accent bugs on Windows OS
const nfc = (str) => {
  if (!str) return '';
  return String(str).normalize('NFC');
};

function formatDateDot(dateStr) {
  if (!dateStr) return '';
  let str = String(dateStr).trim();
  if (str.includes('/')) return str.replace(/\//g, '.');
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return str;
}

export default function WeddingMenuCardCanvas({
  weddingMenuHeader = 'WEDDING MENU',
  title = 'Lễ Thành Hôn',
  brideGroomNames = 'Minh Quang & Thu Hiền',
  eventDate = '02/08/2026',
  khaiViList = [],
  monChinhList = [],
  trangMiengList = [],
  doUongList = [],
  footerText = 'Chúc Quý Khách Ngon Miệng!',
  // Customizable Font Sizes (in px) - Defaulted to user requested baseline
  brideGroomFontSize = 40,
  sectionTitleFontSize = 30,
  dishItemFontSize = 22,
  footerFontSize = 27,
  eventDateFontSize = 30,
  coverHeaderFontSize = 36,
  menuPreviewRef
}) {
  const normWeddingMenuHeader = nfc(weddingMenuHeader);
  const normTitle = nfc(title);
  const normBrideGroom = nfc(brideGroomNames);
  const normEventDate = nfc(eventDate);
  const normFooter = nfc(footerText);

  const dishFontFamily = `var(--font-cormorant), var(--font-lora), 'Cormorant Garamond', 'Lora', 'Playfair Display', Georgia, serif`;
  const titleFontFamily = `var(--font-greatvibes), 'Great Vibes', 'Alex Brush', cursive`;
  const dateFontFamily = `var(--font-playfair), 'Playfair Display', Didot, 'Times New Roman', serif`;

  return (
    <div
      ref={menuPreviewRef}
      id="printable-wedding-menu"
      className="w-[297mm] h-[210mm] min-w-[297mm] min-h-[210mm] relative select-none bg-white overflow-hidden shadow-2xl shrink-0 border border-stone-300"
      style={{
        fontFamily: dishFontFamily,
        boxSizing: 'border-box'
      }}
    >
      {/* 1. ULTRA HIGH-RES BACKGROUND TEMPLATE IMAGE (NEW ELEGANT BLACK & WHITE TEMPLATE) */}
      {/* eslint-disable-next-html-element-suppress */}
      <img
        src="/images/wedding-menu-bg.png"
        alt="Wedding Menu Background Template"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* 2. DYNAMIC CONTENT OVERLAY */}
      <div className="absolute inset-0 flex flex-row z-10 w-full h-full">
        
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 1 (LEFT): DYNAMIC COVER OVERLAY PAGE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-[36px] pt-[115px] pb-[105px] relative flex flex-col justify-between items-center text-center box-border z-10">
          
          {/* DYNAMIC COVER DETAILS (WEDDING MENU HEADER + PARTY TITLE + BRIDE & GROOM + DATE) */}
          <div className="my-auto space-y-3.5 py-1 w-full flex flex-col items-center justify-center">
            
            {/* 1. WEDDING MENU HEADER (DYNAMICALLY EDITABLE e.g. "WEDDING MENU") */}
            {normWeddingMenuHeader && (
              <div className="w-full flex justify-center items-center pb-1">
                <h1
                  className="text-stone-900 font-bold tracking-[0.24em] uppercase text-center font-serif leading-tight drop-shadow-2xs"
                  style={{
                    fontFamily: `var(--font-cormorant), var(--font-playfair), 'Cormorant Garamond', 'Playfair Display', Georgia, serif`,
                    fontSize: `${coverHeaderFontSize}px`
                  }}
                >
                  {normWeddingMenuHeader}
                </h1>
              </div>
            )}

            {/* 2. Event Type Title (Lễ Thành Hôn / Lễ Vu Quy) */}
            <p className="text-[38px] text-stone-900 font-normal italic leading-tight" style={{ fontFamily: titleFontFamily }}>
              {normTitle}
            </p>

            {/* 3. Full Bride & Groom Names - STRICTLY ALWAYS ON 1 SINGLE LINE WITH ADJUSTABLE FONT SIZE */}
            <div className="w-full flex justify-center items-center px-1 overflow-hidden">
              <h2
                className="text-stone-900 font-bold leading-tight tracking-wide text-center whitespace-nowrap max-w-full"
                style={{ fontFamily: titleFontFamily, fontSize: `${brideGroomFontSize}px` }}
              >
                {normBrideGroom}
              </h2>
            </div>

            {/* 4. Event Date (NO TOP AND BOTTOM BORDER LINES - MATCHING LED STAGE SCREEN FONT & STYLING 100%) */}
            <div className="pt-2">
              <span
                className="font-bold text-stone-900 inline-block"
                style={{
                  fontFamily: dateFontFamily,
                  fontSize: `${eventDateFontSize}px`,
                  fontVariantNumeric: "lining-nums tabular-nums",
                  letterSpacing: "0.14em"
                }}
              >
                {nfc(formatDateDot(eventDate))}
              </span>
            </div>

          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 2 (RIGHT): DISH MENU CONTENT PAGE */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-1/2 h-full px-[36px] py-[28px] relative flex flex-col justify-between text-center box-border">
          
          {/* DISH SECTIONS CONTAINER */}
          <div className="my-auto space-y-2.5 px-3 py-1 relative z-10">
            
            {/* 1. KHAI VỊ */}
            {khaiViList.length > 0 && (
              <div className="space-y-1">
                <h3
                  className="text-stone-900 tracking-wide font-normal leading-tight"
                  style={{ fontFamily: titleFontFamily, fontSize: `${sectionTitleFontSize}px` }}
                >
                  Khai vị
                </h3>
                <div
                  className="space-y-1 text-stone-900 font-semibold italic leading-snug"
                  style={{ fontSize: `${dishItemFontSize}px`, fontFamily: dishFontFamily }}
                >
                  {khaiViList.map((item, idx) => (
                    <p key={idx}>{nfc(item)}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 2. MÓN CHÍNH */}
            {monChinhList.length > 0 && (
              <div className="space-y-1">
                <h3
                  className="text-stone-900 tracking-wide font-normal leading-tight"
                  style={{ fontFamily: titleFontFamily, fontSize: `${sectionTitleFontSize}px` }}
                >
                  Món chính
                </h3>
                <div
                  className="space-y-1 text-stone-900 font-semibold italic leading-snug"
                  style={{ fontSize: `${dishItemFontSize}px`, fontFamily: dishFontFamily }}
                >
                  {monChinhList.map((item, idx) => (
                    <p key={idx}>{nfc(item)}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 3. TRÁNG MIỆNG */}
            {trangMiengList.length > 0 && (
              <div className="space-y-1">
                <h3
                  className="text-stone-900 tracking-wide font-normal leading-tight"
                  style={{ fontFamily: titleFontFamily, fontSize: `${sectionTitleFontSize}px` }}
                >
                  Tráng miệng
                </h3>
                <div
                  className="space-y-1 text-stone-900 font-semibold italic leading-snug"
                  style={{ fontSize: `${dishItemFontSize}px`, fontFamily: dishFontFamily }}
                >
                  {trangMiengList.map((item, idx) => (
                    <p key={idx}>{nfc(item)}</p>
                  ))}
                </div>
                <WeddingSectionDivider />
              </div>
            )}

            {/* 4. ĐỒ UỐNG - ALWAYS SINGLE LINE */}
            {doUongList.length > 0 && (
              <div className="space-y-1">
                <h3
                  className="text-stone-900 tracking-wide font-normal leading-tight"
                  style={{ fontFamily: titleFontFamily, fontSize: `${sectionTitleFontSize}px` }}
                >
                  Đồ uống
                </h3>
                <div className="space-y-0.5 text-stone-900 font-semibold italic leading-snug px-1">
                  {doUongList.map((item, idx) => (
                    <p
                      key={idx}
                      className="whitespace-nowrap text-center inline-block max-w-full"
                      style={{ fontSize: `${dishItemFontSize}px`, fontFamily: dishFontFamily }}
                    >
                      {nfc(item)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BLESSING WISH */}
          <div className="pb-3 pt-2 z-10">
            <p
              className="font-bold italic text-stone-900 tracking-wide"
              style={{ fontSize: `${footerFontSize}px`, fontFamily: dishFontFamily }}
            >
              {normFooter}
            </p>
          </div>
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
