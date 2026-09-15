import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import fs from 'fs';
import path from 'path';

const DATA_FILE_TMP = path.join('/tmp', 'personalize-profiles.json');
const DATA_FILE_LOCAL = path.join(process.cwd(), 'src', 'data', 'personalize-profiles.json');

function getCachedProfiles() {
  if (global.gpProfilesCache && Array.isArray(global.gpProfilesCache)) {
    return global.gpProfilesCache;
  }
  try {
    if (fs.existsSync(DATA_FILE_TMP)) {
      return JSON.parse(fs.readFileSync(DATA_FILE_TMP, 'utf8'));
    }
    if (fs.existsSync(DATA_FILE_LOCAL)) {
      return JSON.parse(fs.readFileSync(DATA_FILE_LOCAL, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// GET /api/admin/table-menu?leadId=...
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400 });
    }

    // 1. Fetch lead by ID or by internalNotes / phone matching leadId
    let lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        proposals: { orderBy: { version: 'desc' }, take: 1 },
        tableMenus: { orderBy: { updatedAt: 'desc' }, take: 1 }
      }
    });

    if (!lead) {
      const cleanP = leadId.replace(/[^0-9]/g, '');
      const searchConditions = [
        { internalNotes: { contains: leadId } }
      ];
      if (cleanP.length >= 8) searchConditions.push({ phone: { contains: cleanP } });

      const matches = await prisma.lead.findMany({
        where: { OR: searchConditions },
        include: {
          proposals: { orderBy: { version: 'desc' }, take: 1 },
          tableMenus: { orderBy: { updatedAt: 'desc' }, take: 1 }
        },
        take: 1
      });
      if (matches.length > 0) lead = matches[0];
    }

    // 2. Fetch profile from cache/file store
    const profiles = getCachedProfiles();
    const cleanLId = leadId.replace(/[^0-9]/g, '');
    const foundProfile = profiles.find(p => (
      p.id === leadId ||
      p.dbLeadId === leadId ||
      (lead && (p.id === lead.id || p.dbLeadId === lead.id)) ||
      (cleanLId && cleanLId.length >= 8 && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanLId)
    ));

    const savedMenu = lead?.tableMenus?.[0] || null;
    const latestProposal = lead?.proposals?.[0];

    // Format event date
    let formattedDate = '';
    if (latestProposal?.eventDate) {
      formattedDate = new Date(latestProposal.eventDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    const splitText = (txt) => txt ? txt.split('\n').map(s => s.trim()).filter(Boolean) : [];

    const profileKhaiVi = foundProfile ? splitText(foundProfile.khaiViText) : [];
    const profileMonChinh = foundProfile ? splitText(foundProfile.monChinhText) : [];
    const profileTrangMieng = foundProfile ? splitText(foundProfile.trangMiengText) : [];
    const profileDoUong = foundProfile ? splitText(foundProfile.doUongText) : [];

    const brideGroomFinal = savedMenu?.brideGroomNames
      || (foundProfile?.groomName && foundProfile?.brideName ? `${foundProfile.groomName} & ${foundProfile.brideName}` : null)
      || lead?.brideGroomNames
      || lead?.name
      || 'Chú Rể & Cô Dâu';

    const responseData = {
      leadId: lead?.id || leadId,
      code: lead?.code || 'GP-PROFILE',
      name: lead?.name || foundProfile?.partyTitle || 'Khách Đặt Tiệc',
      brideGroomNames: brideGroomFinal,
      eventDate: savedMenu?.eventDate || foundProfile?.eventDate || formattedDate || '',
      title: savedMenu?.title || foundProfile?.partyTitle || 'Lễ Thành Hôn',
      khaiVi: (savedMenu && JSON.parse(savedMenu.khaiVi || '[]').length > 0) ? JSON.parse(savedMenu.khaiVi) : profileKhaiVi,
      monChinh: (savedMenu && JSON.parse(savedMenu.monChinh || '[]').length > 0) ? JSON.parse(savedMenu.monChinh) : profileMonChinh,
      trangMieng: (savedMenu && JSON.parse(savedMenu.trangMieng || '[]').length > 0) ? JSON.parse(savedMenu.trangMieng) : profileTrangMieng,
      doUong: (savedMenu && JSON.parse(savedMenu.doUong || '[]').length > 0) ? JSON.parse(savedMenu.doUong) : profileDoUong,
      footerText: savedMenu?.footerText || 'Chúc Quý Khách Ngon Miệng!',
      notes: savedMenu?.notes || '',
      updatedAt: savedMenu?.updatedAt || null
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/table-menu
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, title, brideGroomNames, eventDate, khaiVi, monChinh, trangMieng, doUong, footerText, notes } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400 });
    }

    const khaiViJson = JSON.stringify(Array.isArray(khaiVi) ? khaiVi : []);
    const monChinhJson = JSON.stringify(Array.isArray(monChinh) ? monChinh : []);
    const trangMiengJson = JSON.stringify(Array.isArray(trangMieng) ? trangMieng : []);
    const doUongJson = JSON.stringify(Array.isArray(doUong) ? doUong : []);

    const existingMenu = await prisma.tableMenu.findFirst({
      where: { leadId }
    });

    let saved;
    if (existingMenu) {
      saved = await prisma.tableMenu.update({
        where: { id: existingMenu.id },
        data: {
          title: title || 'Lễ Thành Hôn',
          brideGroomNames: brideGroomNames || '',
          eventDate: eventDate || '',
          khaiVi: khaiViJson,
          monChinh: monChinhJson,
          trangMieng: trangMiengJson,
          doUong: doUongJson,
          footerText: footerText || 'Chúc Quý Khách Ngon Miệng!',
          notes: notes || ''
        }
      });
    } else {
      saved = await prisma.tableMenu.create({
        data: {
          leadId,
          title: title || 'Lễ Thành Hôn',
          brideGroomNames: brideGroomNames || '',
          eventDate: eventDate || '',
          khaiVi: khaiViJson,
          monChinh: monChinhJson,
          trangMieng: trangMiengJson,
          doUong: doUongJson,
          footerText: footerText || 'Chúc Quý Khách Ngon Miệng!',
          notes: notes || ''
        }
      });
    }

    return NextResponse.json({ success: true, data: saved });

  } catch (error) {
    console.error('Error saving table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
