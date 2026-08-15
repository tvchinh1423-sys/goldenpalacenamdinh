import Link from 'next/link';
import { notFound } from 'next/navigation';

const VENUES_DATA = {
  'tang-2': {
    name: 'Hội trường Tầng 2',
    subTitle: 'Đại Cung Điện Hoàng Gia',
    capacity: '350 - 750 khách (Từ 35 - 75 mâm)',
    description: 'Hội trường Tầng 2 là sảnh tiệc đại tràng sang trọng bậc nhất tại Nam Định với kiến trúc trần cao 7m hoàn toàn không có cột chắn tầm nhìn. Được trang bị màn hình LED P2.5 30m² sắc nét cùng giàn đèn bướm nghệ thuật rực rỡ, Tầng 2 là sự lựa chọn hoàn hảo cho những đại lễ tiệc cưới hoàng gia và sự kiện quy mô hoành tráng.',
    features: [
      'Diện tích rộng rãi, không cột chắn tầm nhìn',
      'Màn hình LED P2.5 tiêu chuẩn 30m²',
      'Hệ thống giàn đèn bướm & đèn chùm pha lê cao cấp',
      'Sân khấu đa tầng & đường dẫn hoa lụa lãng mạn',
      'Phông chụp ảnh lưu niệm & Cổng hoa chào đón độc quyền'
    ],
    heroImage: '/images/venues/tang-2-3.jpg',
    gallery: [
      '/images/venues/tang-2-3.jpg',
      '/images/venues/tang-2-4.jpg',
      '/images/venues/tang-2-5.jpg',
      '/images/pricing/slide-tang2.png'
    ]
  },
  'tang-3': {
    name: 'Hội trường Tầng 3',
    subTitle: 'Không Gian Tiệc Cưới Hoàng Gia',
    capacity: '300 - 650 khách (Từ 30 - 65 mâm)',
    description: 'Hội trường Tầng 3 sở hữu lối thiết kế tân cổ điển tinh tế với tông màu Rose Gold & Champagne ấm áp. Tầng 3 được trang bị màn hình LED 30m², hệ thống âm thanh ánh sáng biểu diễn chuyên nghiệp và trang trí đường dẫn hoa lụa lãng mạn, mang đến bầu không khí thiêng liêng tuyệt vời cho ngày trọng đại.',
    features: [
      'Thiết kế không cột thoáng đãng, sang trọng',
      'Màn hình LED 30m² tiêu chuẩn hiển thị sắc nét',
      'Giàn đèn bướm nghệ thuật & đèn đường dẫn tự động',
      'Phông 2 bên sân khấu & Phông chụp ảnh lưu niệm cao cấp',
      'Khu vực đón khách & Bàn gallery trang trí chỉn chu'
    ],
    heroImage: '/images/venues/tang-3-2.jpg',
    gallery: [
      '/images/venues/tang-3-2.jpg',
      '/images/venues/tang-3-3.jpg',
      '/images/venues/tang-3-4.jpg',
      '/images/venues/tang-3-5.jpg'
    ]
  },
  'tang-4': {
    name: 'Hội trường Tầng 4',
    subTitle: 'Không Gian Tiệc Ấm Cúng & Tinh Tế',
    capacity: '100 - 300 khách (Từ 10 - 30 mâm)',
    description: 'Hội trường Tầng 4 là lựa chọn lý tưởng cho các buổi tiệc cưới ấm cúng, tiệc báo hỷ hoặc hội nghị doanh nghiệp vừa và nhỏ. Không gian được trang bị màn hình LED 10m², hệ thống âm thanh ánh sáng chuẩn cùng hoa lụa trang trí sân khấu vô cùng tinh tế.',
    features: [
      'Không gian ấm cúng, riêng tư cho tiệc dưới 300 khách',
      'Màn hình LED 10m² hiện đại',
      'Trang bị hệ thống âm thanh & ánh sáng biểu diễn chuyên nghiệp',
      'Cổng chào đón & Bàn trang trí tiền mừng chỉn chu',
      'Hoa lụa 2 bên sân khấu & Phông lưu niệm lãng mạn'
    ],
    heroImage: '/images/venues/tang-4-2.jpg',
    gallery: [
      '/images/venues/tang-4-2.jpg',
      '/images/venues/tang-4-3.jpg',
      '/images/venues/tang-4-4.jpg',
      '/images/venues/tang-4-5.jpg'
    ]
  },
  'quay-bar': {
    name: 'Quầy Bar Tầng 1',
    subTitle: 'Không Gian Hiện Đại & Hiện Đại',
    capacity: '50 - 100 khách',
    description: 'Quầy Bar Tầng 1 mang phong cách kiến trúc hiện đại, trẻ trung với hệ thống đèn trang trí và quầy pha chế sang trọng. Đây là địa điểm lý tưởng cho các buổi tiệc sinh nhật, tiệc kỷ niệm, tiệc cocktail hoặc các buổi gặp mặt giao lưu thân mật.',
    features: [
      'Phong cách hiện đại, quầy pha chế chuyên nghiệp',
      'Không gian kết nối mở sang trọng',
      'Hệ thống âm thanh Lounge & ánh sáng ấm áp',
      'Thích hợp cho tiệc sinh nhật, tiệc cocktail & kỷ niệm'
    ],
    heroImage: '/images/venues/quay-bar-1.jpg',
    gallery: [
      '/images/venues/quay-bar-1.jpg',
      '/images/venues/quay-bar-2.jpg',
      '/images/venues/quay-bar-3.jpg',
      '/images/venues/quay-bar-4.jpg'
    ]
  },
  'phong-vip': {
    name: 'Không Gian Phòng VIP',
    subTitle: 'Đẳng Cấp & Riêng Tư Tuyệt Đối',
    capacity: '10 - 50 khách',
    description: 'Không gian Phòng VIP tại Golden Palace được thiết kế độc bản với nội thất gỗ và mạ vàng sang trọng, mang lại sự riêng tư tối đa cho các buổi tiệc gia đình, tiệc đính hôn nhỏ hoặc tiếp đón đối tác kinh doanh cao cấp.',
    features: [
      'Không gian riêng tư biệt lập hoàn toàn',
      'Nội thất cao cấp, bàn tiệc hoàng gia',
      'Phục vụ riêng chuẩn 5 sao chu đáo',
      'Thích hợp tiệc gia đình, họp mặt & đối tác VIP'
    ],
    heroImage: '/images/venues/phong-vip-2.jpg',
    gallery: [
      '/images/venues/phong-vip-2.jpg',
      '/images/venues/phong-vip-3.jpg',
      '/images/venues/phong-vip-4.jpg',
      '/images/venues/phong-vip-5.jpg'
    ]
  }
};

export default async function KhongGianPage({ params }) {
  const { slug } = await params;
  const venue = VENUES_DATA[slug];

  if (!venue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] font-montserrat text-gray-900 pt-20 pb-28">
      {/* Hero Banner */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fcf9f2] z-10" />
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url('${venue.heroImage}')` }}
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="px-4 py-1.5 bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] rounded-full text-xs uppercase tracking-widest font-semibold mb-4 backdrop-blur-md">
            Khám phá không gian
          </span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-semibold text-white mb-3 drop-shadow-lg">
            {venue.name}
          </h1>
          <p className="text-amber-200 text-lg sm:text-xl font-light font-playfair tracking-wide mb-6">
            {venue.subTitle}
          </p>
          <div className="flex items-center gap-2 bg-black/60 text-[#fcf9f2] px-5 py-2 rounded-full border border-white/20 text-sm backdrop-blur-md">
            <span className="material-symbols-outlined text-[#e3a638] text-lg">groups</span>
            <span>Sức chứa: <strong>{venue.capacity}</strong></span>
          </div>
        </div>
      </section>

      {/* Overview & Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-playfair text-[#a66a3a] mb-6 font-semibold">Giới thiệu không gian</h2>
            <p className="text-gray-700 font-light text-base leading-relaxed mb-8">
              {venue.description}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs text-[#a66a3a]">
              Trang thiết bị & Tiện ích nổi bật:
            </h3>
            <ul className="space-y-3">
              {venue.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-light">
                  <span className="material-symbols-outlined text-[#e3a638] text-lg mt-0.5">check_circle</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-xl border border-[#e3a638]/20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e3a638]/10 text-[#a66a3a] mx-auto mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">calculate</span>
            </div>
            <h3 className="text-2xl font-playfair text-gray-900 mb-3">Dự toán chi phí sự kiện</h3>
            <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
              Tự do chọn sảnh tiệc, phối hợp thực đơn và nhận báo giá tự động trong 3 phút tại công cụ Dự toán.
            </p>
            <Link 
              href="/du-toan-chi-phi" 
              className="inline-block w-full py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold uppercase text-xs tracking-wider rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
              Tính dự toán cho sảnh này
            </Link>
          </div>
        </div>
      </section>

      {/* Real Photos Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-[#e3a638]/20">
        <div className="text-center mb-12">
          <h3 className="text-[#a66a3a] font-montserrat uppercase tracking-[0.2em] text-xs font-semibold mb-2">Thư viện ảnh thực tế</h3>
          <h2 className="text-3xl sm:text-4xl font-playfair text-gray-900">Hình ảnh {venue.name}</h2>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venue.gallery.map((imgUrl, gIdx) => (
            <div key={gIdx} className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-[#e3a638]/20">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-108 transition-transform duration-700"
                style={{ backgroundImage: `url('${imgUrl}')` }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
