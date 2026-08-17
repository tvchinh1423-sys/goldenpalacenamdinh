import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use /tmp on Vercel / Linux serverless environment for reliable write access
const DATA_FILE = path.join('/tmp', 'personalize-profiles.json');

if (!global.gpProfilesCache) {
  global.gpProfilesCache = [
    {
      id: 'demo-1',
      partyTitle: 'Tiệc cưới Anh Thư & Văn Mạnh',
      groomName: 'Văn Mạnh',
      brideName: 'Anh Thư',
      phone: '0912345678',
      eventDate: '2026-11-20',
      eventTime: 'Buổi Trưa (11:00 AM)',
      floorId: 'FLOOR_3',
      venueName: 'Tầng 3',
      driveLink: 'https://drive.google.com/drive/folders/demo-golden-palace',
      ledStatus: 'Mẫu Phông Mặc Định Tầng 3',
      ledTemplateId: 'led-golden-royal',
      musicStatus: 'Đã chọn 4 bài hát yêu thích',
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
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.gpProfilesCache = parsed;
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
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing profiles file:', e);
  }
}

export async function GET() {
  const profiles = readProfiles();
  return NextResponse.json({ success: true, profiles });
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

    if (!phone && !partyTitle) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập Tên Tiệc hoặc SĐT liên hệ' }, { status: 400 });
    }

    const profiles = readProfiles();
    const venueName = floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3';

    // Deduplication check: Match by same eventDate + eventTime + venueName (or same phone/names)
    const existingIndex = profiles.findIndex(p => (
      (p.eventDate === eventDate && p.eventTime === eventTime && p.venueName === venueName) ||
      (p.phone && phone && p.phone === phone && p.eventDate === eventDate)
    ));

    const profileData = {
      id: existingIndex >= 0 ? profiles[existingIndex].id : `prof-${Date.now()}`,
      partyTitle: partyTitle || `Tiệc cưới ${groomName || 'Chú rể'} & ${brideName || 'Cô dâu'}`,
      groomName: groomName || 'Chú rể',
      brideName: brideName || 'Cô dâu',
      phone: phone || 'Chưa cung cấp',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || 'Buổi Trưa (11:00 AM)',
      floorId: floorId || 'FLOOR_3',
      venueName,
      driveLink: driveLink || '',
      ledStatus: ledStatus || 'Phông Mặc Định Sảnh Tiệc',
      ledTemplateId: ledTemplateId || 'led-golden-royal',
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
      // Add new record
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
