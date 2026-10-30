import prisma from '@/lib/prisma';
import VenuesOverviewClient from './VenuesOverviewClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Hệ Thống 5 Không Gian Sảnh Tiệc & Hội Nghị | Golden Palace Nam Định',
  description: 'Khám phá 5 không gian sảnh tiệc cưới và hội nghị sang trọng bậc nhất Nam Định tại Golden Palace: Hội trường Tầng 2, Tầng 3, Tầng 4, Quầy Bar Tầng 1 và Phòng VIP. Sức chứa từ 10 đến 750 khách với kiến trúc không cột chắn trần cao 7m.',
  openGraph: {
    title: 'Hệ Thống 5 Không Gian Sảnh Tiệc & Sự Kiện | Golden Palace Nam Định',
    description: 'Trần cao 7m không cột chắn, màn hình LED P2.5 30m², giàn đèn bướm pha lê hoàng gia. Khám phá 5 không gian tiệc đẳng cấp tại 98 Đông A, Nam Định.',
    images: ['/images/hd-venues/tang-2-hd-1.jpg'],
  }
};

const DEFAULT_VENUES = [
  {
    slug: 'tang-2',
    name: 'Hội trường Tầng 2',
    subTitle: 'Đại Cung Điện Hoàng Gia Sang Trọng',
    floorTag: 'Tầng 2',
    badgeTag: 'Đại Tiệc Hoàng Gia',
    category: 'LARGE',
    capacityGuests: '350 - 750 Khách',
    capacityTables: '35 - 75 Mâm',
    ledHighlight: 'LED P2.5 30m² + Đèn Pha Lê',
    heroImage: '/images/hd-venues/tang-2-hd-1.jpg',
    photoCount: 31,
    description: 'Sảnh tiệc đại tràng sang trọng bậc nhất Nam Định với kiến trúc trần cao 7m hoàn toàn không có cột chắn tầm nhìn. Được trang bị màn hình LED P2.5 30m² sắc nét cùng giàn đèn bướm nghệ thuật rực rỡ, Tầng 2 là sự lựa chọn số 1 cho những đám cưới hoàng gia và đại hội nghị doanh nghiệp quy mô lớn.',
    features: [
      'Trần cao 7m, thiết kế hoàn toàn không cột chắn tầm nhìn',
      'Màn hình LED P2.5 siêu nét tiêu chuẩn 30m² trình chiếu 4K',
      'Hệ thống giàn đèn bướm & đèn chùm pha lê cao cấp',
      'Sân khấu đa tầng & đường dẫn hoa lụa lãng mạn'
    ],
    bestFor: 'Tiệc cưới đại quy mô, Đại hội nghị khách hàng, Gala Dinner doanh nghiệp lớn'
  },
  {
    slug: 'tang-3',
    name: 'Hội trường Tầng 3',
    subTitle: 'Không Gian Tiệc Cưới Hoàng Gia Ấm Cúng',
    floorTag: 'Tầng 3',
    badgeTag: 'Phong Cách Tân Cổ Điển',
    category: 'LARGE',
    capacityGuests: '300 - 650 Khách',
    capacityTables: '30 - 65 Mâm',
    ledHighlight: 'LED 30m² + Giàn Đèn Bướm',
    heroImage: '/images/hd-venues/tang-3-hd-1.jpg',
    photoCount: 30,
    description: 'Sở hữu lối thiết kế tân cổ điển tinh tế với tông màu Rose Gold & Champagne ấm áp. Hội trường Tầng 3 trang bị màn hình LED 30m², hệ thống âm thanh ánh sáng biểu diễn chuyên nghiệp và đường dẫn hoa lụa thanh lịch, mang lại không khí thiêng liêng tuyệt hảo cho ngày hạnh phúc.',
    features: [
      'Thiết kế tân cổ điển không cột chắn, thông thoáng sang trọng',
      'Màn hình LED 30m² hiển thị sắc nét tiêu chuẩn biểu diễn',
      'Giàn đèn bướm nghệ thuật & đèn đường dẫn tự động lộng lẫy',
      'Khu vực đón khách & Bàn gallery trang trí chỉn chu'
    ],
    bestFor: 'Tiệc cưới sang trọng, Lễ thành hôn ấm cúng, Hội thảo & Hội nghị quy mô lớn'
  },
  {
    slug: 'tang-4',
    name: 'Hội trường Tầng 4',
    subTitle: 'Không Gian Tiệc Ấm Cúng & Tinh Tế',
    floorTag: 'Tầng 4',
    badgeTag: 'Ấm Cúng & Tối Ưu',
    category: 'MEDIUM',
    capacityGuests: '100 - 300 Khách',
    capacityTables: '10 - 30 Mâm',
    ledHighlight: 'Màn Hình LED 10m²',
    heroImage: '/images/hd-venues/tang-4-hd-7.jpg',
    photoCount: 18,
    description: 'Lựa chọn lý tưởng cho các buổi tiệc cưới ấm cúng, tiệc báo hỷ thân mật hoặc hội nghị doanh nghiệp vừa và nhỏ. Không gian được trang bị màn hình LED 10m², hệ thống âm thanh ánh sáng chuẩn cùng hoa lụa trang trí sân khấu vô cùng trang nhã và tiết kiệm chi phí tối ưu.',
    features: [
      'Không gian ấm cúng, riêng tư cho tiệc quy mô vừa và nhỏ',
      'Màn hình LED 10m² hiện đại cùng âm thanh biểu diễn',
      'Cổng chào đón & Bàn trang trí tiền mừng chỉn chu',
      'Hoa lụa 2 bên sân khấu & Phông lưu niệm trang nhã'
    ],
    bestFor: 'Tiệc cưới thân mật, Tiệc báo hỷ, Hội nghị vừa & nhỏ, Tiệc liên hoan công ty'
  },
  {
    slug: 'quay-bar',
    name: 'Quầy Bar Tầng 1',
    subTitle: 'Không Gian Sành Điệu & Hiện Đại',
    floorTag: 'Tầng 1',
    badgeTag: 'Lounge Sành Điệu',
    category: 'INTIMATE',
    capacityGuests: '40 - 100 Khách',
    capacityTables: 'Tiệc đứng & Bàn tiệc',
    ledHighlight: 'Quầy Pha Chế + Sound Lounge',
    heroImage: '/images/hd-venues/quay-bar-hd-7.jpg',
    photoCount: 26,
    description: 'Mang phong cách kiến trúc Lounge hiện đại, trẻ trung với hệ thống đèn trang trí và quầy pha chế sang trọng. Đây là địa điểm lý tưởng cho các buổi tiệc sinh nhật, tiệc kỷ niệm, tiệc cocktail hoặc các buổi gặp mặt giao lưu thân mật tràn ngập cảm xúc.',
    features: [
      'Phong cách kiến trúc hiện đại, quầy pha chế sang trọng',
      'Không gian kết nối mở thoáng đãng, view đường phố',
      'Hệ thống âm thanh Lounge & ánh sáng ấm áp, thư thái',
      'Setup linh hoạt theo chủ đề sinh nhật & tiệc kỷ niệm'
    ],
    bestFor: 'Tiệc sinh nhật, Kỷ niệm ngày cưới, Tiệc cocktail, Gặp gỡ bạn bè & đối tác'
  },
  {
    slug: 'phong-vip',
    name: 'Không Gian Phòng VIP',
    subTitle: 'Đẳng Cấp & Riêng Tư Tuyệt Đối',
    floorTag: 'Khu VIP',
    badgeTag: 'Riêng Tư Thượng Lưu',
    category: 'INTIMATE',
    capacityGuests: '10 - 50 Khách',
    capacityTables: '1 - 5 Mâm VIP',
    ledHighlight: 'Nội Thất Gỗ & Phục Vụ 5 Sao',
    heroImage: '/images/hd-venues/phong-vip-hd-1.jpg',
    photoCount: 68,
    description: 'Được thiết kế độc bản với nội thất gỗ và mạ vàng hoàng gia, mang lại sự riêng tư tối đa và trải nghiệm ẩm thực đỉnh cao cho các buổi tiệc gia đình, tiệc đính hôn nhỏ hoặc tiếp đón đối tác kinh doanh cấp cao.',
    features: [
      'Không gian riêng tư biệt lập hoàn toàn, cách âm yên tĩnh',
      'Nội thất gỗ & chi tiết mạ vàng quý phái, bàn tiệc hoàng gia',
      'Đội ngũ phục vụ riêng chuẩn 5 sao chu đáo, tận tâm',
      'Thực đơn đặc sản tươi sống chế biến theo yêu cầu riêng'
    ],
    bestFor: 'Tiệc gia đình cao cấp, Tiếp đón đối tác VIP, Tiệc gặp mặt thông gia, Đính hôn nhỏ'
  }
];

export default async function KhongGianOverviewPage() {
  let dbVenues = [];
  try {
    dbVenues = await prisma.venue.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching venues from DB:', error);
  }

  // Merge DB data with rich static data if available
  const venuesData = DEFAULT_VENUES.map((venue) => {
    const matchedDb = dbVenues.find(dbV => 
      dbV.name.toLowerCase().includes(venue.name.toLowerCase()) || 
      (venue.slug === 'tang-2' && dbV.name.includes('2')) ||
      (venue.slug === 'tang-3' && dbV.name.includes('3')) ||
      (venue.slug === 'tang-4' && dbV.name.includes('4')) ||
      (venue.slug === 'quay-bar' && dbV.name.toLowerCase().includes('bar')) ||
      (venue.slug === 'phong-vip' && dbV.name.toLowerCase().includes('vip'))
    );

    if (matchedDb && matchedDb.images) {
      try {
        const parsedImages = JSON.parse(matchedDb.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
          return {
            ...venue,
            heroImage: parsedImages[0] || venue.heroImage
          };
        }
      } catch (err) {}
    }

    return venue;
  });

  return <VenuesOverviewClient venues={venuesData} />;
}
