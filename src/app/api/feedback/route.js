import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), '.next', 'website-feedback.json');

function readFeedbacks() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveFeedbacks(list) {
  try {
    const dir = path.dirname(FEEDBACK_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    console.error(e);
  }
}

export async function GET() {
  const feedbacks = readFeedbacks();
  return NextResponse.json({ success: true, feedbacks });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { category, content, name, phone, email } = body;

    if (!content) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập nội dung phản hồi' }, { status: 400 });
    }

    const list = readFeedbacks();
    const item = {
      id: `fb-${Date.now()}`,
      category: category || 'Góp ý chung',
      content,
      name: name || 'Khách hàng ẩn danh',
      phone: phone || 'Không cung cấp',
      email: email || '',
      createdAt: new Date().toISOString()
    };

    list.unshift(item);
    saveFeedbacks(list);

    return NextResponse.json({ success: true, message: 'Cảm ơn quý khách đã gửi phản hồi cho Golden Palace!' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
