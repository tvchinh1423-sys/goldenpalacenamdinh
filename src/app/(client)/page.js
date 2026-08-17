import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let venues = [];
  try {
    venues = await prisma.venue.findMany();
  } catch (e) {
    console.error('Error fetching venues on homepage:', e);
  }

  const getVenueImage = (searchName, fallback) => {
    const v = venues.find(item => item.name.toLowerCase().includes(searchName.toLowerCase()));
    if (v && v.images) {
      try {
        const parsed = JSON.parse(v.images);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
          return parsed[0];
        }
      } catch (err) {}
    }
    return fallback;
  };

  const services = [
    {
      title: 'Tiệc Cưới',
      desc: 'Không gian lãng mạn, hệ thống âm thanh ánh sáng hiện đại, lưu giữ khoảnh khắc thiêng liêng.',
      image: getVenueImage('Tầng 3', '/images/hd-venues/tang-3-hd-1.jpg'),
      link: '/dich-vu/tiec-cuoi'
    },
    {
      title: 'Tổ Chức Sự Kiện',
      desc: 'Trang thiết bị màn hình LED 30m² tiêu chuẩn, hội trường quy mô lớn, nâng tầm đẳng cấp doanh nghiệp.',
      image: getVenueImage('Tầng 2', '/images/hd-venues/tang-2-hd-1.jpg'),
      link: '/dich-vu/to-chuc-su-kien'
    },
    {
      title: 'Tiệc Sinh Nhật & Kỷ Niệm',
      desc: 'Không gian ấm cúng tại Quầy Bar hoặc Phòng VIP, decor theo chủ đề trọn vẹn niềm vui.',
      image: getVenueImage('Bar', '/images/hd-venues/quay-bar-hd-7.jpg'),
      link: '/dich-vu/sinh-nhat-ky-niem'
    },
    {
      title: 'Phòng Ăn Riêng',
      desc: 'Không gian phòng VIP riêng tư đẳng cấp, thực đơn tinh hoa dành cho đối tác & gia đình.',
      image: getVenueImage('VIP', '/images/hd-venues/phong-vip-hd-1.jpg'),
      link: '/dich-vu/phong-an-rieng'
    }
  ];

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

      {/* Personalization Highlight Section (Cá Nhân Hóa Tiệc Cưới) */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1c1917] to-[#2a2419] text-white relative overflow-hidden border-y border-[#e3a638]/30">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#e3a638] uppercase tracking-[0.3em] text-xs font-bold block mb-2 font-montserrat">
              Đặc quyền riêng cho dâu rể
            </span>
            <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-4">
              Cá Nhân Hóa Tiệc Cưới Miễn Phí
            </h2>
            <p className="text-gray-300 font-light text-sm max-w-2xl mx-auto">
              Chỉ có tại Golden Palace — Bộ công cụ công nghệ độc quyền hỗ trợ hai bạn tự tạo dấu ấn riêng cho ngày trọng đại
            </p>
            <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Thiệp Cưới Online */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#e3a638]/60 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-3">Thiệp Cưới Online</h3>
                <p className="text-gray-300 text-xs font-light leading-relaxed mb-6">
                  Tự thiết kế thiệp cưới điện tử sang trọng với ảnh cưới HD, bản đồ chỉ đường & form xác nhận tham dự (RSVP) gửi trực tiếp tới bạn bè qua Zalo, Messenger.
                </p>
              </div>
              <Link href="/ca-nhan-hoa" className="inline-flex items-center gap-2 text-[#e3a638] text-xs font-bold uppercase tracking-wider group-hover:underline">
                <span>Tạo thiệp cưới miễn phí</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 2: Phông LED Sân Khấu */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#e3a638]/60 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">desktop_windows</span>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-3">Phông LED Sân Khấu</h3>
                <p className="text-gray-300 text-xs font-light leading-relaxed mb-6">
                  Tùy chỉnh phông nền LED sân khấu với tên chú rể - cô dâu, ngày cưới, chọn hiệu ứng hoàng gia và tải file 4K phát trực tiếp lên màn hình LED 30m².
                </p>
              </div>
              <Link href="/ca-nhan-hoa?tab=led" className="inline-flex items-center gap-2 text-[#e3a638] text-xs font-bold uppercase tracking-wider group-hover:underline">
                <span>Thiết kế phông LED</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 3: Kịch Bản Âm Nhạc */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#e3a638]/60 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">library_music</span>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-3">Kịch Bản Âm Nhạc</h3>
                <p className="text-gray-300 text-xs font-light leading-relaxed mb-6">
                  Tự làm đạo diễn âm nhạc cho tiệc cưới của mình. Lựa chọn danh sách bản nhạc yêu thích cho 4 thời điểm: Đón khách, Lễ cưới, Tiệc chính và Tiễn khách.
                </p>
              </div>
              <Link href="/ca-nhan-hoa?tab=music" className="inline-flex items-center gap-2 text-[#e3a638] text-xs font-bold uppercase tracking-wider group-hover:underline">
                <span>Chọn kịch bản nhạc</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

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
          {services.map((service, idx) => (
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

    </div>
  );
}
