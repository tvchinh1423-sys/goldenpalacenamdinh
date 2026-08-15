const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Admin User
  const email = (process.env.ADMIN_EMAIL || 'admin@goldenpalace.vn').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', isActive: true },
    create: {
      email,
      name: 'Admin Golden Palace',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin sẵn sàng: ${admin.email}`);

  // 2. Clear old test venues to ensure accurate dataset
  await prisma.venuePricing.deleteMany({});
  await prisma.venue.deleteMany({});

  // 3. Real Venues Data
  const venuesData = [
    {
      name: 'Hội trường Tầng 2',
      description: 'Sức chứa 350 - 750 khách (Từ chối phục vụ nếu dưới 250 khách). Trang bị màn hình LED 30m², giàn đèn bướm, phông 2 bên sân khấu sang trọng.',
      minGuests: 350,
      maxGuests: 750,
      displayOrder: 1,
      status: 'PUBLISHED',
      images: JSON.stringify([
        '/images/venues/tang-2-1.jpg',
        '/images/venues/tang-2-2.jpg',
        '/images/venues/tang-2-3.jpg',
        '/images/venues/tang-2-4.jpg'
      ]),
      pricings: [
        {
          guestRangeMin: 350,
          guestRangeMax: 750,
          price: 10000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        },
        {
          guestRangeMin: 250,
          guestRangeMax: 349,
          price: 12000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        }
      ]
    },
    {
      name: 'Hội trường Tầng 3',
      description: 'Sức chứa 300 - 650 khách (Từ chối phục vụ nếu dưới 250 khách). Màn hình LED 30m², giàn đèn bướm, hoa lụa 2 bên đường dẫn cao cấp.',
      minGuests: 300,
      maxGuests: 650,
      displayOrder: 2,
      status: 'PUBLISHED',
      images: JSON.stringify([
        '/images/venues/tang-3-1.jpg',
        '/images/venues/tang-3-2.jpg',
        '/images/venues/tang-3-3.jpg',
        '/images/venues/tang-3-4.jpg'
      ]),
      pricings: [
        {
          guestRangeMin: 300,
          guestRangeMax: 650,
          price: 10000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        },
        {
          guestRangeMin: 250,
          guestRangeMax: 299,
          price: 12000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        }
      ]
    },
    {
      name: 'Hội trường Tầng 4',
      description: 'Sức chứa 100 - 300 khách. Màn hình LED 10m², hệ thống âm thanh ánh sáng hiện đại, hoa lụa 2 bên sân khấu (Ưu đãi giảm 85%).',
      minGuests: 100,
      maxGuests: 300,
      displayOrder: 3,
      status: 'PUBLISHED',
      images: JSON.stringify([
        '/images/venues/tang-4-1.jpg',
        '/images/venues/tang-4-2.jpg',
        '/images/venues/tang-4-3.jpg',
        '/images/venues/tang-4-4.jpg'
      ]),
      pricings: [
        {
          guestRangeMin: 100,
          guestRangeMax: 300,
          price: 2000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        }
      ]
    },
    {
      name: 'Quầy Bar',
      description: 'Không gian quầy Bar sang trọng phù hợp cho tiệc sinh nhật, tiệc kỷ niệm, tiệc cocktail từ 50 - 100 khách.',
      minGuests: 50,
      maxGuests: 100,
      displayOrder: 4,
      status: 'PUBLISHED',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop'
      ]),
      pricings: [
        {
          guestRangeMin: 50,
          guestRangeMax: 100,
          price: 1500000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        }
      ]
    },
    {
      name: 'Phòng VIP',
      description: 'Không gian phòng VIP riêng tư, ấm cúng dành cho tiệc gia đình, gặp mặt đối tác từ 10 - 50 khách.',
      minGuests: 10,
      maxGuests: 50,
      displayOrder: 5,
      status: 'PUBLISHED',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop'
      ]),
      pricings: [
        {
          guestRangeMin: 10,
          guestRangeMax: 50,
          price: 1000000,
          effectiveFrom: new Date('2026-01-01'),
          status: 'PUBLISHED'
        }
      ]
    }
  ];

  for (const v of venuesData) {
    const { pricings, ...vData } = v;
    const createdVenue = await prisma.venue.create({
      data: vData
    });

    for (const p of pricings) {
      await prisma.venuePricing.create({
        data: {
          ...p,
          venueId: createdVenue.id
        }
      });
    }
    console.log(`🏰 Seeded venue: ${createdVenue.name}`);
  }

  // 4. Seed Add-on Services (Advanced Services & Photobooth)
  await prisma.addOnService.deleteMany({});
  const addOnsData = [
    { name: 'Nhạc công Keyboard', description: '800.000 VNĐ / người', displayOrder: 1, status: 'PUBLISHED' },
    { name: 'Ca sĩ (Hát 3 bài)', description: '800.000 VNĐ / người', displayOrder: 2, status: 'PUBLISHED' },
    { name: 'Người dẫn chương trình (MC)', description: '800.000 VNĐ / người', displayOrder: 3, status: 'PUBLISHED' },
    { name: 'Thiên thần (1 cặp)', description: '1.000.000 VNĐ / cặp', displayOrder: 4, status: 'PUBLISHED' },
    { name: 'Ban nhạc Saxophone', description: '5.000.000 VNĐ / ban', displayOrder: 5, status: 'PUBLISHED' },
    { name: 'Ban nhạc tứ tấu', description: '14.000.000 VNĐ / ban', displayOrder: 6, status: 'PUBLISHED' },
    { name: 'Vòng ánh sáng laser trao nhẫn', description: '700.000 VNĐ / lần (Tặng miễn phí tiệc chốt > 400 khách)', displayOrder: 7, status: 'PUBLISHED' },
    { name: 'Bóng bay kích nổ (Làm từ 4 quả)', description: '900.000 VNĐ / quả', displayOrder: 8, status: 'PUBLISHED' },
    { name: 'Flycam trao nhẫn cưới', description: '1.000.000 VNĐ / lần', displayOrder: 9, status: 'PUBLISHED' },
    { name: 'Bướm dẫn đường cô dâu', description: '3.000.000 VNĐ / con', displayOrder: 10, status: 'PUBLISHED' },
    { name: 'Photobooth Gói 1 (1.5 giờ, 200 ảnh nhỏ/100 ảnh to)', description: '3.400.000 VNĐ / máy (Gồm 1 nhân viên, file mềm, phụ kiện checkin, sổ lưu giữ)', displayOrder: 11, status: 'PUBLISHED' },
    { name: 'Photobooth Gói 2 (2 giờ, Không giới hạn ảnh)', description: '4.000.000 VNĐ / máy (Gồm 1 nhân viên, file mềm, phụ kiện checkin, sổ lưu giữ)', displayOrder: 12, status: 'PUBLISHED' },
    { name: 'Photobooth Gói 3 (3 giờ, Không giới hạn ảnh)', description: '5.000.000 VNĐ / máy (Gồm 1 nhân viên, file mềm, phụ kiện checkin, sổ lưu giữ)', displayOrder: 13, status: 'PUBLISHED' }
  ];

  for (const item of addOnsData) {
    await prisma.addOnService.create({ data: item });
  }
  console.log('✨ Seeded Add-on Services!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
