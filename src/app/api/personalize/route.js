import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import fs from 'fs';
import path from 'path';

// Primary & Fallback Data File locations for maximum persistence
const DATA_FILE_TMP = path.join('/tmp', 'personalize-profiles.json');
const DATA_FILE_LOCAL = path.join(process.cwd(), 'src', 'data', 'personalize-profiles.json');

if (!global.gpProfilesCache) {
  global.gpProfilesCache = [
    {
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
    }
  ];
}

// Helper to read saved profiles
function readProfiles() {
  try {
    if (fs.existsSync(DATA_FILE_TMP)) {
      const data = fs.readFileSync(DATA_FILE_TMP, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.gpProfilesCache = parsed;
        return global.gpProfilesCache;
      }
    }
    if (fs.existsSync(DATA_FILE_LOCAL)) {
      const data = fs.readFileSync(DATA_FILE_LOCAL, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.gpProfilesCache = parsed;
        return global.gpProfilesCache;
      }
    }
  } catch (e) {
    console.error('Error reading profiles file:', e);
  }
  return global.gpProfilesCache || [];
}

// Helper to save profiles
function saveProfiles(profiles) {
  global.gpProfilesCache = profiles;
  try {
    const dirTmp = path.dirname(DATA_FILE_TMP);
    if (!fs.existsSync(dirTmp)) {
      fs.mkdirSync(dirTmp, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_TMP, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing /tmp profiles file:', e);
  }

  try {
    const dirLocal = path.dirname(DATA_FILE_LOCAL);
    if (!fs.existsSync(dirLocal)) {
      fs.mkdirSync(dirLocal, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_LOCAL, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (e) {
    // Expected to fail on read-only Vercel serverless file system, gracefully ignore
  }
}

export async function GET() {
  const profiles = readProfiles();
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

    const profiles = readProfiles();
    const venueName = floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3';

    // Deduplication check: Match by same phone/names or same partyTitle
    const existingIndex = profiles.findIndex(p => (
      (p.phone && phone && p.phone === phone && p.eventDate === eventDate) ||
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

    if (existingIndex >= 0) {
      // Overwrite existing record
      profiles[existingIndex] = profileData;
    } else {
      // Add new record at top
      profiles.unshift(profileData);
    }

    saveProfiles(profiles);

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

    const profiles = readProfiles();
    const index = profiles.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy hồ sơ' }, { status: 404 });
    }

    profiles[index] = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveProfiles(profiles);
    return NextResponse.json({ success: true, profile: profiles[index], message: 'Đã cập nhật hồ sơ thành công!' });
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

    let profiles = readProfiles();
    profiles = profiles.filter(p => p.id !== id);
    saveProfiles(profiles);

    return NextResponse.json({ success: true, message: 'Đã xóa hồ sơ thành công!' });
  } catch (e) {
    console.error('Error deleting profile:', e);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
