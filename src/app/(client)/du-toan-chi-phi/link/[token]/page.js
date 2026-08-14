import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function LinkView({ params }) {
  const token = params.token;
  
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

  if (!lead || lead.proposals.length === 0) {
    notFound();
  }

  const proposal = lead.proposals[0];
  const preferredVenue = proposal.venues.find(v => v.isPreferred) || proposal.venues[0];

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="bg-background text-on-surface font-body-md antialiased pt-32 pb-40 min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-on-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-center items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg font-display-lg text-primary-container bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent text-center">
            Golden Palace
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-margin-mobile md:px-0 pt-8">
        <div className="bg-surface-bright/95 backdrop-blur-xl border border-gold-gradient-start/30 shadow-[0_10px_40px_rgba(212,175,55,0.1)] p-8 md:p-12 relative overflow-hidden">
          {/* Invoice Header */}
          <div className="text-center mb-10 border-b border-outline-variant/50 pb-8">
            <h2 className="font-display-lg text-primary mb-2">Bản Dự Trù Tiệc Cưới</h2>
            <p className="font-body-md text-on-surface-variant">Mã KH: {lead.code} • Phiên bản: {proposal.version}</p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6 mb-10 text-slate-text font-body-md">
            <div>
              <p className="text-on-surface-variant mb-1 font-label-md">Khách hàng</p>
              <p className="font-bold">{lead.name}</p>
              <p>{lead.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant mb-1 font-label-md">Thông tin tiệc</p>
              <p className="font-bold">{format(new Date(proposal.eventDate), 'dd/MM/yyyy')} ({proposal.eventSession})</p>
              <p>{proposal.guestCount} khách • {proposal.mainTables} mâm</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-6">
            <h3 className="font-headline-sm text-primary border-b border-gold-gradient-start/30 pb-2">Chi tiết chi phí</h3>
            
            {preferredVenue && (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-text">Phí Hội Trường: {preferredVenue.venueName}</p>
                  <p className="text-sm text-on-surface-variant">Đã bao gồm các trang thiết bị cơ bản</p>
                </div>
                <span className="font-label-md">{formatCurrency(preferredVenue.venueFee)}</span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-text">Thực đơn (Dự kiến)</p>
                <p className="text-sm text-on-surface-variant">{formatCurrency(proposal.budgetPerTable)}/mâm × {proposal.mainTables} mâm chính</p>
                {proposal.reserveTables > 0 && <p className="text-sm text-on-surface-variant">+ {proposal.reserveTables} mâm dự phòng (thanh toán nếu phát sinh)</p>}
              </div>
              <div className="text-right">
                <span className="font-label-md block">{formatCurrency(Number(proposal.budgetPerTable) * proposal.mainTables)}</span>
                {proposal.reserveTables > 0 && <span className="text-sm text-on-surface-variant block mt-1">(Tối đa: +{formatCurrency(Number(proposal.budgetPerTable) * proposal.reserveTables)})</span>}
              </div>
            </div>

            {proposal.package && (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-text">Gói Dịch Vụ: {proposal.package.name}</p>
                </div>
                <span className="font-label-md">{formatCurrency(proposal.packagePrice)}</span>
              </div>
            )}

            {proposal.addOns.length > 0 && (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-text">Dịch vụ bổ sung</p>
                  <ul className="text-sm text-on-surface-variant list-disc list-inside">
                    {proposal.addOns.map(a => <li key={a.id}>{a.addOnName}</li>)}
                  </ul>
                </div>
                <span className="font-label-md">{formatCurrency(proposal.addOns.reduce((sum, a) => sum + Number(a.price), 0))}</span>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-10 pt-6 border-t-2 border-gold-gradient-start border-dashed">
            <div className="flex justify-between items-end">
              <span className="font-headline-md text-on-surface">Tổng Dự Trù</span>
              <div className="text-right">
                <span className="font-display-lg text-primary block">{formatCurrency(proposal.totalBase)}</span>
                <span className="text-on-surface-variant text-sm mt-1 block">Tối đa (nếu dùng hết dự phòng): {formatCurrency(proposal.totalMax)}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 bg-surface-variant p-4 rounded-lg text-sm text-on-surface-variant">
            <p className="font-bold mb-2">Lưu ý quan trọng:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bảng dự trù này chưa bao gồm 8% VAT và chi phí đồ uống tiêu thụ thực tế.</li>
              <li>Giá trị có hiệu lực trong vòng 7 ngày kể từ ngày báo giá.</li>
              <li>Để được tư vấn và giữ ưu đãi, quý khách vui lòng liên hệ hotline: 0900.xxx.xxx</li>
            </ul>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/api/pdf/proposal?token=${token}`} target="_blank">
              <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-surface-variant text-primary font-label-md flex items-center justify-center gap-2 hover:bg-primary-container/20 border border-primary transition-colors">
                <span className="material-symbols-outlined">download</span> Tải PDF
              </button>
            </Link>
            <Link href="/">
              <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-white font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">edit</span> Sửa yêu cầu mới
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
