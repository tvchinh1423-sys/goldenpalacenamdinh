'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#f4f6f8] flex font-inter text-gray-800">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <span className="font-playfair font-bold text-xl text-[#d4af37]">GP ADMIN</span>
          </div>
          <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
            <Link 
              href="/admin" 
              className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Tổng quan
            </Link>
            <Link 
              href="/admin/leads" 
              className={`block px-4 py-2 rounded-md transition-colors ${pathname.includes('/admin/leads') ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Khách hàng (Leads)
            </Link>
            <Link 
              href="/admin/posts" 
              className={`block px-4 py-2 rounded-md transition-colors ${pathname.includes('/admin/posts') ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Bài viết & Ưu đãi
            </Link>
            <Link 
              href="/admin/venues" 
              className={`block px-4 py-2 rounded-md transition-colors ${pathname.includes('/admin/venues') ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Hội trường
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold text-gray-800">Bảng điều khiển</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Xin chào, Admin</span>
            </div>
          </header>
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
