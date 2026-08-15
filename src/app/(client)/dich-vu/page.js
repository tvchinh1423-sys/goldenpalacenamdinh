import Link from 'next/link';

export default function DichVuPage() {
  const services = [
    {
      title: 'Tiệc Cưới',
      subTitle: 'Nơi Khởi Đầu Hạnh Phúc Trọn Vẹn',
      desc: 'Không gian lãng mạn, hệ thống âm thanh ánh sáng hiện đại, lưu giữ khoảnh khắc thiêng liêng.',
      image: '/images/venues/tang-2-4.jpg',
      link: '/dich-vu/tiec-cuoi'
    },
    {
      title: 'Tổ Chức Sự Kiện',
      subTitle: 'Nâng Tầm Đẳng Cấp & Vị Thế Thương Hiệu',
      desc: 'Trang thiết bị màn hình LED 30m² tiêu chuẩn, hội trường quy mô lớn, nâng tầm đẳng cấp doanh nghiệp.',
      image: '/images/venues/tang-3-2.jpg',
      link: '/dich-vu/to-chuc-su-kien'
    },
    {
      title: 'Tiệc Sinh Nhật & Kỷ Niệm',
      subTitle: 'Trọn Vẹn Niềm Vui & Khoảnh Khắc Ấm Cúng',
      desc: 'Không gian ấm cúng tại Quầy Bar Tầng 1 hoặc Phòng VIP, decor theo chủ đề trọn vẹn niềm vui.',
      image: '/images/venues/quay-bar-2.jpg',
      link: '/dich-vu/sinh-nhat-ky-niem'
    },
    {
      title: 'Phòng Ăn Riêng',
      subTitle: 'Không Gian Sang Trọng & Riêng Tư Tuyệt Đối',
      desc: 'Không gian phòng VIP riêng tư đẳng cấp, thực đơn tinh hoa dành cho đối tác & gia đình.',
      image: '/images/venues/phong-vip-2.jpg',
      link: '/dich-vu/phong-an-rieng'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f2] font-montserrat text-gray-900 pt-28 pb-28">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <span className="text-[#a66a3a] uppercase tracking-[0.2em] text-xs font-semibold">Dịch vụ cao cấp</span>
        <h1 className="text-4xl sm:text-5xl font-playfair font-semibold text-gray-900 mt-2 mb-4">
          Dịch Vụ Tại Golden Palace
        </h1>
        <p className="text-gray-600 font-light max-w-2xl mx-auto text-sm sm:text-base">
          Giải pháp trọn gói sang trọng cho mọi sự kiện quan trọng của gia đình và doanh nghiệp.
        </p>
        <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-6" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s, idx) => (
          <Link href={s.link} key={idx} className="group relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-[#e3a638]/20 flex flex-col justify-end p-8">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-108 transition-transform duration-700"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            <div className="relative z-20">
              <span className="text-[#e3a638] text-xs uppercase tracking-widest font-semibold block mb-1">{s.subTitle}</span>
              <h2 className="text-3xl font-playfair text-white mb-3">{s.title}</h2>
              <p className="text-gray-200 text-sm font-light leading-relaxed mb-6 line-clamp-2">{s.desc}</p>
              <span className="inline-flex items-center gap-2 text-white text-xs uppercase tracking-wider font-semibold group-hover:text-[#e3a638] transition-colors">
                Khám phá dịch vụ
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
