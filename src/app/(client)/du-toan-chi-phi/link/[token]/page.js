import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function LinkView({ params }) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;
  
  if (!token) {
    notFound();
  }

  const lead = await prisma.lead.findUnique({
    where: { linkToken: token },
    include: {
      proposals: {
        orderBy: { version: 'desc' },
        take: 1,
        include: {
          venues: true,
          addOns: true,
          package: true
        }
      }
    }
  });

  if (!lead || !lead.proposals || lead.proposals.length === 0) {
    notFound();
  }

  const proposal = lead.proposals[0];
  const preferredVenue = proposal.venues.find(v => v.isPreferred) || proposal.venues[0];

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-800 font-montserrat flex flex-col items-center justify-center p-3 sm:p-6 relative selection:bg-[#e3a638] selection:text-white pt-24 pb-28">
      
      {/* Background Accent */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-amber-50/20 to-[#faf6f0] pointer-events-none"></div>

      {/* Main E-Card Envelope Frame (Matching Thiệp Cưới Online) */}
      <div className="w-full max-w-2xl bg-[#faf6f0] border-2 border-[#d4af37]/60 rounded-3xl p-6 sm:p-10 shadow-[0_15px_60px_rgba(217,162,60,0.2)] relative z-10 my-6 flex flex-col">
        
        {/* SVG Floral Corner Ornaments */}
        <svg className="absolute top-2 left-2 w-16 h-16 pointer-events-none opacity-80" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
        </svg>
        <svg className="absolute top-2 right-2 w-16 h-16 pointer-events-none opacity-80 transform scale-x-[-1]" viewBox="0 0 100 100" fill="none">
          <path d="M10 30 C10 15, 25 10, 40 10 M10 45 C10 20, 30 10, 55 10 M10 10 Q35 10 10 35" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#d4af37" />
        </svg>

        {/* Brand Header */}
        <div className="flex justify-between items-center border-b border-amber-200/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="Golden Palace Logo" className="h-8 w-auto object-contain" />
            <div>
              <span className="text-[10px] font-playfair tracking-[0.2em] text-[#a66a3a] font-bold uppercase block">GOLDEN PALACE</span>
              <span className="text-[9px] text-stone-500 block">Nam Định • Wedding & Convention</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-100 text-[#a66a3a] px-3 py-1 rounded-full border border-amber-300">
            {lead.code}
          </span>
        </div>

        {/* Invoice Title */}
        <div className="text-center mb-8">
          <span className="text-[#a66a3a] uppercase tracking-[0.25em] text-[10px] font-bold block mb-1">
            BẢN BÁO GIÁ TIỆC CƯỚI TRỰC TUYẾN
          </span>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#b8860b]">
            Dự Toán Chi Phí Trọn Gói
          </h1>
        </div>

        {/* Customer & Event Overview */}
        <div className="bg-[#fdfbf7] border border-[#e3a638]/40 rounded-2xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-[#a66a3a] uppercase tracking-wider block mb-1">Khách Hàng</span>
            <p className="font-bold text-stone-900 text-sm">{lead.name}</p>
            <p className="text-stone-600 font-mono mt-0.5">SĐT Zalo: {lead.phone}</p>
          </div>
          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-200">
            <span className="text-[10px] font-bold text-[#a66a3a] uppercase tracking-wider block mb-1">Thông Tin Tiệc</span>
            <p className="font-bold text-stone-900 text-sm">
              {proposal.eventDate ? format(new Date(proposal.eventDate), 'dd/MM/yyyy') : 'Chưa chọn'} ({proposal.eventSession})
            </p>
            <p className="text-stone-600 font-mono mt-0.5">{proposal.guestCount} Khách • {proposal.mainTables} mâm</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4 text-xs sm:text-sm mb-8">
          <h3 className="font-playfair font-bold text-base text-[#b8860b] border-b border-amber-200/80 pb-2">
            Chi Tiết Các Hạng Mục Dịch Vụ
          </h3>

          {/* 1. Mâm Cỗ */}
          <div className="flex justify-between items-start py-2 border-b border-stone-100">
            <div>
              <span className="font-bold text-stone-900 block">1. Mâm Cỗ Tiệc Cưới</span>
              <span className="text-xs text-stone-500">{proposal.mainTables} mâm x {formatCurrency(proposal.budgetPerTable)} / mâm</span>
            </div>
            <span className="font-bold text-stone-900">{formatCurrency(Number(proposal.budgetPerTable) * proposal.mainTables)}</span>
          </div>

          {/* 2. Sảnh Hội Trường */}
          {preferredVenue && (
            <div className="flex justify-between items-start py-2 border-b border-stone-100 bg-amber-50/50 p-2.5 rounded-xl">
              <div>
                <span className="font-bold text-stone-900 block">2. Phí Hội Trường ({preferredVenue.venueName})</span>
                <span className="text-xs text-stone-500">Đã bao gồm đầy đủ trang thiết bị & sân khấu</span>
              </div>
              <span className="font-bold text-[#a66a3a]">{formatCurrency(preferredVenue.venueFee)}</span>
            </div>
          )}

          {/* 3. Dịch Vụ Bổ Sung */}
          {proposal.addOns && proposal.addOns.length > 0 && (
            <div className="py-2 border-b border-stone-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-stone-900">
                <span>3. Dịch Vụ Bổ Sung ({proposal.addOns.length} dịch vụ)</span>
                <span className="text-[#a66a3a]">{formatCurrency(proposal.addOns.reduce((sum, a) => sum + Number(a.price), 0))}</span>
              </div>
              <div className="bg-[#fdfbf7] p-3 rounded-xl border border-amber-200/60 space-y-1.5 text-xs">
                {proposal.addOns.map(a => (
                  <div key={a.id} className="flex justify-between items-center text-stone-700">
                    <span>• {a.addOnName}</span>
                    <span className="font-bold text-stone-900">
                      {Number(a.price) > 0 ? formatCurrency(a.price) : 'Báo giá: Liên hệ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Tổng Dự Trù */}
          <div className="pt-4 border-t-2 border-[#b8860b] flex justify-between items-center text-base sm:text-lg font-bold">
            <span className="text-stone-900 font-playfair">TỔNG CHI PHÍ DỰ TOÁN:</span>
            <span className="text-2xl font-playfair font-bold text-[#b8860b]">
              {formatCurrency(proposal.totalBase)}
            </span>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 leading-relaxed font-serif mb-6">
          <p className="font-bold text-amber-900 mb-1">Lưu ý quan trọng:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px] font-light">
            <li>Báo giá tạm tính chưa bao gồm 8% thuế VAT và đồ uống chốt thực tế sau tiệc.</li>
            <li><strong>Với số lượng khách khác nhau thì sẽ có mức ưu đãi khác nhau, quý khách vui lòng liên hệ để nhận báo giá chính xác nhất.</strong></li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="https://zalo.me/02286595959"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Liên Hệ Zalo Tư Vấn Trực Tiếp</span>
          </a>

          <Link href="/du-toan-chi-phi">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Tạo Dự Toán Mới</span>
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-500 font-serif">
          Golden Palace Wedding & Convention Center • Hotline: 0228 659 5959
        </div>

      </div>

    </div>
  );
}
