import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';

// Primary & Fallback Data File locations for maximum persistence
const DATA_FILE_TMP = path.join('/tmp', 'personalize-profiles.json');
const DATA_FILE_LOCAL = path.join(process.cwd(), 'src', 'data', 'personalize-profiles.json');

const DEMO_PROFILE = {
  id: 'demo-1',
  partyTitle: 'LỄ THÀNH HÔN',
  groomName: 'Đức Hoàng',
  brideName: 'Thu Hương',
  phone: '0912345678',
  eventDate: '2026-11-20',
  eventTime: '11:00 AM',
  floorId: 'FLOOR_3',
  venueName: 'Tầng 3',
  driveLink: 'https://drive.google.com/drive/folders/demo-golden-palace',
  ledStatus: 'Đã tùy chỉnh phông LED',
  ledTemplateId: 'led-cosmic-milkyway',
  ledFont: 'ballet',
  ledBrideGroomFontSize: 59,
  ledTitleFontSize: 32,
  ledDateFontSize: 24,
  musicStatus: 'Đã chọn danh sách nhạc',
  selectedMusic: ['w1', 'e1', 't1', 'd1'],
  youtubeLinks: { welcome: '', entrance: '', toast: '', dining: '' },
  customNotes: 'Mở bài "Beautiful in White" khi Chú Rể dắt Cô Dâu vào sảnh sân khấu.',
  createdAt: new Date().toISOString()
};

if (!global.gpDeletedProfileIds) {
  global.gpDeletedProfileIds = new Set();
}

if (!global.gpProfilesCache) {
  global.gpProfilesCache = [DEMO_PROFILE];
}

// Auto-delete profiles 7 days after the eventDate
async function autoCleanExpiredProfiles(profiles) {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const activeProfiles = [];
  const expiredDbIds = [];

  for (const p of profiles) {
    if (!p.eventDate || p.id === 'demo-1') {
      activeProfiles.push(p);
      continue;
    }

    try {
      const parts = (p.eventDate || '').split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const eventDateMs = new Date(year, month - 1, day).getTime();

        // Expired if current date is strictly more than 7 days after the wedding event date
        if (todayMs - eventDateMs > SEVEN_DAYS_MS) {
          if (p.dbLeadId) expiredDbIds.push(p.dbLeadId);
          continue;
        }
      }
    } catch (e) {}

    activeProfiles.push(p);
  }

  // Delete expired records from DB
  if (expiredDbIds.length > 0) {
    try {
      await prisma.lead.deleteMany({
        where: {
          id: { in: expiredDbIds }
        }
      });
    } catch (e) {
      console.error('Error auto-deleting expired profiles from DB:', e);
    }
  }

  return activeProfiles;
}

// Helper to read saved profiles from DB + Filesystem + Memory
async function readProfiles() {
  if (!global.gpDeletedProfileIds) {
    global.gpDeletedProfileIds = new Set();
  }

  let dbProfiles = [];
  try {
    // ONLY query records tagged specifically as [PERSONALIZE_PROFILE]
    const leads = await prisma.lead.findMany({
      where: {
        internalNotes: {
          contains: '[PERSONALIZE_PROFILE]'
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    dbProfiles = leads.map(l => {
      try {
        if (l.internalNotes && l.internalNotes.includes('[PERSONALIZE_PROFILE]')) {
          const match = l.internalNotes.match(/\[PERSONALIZE_PROFILE\]([\s\S]*)/);
          if (match && match[1]) {
            const parsed = JSON.parse(match[1].trim());
            return { ...parsed, dbLeadId: l.id };
          }
        }
      } catch (err) {
        console.error('Error parsing profile JSON from Lead:', err);
      }
      return null;
    }).filter(Boolean);
  } catch (e) {
    console.error('Error reading profiles from Prisma DB:', e);
  }

  let fileProfiles = [];
  try {
    if (fs.existsSync(DATA_FILE_TMP)) {
      const data = fs.readFileSync(DATA_FILE_TMP, 'utf8');
      fileProfiles = JSON.parse(data);
    } else if (fs.existsSync(DATA_FILE_LOCAL)) {
      const data = fs.readFileSync(DATA_FILE_LOCAL, 'utf8');
      fileProfiles = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading profiles file:', e);
  }

  const map = new Map();

  const isDeleted = (p) => {
    if (!p) return true;
    if (p.id && global.gpDeletedProfileIds.has(p.id)) return true;
    if (p.dbLeadId && global.gpDeletedProfileIds.has(p.dbLeadId)) return true;
    return false;
  };

  // Add DB profiles (authoritative primary store)
  if (Array.isArray(dbProfiles)) {
    dbProfiles.forEach(p => {
      if (p && p.id && !isDeleted(p)) {
        map.set(p.id, p);
      }
    });
  }

  // Add file profiles if not already deleted and not overriding existing DB profile
  if (Array.isArray(fileProfiles)) {
    fileProfiles.forEach(p => {
      if (p && p.id && !isDeleted(p)) {
        if (!map.has(p.id)) map.set(p.id, p);
      }
    });
  }

  // Add memory profiles if not deleted and not overriding existing DB profile
  if (global.gpProfilesCache && Array.isArray(global.gpProfilesCache)) {
    global.gpProfilesCache.forEach(p => {
      if (p && p.id && !isDeleted(p)) {
        if (!map.has(p.id)) map.set(p.id, p);
      }
    });
  }

  // Only seed DEMO_PROFILE if 0 profiles exist anywhere and demo-1 was NOT explicitly deleted
  if (map.size === 0 && !global.gpDeletedProfileIds.has('demo-1') && dbProfiles.length === 0 && fileProfiles.length === 0) {
    map.set(DEMO_PROFILE.id, DEMO_PROFILE);
  }

  let merged = Array.from(map.values()).sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  // Automatically clean & purge profiles older than 7 days after the event date
  merged = await autoCleanExpiredProfiles(merged);

  global.gpProfilesCache = merged;
  return merged;
}

// Helper to save profile into DB + Filesystem + Memory
async function persistProfile(profileData) {
  if (!global.gpDeletedProfileIds) global.gpDeletedProfileIds = new Set();
  if (profileData.id) global.gpDeletedProfileIds.delete(profileData.id);
  if (profileData.dbLeadId) global.gpDeletedProfileIds.delete(profileData.dbLeadId);

  // 1. Memory update
  let profiles = global.gpProfilesCache || [];
  const cleanPhone = (profileData.phone || '').replace(/[^0-9]/g, '');
  
  const existingIdx = profiles.findIndex(p => (
    p.id === profileData.id ||
    (cleanPhone && cleanPhone.length >= 8 && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanPhone)
  ));

  if (existingIdx >= 0) {
    profiles[existingIdx] = profileData;
  } else {
    profiles.unshift(profileData);
  }
  global.gpProfilesCache = profiles;

  // 2. Save to /tmp disk & local disk
  try {
    const dirTmp = path.dirname(DATA_FILE_TMP);
    if (!fs.existsSync(dirTmp)) fs.mkdirSync(dirTmp, { recursive: true });
    fs.writeFileSync(DATA_FILE_TMP, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (e) {}

  try {
    const dirLocal = path.dirname(DATA_FILE_LOCAL);
    if (!fs.existsSync(dirLocal)) fs.mkdirSync(dirLocal, { recursive: true });
    fs.writeFileSync(DATA_FILE_LOCAL, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (e) {}

  // 3. Save to Prisma Database (PostgreSQL / Supabase)
  try {
    const jsonTag = `[PERSONALIZE_PROFILE] ${JSON.stringify(profileData)}`;
    let existingLead = null;

    if (cleanPhone && cleanPhone.length >= 8) {
      existingLead = await prisma.lead.findFirst({
        where: {
          phone: { contains: cleanPhone },
          internalNotes: { contains: '[PERSONALIZE_PROFILE]' }
        }
      });
    }

    let targetLead = null;
    if (existingLead) {
      targetLead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name: `${profileData.partyTitle} (${profileData.groomName} & ${profileData.brideName})`,
          phone: profileData.phone || existingLead.phone,
          brideGroomNames: `${profileData.groomName} & ${profileData.brideName}`,
          notes: profileData.partyTitle,
          internalNotes: jsonTag
        }
      });
    } else {
      const code = `GP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      targetLead = await prisma.lead.create({
        data: {
          code,
          linkToken: randomUUID(),
          name: `${profileData.partyTitle} (${profileData.groomName} & ${profileData.brideName})`,
          phone: profileData.phone || '0000000000',
          brideGroomNames: `${profileData.groomName} & ${profileData.brideName}`,
          notes: profileData.partyTitle,
          internalNotes: jsonTag
        }
      });
    }

    // Auto-upsert TableMenu in database if menu categories exist
    if (targetLead && (profileData.khaiViText || profileData.monChinhText || profileData.doUongText)) {
      const splitArr = (txt) => txt ? txt.split('\n').map(s => s.trim()).filter(Boolean) : [];
      const jsonStr = (txt) => JSON.stringify(splitArr(txt));

      const existingMenu = await prisma.tableMenu.findFirst({
        where: { leadId: targetLead.id }
      });

      const menuData = {
        title: profileData.partyTitle || 'WEDDING MENU',
        brideGroomNames: `${profileData.groomName} & ${profileData.brideName}`,
        eventDate: profileData.eventDate || '',
        khaiVi: jsonStr(profileData.khaiViText),
        monChinh: jsonStr(profileData.monChinhText),
        trangMieng: jsonStr(profileData.trangMiengText),
        doUong: jsonStr(profileData.doUongText),
        footerText: 'Chúc Quý Khách Ngon Miệng!',
        notes: profileData.customNotes || ''
      };

      if (existingMenu) {
        await prisma.tableMenu.update({
          where: { id: existingMenu.id },
          data: menuData
        });
      } else {
        await prisma.tableMenu.create({
          data: {
            leadId: targetLead.id,
            ...menuData
          }
        });
      }
    }
  } catch (dbErr) {
    console.error('Error saving profile to Prisma database:', dbErr);
  }
}

// Helper to remove profile from DB + Filesystem + Memory
async function removeProfile(id) {
  if (!id) return;
  const targetId = String(id).trim();

  if (!global.gpDeletedProfileIds) global.gpDeletedProfileIds = new Set();
  global.gpDeletedProfileIds.add(targetId);

  // 1. Load all current profiles from DB & Memory to find matching targets
  const allProfiles = await readProfiles();
  const target = allProfiles.find(p => p.id === targetId || p.dbLeadId === targetId);

  if (target) {
    if (target.id) global.gpDeletedProfileIds.add(target.id);
    if (target.dbLeadId) global.gpDeletedProfileIds.add(target.dbLeadId);
  }

  // 2. Build multi-condition query to locate matching leads in Prisma DB
  const dbOrConditions = [
    { id: targetId },
    { internalNotes: { contains: targetId } }
  ];

  if (target?.dbLeadId) dbOrConditions.push({ id: target.dbLeadId });
  if (target?.id) dbOrConditions.push({ internalNotes: { contains: target.id } });

  const cleanPhone = (target?.phone || (targetId.length >= 8 ? targetId : '')).replace(/[^0-9]/g, '');
  if (cleanPhone && cleanPhone.length >= 8) {
    dbOrConditions.push({ phone: { contains: cleanPhone } });
  }

  if (target?.groomName && target?.brideName) {
    dbOrConditions.push({
      brideGroomNames: { contains: `${target.groomName}` }
    });
  }

  let matchingLeads = [];
  try {
    matchingLeads = await prisma.lead.findMany({
      where: { OR: dbOrConditions }
    });
  } catch (e) {
    console.error('Error finding matching leads for deletion:', e);
  }

  const leadIdsToDelete = new Set();
  matchingLeads.forEach(l => leadIdsToDelete.add(l.id));
  if (target?.dbLeadId) leadIdsToDelete.add(target.dbLeadId);
  leadIdsToDelete.forEach(lId => global.gpDeletedProfileIds.add(lId));

  // 3. Delete from DB (TableMenu, Proposal, and Lead)
  if (leadIdsToDelete.size > 0) {
    const idsArray = Array.from(leadIdsToDelete);
    try {
      await prisma.tableMenu.deleteMany({
        where: { leadId: { in: idsArray } }
      });
    } catch (e) {}

    try {
      await prisma.proposal.deleteMany({
        where: { leadId: { in: idsArray } }
      });
    } catch (e) {}

    try {
      await prisma.lead.deleteMany({
        where: { id: { in: idsArray } }
      });
      console.log(`Successfully deleted leads from DB:`, idsArray);
    } catch (e) {
      console.error('Error deleting leads by ID array from DB:', e);
    }
  }

  // Fallback direct deleteMany for internalNotes / OR conditions
  try {
    await prisma.lead.deleteMany({
      where: { OR: dbOrConditions }
    });
  } catch (e) {
    console.error('Error executing fallback deleteMany on leads:', e);
  }

  // 4. Update in-memory cache
  const nextCache = (global.gpProfilesCache || []).filter(p => (
    p.id !== targetId &&
    p.dbLeadId !== targetId &&
    !leadIdsToDelete.has(p.dbLeadId) &&
    !leadIdsToDelete.has(p.id) &&
    !global.gpDeletedProfileIds.has(p.id) &&
    !global.gpDeletedProfileIds.has(p.dbLeadId)
  ));
  global.gpProfilesCache = nextCache;

  // 5. Sync to files
  try {
    if (fs.existsSync(DATA_FILE_TMP)) {
      fs.writeFileSync(DATA_FILE_TMP, JSON.stringify(nextCache, null, 2), 'utf8');
    }
  } catch (e) {}
  try {
    if (fs.existsSync(DATA_FILE_LOCAL)) {
      fs.writeFileSync(DATA_FILE_LOCAL, JSON.stringify(nextCache, null, 2), 'utf8');
    }
  } catch (e) {}
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const profiles = await readProfiles();

  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 8) {
      const found = profiles.find(p => p.phone && p.phone.replace(/[^0-9]/g, '') === cleanPhone);
      if (found) {
        return NextResponse.json(
          { success: true, profile: found },
          { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    return NextResponse.json(
      { success: false, message: 'Chưa có hồ sơ nào với SĐT này' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  return NextResponse.json(
    { success: true, profiles },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      partyTitle,
      groomName,
      brideName,
      phone,
      eventDate,
      eventTime,
      floorId,
      driveLink,
      ledStatus,
      musicStatus,
      ledTemplateId,
      ledFont,
      ledBrideGroomFontSize,
      ledTitleFontSize,
      ledDateFontSize,
      selectedMusic,
      youtubeLinks,
      customNotes,
      khaiViText,
      monChinhText,
      trangMiengText,
      doUongText
    } = body;

    const profiles = await readProfiles();
    const cleanInputPhone = (phone || '').replace(/[^0-9]/g, '');

    const existingIndex = profiles.findIndex(p => (
      (id && p.id === id) ||
      (cleanInputPhone && cleanInputPhone.length >= 8 && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanInputPhone)
    ));

    const venueName = floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3';

    let profileData;

    if (existingIndex >= 0) {
      // PRESERVE EXISTING PROFILE SETTINGS (LED, Music, Notes) & MERGE MISSING INFO
      const old = profiles[existingIndex];
      profileData = {
        ...old,
        partyTitle: partyTitle || old.partyTitle,
        groomName: groomName || old.groomName,
        brideName: brideName || old.brideName,
        phone: phone || old.phone,
        eventDate: eventDate || old.eventDate,
        eventTime: eventTime || old.eventTime,
        floorId: floorId || old.floorId,
        venueName,
        driveLink: driveLink || old.driveLink,
        ledTemplateId: old.ledTemplateId || ledTemplateId || 'led-cosmic-milkyway',
        ledFont: old.ledFont || ledFont || 'ballet',
        ledBrideGroomFontSize: old.ledBrideGroomFontSize ?? ledBrideGroomFontSize ?? 59,
        ledTitleFontSize: old.ledTitleFontSize ?? ledTitleFontSize ?? 32,
        ledDateFontSize: old.ledDateFontSize ?? ledDateFontSize ?? 24,
        selectedMusic: (old.selectedMusic && old.selectedMusic.length > 0) ? old.selectedMusic : (selectedMusic || []),
        youtubeLinks: (old.youtubeLinks && Object.values(old.youtubeLinks).some(Boolean)) ? old.youtubeLinks : (youtubeLinks || {}),
        customNotes: (old.customNotes && old.customNotes !== 'Không có ghi chú thêm') ? old.customNotes : (customNotes || ''),
        khaiViText: old.khaiViText ? old.khaiViText : (khaiViText || ''),
        monChinhText: old.monChinhText ? old.monChinhText : (monChinhText || ''),
        trangMiengText: old.trangMiengText ? old.trangMiengText : (trangMiengText || ''),
        doUongText: old.doUongText ? old.doUongText : (doUongText || ''),
        updatedAt: new Date().toISOString()
      };
    } else {
      // NEW PROFILE CREATION
      profileData = {
        id: id || `prof-${Date.now()}`,
        partyTitle: partyTitle || `LỄ THÀNH HÔN ${groomName || ''} & ${brideName || ''}`.trim(),
        groomName: groomName || '',
        brideName: brideName || '',
        phone: phone || '',
        eventDate: eventDate || new Date().toISOString().split('T')[0],
        eventTime: eventTime || '11:00 AM',
        floorId: floorId || 'FLOOR_3',
        venueName,
        driveLink: driveLink || '',
        ledStatus: 'Tự động tạo phông LED mặc định',
        ledTemplateId: ledTemplateId || 'led-cosmic-milkyway',
        ledFont: ledFont || 'ballet',
        ledBrideGroomFontSize: ledBrideGroomFontSize ?? 59,
        ledTitleFontSize: ledTitleFontSize ?? 32,
        ledDateFontSize: ledDateFontSize ?? 24,
        musicStatus: (selectedMusic && selectedMusic.length > 0) ? 'Đã chọn danh sách nhạc' : 'Không có yêu cầu gì',
        selectedMusic: selectedMusic || [],
        youtubeLinks: youtubeLinks || {},
        customNotes: customNotes || '',
        khaiViText: khaiViText || '',
        monChinhText: monChinhText || '',
        trangMiengText: trangMiengText || '',
        doUongText: doUongText || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    await persistProfile(profileData);

    return NextResponse.json({ success: true, profile: profileData, message: 'Đã lưu cấu hình tiệc cưới thành công!' });
  } catch (error) {
    console.error('Error saving personalization profile:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi lưu cấu hình' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user.role === 'MEMBER') {
      return NextResponse.json({ success: false, message: 'Tài khoản Kỹ Thuật không có quyền sửa bản ghi!' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID hồ sơ' }, { status: 400 });
    }

    const profiles = await readProfiles();
    const index = profiles.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy hồ sơ' }, { status: 404 });
    }

    const updatedProfile = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await persistProfile(updatedProfile);

    return NextResponse.json({ success: true, profile: updatedProfile, message: 'Đã cập nhật hồ sơ thành công!' });
  } catch (e) {
    console.error('Error updating profile:', e);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID hồ sơ cần xóa' }, { status: 400 });
    }

    await removeProfile(id);

    return NextResponse.json({ success: true, message: 'Đã xóa hồ sơ thành công!' });
  } catch (e) {
    console.error('Error deleting profile:', e);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
