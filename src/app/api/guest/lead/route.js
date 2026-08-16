import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, phone, notes,
      guestCount, budgetPerTable, session = 'Tối', date,
      selectedVenues = [], selectedPackage = null, selectedAddOns = []
    } = body;

    // Validate name and phone
    if (!name || !phone) {
      return NextResponse.json({ error: 'Họ tên và số điện thoại là bắt buộc' }, { status: 400 });
    }

    // Generate unique code and token
    const code = 'GP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const linkToken = uuidv4();

    // Safely parse numbers to prevent NaN database errors
    const parsedGuestCount = Math.max(10, parseInt(guestCount, 10) || 100);
    const parsedBudgetPerTable = Math.max(0, parseInt(budgetPerTable, 10) || 1500000);

    const mainTables = Math.ceil(parsedGuestCount / 10);
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
              guestRangeMin: { lte: parsedGuestCount },
              guestRangeMax: { gte: parsedGuestCount }
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
        where: { id: { in: selectedAddOns } },
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

    // Real-time Automated Notification Trigger (Zalo / Telegram Webhook)
    const webhookUrl = process.env.ZALO_WEBHOOK_URL || process.env.TELEGRAM_WEBHOOK_URL || 'http://localhost:4000/dispatch';
    if (webhookUrl) {
      try {
        const notifyPayload = {
          event: 'NEW_LEAD',
          leadCode: code,
          customerName: name,
          phone,
          guestCount: parsedGuestCount,
          estimatedTotal: totalBase,
          zaloChatUrl: `https://zalo.me/${phone.replace(/[^0-9]/g, '')}`,
          linkToken
        };
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifyPayload)
        }).catch(e => console.error('Webhook notify error:', e));
      } catch (err) {
        console.error('Notification dispatch error:', err);
      }
    }

    return NextResponse.json({ success: true, linkToken: lead.linkToken }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
