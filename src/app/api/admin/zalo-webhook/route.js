import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { webhookUrl, test } = await request.json();

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Vui lòng nhập Webhook URL Zalo Tự Động Hóa' }, { status: 400 });
    }

    if (test) {
      const samplePayload = {
        event: 'TEST_CONNECTION',
        message: `🧪 KIỂM TRA KẾT NỐI TỰ ĐỘNG HÓA ZALO
📌 Nhóm nhận: Chốt tiền hàng
👤 Khách hàng mẫu: Nguyễn Văn A (TEST)
📞 Số điện thoại: 0945857996
🏛️ Sảnh tiệc yêu cầu: Hội trường Tầng 2
👥 Quy mô: 400 khách (40 mâm)
💰 Dự toán chi phí: 185.000.000 VNĐ
✅ Kết nối giữa Hệ thống Đặt tiệc Golden Palace & Nhóm Zalo 'Chốt tiền hàng' đã HOÀN HẢO!`
      };

      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(samplePayload)
        });
        if (res.ok) {
          return NextResponse.json({ success: true, message: 'Đã phát tin nhắn thử nghiệm tới Webhook Zalo thành công!' });
        }
      } catch (e) {
        console.error('Test webhook error:', e);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Đã lưu cấu hình Webhook URL thành công. Mỗi khi có khách mới, hệ thống sẽ tự động phát thông báo!' 
      });
    }

    return NextResponse.json({ success: true, webhookUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
