import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';

export default async function LeadDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const { id } = params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      proposals: {
        orderBy: { version: 'desc' },
        include: {
          venues: true,
          addOns: true,
          package: true
        }
      }
    }
  });

  if (!lead) {
    notFound();
  }

  // Server Action to update status
  async function updateStatus(formData) {
    'use server';
    const newStatus = formData.get('status');
    await prisma.lead.update({
      where: { id },
      data: { leadStatus: newStatus }
    });
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath(`/admin/leads`);
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads">
            <button className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <h2 className="text-2xl font-headline-sm text-on-surface">Chi tiết Khách hàng</h2>
        </div>
        
        <form action={updateStatus} className="flex items-center gap-3 bg-surface-bright p-2 rounded-lg border border-outline-variant/30 shadow-sm">
          <span className="text-sm font-label-md text-on-surface-variant">Cập nhật trạng thái:</span>
          <select 
            name="status" 
            defaultValue={lead.leadStatus}
            className="bg-transparent border border-outline-variant/50 rounded p-1 font-body-md text-sm outline-none focus:border-primary"
          >
            <option value="NEW">Mới (NEW)</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="QUOTED">Đã báo giá</option>
            <option value="WON">Chốt Hợp Đồng</option>
            <option value="LOST">Hủy</option>
          </select>
          <button type="submit" className="bg-primary text-white px-3 py-1.5 rounded text-sm font-label-md hover:bg-primary/90 transition-colors">
            Lưu
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Info */}
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-gradient-start to-gold-gradient-end flex items-center justify-center text-white text-2xl font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface">{lead.name}</h3>
              <p className="text-on-surface-variant text-sm">{lead.code}</p>
            </div>
          </div>

          <div className="space-y-4 font-body-md">
            <div>
              <p className="text-sm text-on-surface-variant font-label-md">Số điện thoại</p>
              <p className="text-on-surface font-semibold">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-label-md">Ngày nhận thông tin</p>
              <p className="text-on-surface font-semibold">{format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-label-md">Ghi chú từ khách hàng</p>
              <div className="bg-surface-variant p-3 rounded-lg text-on-surface mt-1 text-sm border border-outline-variant/30">
                {lead.notes ? lead.notes : <span className="text-on-surface-variant italic">Không có ghi chú</span>}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Link href={`/du-toan-chi-phi/link/${lead.linkToken}`} target="_blank">
              <button className="w-full bg-surface-variant border border-primary/50 text-primary py-2 rounded-lg font-label-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">link</span> Xem Link Khách Hàng
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Proposals History */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-outline-variant/30">
          <h3 className="font-headline-sm text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Lịch sử Phương án (Proposals)</h3>
          
          <div className="space-y-8">
            {lead.proposals.length === 0 ? (
              <p className="text-on-surface-variant italic">Chưa có phương án nào.</p>
            ) : (
              lead.proposals.map((proposal, index) => {
                const isLatest = index === 0;
                return (
                  <div key={proposal.id} className={`relative pl-8 border-l-2 ${isLatest ? 'border-primary' : 'border-outline-variant/50'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-surface ${isLatest ? 'border-primary' : 'border-outline-variant/50'}`}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className={`font-label-lg font-bold ${isLatest ? 'text-primary' : 'text-on-surface-variant'}`}>
                          Version {proposal.version} {isLatest && <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full ml-2 font-normal">Mới nhất</span>}
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-1">Lưu lúc: {format(new Date(proposal.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-label-md text-on-surface-variant">Tổng dự trù</p>
                        <p className={`font-headline-sm ${isLatest ? 'text-on-surface' : 'text-on-surface-variant'}`}>{formatCurrency(proposal.totalBase)}</p>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 text-sm font-body-sm p-4 rounded-lg bg-surface-bright border ${isLatest ? 'border-gold-gradient-start/30' : 'border-outline-variant/30'}`}>
                      <div>
                        <span className="text-on-surface-variant block mb-1">Ngày tiệc & Quy mô</span>
                        <p className="font-semibold">{format(new Date(proposal.eventDate), 'dd/MM/yyyy')} ({proposal.eventSession})</p>
                        <p>{proposal.guestCount} khách • {proposal.mainTables} mâm</p>
                      </div>
                      
                      <div>
                        <span className="text-on-surface-variant block mb-1">Hội trường ưu tiên</span>
                        {proposal.venues.filter(v => v.isPreferred).map(v => (
                          <p key={v.venueId} className="font-semibold">{v.venueName} ({formatCurrency(v.venueFee)})</p>
                        ))}
                        {proposal.venues.length === 0 && <p className="italic">Không chọn</p>}
                      </div>

                      <div>
                        <span className="text-on-surface-variant block mb-1">Thực đơn</span>
                        <p className="font-semibold">{formatCurrency(proposal.budgetPerTable)} / mâm</p>
                      </div>

                      <div>
                        <span className="text-on-surface-variant block mb-1">Gói dịch vụ & Add-ons</span>
                        <p className="font-semibold">{proposal.package ? proposal.package.name : 'Không chọn gói'}</p>
                        <p className="text-xs mt-1 text-on-surface-variant">{proposal.addOns.length} dịch vụ bổ sung</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
