const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating venue images in Supabase database...');
  
  function makeHdImages(prefix, count) {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(`/images/hd-venues/${prefix}-hd-${i}.jpg`);
    }
    return JSON.stringify(arr);
  }

  // Update Hội trường Tầng 4
  const tang4 = await prisma.venue.findFirst({
    where: { name: { contains: 'Tầng 4' } }
  });
  if (tang4) {
    await prisma.venue.update({
      where: { id: tang4.id },
      data: { images: makeHdImages('tang-4', 12) }
    });
    console.log('Updated Hội trường Tầng 4 images');
  }

  // Update Quầy Bar Tầng 1
  const quayBar = await prisma.venue.findFirst({
    where: { name: { contains: 'Quầy Bar' } }
  });
  if (quayBar) {
    await prisma.venue.update({
      where: { id: quayBar.id },
      data: { images: makeHdImages('quay-bar', 12) }
    });
    console.log('Updated Quầy Bar Tầng 1 images');
  }

  console.log('Database venue images updated successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
