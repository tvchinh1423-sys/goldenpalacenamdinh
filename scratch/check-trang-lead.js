const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let leads = await prisma.lead.findMany({
    where: { name: { contains: 'Trần Thu Trang' } },
    include: { 
      proposals: { 
        include: { 
          venues: true, 
          package: true, 
          addOns: true 
        } 
      } 
    }
  });

  if (leads.length === 0) {
    console.log('Customer Trần Thu Trang not found. Creating lead sample for Trần Thu Trang...');
    const venue = await prisma.venue.findFirst({ where: { name: { contains: 'Tầng 2' } } });
    
    const newLead = await prisma.lead.create({
      data: {
        code: 'GP-TRANG88',
        linkToken: 'token-trang-88',
        name: 'Trần Thu Trang',
        phone: '0987654321',
        notes: 'Khách yêu cầu tư vấn tiệc cưới quy mô 400 khách, cần trang trí bướm dẫn đường và photobooth.',
        leadStatus: 'NEW',
        proposals: {
          create: {
            version: 1,
            guestCount: 400,
            budgetPerTable: 1850000,
            eventDate: new Date('2026-10-20'),
            eventSession: 'Tối',
            mainTables: 40,
            reserveTables: 4,
            packagePrice: 10000000,
            totalBase: 84000000,
            totalMax: 91400000,
            priceEffectiveDate: new Date(),
            venues: {
              create: [
                {
                  venueId: venue ? venue.id : 'v-1',
                  venueName: 'Hội trường Tầng 2',
                  venueFee: 10000000,
                  isPreferred: true
                }
              ]
            }
          }
        }
      },
      include: { proposals: { include: { venues: true } } }
    });
    leads = [newLead];
  }

  console.log('✅ Lead Trần Thu Trang ready:', leads[0].name, 'Mã:', leads[0].code, 'ID:', leads[0].id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
