const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@goldenpalace.vn' },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      email: 'admin@goldenpalace.vn',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
