'use client';

import React from 'react';

/**
 * 1-to-1 Replica of Golden Palace Wedding Table Menu (A4 Folded Booklet)
 * Sample Photo Reference: media__1789040692675.jpg
 */

// 1. TOP CORNER BOTANICAL LEAF SPRAYS FOR COVER PAGE
const CoverBotanicalLeafBranch = ({ position = 'left' }) => (
  <svg
    className={`absolute top-3 ${position === 'left' ? 'left-3' : 'right-3 scale-x-[-1]'} w-32 h-32 text-stone-900 pointer-events-none z-10`}
    viewBox="0 0 160 160"
    fill="none"
    stroke="currentColor"
  >
    {/* Arching stems */}
    <path d="M 8 8 Q 50 14, 95 38 Q 130 65, 148 110" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 8 8 Q 14 50, 38 95 Q 65 130, 110 148" strokeWidth="1.8" strokeLinecap="round" />

    {/* Leaves */}
    <g fill="currentColor" stroke="none">
      <path d="M 22 10 Q 32 2 44 8 Q 36 20 22 10 Z" />
      <path d="M 20 18 Q 10 28 16 40 Q 28 32 20 18 Z" />
      <path d="M 45 16 Q 58 6 70 14 Q 60 28 45 16 Z" />
      <path d="M 42 26 Q 32 38 40 50 Q 50 40 42 26 Z" />
      <path d="M 72 26 Q 88 16 100 26 Q 88 40 72 26 Z" />
      <path d="M 68 38 Q 58 52 68 64 Q 78 52 68 38 Z" />
      <path d="M 102 42 Q 118 34 128 46 Q 114 58 102 42 Z" />
      <path d="M 96 56 Q 88 70 100 80 Q 108 68 96 56 Z" />

      <path d="M 10 24 Q 2 36 12 46 Q 22 36 10 24 Z" />
      <path d="M 24 10 Q 36 2 46 12 Q 36 22 24 10 Z" />
    </g>

    {/* Berries */}
    <g fill="currentColor">
      <circle cx="28" cy="22" r="2.8" />
      <circle cx="34" cy="18" r="2.2" />
      <circle cx="52" cy="30" r="2.8" />
      <circle cx="58" cy="24" r="2.2" />
      <circle cx="80" cy="42" r="2.8" />
      <circle cx="108" cy="60" r="2.8" />
    </g>
  </svg>
);

// 2. VICTORIAN CORNER SCROLL FLOURISHES FOR LEFT MENU PAGE
const VictorianCornerFlourish = ({ position = 'top-left' }) => {
  let transform = '';
  if (position === 'top-right') transform = 'scale-x-[-1]';
  if (position === 'bottom-left') transform = 'scale-y-[-1]';
  if (position === 'bottom-right') transform = 'scale-x-[-1] scale-y-[-1]';

  return (
    <svg
      className={`absolute ${position.includes('top') ? 'top-3.5' : 'bottom-3.5'} ${position.includes('left') ? 'left-3.5' : 'right-3.5'} w-8 h-8 text-stone-900 pointer-events-none z-10 ${transform}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <path d="M 5 50 V 5 H 50" strokeWidth="2.5" strokeLinecap="square" />
      <path d="M 12 42 V 12 H 42" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M 18 18 C 32 18, 42 28, 42 42 C 42 32, 32 22, 18 22 Z" fill="currentColor" stroke="none" />
      <circle cx="28" cy="28" r="3.2" fill="currentColor" stroke="none" />
      <path d="M 28 33 C 35 39, 44 43, 50 39" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

// 3. SECTION SEPARATOR DIVIDER SWIRL
const WeddingSectionDivider = () => (
  <div className="flex items-center justify-center my-1 text-stone-900 opacity-90">
    <svg className="w-28 h-3.5 fill-current" viewBox="0 0 140 20">
      <path d="M 70 3 C 65 3, 60 7, 52 7 C 42 7, 35 1, 20 5 C 10 8, 2 15, 0 10 C 2 5, 12 0, 22 2 C 34 4, 40 10, 50 10 C 58 10, 62 6, 70 6 C 78 6, 82 10, 90 10 C 100 10, 106 4, 118 2 C 128 0, 138 5, 140 10 C 138 15, 130 8, 120 5 C 105 1, 98 7, 88 7 C 80 7, 75 3, 70 3 Z" />
      <circle cx="70" cy="11" r="2.5" />
      <circle cx="56" cy="11" r="1.5" />
      <circle cx="84" cy="11" r="1.5" />
    </svg>
  </div>
);

// 4. MONOGRAM LOGO BADGE (RIGHT COVER PAGE)
const MonogramLogoBadge = ({ text = "MH" }) => (
  <div className="w-24 h-16 relative flex items-center justify-center my-1">
    <svg className="w-full h-full text-stone-900" viewBox="0 0 140 80" fill="none">
      <ellipse cx="70" cy="40" rx="64" ry="34" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <ellipse cx="70" cy="40" rx="59" ry="29" fill="currentColor" />
      <path d="M 22 40 C 37 20, 103 20, 118 40 C 103 60, 37 60, 22 40 Z" fill="#fdfbf7" />
      <path d="M 25 40 C 39 23, 101 23, 115 40 C 101 57, 39 57, 25 40 Z" fill="currentColor" />
      <text
        x="70"
        y="50"
        textAnchor="middle"
        fill="#fdfbf7"
        fontSize="30"
        fontWeight="bold"
        fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
        letterSpacing="2"
      >
        {text}
      </text>
    </svg>
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
      className="bg-[#fdfbf7] text-[#111111] w-[840px] h-[594px] min-w-[840px] min-h-[594px] rounded-xs shadow-2xl p-4 flex flex-row relative select-none border border-stone-300 shrink-0"
      style={{
        fontFamily: `'Cormorant Garamond', 'Lora', 'Playfair Display', Georgia, serif`,
        backgroundColor: '#fdfbf7'
      }}
    >
      {/* Center Fold Line */}
      <div className="absolute left-1/2 top-3 bottom-3 w-[1px] bg-stone-400/40 border-r border-dashed border-stone-400/50 -ml-[0.5px] z-20"></div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PAGE 1 (LEFT): DISH MENU CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="w-1/2 p-4 relative flex flex-col justify-between text-center bg-[#fdfbf7]">
        
        {/* Outer Frame: Double Line Border */}
        <div className="absolute inset-2 border border-stone-900 pointer-events-none"></div>
        <div className="absolute inset-3 border border-stone-800 pointer-events-none"></div>

        {/* 4 Victorian Corner Scroll Flourishes */}
        <VictorianCornerFlourish position="top-left" />
        <VictorianCornerFlourish position="top-right" />
        <VictorianCornerFlourish position="bottom-left" />
        <VictorianCornerFlourish position="bottom-right" />

        {/* DISH SECTIONS */}
        <div className="my-auto space-y-2 px-3 py-1 relative z-10">
          
          {/* 1. KHAI VỊ */}
          {khaiViList.length > 0 && (
            <div className="space-y-0.5">
              <h3 className="text-3xl text-stone-900 tracking-wide font-normal" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                Khai vị
              </h3>
              <div className="space-y-0.5 text-[13.5px] font-serif text-stone-900 font-semibold italic leading-snug">
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
              <h3 className="text-3xl text-stone-900 tracking-wide font-normal" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                Món chính
              </h3>
              <div className="space-y-0.5 text-[13.5px] font-serif text-stone-900 font-semibold italic leading-snug">
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
              <h3 className="text-3xl text-stone-900 tracking-wide font-normal" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                Tráng miệng
              </h3>
              <div className="space-y-0.5 text-[13.5px] font-serif text-stone-900 font-semibold italic leading-snug">
                {trangMiengList.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
              <WeddingSectionDivider />
            </div>
          )}

          {/* 4. ĐỒ UỐNG */}
          {doUongList.length > 0 && (
            <div className="space-y-0.5">
              <h3 className="text-3xl text-stone-900 tracking-wide font-normal" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
                Đồ uống
              </h3>
              <div className="space-y-0.5 text-[13.5px] font-serif text-stone-900 font-semibold italic leading-snug">
                {doUongList.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BLESSING WISH */}
        <div className="pb-2 pt-1 z-10">
          <p className="font-serif text-base font-bold italic text-stone-900 tracking-wide">
            {footerText}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PAGE 2 (RIGHT): COVER PAGE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="w-1/2 p-4 relative flex flex-col justify-between text-center bg-[#fdfbf7]">
        
        {/* Outer Frame: Double Line Border */}
        <div className="absolute inset-2 border border-stone-900 pointer-events-none"></div>
        <div className="absolute inset-3 border border-stone-800 pointer-events-none"></div>

        {/* TOP CORNERS BOTANICAL LEAF BRANCHES */}
        <CoverBotanicalLeafBranch position="left" />
        <CoverBotanicalLeafBranch position="right" />

        {/* MH MONOGRAM LOGO BADGE */}
        <div className="pt-7 flex flex-col items-center z-10">
          <MonogramLogoBadge text="MH" />
        </div>

        {/* COVER TITLES */}
        <div className="my-auto space-y-3 py-2 z-10">
          <h1 className="text-2xl font-serif tracking-[0.24em] font-bold text-stone-900 uppercase">
            WEDDING MENU
          </h1>

          <div className="space-y-1">
            <p className="text-3xl text-stone-900 font-normal italic" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
              {title}
            </p>
            <h2 className="text-4xl text-stone-900 font-bold px-2 py-0.5 leading-snug" style={{ fontFamily: `'Great Vibes', 'Alex Brush', cursive` }}>
              {brideGroomNames}
            </h2>
          </div>

          <div className="pt-1.5">
            <span className="inline-block border-t border-b border-stone-800 px-8 py-1 font-serif text-base font-bold text-stone-900 tracking-wider">
              {eventDate}
            </span>
          </div>

          <WeddingSectionDivider />
        </div>

        {/* FOOTER HOTEL DETAILS */}
        <div className="pb-3 pt-1 px-2 text-[11px] font-serif text-stone-900 leading-tight z-10">
          <p className="font-bold">Trung tâm Hội nghị, Tiệc cưới & Nhà hàng Golden Palace</p>
          <p className="italic">Số 98 Đông A, Phường Nam Định, Tỉnh Ninh Bình</p>
          <p className="font-medium">Mọi chi tiết liên hệ: 02286595959</p>
        </div>

      </div>
    </div>
  );
}
