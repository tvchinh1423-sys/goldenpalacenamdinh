import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function LeadsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const statusFilter = searchParams.status || 'ALL';
  const searchQuery = searchParams.q || '';

  const whereClause = {
    ...(statusFilter !== 'ALL' && { leadStatus: statusFilter }),
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery } },
        { phone: { contains: searchQuery } },
        { code: { contains: searchQuery } },
      ]
    })
  };

  const leads = await prisma.lead.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      proposals: {
        orderBy: { version: 'desc' },
        take: 1
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-headline-sm text-on-surface">Quản lý Khách hàng (Leads)</h2>
        <div className="flex gap-4">
          <form className="flex gap-2">
            <input 
              type="text" 
              name="q"
              defaultValue={searchQuery}
              placeholder="Tìm tên, SĐT, Mã KH..." 
              className="bg-surface-bright border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <select 
              name="status" 
              defaultValue={statusFilter}
              className="bg-surface-bright border border-outline-variant/50 rounded-lg px-4 py-2 font-body-md focus:border-primary outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới (NEW)</option>
              <option value="CONTACTED">Đã liên hệ</option>
              <option value="QUOTED">Đã báo giá</option>
              <option value="WON">Chốt Hợp Đồng</option>
              <option value="LOST">Hủy</option>
            </select>
            <button type="submit" className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">search</span> Lọc
            </button>
          </form>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md">
            <thead className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4 font-label-md font-semibold">Mã KH</th>
                <th className="px-6 py-4 font-label-md font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-label-md font-semibold">Số lượng khách</th>
                <th className="px-6 py-4 font-label-md font-semibold">Ngày dự kiến</th>
                <th className="px-6 py-4 font-label-md font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-label-md font-semibold">Ngày nhận</th>
                <th className="px-6 py-4 font-label-md font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
                      <p>Không tìm thấy khách hàng nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const latestProposal = lead.proposals[0];
                  return (
                    <tr key={lead.id} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{lead.code}</td>
                      <td className="px-6 py-4">
                        <div className="text-on-surface font-semibold">{lead.name}</div>
                        <div className="text-on-surface-variant text-sm">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-on-surface">
                        {latestProposal ? `${latestProposal.guestCount} khách` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-on-surface">
                        {latestProposal ? format(new Date(latestProposal.eventDate), 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-label-md inline-block ${
                          lead.leadStatus === 'NEW' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          lead.leadStatus === 'CONTACTED' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          lead.leadStatus === 'WON' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                          'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <button className="text-primary hover:text-primary-container p-2 rounded-full hover:bg-primary/10 transition-colors tooltip" title="Xem chi tiết">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
