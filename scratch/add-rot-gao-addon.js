const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAddon() {
  try {
    const existing = await prisma.addOnService.findFirst({
      where: { name: { contains: 'Rót gạo' } }
    });

    if (existing) {
      console.log('✅ Dịch vụ "Rót gạo / Tranh cát" đã tồn tại:', existing);
    } else {
      const created = await prisma.addOnService.create({
        data: {
          name: 'Rót gạo / Tranh cát',
          description: '800.000 VNĐ / Hộp',
          displayOrder: 12,
          isAvailable: true,
          status: 'PUBLISHED'
        }
      });
      console.log('🚀 Đã thêm thành công dịch vụ "Rót gạo / Tranh cát":', created);
    }
  } catch (err) {
    console.error('Lỗi khi thêm dịch vụ:', err);
  } finally {
    await prisma.$disconnect();
  }
}

addAddon();
