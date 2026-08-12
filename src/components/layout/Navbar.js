import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#d4af37] rounded flex items-center justify-center text-black font-bold font-playfair text-xl">
            G
          </div>
          <span className="text-[#d4af37] font-playfair text-xl tracking-widest uppercase">Golden Palace</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 font-inter text-sm tracking-wider uppercase">
          <Link href="/" className="text-gray-300 hover:text-[#d4af37] transition-colors">Trang chủ</Link>
          <Link href="/he-thong" className="text-gray-300 hover:text-[#d4af37] transition-colors">Hệ thống</Link>
          <Link href="/dich-vu" className="text-gray-300 hover:text-[#d4af37] transition-colors">Dịch vụ</Link>
          <Link href="/thuc-don" className="text-gray-300 hover:text-[#d4af37] transition-colors">Thực đơn</Link>
          <Link href="/khuyen-mai" className="text-gray-300 hover:text-[#d4af37] transition-colors">Ưu đãi</Link>
          <Link href="/tin-tuc" className="text-gray-300 hover:text-[#d4af37] transition-colors">Tin tức</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/du-toan-chi-phi" className="px-5 py-2.5 bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-inter text-xs tracking-widest uppercase transition-all">
            Dự toán chi phí
          </Link>
        </div>
      </div>
    </nav>
  );
}
