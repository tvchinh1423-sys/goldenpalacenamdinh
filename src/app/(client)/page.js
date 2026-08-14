import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf9f2] text-gray-900 font-montserrat selection:bg-[#e3a638] selection:text-white pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fcf9f2] z-10"></div>
          {/* Mockup image placeholder (in real life this is a high-res venue photo or video) */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-10">
          <h2 className="text-[#e3a638] text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-montserrat font-medium drop-shadow-md">
            Trung tâm tổ chức Sự kiện, Tiệc cưới & Nhà hàng
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold mb-6 leading-tight drop-shadow-2xl font-playfair text-white max-w-5xl">
            Golden Palace<br/>
            <span className="font-slogan font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#e3a638] mt-4 block whitespace-nowrap">
              Nơi khởi đầu hạnh phúc trọn vẹn
            </span>
          </h1>
          <p className="text-gray-100 mb-10 text-lg md:text-xl font-montserrat font-light max-w-2xl drop-shadow-md">
            Tọa lạc tại 98 Đông A, KĐT Hòa Vượng, TP Nam Định, Golden Palace mang đến trải nghiệm không gian sang trọng, dịch vụ chuyên nghiệp và ẩm thực tinh hoa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/du-toan-chi-phi" className="px-8 py-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold rounded-none hover:shadow-[0_0_20px_rgba(227,166,56,0.4)] transition-all uppercase tracking-wider font-montserrat text-sm">
              Dự toán chi phí sự kiện
            </Link>
            <Link href="/he-thong" className="px-8 py-4 border border-[#e3a638] text-[#e3a638] font-semibold rounded-none hover:bg-[#e3a638]/10 transition-all uppercase tracking-wider font-montserrat text-sm bg-black/40 backdrop-blur-md">
              Khám phá không gian
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-[#e3a638]/20">
        <div className="text-center mb-16">
          <h3 className="text-[#a66a3a] font-montserrat uppercase tracking-[0.2em] text-sm mb-2 font-semibold">Giá trị cốt lõi</h3>
          <h2 className="text-4xl md:text-5xl font-playfair text-gray-900">Cam kết của chúng tôi</h2>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#e3a638]/10 group-hover:bg-[#e3a638]/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#a66a3a]">verified_user</span>
            </div>
            <h4 className="text-2xl font-playfair text-[#a66a3a] mb-4">Sự An Tâm</h4>
            <p className="text-gray-600 font-montserrat text-sm font-light leading-relaxed">
              Kiểm soát rủi ro vận hành ở mức bằng không. Mọi quy trình đều được giám sát nghiêm ngặt để đảm bảo sự chỉn chu tối đa cho gia chủ.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#e3a638]/10 group-hover:bg-[#e3a638]/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#a66a3a]">diamond</span>
            </div>
            <h4 className="text-2xl font-playfair text-[#a66a3a] mb-4">Sự Chỉn Chu & Thể Diện</h4>
            <p className="text-gray-600 font-montserrat text-sm font-light leading-relaxed">
              Thể diện của khách hàng là danh dự của Golden Palace. Chúng tôi luôn duy trì tiêu chuẩn ẩm thực truyền thống cao cấp.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#e3a638]/10 group-hover:bg-[#e3a638]/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#a66a3a]">handshake</span>
            </div>
            <h4 className="text-2xl font-playfair text-[#a66a3a] mb-4">Minh Bạch Giá Trị Thực</h4>
            <p className="text-gray-600 font-montserrat text-sm font-light leading-relaxed">
              Tuyệt đối nói không với chiêu trò ép sale, chi phí ẩn. Tư vấn chân thành, đóng gói Combo rõ ràng phù hợp mức thu nhập địa phương.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-[#a66a3a] font-montserrat uppercase tracking-[0.2em] text-sm mb-2 font-semibold">Dịch vụ</h3>
          <h2 className="text-4xl md:text-5xl font-playfair text-gray-900">Dấu ấn khó phai</h2>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Tiệc Cưới',
              desc: 'Không gian lãng mạn, hệ thống âm thanh ánh sáng hiện đại, lưu giữ khoảnh khắc thiêng liêng.',
              image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop',
              link: '/dich-vu/tiec-cuoi'
            },
            {
              title: 'Sự Kiện Công Ty',
              desc: 'Trang thiết bị màn hình LED 30m2 tiêu chuẩn, hội trường quy mô lớn, nâng tầm đẳng cấp doanh nghiệp.',
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
              link: '/dich-vu/su-kien'
            },
            {
              title: 'Tiệc Sinh Nhật & Kỷ Niệm',
              desc: 'Không gian ấm cúng tại Phòng VIP hoặc Quầy Bar, decor theo chủ đề trọn vẹn niềm vui.',
              image: 'https://images.unsplash.com/photo-1530103862676-de3c9de59f9e?w=800&auto=format&fit=crop',
              link: '/dich-vu/sinh-nhat'
            }
          ].map((service, idx) => (
            <Link href={service.link} key={idx} className="group relative h-[450px] overflow-hidden rounded-sm cursor-pointer shadow-lg">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform group-hover:-translate-y-2 transition-transform duration-500">
                <h4 className="text-2xl mb-3 text-[#e3a638] font-playfair">{service.title}</h4>
                <p className="text-gray-200 font-montserrat text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto mb-4">{service.desc}</p>
                <span className="inline-block border-b border-[#e3a638] text-white text-xs uppercase font-montserrat pb-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Xem chi tiết
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-white border border-[#e3a638]/20 p-10 md:p-16 rounded-lg flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e3a638]/10 rounded-full blur-3xl"></div>
            
            <div className="flex-1 relative z-20">
              <h3 className="text-3xl font-semibold mb-4 text-[#a66a3a] font-playfair">Bạn đang lên kế hoạch cho sự kiện?</h3>
              <p className="text-gray-600 font-montserrat font-light mb-6 max-w-xl">
                Trải nghiệm công cụ Dự toán chi phí độc quyền của Golden Palace. Khám phá không gian, so sánh ngân sách và nhận báo giá tham khảo chỉ trong 3 phút.
              </p>
              <ul className="space-y-3 font-montserrat text-sm text-gray-700 font-light mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#e3a638] rounded-full"></span>
                  Minh bạch toàn bộ chi phí mâm cỗ & hội trường
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#e3a638] rounded-full"></span>
                  So sánh trực quan 18 Set menu cao cấp
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#e3a638] rounded-full"></span>
                  Liên hệ Hotline <strong className="text-[#a66a3a] ml-1">0228 659 5959</strong>
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-auto relative z-20">
              <Link href="/du-toan-chi-phi" className="block w-full text-center px-10 py-5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold hover:shadow-lg transition-all uppercase tracking-wider font-montserrat text-sm rounded-sm">
                Dự toán chi phí ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
