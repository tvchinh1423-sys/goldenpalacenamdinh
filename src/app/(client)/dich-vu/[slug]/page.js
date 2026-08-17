import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

const SERVICE_VENUE_MAP = {
  'tiec-cuoi': 'Hội trường Tầng 3',
  'to-chuc-su-kien': 'Hội trường Tầng 2',
  'sinh-nhat-ky-niem': 'Quầy Bar Tầng 1',
  'phong-an-rieng': 'Phòng VIP'
};

const SERVICES_DATA = {
  'tiec-cuoi': {
    name: 'Dịch vụ Tiệc Cưới Trọn Gói',
    subTitle: 'Nơi Khởi Đầu Hạnh Phúc Trọn Vẹn',
    description: 'Golden Palace tự hào là trung tâm tiệc cưới hàng đầu tại Nam Định, nơi biến những giấc mơ ngày trọng đại thành hiện thực. Với các hội trường hoàng gia không cột chắn, hệ thống màn hình LED 30m² tiêu chuẩn cùng phong cách ẩm thực tinh hoa, chúng tôi mang đến một lễ cưới trọn vẹn niềm vui và dấu ấn đẳng cấp cho hai họ.',
    highlights: [
      'Hội trường trần cao 7m sang trọng, thiết kế hoàn toàn không cột chắn',
      'Màn hình LED P2.5 30m² sắc nét & hệ thống âm thanh ánh sáng biểu diễn',
      'Trang trí không gian lễ cưới lãng mạn (Cổng hoa, phông lưu niệm, đường dẫn)',
      'Thực đơn mâm cỗ 10 món truyền thống kết hợp hiện đại chỉn chu',
      'Đội ngũ phục vụ chuyên nghiệp, tận tâm đồng hành suốt buổi lễ'
    ],
    heroImage: '/images/hd-venues/tang-3-hd-1.jpg',
    gallery: [
      '/images/hd-venues/tang-3-hd-1.jpg',
      '/images/hd-venues/tang-3-hd-2.jpg',
      '/images/hd-venues/tang-3-hd-3.jpg',
      '/images/hd-venues/tang-3-hd-4.jpg',
      '/images/hd-venues/tang-3-hd-5.jpg',
      '/images/hd-venues/tang-3-hd-6.jpg',
      '/images/hd-venues/tang-3-hd-7.jpg',
      '/images/hd-venues/tang-3-hd-8.jpg'
    ]
  },
  'to-chuc-su-kien': {
    name: 'Tổ Chức Sự Kiện Doanh Nghiệp',
    subTitle: 'Nâng Tầm Đẳng Cấp & Vị Thế Thương Hiệu',
    description: 'Dành cho các hội nghị, hội thảo, lễ ra mắt sản phẩm, tiệc tất niên (Year-End Party) hay tiệc tri ân khách hàng của doanh nghiệp. Golden Palace đáp ứng trọn vẹn từ hệ thống thiết bị sự kiện chuyên nghiệp đến công tác hậu cần chỉn chu, giúp sự kiện thành công vang dội.',
    highlights: [
      'Hội trường quy mô linh hoạt từ 100 đến 800 khách mời',
      'Màn hình LED 30m² trình chiếu báo cáo & video sự kiện sắc nét',
      'Bố trí sơ đồ bàn tiệc hoặc ghế hội thảo đa dạng',
      'Thực đơn tiệc đứng (Buffet/Finger Food) hoặc tiệc bàn linh hoạt',
      'Hỗ trợ trọn gói âm thanh, ánh sáng, MC và kỹ thuật viên vận hành'
    ],
    heroImage: '/images/hd-venues/tang-2-hd-1.jpg',
    gallery: [
      '/images/hd-venues/tang-2-hd-1.jpg',
      '/images/hd-venues/tang-2-hd-2.jpg',
      '/images/hd-venues/tang-2-hd-3.jpg',
      '/images/hd-venues/tang-2-hd-4.jpg',
      '/images/hd-venues/tang-2-hd-5.jpg',
      '/images/hd-venues/tang-2-hd-6.jpg',
      '/images/hd-venues/tang-2-hd-7.jpg',
      '/images/hd-venues/tang-2-hd-8.jpg'
    ]
  },
  'sinh-nhat-ky-niem': {
    name: 'Tiệc Sinh Nhật & Kỷ Niệm',
    subTitle: 'Trọn Vẹn Niềm Vui & Khoảnh Khắc Ấm Cúng',
    description: 'Golden Palace mang đến không gian trang trí theo chủ đề cá nhân hóa độc đáo cho các buổi tiệc sinh nhật, tiệc thôi nôi, tiệc mừng thọ hay kỷ niệm ngày cưới. Dù tại Quầy Bar Tầng 1 sành điệu hay Phòng VIP riêng tư, mọi khoảnh khắc đều trở nên đáng nhớ.',
    highlights: [
      'Thiết kế gói trang trí Concept sinh nhật/kỷ niệm riêng biệt',
      'Không gian Quầy Bar Tầng 1 hoặc Phòng VIP ấm cúng',
      'Thực đơn tiệc tự chọn phong phú hợp gu mọi lứa tuổi',
      'Hệ thống âm thanh karaoke & màn hình trình chiếu kỷ niệm',
      'Dịch vụ máy chụp ảnh Photobooth lấy liền làm quà tặng lưu niệm'
    ],
    heroImage: '/images/hd-venues/quay-bar-hd-7.jpg',
    gallery: [
      '/images/hd-venues/quay-bar-hd-7.jpg',
      '/images/hd-venues/quay-bar-hd-8.jpg',
      '/images/hd-venues/quay-bar-hd-1.jpg',
      '/images/hd-venues/quay-bar-hd-2.jpg',
      '/images/hd-venues/quay-bar-hd-3.jpg',
      '/images/hd-venues/quay-bar-hd-4.jpg',
      '/images/hd-venues/quay-bar-hd-5.jpg',
      '/images/hd-venues/quay-bar-hd-6.jpg'
    ]
  },
  'phong-an-rieng': {
    name: 'Dịch Vụ Phòng Ăn Riêng VIP',
    subTitle: 'Không Gian Sang Trọng & Sự Riêng Tư Tuyệt Đối',
    description: 'Hệ thống Phòng VIP tại Golden Palace là sự lựa chọn hàng đầu cho những buổi tiếp đón đối tác ngoại giao, tiệc gặp mặt gia đình hay họp mặt thân mật. Không gian biệt lập hoàn toàn kết hợp phong cách phục vụ cá nhân hóa chuẩn 5 sao mang lại thể diện tuyệt đối cho gia chủ.',
    highlights: [
      'Không gian phòng VIP biệt lập, yên tĩnh tuyệt đối',
      'Bàn tiệc xoay hoàng gia sang trọng',
      'Thực đơn món ăn tinh hoa được chế biến từ nguyên liệu tươi sống cao cấp',
      'Đội ngũ nhân viên phục vụ riêng chu đáo, riêng biệt',
      'Phù hợp tiệc từ 10 đến 50 khách'
    ],
    heroImage: '/images/hd-venues/phong-vip-hd-1.jpg',
    gallery: [
      '/images/hd-venues/phong-vip-hd-1.jpg',
      '/images/hd-venues/phong-vip-hd-2.jpg',
      '/images/hd-venues/phong-vip-hd-3.jpg',
      '/images/hd-venues/phong-vip-hd-4.jpg',
      '/images/hd-venues/phong-vip-hd-5.jpg',
      '/images/hd-venues/phong-vip-hd-6.jpg',
      '/images/hd-venues/phong-vip-hd-7.jpg',
      '/images/hd-venues/phong-vip-hd-8.jpg'
    ]
  }
};

export default async function DichVuDetailPage({ params }) {
  const { slug } = await params;
  const staticService = SERVICES_DATA[slug];

  if (!staticService) {
    notFound();
  }

  // Fetch dynamic venue images from DB for this service
  let dbImages = [];
  try {
    const venueSearchName = SERVICE_VENUE_MAP[slug];
    if (venueSearchName) {
      const venueRecord = await prisma.venue.findFirst({
        where: {
          name: { contains: venueSearchName, mode: 'insensitive' }
        }
      });
      if (venueRecord && venueRecord.images) {
        const parsed = JSON.parse(venueRecord.images || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          dbImages = parsed;
        }
      }
    }
  } catch (err) {
    console.error('Error loading service venue images from DB:', err);
  }

  const gallery = (dbImages && dbImages.length > 0) ? dbImages : staticService.gallery;
  const heroImage = (gallery && gallery.length > 0) ? gallery[0] : staticService.heroImage;

  return (
    <div className="min-h-screen bg-[#fcf9f2] font-montserrat text-gray-900 pt-20 pb-28">
      {/* Hero Banner */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#fcf9f2] z-10" />
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="px-4 py-1.5 bg-[#e3a638]/20 border border-[#e3a638] text-[#e3a638] rounded-full text-xs uppercase tracking-widest font-semibold mb-4 backdrop-blur-md">
            Dịch vụ chuyên nghiệp
          </span>
          <h1 className="text-4xl sm:text-6xl font-playfair font-semibold text-white mb-3 drop-shadow-lg">
            {staticService.name}
          </h1>
          <p className="text-amber-200 text-lg sm:text-xl font-light font-playfair tracking-wide">
            {staticService.subTitle}
          </p>
        </div>
      </section>

      {/* Description & Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-playfair text-[#a66a3a] mb-6 font-semibold">Giới thiệu dịch vụ</h2>
            <p className="text-gray-700 font-light text-base leading-relaxed mb-8">
              {staticService.description}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs text-[#a66a3a]">
              Điểm nổi bật dịch vụ:
            </h3>
            <ul className="space-y-3">
              {staticService.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-light">
                  <span className="material-symbols-outlined text-[#e3a638] text-lg mt-0.5">star</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-xl border border-[#e3a638]/20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e3a638]/10 text-[#a66a3a] mx-auto mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">event_available</span>
            </div>
            <h3 className="text-2xl font-playfair text-gray-900 mb-3">Tư vấn & Lập dự toán</h3>
            <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
              Liên hệ Hotline hoặc trải nghiệm công cụ Dự toán chi phí tức thì để phối hợp gói dịch vụ và thực đơn phù hợp nhất.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/du-toan-chi-phi" 
                className="w-full py-3.5 bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white font-semibold uppercase text-xs tracking-wider rounded-lg shadow-md hover:opacity-90 transition-opacity"
              >
                Tính dự toán ngân sách
              </Link>
              <a 
                href="tel:02286595959"
                className="w-full py-3 bg-gray-900 text-amber-300 font-medium text-xs tracking-wider rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">call</span>
                Hotline: 0228 659 5959
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-[#e3a638]/20">
        <div className="text-center mb-12">
          <h3 className="text-[#a66a3a] font-montserrat uppercase tracking-[0.2em] text-xs font-semibold mb-2">Thư viện ảnh thực tế ({gallery.length} ảnh)</h3>
          <h2 className="text-3xl sm:text-4xl font-playfair text-gray-900">Không gian & Không khí {staticService.name}</h2>
          <div className="w-16 h-[1px] bg-[#e3a638] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((imgUrl, gIdx) => (
            <div key={gIdx} className="group relative h-72 rounded-xl overflow-hidden shadow-lg border border-[#e3a638]/20 cursor-pointer font-montserrat">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-108 transition-transform duration-700"
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
