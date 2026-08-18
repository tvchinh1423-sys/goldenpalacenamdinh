import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Business Rule Venue Fee Calculator
function calculateVenueFee(venueName, guestCount) {
  const name = venueName || '';
  const count = Number(guestCount) || 100;

  if (name.includes('Tầng 2')) {
    if (count >= 350) return 10000000;
    if (count >= 250) return 12000000;
    return 0;
  }
  if (name.includes('Tầng 3')) {
    if (count >= 300) return 10000000;
    if (count >= 250) return 12000000;
    return 0;
  }
  return 2000000; // Tầng 4, Quầy Bar, Phòng VIP
}

function parseAddonNumericPrice(addon, guestCount) {
  const raw = addon.description || '';
  if (addon.name.includes('Vòng ánh sáng laser')) {
    if (Number(guestCount) >= 400) return 0;
    return 700000;
  }
  if (raw.includes('800.000')) return 800000;
  if (raw.includes('1.000.000')) return 1000000;
  if (raw.includes('900.000')) return 900000;
  if (raw.includes('3.000.000')) return 3000000;
  if (raw.includes('3.400.000')) return 3400000;
  if (raw.includes('4.000.000')) return 4000000;
  if (raw.includes('5.000.000')) return 5000000;
  if (raw.includes('14.000.000')) return 14000000;
  return 0;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name = '', phone, notes = '',
      guestCount, budgetPerTable, session = 'Tối', date,
      selectedVenues = [], selectedPackage = null, selectedAddOns = []
    } = body;

    // Validate phone
    if (!phone) {
      return NextResponse.json({ error: 'Số điện thoại là bắt buộc' }, { status: 400 });
    }

    // Generate unique code and token
    const code = 'GP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const linkToken = uuidv4();

    // Safely parse numbers
    const parsedGuestCount = Math.max(10, parseInt(guestCount, 10) || 100);
    const parsedBudgetPerTable = Math.max(3200000, parseInt(budgetPerTable, 10) || 3200000);

    const mainTables = Math.ceil(parsedGuestCount / 10);
    const reserveTables = Math.ceil(mainTables * 0.1);

    // Fetch venue pricing details
    let venueTotal = 0;
    const proposalVenues = [];
    if (selectedVenues && selectedVenues.length > 0) {
      const venues = await prisma.venue.findMany({
        where: { id: { in: selectedVenues } }
      });
      
      venues.forEach((v, index) => {
        const fee = calculateVenueFee(v.name, parsedGuestCount);
        if (index === 0) venueTotal = Number(fee);
        proposalVenues.push({
          venueId: v.id,
          venueName: v.name,
          venueFee: fee,
          isPreferred: index === 0
        });
      });
    }

    let packagePrice = 0;
    if (selectedPackage) {
      const pkg = await prisma.servicePackage.findUnique({
        where: { id: selectedPackage },
        include: {
          pricings: {
            where: {
              ...(selectedVenues?.[0] && { venueId: selectedVenues[0] }),
              guestRangeMin: { lte: parsedGuestCount },
              guestRangeMax: { gte: parsedGuestCount }
            }
          }
        }
      });
      if (pkg) {
        packagePrice = Number(pkg.pricings[0]?.price || 0);
      }
    }

    let addOnsTotal = 0;
    const proposalAddOns = [];
    if (selectedAddOns && selectedAddOns.length > 0) {
      const addons = await prisma.addOnService.findMany({
        where: { id: { in: selectedAddOns } }
      });
      addons.forEach(a => {
        const fee = parseAddonNumericPrice(a, parsedGuestCount);
        if (fee > 0) {
          addOnsTotal += fee;
          proposalAddOns.push({
            addOnId: a.id,
            addOnName: a.name,
            price: fee
          });
        }
      });
    }

    const menuBase = mainTables * parsedBudgetPerTable;
    const menuMax = (mainTables + reserveTables) * parsedBudgetPerTable;
    const fixedTotal = Number(venueTotal || 0) + Number(packagePrice || 0) + Number(addOnsTotal || 0);

    const totalBase = Math.round(fixedTotal + menuBase);
    const totalMax = Math.round(fixedTotal + menuMax);

    // Save lead in Prisma DB transaction
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          code,
          linkToken,
          name: name.trim() || `Khách hàng ${phone}`,
          phone,
          notes: notes.trim(),
          leadStatus: 'NEW'
        }
      });

      const eventDate = date ? new Date(date) : new Date();

      await tx.proposal.create({
        data: {
          leadId: newLead.id,
          version: 1,
          guestCount: parsedGuestCount,
          budgetPerTable: parsedBudgetPerTable,
          eventDate,
          eventSession: session || 'Tối',
          mainTables,
          reserveTables,
          packageId: selectedPackage || null,
          packagePrice,
          totalBase,
          totalMax,
          priceEffectiveDate: new Date(),
          venues: {
            create: proposalVenues
          },
          addOns: {
            create: proposalAddOns
          }
        }
      });

      return newLead;
    });

    return NextResponse.json({ success: true, linkToken: lead.linkToken }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
