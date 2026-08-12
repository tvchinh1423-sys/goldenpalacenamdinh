import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-playfair selection:bg-[#d4af37] selection:text-black pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a] z-10"></div>
          {/* Mockup image placeholder (in real life this is a high-res venue photo or video) */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-[#d4af37] text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-inter">Trung tâm tổ chức Sự kiện & Tiệc cưới</h2>
          <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight drop-shadow-2xl">
            Khai mở không gian<br/>
            <span className="italic font-light">Đẳng cấp hoàng gia</span>
          </h1>
          <p className="text-gray-300 mb-10 text-lg md:text-xl font-inter font-light max-w-2xl">
            Tọa lạc tại trung tâm Nam Định, Golden Palace mang đến trải nghiệm không gian sang trọng, dịch vụ chuyên nghiệp và ẩm thực tinh hoa cho mọi sự kiện của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/du-toan-chi-phi" className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#aa8022] text-black font-semibold rounded-none hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all uppercase tracking-wider font-inter text-sm">
              Dự toán chi phí sự kiện
            </Link>
            <Link href="/he-thong" className="px-8 py-4 border border-[#d4af37] text-[#d4af37] font-semibold rounded-none hover:bg-[#d4af37]/10 transition-all uppercase tracking-wider font-inter text-sm bg-black/40 backdrop-blur-md">
              Khám phá không gian
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-[#d4af37] font-inter uppercase tracking-[0.2em] text-sm mb-2">Dịch vụ</h3>
          <h2 className="text-4xl md:text-5xl">Dấu ấn khó phai</h2>
          <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Tiệc Cưới',
              desc: 'Không gian lãng mạn, kịch bản độc quyền, lưu giữ khoảnh khắc thiêng liêng nhất.',
              image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
              link: '/dich-vu/tiec-cuoi'
            },
            {
              title: 'Sự Kiện Công Ty',
              desc: 'Trang thiết bị hiện đại, hội trường quy mô lớn, nâng tầm đẳng cấp doanh nghiệp.',
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
              link: '/dich-vu/su-kien'
            },
            {
              title: 'Tiệc Sinh Nhật & Kỷ Niệm',
              desc: 'Decor theo chủ đề riêng, không gian ấm cúng, trọn vẹn niềm vui.',
              image: 'https://images.unsplash.com/photo-1530103862676-de3c9de59f9e?w=800&auto=format&fit=crop',
              link: '/dich-vu/sinh-nhat'
            }
          ].map((service, idx) => (
            <Link href={service.link} key={idx} className="group relative h-[450px] overflow-hidden rounded-sm cursor-pointer">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform group-hover:-translate-y-2 transition-transform duration-500">
                <h4 className="text-2xl mb-3 text-[#d4af37]">{service.title}</h4>
                <p className="text-gray-300 font-inter text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto mb-4">{service.desc}</p>
                <span className="inline-block border-b border-[#d4af37] text-white text-xs uppercase font-inter pb-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Xem chi tiết
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#d4af37]/5 z-0"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-[#111] border border-[#d4af37]/20 p-10 md:p-16 rounded-sm flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-semibold mb-4 text-white">Bạn đang lên kế hoạch cho sự kiện?</h3>
              <p className="text-gray-400 font-inter font-light mb-6 max-w-xl">
                Trải nghiệm công cụ Dự toán chi phí độc quyền của Golden Palace. Khám phá không gian, so sánh ngân sách và nhận báo giá tham khảo chỉ trong 3 phút.
              </p>
              <ul className="space-y-3 font-inter text-sm text-gray-300 font-light mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                  Minh bạch toàn bộ chi phí mâm cỗ & hội trường
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                  So sánh trực quan các phương án
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                  Bảo mật thông tin tuyệt đối
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-auto">
              <Link href="/du-toan-chi-phi" className="block w-full text-center px-10 py-5 bg-[#d4af37] text-black font-semibold hover:bg-white transition-colors uppercase tracking-wider font-inter text-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                Dự toán chi phí ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
