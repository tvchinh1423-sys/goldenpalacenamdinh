import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function VenuesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const venues = await prisma.venue.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pricings: true
    }
  });

  async function toggleStatus(formData) {
    'use server';
    const id = formData.get('id');
    const currentStatus = formData.get('status');
    await prisma.venue.update({
      where: { id },
      data: { status: currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
    });
    revalidatePath('/admin/venues');
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-sm text-on-surface">Quản lý Hội trường</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Hội trường
        </button>
      </div>

      <div className="glass-panel rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left font-body-md">
          <thead className="bg-surface-container-lowest text-on-surface-variant border-b border-outline-variant/30">
            <tr>
              <th className="px-6 py-4 font-label-md font-semibold w-16">Ảnh</th>
              <th className="px-6 py-4 font-label-md font-semibold">Tên hội trường</th>
              <th className="px-6 py-4 font-label-md font-semibold">Sức chứa tối đa</th>
              <th className="px-6 py-4 font-label-md font-semibold">Mức giá</th>
              <th className="px-6 py-4 font-label-md font-semibold">Trạng thái</th>
              <th className="px-6 py-4 font-label-md font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {venues.map(v => {
              const images = JSON.parse(v.images || '[]');
              const thumbnail = images[0] || 'https://via.placeholder.com/150';
              return (
                <tr key={v.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="px-6 py-4">
                    <img src={thumbnail} alt={v.name} className="w-12 h-12 rounded object-cover border border-outline-variant/30" />
                  </td>
                  <td className="px-6 py-4 font-bold text-on-surface">{v.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{v.maxGuests} khách</td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {v.pricings.length > 0 
                      ? `${v.pricings.length} mức giá (Từ ${formatCurrency(v.pricings[0].price)})` 
                      : 'Chưa cài đặt giá'}
                  </td>
                  <td className="px-6 py-4">
                    <form action={toggleStatus}>
                      <input type="hidden" name="id" value={v.id} />
                      <input type="hidden" name="status" value={v.status} />
                      <button type="submit" className={`px-3 py-1 text-xs rounded-full font-label-md flex items-center gap-1 border ${
                        v.status === 'PUBLISHED' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {v.status === 'PUBLISHED' ? 'public' : 'visibility_off'}
                        </span>
                        {v.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-container p-2 rounded-full hover:bg-primary/10 transition-colors tooltip" title="Chỉnh sửa">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {venues.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-on-surface-variant">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
