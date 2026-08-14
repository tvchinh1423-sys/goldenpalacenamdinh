import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, phone, notes,
      guestCount, budgetPerTable, session, date,
      selectedVenues, selectedPackage, selectedAddOns
    } = body;

    // Validate
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Generate unique code and token
    const code = 'GP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const linkToken = uuidv4();

    const mainTables = Math.ceil(guestCount / 10);
    const reserveTables = Math.ceil(mainTables * 0.1);

    // Fetch pricing details to freeze them
    let venueTotal = 0;
    const proposalVenues = [];
    if (selectedVenues && selectedVenues.length > 0) {
      const venues = await prisma.venue.findMany({
        where: { id: { in: selectedVenues } },
        include: {
          pricings: {
            where: {
              guestRangeMin: { lte: guestCount },
              guestRangeMax: { gte: guestCount }
            }
          }
        }
      });
      
      venues.forEach((v, index) => {
        const fee = v.pricings[0]?.price || 0;
        if (index === 0) venueTotal = Number(fee); // Use preferred venue for total
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
              guestRangeMin: { lte: guestCount },
              guestRangeMax: { gte: guestCount }
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
        where: { id: { in: selectedAddOns } },
        include: {
          pricings: {
            where: {
              ...(selectedVenues?.[0] && { venueId: selectedVenues[0] }),
              guestRangeMin: { lte: guestCount },
              guestRangeMax: { gte: guestCount }
            }
          }
        }
      });
      addons.forEach(a => {
        const fee = Number(a.pricings[0]?.price || 0);
        addOnsTotal += fee;
        proposalAddOns.push({
          addOnId: a.id,
          addOnName: a.name,
          price: fee
        });
      });
    }

    const menuBase = mainTables * budgetPerTable;
    const menuMax = (mainTables + reserveTables) * budgetPerTable;
    const fixedTotal = venueTotal + packagePrice + addOnsTotal;

    const totalBase = fixedTotal + menuBase;
    const totalMax = fixedTotal + menuMax;

    // Use a transaction
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          code,
          linkToken,
          name,
          phone,
          notes,
          leadStatus: 'NEW'
        }
      });

      const eventDate = date ? new Date(date) : new Date();

      await tx.proposal.create({
        data: {
          leadId: newLead.id,
          version: 1,
          guestCount,
          budgetPerTable,
          eventDate,
          eventSession: session,
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
