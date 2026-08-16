import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { invitationSlug, guestName, phone, attending, guestCount, wishes } = body;

    if (!guestName) {
      return NextResponse.json({ success: false, error: 'Vui lòng điền họ tên' }, { status: 400 });
    }

    console.log(`[RSVP RECEIVED] Slug: ${invitationSlug} | Khách: ${guestName} | SĐT: ${phone} | Tham dự: ${attending} | Số người: ${guestCount} | Lời chúc: ${wishes}`);

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã gửi phản hồi RSVP thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
