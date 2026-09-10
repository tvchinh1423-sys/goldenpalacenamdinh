'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isMember = session?.user?.role === 'MEMBER';
  const isStaff = session?.user?.role === 'STAFF';

  // Route protection for MEMBER role
  useEffect(() => {
    if (status === 'authenticated') {
      if (isMember && pathname !== '/admin/personalize' && !pathname.startsWith('/admin/menus/table-designer')) {
        router.replace('/admin/personalize');
      } else if (isStaff && !pathname.startsWith('/admin/leads') && !pathname.startsWith('/admin/menus/table-designer')) {
        router.replace('/admin/leads');
      }
    }
  }, [status, isMember, isStaff, pathname, router]);

  // Close mobile sidebar whenever pathname changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const allNavItems = [
    { name: 'Bảng điều khiển', href: '/admin', icon: 'dashboard' },
    { name: 'Quản lý Khách hàng', href: '/admin/leads', icon: 'group' },
    { name: 'Menu Tiệc Để Bàn', href: '/admin/menus/table-designer', icon: 'restaurant_menu' },
    { name: 'Huấn Luyện AI Chat', href: '/admin/ai-training', icon: 'psychology' },
    { name: 'Quản lý Hội trường', href: '/admin/venues', icon: 'apartment' },
    { name: 'Gói Dịch vụ', href: '/admin/packages', icon: 'card_giftcard' },
    { name: 'Dịch vụ Bổ sung', href: '/admin/addons', icon: 'extension' },
    { name: 'Thực đơn Cỗ Tiệc', href: '/admin/menus', icon: 'menu_book' },
    { name: 'Đồ uống', href: '/admin/beverages', icon: 'local_bar' },
    { name: 'Bài viết & Ưu đãi', href: '/admin/posts', icon: 'article' },
    { name: 'Kỹ Thuật & Cá Nhân Hóa', href: '/admin/personalize', icon: 'auto_awesome' },
  ];

  // Role-based sidebar menu items
  let navItems = allNavItems;
  if (isMember) {
    navItems = [
      { name: 'Kỹ Thuật & Cá Nhân Hóa', href: '/admin/personalize', icon: 'auto_awesome' },
      { name: 'Menu Tiệc Để Bàn', href: '/admin/menus/table-designer', icon: 'restaurant_menu' }
    ];
  } else if (isStaff) {
    navItems = [
      { name: 'Quản lý Khách hàng', href: '/admin/leads', icon: 'group' },
      { name: 'Menu Tiệc Để Bàn', href: '/admin/menus/table-designer', icon: 'restaurant_menu' }
    ];
  }

  // Header Title & Badge
  let brandTitle = 'GP ADMIN';
  let roleLabel = session?.user?.email || 'admin@goldenpalacenamdinh.com';
  let avatarInitial = 'A';

  if (isMember) {
    brandTitle = 'GP KĨ THUẬT';
    roleLabel = 'Tài khoản Kỹ Thuật';
    avatarInitial = 'KT';
  } else if (isStaff) {
    brandTitle = 'GP LỄ TÂN / SALE';
    roleLabel = 'Tài khoản Lễ Tân / Sale';
    avatarInitial = 'LT';
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col lg:flex-row font-inter">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar (Responsive Overlay Drawer on Mobile, Fixed Sidebar on Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 border-r border-stone-800 flex flex-col transition-transform duration-300 transform shadow-2xl
        lg:static lg:translate-x-0 lg:w-64 shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-stone-800 bg-stone-950">
          <span className="font-bold text-lg text-amber-400 font-playfair tracking-wider">
            {brandTitle}
          </span>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md font-bold' 
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 bg-stone-950">
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-stone-950">
        
        {/* Topbar */}
        <header className="h-16 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-stone-800 text-amber-400 hover:bg-stone-700 transition-colors cursor-pointer"
              title="Mở menu quản trị"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1 className="text-sm sm:text-base font-bold font-playfair text-stone-100 truncate">
              {navItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))?.name || 'Golden Palace Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-stone-200 truncate max-w-[140px]">
                {session?.user?.name || 'User'}
              </span>
              <span className="text-[10px] text-amber-400/90 font-mono truncate max-w-[140px]">
                {roleLabel}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md border border-amber-400/30">
              {avatarInitial}
            </div>
          </div>
        </header>

        {/* Responsive Content Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-6">
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
