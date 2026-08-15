import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ZaloHeaderButton from './ZaloHeaderButton';

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

export default async function LeadsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams?.status || 'ALL';
  const searchQuery = resolvedSearchParams?.q || '';

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

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="space-y-6 font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quản lý Khách hàng (Leads) & Thông báo Zalo</h2>
          <p className="text-xs text-gray-500 mt-1">Đồng bộ yêu cầu đặt tiệc và gửi tin nhắn Zalo trực tiếp cho nhóm "Chốt tiền hàng"</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <ZaloHeaderButton />
          <form className="flex gap-2">
            <input 
              type="text" 
              name="q"
              defaultValue={searchQuery}
              placeholder="Tìm tên, SĐT, Mã KH..." 
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs font-medium focus:border-[#e3a638] focus:outline-none"
            />
            <select 
              name="status" 
              defaultValue={statusFilter}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium focus:border-[#e3a638] outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="NEW">Mới (NEW)</option>
              <option value="CONTACTED">Đã liên hệ</option>
              <option value="QUOTED">Đã báo giá</option>
              <option value="WON">Chốt Hợp Đồng</option>
              <option value="LOST">Hủy</option>
            </select>
            <button type="submit" className="bg-gray-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-base">search</span> Lọc
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-gray-900 text-amber-200 uppercase text-[11px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Mã KH</th>
                <th className="px-6 py-4">Khách Hàng & SĐT</th>
                <th className="px-6 py-4">Sảnh & Quy Mô</th>
                <th className="px-6 py-4">Dự Toán Chi Phí</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4">Thời Gian Nhận (Giờ VN)</th>
                <th className="px-6 py-4 text-right">Thao Tác & Zalo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-gray-300">inbox</span>
                      <p className="text-xs font-light">Không tìm thấy yêu cầu đặt tiệc nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const latestProposal = lead.proposals[0];
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#a66a3a]">{lead.code}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-bold">{lead.name}</div>
                        <div className="text-gray-500 font-mono text-[11px]">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {latestProposal ? (
                          <div>
                            <span className="font-semibold text-gray-900 block">{latestProposal.guestCount} khách ({latestProposal.mainTables} mâm)</span>
                            <span className="text-[11px] text-gray-500">Ngày: {formatVietnamDateOnly(latestProposal.eventDate)}</span>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700 whitespace-nowrap">
                        {latestProposal ? formatCurrency(latestProposal.totalBase) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full inline-block whitespace-nowrap ${
                          lead.leadStatus === 'NEW' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          lead.leadStatus === 'CONTACTED' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          lead.leadStatus === 'WON' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-bold text-[11px] whitespace-nowrap">
                        {formatVietnamTime(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Direct Zalo Button */}
                          <a 
                            href={`https://zalo.me/${cleanPhone}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Chat Zalo trực tiếp với số điện thoại này"
                          >
                            <span>📱 Chat Zalo</span>
                          </a>

                          <Link href={`/admin/leads/${lead.id}`}>
                            <button className="bg-gray-900 hover:bg-black text-amber-300 p-1.5 rounded-lg transition-colors cursor-pointer" title="Xem chi tiết đơn">
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                          </Link>
                        </div>
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
