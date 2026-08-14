import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function PackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const packages = await prisma.servicePackage.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pricings: true,
      items: true
    }
  });

  async function toggleStatus(formData) {
    'use server';
    const id = formData.get('id');
    const currentStatus = formData.get('status');
    await prisma.servicePackage.update({
      where: { id },
      data: { status: currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
    });
    revalidatePath('/admin/packages');
  }

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-sm text-on-surface">Quản lý Gói dịch vụ</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Gói
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(p => {
          const images = JSON.parse(p.images || '[]');
          const thumbnail = images[0] || 'https://via.placeholder.com/400x250';
          return (
            <div key={p.id} className="glass-panel rounded-xl overflow-hidden border border-outline-variant/30 flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={thumbnail} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <form action={toggleStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value={p.status} />
                    <button type="submit" className={`px-3 py-1 text-xs rounded-full font-label-md flex items-center gap-1 shadow-sm backdrop-blur-sm ${
                      p.status === 'PUBLISHED' 
                        ? 'bg-emerald-500/90 text-white' 
                        : 'bg-surface/90 text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {p.status === 'PUBLISHED' ? 'public' : 'visibility_off'}
                      </span>
                      {p.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                    </button>
                  </form>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-sm text-on-surface mb-2">{p.name}</h3>
                <p className="font-label-md text-primary mb-4">
                  Từ {p.pricings.length > 0 ? formatCurrency(p.pricings[0].price) : '0đ'}
                </p>
                
                <div className="flex-grow space-y-2 mb-6">
                  <p className="text-sm font-label-md text-on-surface-variant">Bao gồm {p.items.length} hạng mục:</p>
                  <ul className="text-sm text-on-surface list-disc list-inside">
                    {p.items.slice(0, 3).map(item => (
                      <li key={item.id} className="truncate">{item.name}</li>
                    ))}
                    {p.items.length > 3 && <li className="text-on-surface-variant italic">+{p.items.length - 3} hạng mục khác</li>}
                  </ul>
                </div>
                
                <div className="mt-auto border-t border-outline-variant/30 pt-4">
                  <button className="w-full bg-surface-variant border border-primary/30 text-primary py-2 rounded-lg font-label-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {packages.length === 0 && (
        <div className="p-10 text-center text-on-surface-variant glass-panel rounded-xl">Không có dữ liệu gói dịch vụ.</div>
      )}
    </div>
  );
}
