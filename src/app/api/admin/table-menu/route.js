import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function getProfilesFromDb() {
  if (global.gpProfilesCache && Array.isArray(global.gpProfilesCache) && global.gpProfilesCache.length > 0) {
    return global.gpProfilesCache;
  }
  try {
    const leads = await prisma.lead.findMany({
      where: {
        internalNotes: {
          contains: '[PERSONALIZE_PROFILE]'
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const dbProfiles = leads.map(l => {
      try {
        if (l.internalNotes && l.internalNotes.includes('[PERSONALIZE_PROFILE]')) {
          const match = l.internalNotes.match(/\[PERSONALIZE_PROFILE\]([\s\S]*)/);
          if (match && match[1]) {
            const parsed = JSON.parse(match[1].trim());
            return { ...parsed, dbLeadId: l.id };
          }
        }
      } catch (err) {}
      return null;
    }).filter(Boolean);

    if (dbProfiles.length > 0) {
      global.gpProfilesCache = dbProfiles;
      return dbProfiles;
    }
  } catch (e) {}

  return getCachedProfiles();
}

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
};

// GET /api/admin/table-menu?leadId=...
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noCacheHeaders });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400, headers: noCacheHeaders });
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

    // Direct profile extraction from lead.internalNotes if available
    let profileFromLead = null;
    if (lead?.internalNotes && lead.internalNotes.includes('[PERSONALIZE_PROFILE]')) {
      try {
        const match = lead.internalNotes.match(/\[PERSONALIZE_PROFILE\]([\s\S]*)/);
        if (match && match[1]) {
          profileFromLead = JSON.parse(match[1].trim());
        }
      } catch (e) {}
    }

    // 2. Fetch profile from DB / cache store
    const profiles = await getProfilesFromDb();
    const cleanLId = leadId.replace(/[^0-9]/g, '');
    const foundProfile = profileFromLead || profiles.find(p => (
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
    const safeParseArray = (jsonStr) => {
      try {
        const parsed = JSON.parse(jsonStr || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    };

    const savedKhaiVi = safeParseArray(savedMenu?.khaiVi);
    const savedMonChinh = safeParseArray(savedMenu?.monChinh);
    const savedTrangMieng = safeParseArray(savedMenu?.trangMieng);
    const savedDoUong = safeParseArray(savedMenu?.doUong);

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
      khaiVi: savedKhaiVi.length > 0 ? savedKhaiVi : profileKhaiVi,
      monChinh: savedMonChinh.length > 0 ? savedMonChinh : profileMonChinh,
      trangMieng: savedTrangMieng.length > 0 ? savedTrangMieng : profileTrangMieng,
      doUong: savedDoUong.length > 0 ? savedDoUong : profileDoUong,
      footerText: savedMenu?.footerText || 'Chúc Quý Khách Ngon Miệng!',
      notes: savedMenu?.notes || '',
      updatedAt: savedMenu?.updatedAt || null
    };

    return NextResponse.json(responseData, { headers: noCacheHeaders });

  } catch (error) {
    console.error('Error fetching table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: noCacheHeaders });
  }
}

// POST /api/admin/table-menu
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noCacheHeaders });
    }

    const body = await request.json();
    const { leadId, title, brideGroomNames, eventDate, khaiVi, monChinh, trangMieng, doUong, footerText, notes } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId là bắt buộc' }, { status: 400, headers: noCacheHeaders });
    }

    const khaiViJson = JSON.stringify(Array.isArray(khaiVi) ? khaiVi : []);
    const monChinhJson = JSON.stringify(Array.isArray(monChinh) ? monChinh : []);
    const trangMiengJson = JSON.stringify(Array.isArray(trangMieng) ? trangMieng : []);
    const doUongJson = JSON.stringify(Array.isArray(doUong) ? doUong : []);

    let targetLeadId = leadId;

    // Check if leadId exists as DB ID or matching lead
    let lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      const cleanP = leadId.replace(/[^0-9]/g, '');
      const searchConditions = [{ internalNotes: { contains: leadId } }];
      if (cleanP.length >= 8) searchConditions.push({ phone: { contains: cleanP } });

      const matches = await prisma.lead.findMany({ where: { OR: searchConditions }, take: 1 });
      if (matches.length > 0) {
        lead = matches[0];
        targetLeadId = lead.id;
      }
    }

    const existingMenu = await prisma.tableMenu.findFirst({
      where: { leadId: targetLeadId }
    });

    const menuData = {
      title: title || 'Lễ Thành Hôn',
      brideGroomNames: brideGroomNames || '',
      eventDate: eventDate || '',
      khaiVi: khaiViJson,
      monChinh: monChinhJson,
      trangMieng: trangMiengJson,
      doUong: doUongJson,
      footerText: footerText || 'Chúc Quý Khách Ngon Miệng!',
      notes: notes || ''
    };

    let saved;
    if (existingMenu) {
      saved = await prisma.tableMenu.update({
        where: { id: existingMenu.id },
        data: menuData
      });
    } else {
      saved = await prisma.tableMenu.create({
        data: {
          leadId: targetLeadId,
          ...menuData
        }
      });
    }

    // Also update internalNotes on lead if lead exists to keep personalize profile 100% in sync
    if (lead && lead.internalNotes && lead.internalNotes.includes('[PERSONALIZE_PROFILE]')) {
      try {
        const match = lead.internalNotes.match(/\[PERSONALIZE_PROFILE\]([\s\S]*)/);
        if (match && match[1]) {
          const profile = JSON.parse(match[1].trim());
          profile.khaiViText = (Array.isArray(khaiVi) ? khaiVi : []).join('\n');
          profile.monChinhText = (Array.isArray(monChinh) ? monChinh : []).join('\n');
          profile.trangMiengText = (Array.isArray(trangMieng) ? trangMieng : []).join('\n');
          profile.doUongText = (Array.isArray(doUong) ? doUong : []).join('\n');
          profile.partyTitle = title || profile.partyTitle;
          profile.updatedAt = new Date().toISOString();

          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              internalNotes: `[PERSONALIZE_PROFILE] ${JSON.stringify(profile)}`
            }
          });

          // Update memory cache
          if (global.gpProfilesCache && Array.isArray(global.gpProfilesCache)) {
            const idx = global.gpProfilesCache.findIndex(p => p.id === profile.id || p.dbLeadId === lead.id);
            if (idx >= 0) {
              global.gpProfilesCache[idx] = profile;
            }
          }
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, data: saved }, { headers: noCacheHeaders });

  } catch (error) {
    console.error('Error saving table menu:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: noCacheHeaders });
  }
}

