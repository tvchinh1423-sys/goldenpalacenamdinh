'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isMember = session?.user?.role === 'MEMBER';

  // Route protection for MEMBER role: strictly only allow /admin/personalize
  useEffect(() => {
    if (status === 'authenticated' && isMember) {
      if (pathname !== '/admin/personalize') {
        router.replace('/admin/personalize');
      }
    }
  }, [status, isMember, pathname, router]);

  const allNavItems = [
    { name: 'Bảng điều khiển', href: '/admin', icon: 'dashboard' },
    { name: 'Quản lý Khách hàng', href: '/admin/leads', icon: 'group' },
    { name: 'Huấn Luyện AI Chat', href: '/admin/ai-training', icon: 'psychology' },
    { name: 'Quản lý Hội trường', href: '/admin/venues', icon: 'apartment' },
    { name: 'Gói Dịch vụ', href: '/admin/packages', icon: 'card_giftcard' },
    { name: 'Dịch vụ Bổ sung', href: '/admin/addons', icon: 'extension' },
    { name: 'Thực đơn', href: '/admin/menus', icon: 'restaurant_menu' },
    { name: 'Đồ uống', href: '/admin/beverages', icon: 'local_bar' },
    { name: 'Bài viết & Ưu đãi', href: '/admin/posts', icon: 'article' },
    { name: 'Kỹ Thuật & Cá Nhân Hóa', href: '/admin/personalize', icon: 'auto_awesome' },
  ];

  // MEMBER role (Kỹ thuật) only sees Kỹ Thuật & Cá Nhân Hóa
  const navItems = isMember
    ? [{ name: 'Kỹ Thuật & Cá Nhân Hóa', href: '/admin/personalize', icon: 'auto_awesome' }]
    : allNavItems;

  return (
    <div className="min-h-screen bg-surface flex font-inter text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-bright border-r border-outline-variant/30 flex flex-col shadow-sm">
        <div className="h-16 flex items-center justify-center border-b border-outline-variant/30">
          <span className="font-display-lg font-bold text-xl text-primary bg-clip-text bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-transparent">
            {isMember ? 'GP KỸ THUẬT' : 'GP ADMIN'}
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-label-md ${
                  isActive 
                    ? 'bg-primary-container/20 text-primary border border-primary/20 shadow-sm font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-outline-variant/30">
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error-rose hover:bg-error-rose/10 transition-colors font-label-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Topbar */}
        <header className="h-16 bg-surface-bright border-b border-outline-variant/30 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-headline-sm text-on-surface">
            {navItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))?.name || 'Golden Palace Admin'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-on-surface">
                {session?.user?.name || (isMember ? 'Bộ Phận Kỹ Thuật' : 'Admin')}
              </span>
              <span className="text-xs text-on-surface-variant">
                {isMember ? 'Tài khoản Kỹ Thuật (Chỉ xem)' : (session?.user?.email || 'admin@goldenpalace.vn')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-gradient-start to-gold-gradient-end flex items-center justify-center text-white font-bold">
              {isMember ? 'KT' : 'A'}
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
