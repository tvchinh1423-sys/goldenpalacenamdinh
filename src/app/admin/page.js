import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch real stats
  const totalLeads = await prisma.lead.count();
  const newLeads = await prisma.lead.count({
    where: { leadStatus: 'NEW' }
  });
  const totalVenues = await prisma.venue.count();
  const totalPackages = await prisma.servicePackage.count();

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-sm font-label-md text-on-surface-variant">Tổng Leads</span>
          </div>
          <p className="text-3xl font-display-lg text-on-surface">{totalLeads}</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-gold-gradient-start flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined">fiber_new</span>
            </div>
            <span className="text-sm font-label-md text-primary">Leads Mới</span>
          </div>
          <p className="text-3xl font-display-lg text-primary relative z-10">{newLeads}</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <span className="text-sm font-label-md text-on-surface-variant">Hội trường</span>
          </div>
          <p className="text-3xl font-display-lg text-on-surface">{totalVenues}</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined">card_giftcard</span>
            </div>
            <span className="text-sm font-label-md text-on-surface-variant">Gói dịch vụ</span>
          </div>
          <p className="text-3xl font-display-lg text-on-surface">{totalPackages}</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-sm text-on-surface">Khách hàng mới nhất</h2>
          <Link href="/admin/leads">
            <button className="text-primary font-label-md hover:underline flex items-center gap-1">
              Xem tất cả <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-md">
            <thead className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant/30">
              <tr>
                <th className="px-6 py-4 font-label-md font-semibold">Mã KH</th>
                <th className="px-6 py-4 font-label-md font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-label-md font-semibold">Số điện thoại</th>
                <th className="px-6 py-4 font-label-md font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-label-md font-semibold">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant">
                    Chưa có khách hàng nào.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-variant/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">{lead.code}</td>
                    <td className="px-6 py-4 text-on-surface">{lead.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{lead.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-label-md ${
                        lead.leadStatus === 'NEW' ? 'bg-blue-100 text-blue-700' :
                        lead.leadStatus === 'CONTACTED' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.leadStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
