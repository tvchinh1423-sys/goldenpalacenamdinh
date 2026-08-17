import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

const SLUG_MAP = {
  'tang-2': 'Hội trường Tầng 2',
  'tang-3': 'Hội trường Tầng 3',
  'tang-4': 'Hội trường Tầng 4',
  'quay-bar': 'Quầy Bar Tầng 1',
  'phong-vip': 'Phòng VIP'
};

const makeHdList = (prefix, count = 12) => {
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push(`/images/hd-venues/${prefix}-hd-${i}.jpg`);
  }
  return list;
};

const DEFAULT_VENUES_DATA = {
  'tang-2': {
    name: 'Hội trường Tầng 2',
    subTitle: 'Đại Cung Điện Hoàng Gia Sang Trọng',
    capacity: '350 - 750 khách (Từ 35 - 75 mâm)',
    description: 'Hội trường Tầng 2 là sảnh tiệc đại tràng sang trọng bậc nhất tại Nam Định với kiến trúc trần cao 7m hoàn toàn không có cột chắn tầm nhìn. Được trang bị màn hình LED P2.5 30m² sắc nét cùng giàn đèn bướm nghệ thuật rực rỡ, Tầng 2 là sự lựa chọn hoàn hảo cho những đại lễ tiệc cưới hoàng gia và sự kiện quy mô hoành tráng.',
    features: [
      'Diện tích rộng rãi, thiết kế hoàn toàn không cột chắn tầm nhìn',
      'Màn hình LED P2.5 siêu nét tiêu chuẩn 30m²',
      'Hệ thống giàn đèn bướm & đèn chùm pha lê cao cấp',
      'Sân khấu đa tầng & đường dẫn hoa lụa lãng mạn',
      'Phông chụp ảnh lưu niệm & Cổng hoa chào đón độc quyền'
    ],
    heroImage: '/images/hd-venues/tang-2-hd-1.jpg',
    gallery: makeHdList('tang-2', 12)
  },
  'tang-3': {
    name: 'Hội trường Tầng 3',
    subTitle: 'Không Gian Tiệc Cưới Hoàng Gia Ấm Cúng',
    capacity: '300 - 650 khách (Từ 30 - 65 mâm)',
    description: 'Hội trường Tầng 3 sở hữu lối thiết kế tân cổ điển tinh tế với tông màu Rose Gold & Champagne ấm áp. Tầng 3 được trang bị màn hình LED 30m², hệ thống âm thanh ánh sáng biểu diễn chuyên nghiệp và trang trí đường dẫn hoa lụa lãng mạn, mang đến bầu không khí thiêng liêng tuyệt vời cho ngày trọng đại.',
    features: [
      'Thiết kế không cột thoáng đãng, sang trọng',
      'Màn hình LED 30m² tiêu chuẩn hiển thị sắc nét',
      'Giàn đèn bướm nghệ thuật & đèn đường dẫn tự động',
      'Phông 2 bên sân khấu & Phông chụp ảnh lưu niệm cao cấp',
      'Khu vực đón khách & Bàn gallery trang trí chỉn chu'
    ],
    heroImage: '/images/hd-venues/tang-3-hd-1.jpg',
    gallery: makeHdList('tang-3', 12)
  },
  'tang-4': {
    name: 'Hội trường Tầng 4',
    subTitle: 'Không Gian Tiệc Ấm Cúng & Tinh Tế',
    capacity: '100 - 300 khách (Từ 10 - 30 mâm)',
    description: 'Hội trường Tầng 4 là lựa chọn lý tưởng cho các buổi tiệc cưới ấm cúng, tiệc báo hỷ hoặc hội nghị doanh nghiệp vừa và nhỏ. Không gian được trang bị màn hình LED 10m², hệ thống âm thanh ánh sáng chuẩn cùng hoa lụa trang trí sân khấu vô cùng tinh tế.',
    features: [
      'Không gian ấm cúng, riêng tư cho tiệc quy mô vừa và nhỏ',
      'Màn hình LED 10m² hiện đại',
      'Trang bị hệ thống âm thanh & ánh sáng biểu diễn chuyên nghiệp',
      'Cổng chào đón & Bàn trang trí tiền mừng chỉn chu',
      'Hoa lụa 2 bên sân khấu & Phông lưu niệm lãng mạn'
    ],
    heroImage: '/images/hd-venues/tang-4-hd-7.jpg',
    gallery: makeHdList('tang-4', 12)
  },
  'quay-bar': {
    name: 'Quầy Bar Tầng 1',
    subTitle: 'Không Gian Sành Điệu & Hiện Đại',
    capacity: '50 - 100 khách',
    description: 'Quầy Bar Tầng 1 mang phong cách kiến trúc hiện đại, trẻ trung với hệ thống đèn trang trí và quầy pha chế sang trọng. Đây là địa điểm lý tưởng cho các buổi tiệc sinh nhật, tiệc kỷ niệm, tiệc cocktail hoặc các buổi gặp mặt giao lưu thân mật.',
    features: [
      'Phong cách kiến trúc hiện đại, quầy pha chế sang trọng',
      'Không gian kết nối mở thoáng đãng',
      'Hệ thống âm thanh Lounge & ánh sáng ấm áp',
      'Thích hợp cho tiệc sinh nhật, tiệc cocktail & kỷ niệm'
    ],
    heroImage: '/images/hd-venues/quay-bar-hd-7.jpg',
    gallery: ['/images/hd-venues/quay-bar-hd-7.jpg', '/images/hd-venues/quay-bar-hd-8.jpg', ...makeHdList('quay-bar', 10)]
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
    heroImage: '/images/hd-venues/phong-vip-hd-1.jpg',
    gallery: makeHdList('phong-vip', 12)
  }
};

export default async function KhongGianPage({ params }) {
  const { slug } = await params;
  const staticData = DEFAULT_VENUES_DATA[slug];

  if (!staticData) {
    notFound();
  }

  // Fetch dynamic venue data from Prisma DB to reflect Admin sorting & Drive photos
  let dbImages = [];
  let dbCapacity = staticData.capacity;
  let dbDescription = staticData.description;

  try {
    const searchName = SLUG_MAP[slug];
    if (searchName) {
      const venueRecord = await prisma.venue.findFirst({
        where: {
          name: { contains: searchName, mode: 'insensitive' }
        }
      });

      if (venueRecord) {
        if (venueRecord.description) dbDescription = venueRecord.description;
        if (venueRecord.maxGuests) dbCapacity = `${venueRecord.minGuests || 10} - ${venueRecord.maxGuests} khách`;
        try {
          const parsed = JSON.parse(venueRecord.images || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbImages = parsed;
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Error fetching venue from database:', err);
  }

  const gallery = (dbImages && dbImages.length > 0) ? dbImages : staticData.gallery;
  const heroImage = (gallery && gallery.length > 0) ? gallery[0] : staticData.heroImage;

  return (
    <div className="min-h-screen bg-[#fcf9f2] font-montserrat text-gray-900 pt-20 pb-28">
      {/* Hero Banner */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#fcf9f2] z-10" />
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="px-4 py-1.5 bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] rounded-full text-xs uppercase tracking-widest font-semibold mb-4 backdrop-blur-md">
            Khám phá không gian thực tế
          </span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-semibold text-white mb-3 drop-shadow-lg">
            {staticData.name}
          </h1>
          <p className="text-amber-200 text-lg sm:text-xl font-light font-playfair tracking-wide mb-6">
            {staticData.subTitle}
          </p>
          <div className="flex items-center gap-2 bg-black/70 text-[#fcf9f2] px-6 py-2.5 rounded-full border border-white/30 text-sm backdrop-blur-md shadow-xl font-medium">
            <span className="material-symbols-outlined text-[#e3a638] text-xl">groups</span>
            <span>Sức chứa: <strong className="text-[#e3a638] font-semibold">{dbCapacity}</strong></span>
          </div>
        </div>
      </section>

      {/* Overview & Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-playfair text-[#a66a3a] mb-6 font-semibold">Giới thiệu không gian</h2>
            <p className="text-gray-700 font-light text-base leading-relaxed mb-8">
              {dbDescription}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs text-[#a66a3a]">
              Trang thiết bị & Tiện ích nổi bật:
            </h3>
            <ul className="space-y-3">
              {staticData.features.map((feat, idx) => (
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
              Tự do chọn sảnh tiệc, phối hợp thực đơn và nhận báo giá tự động trong 3 phút tại công cụ Dự toán độc quyền.
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

      {/* Gallery showing Admin-ordered images */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#e3a638]/20">
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-[#e3a638]/10 text-[#a66a3a] text-[11px] font-semibold uppercase tracking-widest rounded-full">
            Bộ sưu tập nhiếp ảnh chất lượng cao ({gallery.length} ảnh)
          </span>
          <h2 className="text-3xl sm:text-4xl font-playfair text-gray-900 mt-3 mb-2">Thư Viện Ảnh Thực Tế {staticData.name}</h2>
          <p className="text-gray-500 text-xs font-light">Hình ảnh thực tế sắp xếp theo trang quản trị Admin</p>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((imgUrl, gIdx) => (
            <div key={gIdx} className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-[#e3a638]/20 cursor-pointer">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url('${imgUrl}')` }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Vị trí #{gIdx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
