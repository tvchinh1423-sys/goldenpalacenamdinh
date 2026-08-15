const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
  const hash = await bcrypt.hash('0945857996', 10);
  
  // Upsert user 0945857996
  const user = await prisma.user.upsert({
    where: { email: '0945857996@goldenpalace.vn' },
    update: {
      passwordHash: hash,
      isActive: true,
      role: 'ADMIN',
      name: 'Trần Vân Chinh'
    },
    create: {
      email: '0945857996@goldenpalace.vn',
      passwordHash: hash,
      isActive: true,
      role: 'ADMIN',
      name: 'Trần Vân Chinh'
    }
  });

  // Also update default admin account to 0945857996 password
  await prisma.user.updateMany({
    data: { passwordHash: hash }
  });

  console.log('✅ Updated admin password to 0945857996 for user:', user.email);
}

updateAdmin().catch(console.error).finally(() => prisma.$disconnect());
