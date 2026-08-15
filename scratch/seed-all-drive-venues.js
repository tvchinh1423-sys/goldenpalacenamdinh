const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('scratch/all_drive_subfolders.json', 'utf-8'));

  const tang2Images = [...data['1lmVcSknJKOVCM9fjU6SYJdGpV0tLk9wG'], ...data['1qIsFhCojImpIQ4RUYlL1wglvPLawMMiC']];
  const tang3Images = data['1QzN7kGHWc-dmuIzYKGB8NowftLJCinZJ'];
  const tang4Images = data['1HbsI6CCNc2UCnW7ywRuMcW_IaErDdBf2'];
  const quayBarImages = data['1bKSsDbDT-mYgmxxyay1iKs6pMcd3Gq-X'];
  const vipImages = data['1nfeyxanHHUGQTIjEMZUMZ3VI4ke1d2eu'];

  const mappings = [
    { match: 'Tầng 2', images: tang2Images },
    { match: 'Tầng 3', images: tang3Images },
    { match: 'Tầng 4', images: tang4Images },
    { match: 'Quầy Bar', images: quayBarImages },
    { match: 'Phòng VIP', images: vipImages },
  ];

  for (const item of mappings) {
    const venue = await prisma.venue.findFirst({
      where: { name: { contains: item.match } }
    });
    if (venue) {
      await prisma.venue.update({
        where: { id: venue.id },
        data: { images: JSON.stringify(item.images) }
      });
      console.log(`✅ Updated ${venue.name} with ${item.images.length} real Google Drive images!`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
