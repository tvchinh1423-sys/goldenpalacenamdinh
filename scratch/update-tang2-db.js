const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function updateTang2() {
  const images = JSON.parse(fs.readFileSync('scratch/tang2_drive_images.json', 'utf-8'));
  const imagesJson = JSON.stringify(images);

  const venue = await prisma.venue.findFirst({
    where: { name: { contains: 'Tầng 2' } }
  });

  if (venue) {
    const updated = await prisma.venue.update({
      where: { id: venue.id },
      data: { images: imagesJson }
    });
    console.log(`✅ Updated ${updated.name} with ${images.length} images from Google Drive folder 1qIsFhCojImpIQ4RUYlL1wglvPLawMMiC!`);
  } else {
    console.log('Venue not found');
  }
}

updateTang2().catch(console.error).finally(() => prisma.$disconnect());
