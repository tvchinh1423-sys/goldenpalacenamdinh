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
  ledTemplateId: 'led-starry-diamond',
  musicStatus: 'Đã chọn danh sách nhạc',
  selectedMusic: ['w1', 'e1', 't1', 'd1'],
  youtubeLinks: { welcome: '', entrance: '', toast: '', dining: '' },
  customNotes: 'Mở bài "Beautiful in White" khi Chú Rể dắt Cô Dâu vào sảnh sân khấu.',
  createdAt: new Date().toISOString()
};

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

  // Merge map by Phone or ID
  const map = new Map();
  map.set(DEMO_PROFILE.phone, DEMO_PROFILE);

  if (global.gpProfilesCache && Array.isArray(global.gpProfilesCache)) {
    global.gpProfilesCache.forEach(p => {
      if (p && p.id) map.set(p.phone || p.id, p);
    });
  }

  if (Array.isArray(fileProfiles)) {
    fileProfiles.forEach(p => {
      if (p && p.id) map.set(p.phone || p.id, p);
    });
  }

  if (Array.isArray(dbProfiles)) {
    dbProfiles.forEach(p => {
      if (p && p.id) map.set(p.phone || p.id, p);
    });
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
  // 1. Memory update
  let profiles = global.gpProfilesCache || [DEMO_PROFILE];
  const cleanPhone = (profileData.phone || '').replace(/[^0-9]/g, '');
  
  const existingIdx = profiles.findIndex(p => (
    (cleanPhone && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
    p.id === profileData.id
  ));

  if (existingIdx >= 0) {
    profiles[existingIdx] = profileData;
  } else {
    profiles.unshift(profileData);
  }
  global.gpProfilesCache = profiles;

  // 2. Save to /tmp disk
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

    if (existingLead) {
      await prisma.lead.update({
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
      await prisma.lead.create({
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
  } catch (dbErr) {
    console.error('Error saving profile to Prisma database:', dbErr);
  }
}

// Helper to remove profile from DB + Memory
async function removeProfile(id) {
  let profiles = global.gpProfilesCache || [];
  const target = profiles.find(p => p.id === id);
  profiles = profiles.filter(p => p.id !== id);
  global.gpProfilesCache = profiles;

  try {
    if (fs.existsSync(DATA_FILE_TMP)) {
      fs.writeFileSync(DATA_FILE_TMP, JSON.stringify(profiles, null, 2), 'utf8');
    }
  } catch (e) {}

  if (target) {
    try {
      const cleanPhone = (target.phone || '').replace(/[^0-9]/g, '');
      if (cleanPhone.length >= 8) {
        await prisma.lead.deleteMany({
          where: {
            phone: { contains: cleanPhone },
            internalNotes: { contains: '[PERSONALIZE_PROFILE]' }
          }
        });
      } else if (target.dbLeadId) {
        await prisma.lead.delete({
          where: { id: target.dbLeadId }
        });
      }
    } catch (e) {
      console.error('Error deleting profile from DB:', e);
    }
  }
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
      selectedMusic,
      youtubeLinks,
      customNotes
    } = body;

    const profiles = await readProfiles();
    const venueName = floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3';

    const cleanInputPhone = (phone || '').replace(/[^0-9]/g, '');

    const existingIndex = profiles.findIndex(p => (
      (cleanInputPhone && p.phone && p.phone.replace(/[^0-9]/g, '') === cleanInputPhone) ||
      (p.groomName && groomName && p.groomName === groomName && p.brideName === brideName && p.eventDate === eventDate)
    ));

    const profileData = {
      id: existingIndex >= 0 ? profiles[existingIndex].id : `prof-${Date.now()}`,
      partyTitle: partyTitle || `LỄ THÀNH HÔN ${groomName || 'Đức Hoàng'} & ${brideName || 'Thu Hương'}`,
      groomName: groomName || 'Đức Hoàng',
      brideName: brideName || 'Thu Hương',
      phone: phone || 'Chưa cung cấp',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || '11:00 AM',
      floorId: floorId || 'FLOOR_3',
      venueName,
      driveLink: driveLink || '',
      ledStatus: ledStatus || 'Đã tùy chỉnh phông LED',
      ledTemplateId: ledTemplateId || 'led-starry-diamond',
      musicStatus: (selectedMusic && selectedMusic.length > 0) || Object.values(youtubeLinks || {}).some(Boolean) ? 'Đã chọn danh sách nhạc' : 'Không có yêu cầu gì',
      selectedMusic: selectedMusic || [],
      youtubeLinks: youtubeLinks || {},
      customNotes: customNotes || 'Không có ghi chú thêm',
      createdAt: existingIndex >= 0 ? profiles[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

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
    if (session && session.user.role === 'MEMBER') {
      return NextResponse.json({ success: false, message: 'Tài khoản Kỹ Thuật không có quyền xóa bản ghi!' }, { status: 403 });
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
