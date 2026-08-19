import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendTelegramNotification } from '@/lib/telegram';

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

function generateProposalDiff(prevProposal, nextData) {
  if (!prevProposal) return null;
  const changes = [];

  if (prevProposal.guestCount !== nextData.guestCount) {
    changes.push(`Quy mô: ${prevProposal.guestCount} khách → ${nextData.guestCount} khách`);
  }
  if (prevProposal.budgetPerTable !== nextData.budgetPerTable) {
    changes.push(`Mâm cỗ: ${new Intl.NumberFormat('vi-VN').format(prevProposal.budgetPerTable)}đ → ${new Intl.NumberFormat('vi-VN').format(nextData.budgetPerTable)}đ/mâm`);
  }
  const prevVenueName = prevProposal.venues?.[0]?.venueName || 'Chưa chọn';
  if (prevVenueName !== nextData.venueName) {
    changes.push(`Hội trường: ${prevVenueName} → ${nextData.venueName}`);
  }
  const diffTotal = nextData.totalBase - prevProposal.totalBase;
  if (diffTotal !== 0) {
    const sign = diffTotal > 0 ? '+' : '';
    changes.push(`Dự toán: ${new Intl.NumberFormat('vi-VN').format(prevProposal.totalBase)}đ → ${new Intl.NumberFormat('vi-VN').format(nextData.totalBase)}đ (${sign}${new Intl.NumberFormat('vi-VN').format(diffTotal)}đ)`);
  }

  return changes.length > 0 ? changes.join(' | ') : 'Cập nhật lại phương án dự toán';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name = '', phone, notes = '',
      guestCount, budgetPerTable, session = 'Tối', date,
      selectedVenues = [], selectedPackage = null, selectedAddOns = []
    } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Số điện thoại là bắt buộc' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Check if a Lead with this phone already exists
    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: {
          contains: cleanPhone
        }
      },
      include: {
        proposals: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            venues: true,
            addOns: true
          }
        }
      }
    });

    // Safely parse numbers
    const parsedGuestCount = Math.max(10, parseInt(guestCount, 10) || 100);
    const parsedBudgetPerTable = Math.max(3200000, parseInt(budgetPerTable, 10) || 3200000);

    const mainTables = Math.ceil(parsedGuestCount / 10);
    const reserveTables = Math.ceil(mainTables * 0.1);

    // Fetch venue details
    let venueTotal = 0;
    let preferredVenueName = 'Tầng 3';
    const proposalVenues = [];

    if (selectedVenues && selectedVenues.length > 0) {
      const venues = await prisma.venue.findMany({
        where: { id: { in: selectedVenues } }
      });
      
      venues.forEach((v, index) => {
        const fee = calculateVenueFee(v.name, parsedGuestCount);
        if (index === 0) {
          venueTotal = Number(fee);
          preferredVenueName = v.name;
        }
        proposalVenues.push({
          venueId: v.id,
          venueName: v.name,
          venueFee: fee,
          isPreferred: index === 0
        });
      });
    }

    let packagePrice = 0;

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

    // Calculate diff if updating an existing customer
    let diffSummary = null;
    let versionNumber = 1;

    if (existingLead && existingLead.proposals.length > 0) {
      const prev = existingLead.proposals[0];
      versionNumber = (prev.version || 1) + 1;
      diffSummary = generateProposalDiff(prev, {
        guestCount: parsedGuestCount,
        budgetPerTable: parsedBudgetPerTable,
        venueName: preferredVenueName,
        totalBase
      });
    }

    // Save or update lead in Prisma DB transaction
    const lead = await prisma.$transaction(async (tx) => {
      let targetLead;

      if (existingLead) {
        // OVERWRITE / UPSERT EXISTING LEAD RECORD WITH LATEST DATA
        targetLead = await tx.lead.update({
          where: { id: existingLead.id },
          data: {
            name: name.trim() || existingLead.name,
            notes: notes.trim() ? (existingLead.notes ? `${existingLead.notes} | ${notes.trim()}` : notes.trim()) : existingLead.notes,
            leadStatus: 'NEW',
            updatedAt: new Date()
          }
        });
      } else {
        // CREATE NEW LEAD IF PHONE DOES NOT EXIST
        const code = 'GP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const linkToken = uuidv4();

        targetLead = await tx.lead.create({
          data: {
            code,
            linkToken,
            name: name.trim() || `Khách hàng ${phone}`,
            phone,
            notes: notes.trim(),
            leadStatus: 'NEW'
          }
        });
      }

      const eventDate = date ? new Date(date) : new Date();

      // Create new proposal version
      await tx.proposal.create({
        data: {
          leadId: targetLead.id,
          version: versionNumber,
          guestCount: parsedGuestCount,
          budgetPerTable: parsedBudgetPerTable,
          eventDate,
          eventSession: session || 'Tối',
          mainTables,
          reserveTables,
          packagePrice: 0,
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

      return targetLead;
    });

    // Fire Telegram Notification asynchronously
    sendTelegramNotification({
      code: lead.code,
      name: lead.name,
      phone: lead.phone,
      eventDate: date,
      eventSession: session,
      guestCount: parsedGuestCount,
      mainTables,
      budgetPerTable: parsedBudgetPerTable,
      preferredVenueName,
      totalBase,
      linkToken: lead.linkToken,
      leadId: lead.id,
      isUpdate: Boolean(existingLead),
      versionNumber,
      diffSummary
    }).catch(err => console.error('[Telegram dispatch error]:', err));

    return NextResponse.json({ 
      success: true, 
      linkToken: lead.linkToken,
      version: versionNumber,
      diffSummary
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating/updating lead:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
