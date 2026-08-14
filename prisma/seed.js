// Seed dữ liệu khởi tạo cho Golden Palace.
//
// CHỈ tạo tài khoản Admin đầu tiên. KHÔNG seed hội trường / bảng giá / gói dịch vụ —
// theo quy tắc "không tự bịa dữ liệu", toàn bộ dữ liệu nghiệp vụ do Admin nhập qua trang quản trị.
//
// Chạy: npm run db:seed
// Đổi mật khẩu mặc định bằng biến môi trường ADMIN_EMAIL / ADMIN_PASSWORD.

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@goldenpalace.vn').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', isActive: true },
    create: {
      email,
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin sẵn sàng: ${admin.email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  Đang dùng mật khẩu mặc định "admin123" — hãy đổi trước khi lên production.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
