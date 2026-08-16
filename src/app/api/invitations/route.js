import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { slug, groomName, brideName, templateId, eventDate } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Thiếu slug thiệp cưới' }, { status: 400 });
    }

    // In MVP, we return a successful response with the generated slug
    return NextResponse.json({
      success: true,
      slug,
      message: 'Tạo thiệp cưới điện tử thành công!',
      data: {
        groomName,
        brideName,
        templateId,
        eventDate
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
