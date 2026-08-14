import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 text-gray-400 font-montserrat">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#e3a638] rounded flex items-center justify-center text-black font-bold font-playfair text-lg">
              G
            </div>
            <span className="text-[#e3a638] font-playfair text-lg tracking-widest uppercase">Golden Palace</span>
          </Link>
          <p className="text-sm font-light leading-relaxed mb-6">
            Nơi tôn vinh những khoảnh khắc trọn vẹn. Không gian hoàng gia, dịch vụ đẳng cấp 5 sao tại trung tâm thành phố Nam Định.
          </p>
        </div>

        {/* Contact */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Liên Hệ</h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <span className="block text-[#e3a638] text-xs mb-1 uppercase tracking-widest">Địa chỉ</span>
              98 Đông A, KĐT Hòa Vượng, TP Nam Định
            </li>
            <li>
              <span className="block text-[#e3a638] text-xs mb-1 uppercase tracking-widest">Hotline</span>
              0228 659 5959
            </li>
            <li>
              <span className="block text-[#e3a638] text-xs mb-1 uppercase tracking-widest">Email</span>
              booking@goldenpalace.vn
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Liên Kết</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><Link href="/he-thong" className="hover:text-[#e3a638] transition-colors">Hệ thống trung tâm</Link></li>
            <li><Link href="/dich-vu" className="hover:text-[#e3a638] transition-colors">Dịch vụ sự kiện</Link></li>
            <li><Link href="/thuc-don" className="hover:text-[#e3a638] transition-colors">Thực đơn tham khảo</Link></li>
            <li><Link href="/khuyen-mai" className="hover:text-[#e3a638] transition-colors">Chương trình ưu đãi</Link></li>
            <li><Link href="/du-toan-chi-phi" className="hover:text-[#e3a638] transition-colors">Công cụ dự toán chi phí</Link></li>
          </ul>
        </div>

        {/* Newsletter / Contact form */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Nhận Tư Vấn</h4>
          <p className="text-sm font-light mb-4">Để lại số điện thoại để nhận tư vấn và báo giá chi tiết nhất từ chúng tôi.</p>
          <div className="flex">
            <input 
              type="tel" 
              placeholder="Số điện thoại của bạn" 
              className="bg-white/5 border border-white/10 px-4 py-2 w-full text-sm focus:outline-none focus:border-[#e3a638] transition-colors text-white"
            />
            <button className="bg-[#e3a638] text-black px-4 py-2 text-sm font-semibold hover:bg-[#a66a3a] transition-colors">
              GỬI
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-light">
        <p>© 2026 Golden Palace Nam Định. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-[#e3a638] transition-colors">Facebook</Link>
          <Link href="#" className="hover:text-[#e3a638] transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-[#e3a638] transition-colors">Zalo</Link>
        </div>
      </div>
    </footer>
  );
}
