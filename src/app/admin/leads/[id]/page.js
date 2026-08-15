import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import LeadZaloClientActions from './LeadZaloClientActions';

const formatVietnamTime = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatVietnamDateOnly = (dateVal) => {
  if (!dateVal) return 'N/A';
  return new Date(dateVal).toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default async function LeadDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) notFound();

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
  const latestProposal = lead.proposals[0];
  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads">
            <button className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
          </Link>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#a66a3a] block">{lead.code}</span>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết Khách hàng: {lead.name}</h2>
          </div>
        </div>
        
        <form action={updateStatus} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-700">Trạng thái:</span>
          <select 
            name="status" 
            defaultValue={lead.leadStatus}
            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900 outline-none focus:border-[#e3a638]"
          >
            <option value="NEW">Mới (NEW)</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="QUOTED">Đã báo giá</option>
            <option value="WON">Chốt Hợp Đồng</option>
            <option value="LOST">Hủy</option>
          </select>
          <button type="submit" className="bg-gray-900 text-amber-300 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer">
            Lưu
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Info & Zalo Actions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1c1917] to-[#a66a3a] text-amber-300 flex items-center justify-center text-xl font-bold font-playfair shadow-md">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{lead.name}</h3>
                <p className="text-xs text-amber-800 font-mono font-bold">{lead.phone}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-0.5">Số điện thoại liên hệ</p>
                <p className="text-gray-900 font-bold text-sm font-mono">{lead.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-0.5">Thời gian nhận yêu cầu (Giờ Việt Nam)</p>
                <p className="text-gray-900 font-bold text-sm text-emerald-700">{formatVietnamTime(lead.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-0.5">Ghi chú của khách hàng</p>
                <div className="bg-gray-50 p-3 rounded-xl text-gray-700 text-xs border border-gray-200/80 leading-relaxed">
                  {lead.notes ? lead.notes : <span className="text-gray-400 italic">Không có ghi chú</span>}
                </div>
              </div>
            </div>

            {/* ZALO INTERACTION BUTTONS */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <span>📱</span> Tương Tác & Gửi Zalo Trực Tiếp:
              </span>
              
              <LeadZaloClientActions 
                leadName={lead.name}
                phone={cleanPhone}
                code={lead.code}
                proposal={latestProposal}
                linkToken={lead.linkToken}
                notes={lead.notes}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link href={`/du-toan-chi-phi/link/${lead.linkToken}`} target="_blank">
              <button className="w-full bg-gray-900 text-amber-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span className="material-symbols-outlined text-base">link</span> Xem Link Dự Toán Khách Hàng
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Proposals History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span>📋</span> Lịch sử Phương án Báo Giá (Proposals)
          </h3>
          
          <div className="space-y-8">
            {lead.proposals.length === 0 ? (
              <p className="text-gray-500 text-xs italic">Chưa có phương án nào.</p>
            ) : (
              lead.proposals.map((proposal, index) => {
                const isLatest = index === 0;
                return (
                  <div key={proposal.id} className={`relative pl-8 border-l-2 ${isLatest ? 'border-[#e3a638]' : 'border-gray-200'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white ${isLatest ? 'border-[#e3a638] bg-[#e3a638]' : 'border-gray-300'}`}></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className={`text-sm font-bold ${isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
                          Phiên bản Version {proposal.version} {isLatest && <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full ml-2">Mới nhất</span>}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Lưu lúc: {formatVietnamTime(proposal.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-gray-400 font-semibold">Tổng dự trù kinh phí</p>
                        <p className={`text-base font-bold font-playfair ${isLatest ? 'text-emerald-700' : 'text-gray-500'}`}>{formatCurrency(proposal.totalBase)}</p>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 text-xs p-4 rounded-xl border ${isLatest ? 'bg-amber-50/40 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase mb-0.5">Ngày tiệc & Quy mô</span>
                        <p className="font-bold text-gray-900">{formatVietnamDateOnly(proposal.eventDate)} ({proposal.eventSession})</p>
                        <p className="text-gray-700">{proposal.guestCount} khách • {proposal.mainTables} mâm chính</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase mb-0.5">Hội trường ưu tiên</span>
                        {proposal.venues.filter(v => v.isPreferred).map(v => (
                          <p key={v.venueId} className="font-bold text-gray-900">{v.venueName} ({formatCurrency(v.venueFee)})</p>
                        ))}
                        {proposal.venues.length === 0 && <p className="italic text-gray-400">Không chọn</p>}
                      </div>

                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase mb-0.5">Thực đơn</span>
                        <p className="font-bold text-gray-900">{formatCurrency(proposal.budgetPerTable)} / mâm</p>
                      </div>

                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase mb-0.5">Gói dịch vụ & Dịch vụ nâng cao</span>
                        <p className="font-bold text-gray-900">{proposal.package ? proposal.package.name : 'Không chọn gói'}</p>
                        <p className="text-[11px] text-gray-500">{proposal.addOns.length} hạng mục nâng cao</p>
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
