import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo-icon.png" alt="Golden Palace Emblem" className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="text-[#a66a3a] font-playfair text-xl tracking-widest uppercase font-semibold">Golden Palace</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 font-montserrat text-sm tracking-wider uppercase font-medium">
          <Link href="/" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Trang chủ</Link>
          <Link href="/he-thong" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Hệ thống</Link>
          <Link href="/dich-vu" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Dịch vụ</Link>
          <Link href="/thuc-don" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Thực đơn</Link>
          <Link href="/khuyen-mai" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Ưu đãi</Link>
          <Link href="/tin-tuc" className="text-gray-700 hover:text-[#a66a3a] transition-colors">Tin tức</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/du-toan-chi-phi" className="px-5 py-2.5 bg-[#e3a638]/10 border border-[#e3a638] text-[#a66a3a] hover:bg-[#e3a638] hover:text-white font-montserrat text-xs tracking-widest uppercase transition-all font-semibold">
            Dự toán chi phí
          </Link>
        </div>
      </div>
    </nav>
  );
}
