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
      ledStatus: 'Đã chọn mẫu Hoàng Gia Ép Kim',
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
    const newProfile = {
      id: `prof-${Date.now()}`,
      partyTitle: partyTitle || `Tiệc cưới ${groomName || 'Chú rể'} & ${brideName || 'Cô dâu'}`,
      groomName: groomName || 'Chú rể',
      brideName: brideName || 'Cô dâu',
      phone: phone || 'Chưa cung cấp',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      eventTime: eventTime || 'Buổi Trưa (11:00 AM)',
      floorId: floorId || 'FLOOR_3',
      venueName: floorId === 'FLOOR_1' ? 'Tầng 1' : floorId === 'FLOOR_2' ? 'Tầng 2' : floorId === 'FLOOR_4' ? 'Tầng 4' : 'Tầng 3',
      driveLink: driveLink || '',
      ledStatus: ledStatus || 'Không có yêu cầu gì',
      ledTemplateId: ledTemplateId || 'led-golden-royal',
      musicStatus: musicStatus || 'Không có yêu cầu gì',
      selectedMusic: selectedMusic || [],
      youtubeLinks: youtubeLinks || {},
      customNotes: customNotes || 'Không có ghi chú thêm',
      createdAt: new Date().toISOString()
    };

    profiles.unshift(newProfile);
    saveProfiles(profiles);

    return NextResponse.json({ success: true, profile: newProfile, message: 'Đã lưu cấu hình tiệc cưới thành công!' });
  } catch (error) {
    console.error('Error saving personalization profile:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi lưu cấu hình' }, { status: 500 });
  }
}
