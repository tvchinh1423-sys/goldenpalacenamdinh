import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  // Mock data tạm thời để bỏ qua lỗi SQLite trên Vercel Serverless
  const totalLeads = 2;
  const newLeads = 1;
  const totalPosts = 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tổng quan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số Leads</h3>
          <p className="text-3xl font-bold text-gray-800">{totalLeads}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Leads Mới</h3>
          <p className="text-3xl font-bold text-[#d4af37]">{newLeads}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Bài viết / Khuyến mãi</h3>
          <p className="text-3xl font-bold text-gray-800">{totalPosts}</p>
        </div>
      </div>
    </div>
  );
}
