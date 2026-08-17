import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf9f2] text-gray-900 font-montserrat selection:bg-[#e3a638] selection:text-white pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-[#fcf9f2] z-10"></div>
          <div className="w-full h-full bg-[url('/images/hero-banner.jpg')] bg-cover bg-center" />
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
            <Link href="/khong-gian/tang-2" className="px-8 py-4 border border-[#e3a638] text-[#e3a638] font-semibold rounded-none hover:bg-[#e3a638]/10 transition-all uppercase tracking-wider font-montserrat text-sm bg-black/40 backdrop-blur-md">
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
            <h4 className="text-2xl font-playfair text-[#a66a3a] mb-4">Đẳng Cấp Không Gian</h4>
            <p className="text-gray-600 font-montserrat text-sm font-light leading-relaxed">
              Hệ thống hội trường trần cao 7m hoàn toàn không cột chắn, trang bị công nghệ màn hình LED sắc nét & âm thanh biểu diễn tiêu chuẩn.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#e3a638]/10 group-hover:bg-[#e3a638]/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#a66a3a]">restaurant</span>
            </div>
            <h4 className="text-2xl font-playfair text-[#a66a3a] mb-4">Ẩm Thực Tinh Hoa</h4>
            <p className="text-gray-600 font-montserrat text-sm font-light leading-relaxed">
              18 Set Menu đa dạng được chế biến chỉn chu từ nguồn nguyên liệu tươi ngon, kết hợp nét ẩm thực truyền thống và hiện đại.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#a66a3a] font-montserrat uppercase tracking-[0.2em] text-sm mb-2 font-semibold">Dịch vụ</h3>
          <h2 className="text-4xl md:text-5xl font-playfair text-gray-900">Dấu ấn đẳng cấp</h2>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Tiệc Cưới',
              desc: 'Không gian lãng mạn, hệ thống âm thanh ánh sáng hiện đại, lưu giữ khoảnh khắc thiêng liêng.',
              image: '/images/hd-venues/tang-3-hd-1.jpg',
              link: '/dich-vu/tiec-cuoi'
            },
            {
              title: 'Tổ Chức Sự Kiện',
              desc: 'Trang thiết bị màn hình LED 30m² tiêu chuẩn, hội trường quy mô lớn, nâng tầm đẳng cấp doanh nghiệp.',
              image: '/images/hd-venues/tang-2-hd-1.jpg',
              link: '/dich-vu/to-chuc-su-kien'
            },
            {
              title: 'Tiệc Sinh Nhật & Kỷ Niệm',
              desc: 'Không gian ấm cúng tại Quầy Bar hoặc Phòng VIP, decor theo chủ đề trọn vẹn niềm vui.',
              image: '/images/hd-venues/quay-bar-hd-1.jpg',
              link: '/dich-vu/sinh-nhat-ky-niem'
            },
            {
              title: 'Phòng Ăn Riêng',
              desc: 'Không gian phòng VIP riêng tư đẳng cấp, thực đơn tinh hoa dành cho đối tác & gia đình.',
              image: '/images/hd-venues/phong-vip-hd-1.jpg',
              link: '/dich-vu/phong-an-rieng'
            }
          ].map((service, idx) => (
            <Link href={service.link} key={idx} className="group relative h-[420px] overflow-hidden rounded-lg cursor-pointer shadow-xl border border-[#e3a638]/20">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-108 transition-transform duration-700"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform group-hover:-translate-y-1 transition-transform duration-500">
                <h4 className="text-2xl mb-2 text-[#e3a638] font-playfair font-semibold">{service.title}</h4>
                <p className="text-gray-200 font-montserrat text-xs font-light leading-relaxed mb-4 line-clamp-3">{service.desc}</p>
                <span className="inline-block border-b border-[#e3a638] text-white text-xs uppercase font-montserrat pb-1 tracking-widest font-medium group-hover:text-[#e3a638] transition-colors">
                  Xem chi tiết
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalization Suite Feature Showcase Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 border-t border-b border-[#e3a638]/20 bg-[#faf6f0]/50 rounded-2xl my-12">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#e3a638]/10 border border-[#e3a638]/30 text-[#a66a3a] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Đặc Quyền Dành Cho Cặp Đôi
          </span>
          <h2 className="text-3xl md:text-5xl font-playfair text-gray-900 mb-4">Cá Nhân Hóa Trải Nghiệm Tiệc Cưới</h2>
          <p className="text-gray-600 font-montserrat text-sm max-w-2xl mx-auto font-light leading-relaxed">
            Thiết kế thiệp điện tử nền sáng sang trọng, xem trước tên cô dâu chú rể trên màn LED sân khấu P3 và tự do chọn kịch bản nhạc tiệc theo từng giai đoạn.
          </p>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Thiệp Cưới Online */}
          <div className="bg-white p-8 rounded-2xl border border-amber-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#a66a3a] mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-3">Thiệp Cưới Điện Tử Online</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                6 mẫu thiệp nền sáng tinh tế, chữ thư pháp lãng mạn bay bổng, thông tin gia đình 2 họ chỉn chu, gửi link Zalo/FB mượt mà.
              </p>
            </div>
            <Link href="/ca-nhan-hoa?tab=invitation" className="inline-flex items-center gap-2 text-xs font-bold text-[#a66a3a] uppercase tracking-wider group-hover:text-amber-600">
              Tạo Thiệp Cưới Ngay <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 2: Customize Phông LED */}
          <div className="bg-white p-8 rounded-2xl border border-amber-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#a66a3a] mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">tune</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-3">Phông Màn LED Sân Khấu</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                Trực quan hóa tên Cô Dâu & Chú Rể trên màn hình LED P3 Full HD tại các sảnh tiệc Tầng 1, 2, 3, 4 theo chuẩn nhận diện Golden Palace.
              </p>
            </div>
            <Link href="/ca-nhan-hoa?tab=led" className="inline-flex items-center gap-2 text-xs font-bold text-[#a66a3a] uppercase tracking-wider group-hover:text-amber-600">
              Customize Phông LED <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 3: Album Nhạc Tiệc Cưới */}
          <div className="bg-white p-8 rounded-2xl border border-amber-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#a66a3a] mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">library_music</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-3">Kịch Bản Nhạc Tiệc Cưới</h3>
              <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                Lắng nghe thử và lên danh sách ca khúc yêu thích cho 4 giai đoạn tiệc (Đón khách, Vào lễ, Rót rượu & Khai tiệc) gửi Đội Kỹ Thuật.
              </p>
            </div>
            <Link href="/ca-nhan-hoa?tab=music" className="inline-flex items-center gap-2 text-xs font-bold text-[#a66a3a] uppercase tracking-wider group-hover:text-amber-600">
              Chọn Nhạc Tiệc Cưới <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
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

            <div className="relative z-20 flex flex-col gap-4">
              <Link href="/du-toan-chi-phi" className="px-8 py-4 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold rounded-none hover:shadow-xl transition-all uppercase tracking-wider font-montserrat text-sm text-center">
                Dự toán chi phí ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
