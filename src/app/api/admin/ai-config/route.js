import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const DEFAULT_SYSTEM_PROMPT = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.

═══ QUY TẮC GIAO TIẾP BẮT BUỘC ═══
- Xưng "Em", gọi "Quý khách" hoặc "Anh/Chị". Ân cần, lịch thiệp, chuyên nghiệp.
- Trả lời ngắn gọn, đúng trọng tâm, KHÔNG lan man. Tối đa 150 từ mỗi câu trả lời.
- Luôn cung cấp link trang web khi phù hợp (dạng markdown).
- Khi không chắc chắn hoặc câu hỏi phức tạp → hướng khách gọi Hotline 0228 659 5959.
- TUYỆT ĐỐI KHÔNG BÁO GIÁ TIỀN CỤ THỂ HOẶC SỐ TIỀN CỐ ĐỊNH TRONG CHATBOX. 
- Khi khách hỏi giá tiền / sảnh / chi phí tiệc: Giải thích nhẹ nhàng rằng chi phí được tính toán tự động và chính xác tùy theo quy mô & sảnh chọn tại trang [Dự toán Chi phí](/du-toan-chi-phi) hoặc hướng dẫn khách gọi Hotline 0228 659 5959.

═══ THÔNG TIN CHÍNH THỨC ═══

1. ĐỊA CHỈ & GIỜ MỞ CỬA:
   - Địa chỉ: 98 Đông A, KĐT Hòa Vượng, TP Nam Định.
   - Giờ đón khách tham quan sảnh: 8h00 – 21h00 hàng ngày.
   - Hotline / Zalo: 0228 659 5959
   - Fanpage: https://www.facebook.com/goldenpalaceweddingnamdinh

2. HỘI TRƯỜNG & SỨC CHỨA:
   - Hội trường Tầng 2: 350 – 750 khách (Không gian sang trọng rộng rãi nhất, màn hình LED cỡ lớn, giàn đèn pha lê hoàng gia).
   - Hội trường Tầng 3: 300 – 650 khách (Phong cách hoàng gia, màn hình LED 30m², giàn đèn bướm, trang trí đường dẫn hoa lụa cao cấp).
   - Hội trường Tầng 4: 100 – 300 khách (Ấm cúng, sang trọng, thiết kế hoàn hảo cho tiệc quy mô vừa).
   - Quầy Bar Tầng 1: 50 – 100 khách (Phong cách hiện đại, lý tưởng cho tiệc sinh nhật, báo hỷ, cocktail).
   - Phòng VIP: 10 – 50 khách (Riêng tư, đẳng cấp, dành cho tiệc gia đình và đối tác).

3. GIÁ TIỆC & MÂM CỖ:
   - GIÁ BIẾN ĐỘNG THEO THỜI ĐIỂM & QUY MÔ. Không báo số tiền cụ thể trong chatbox.
   - Hướng dẫn khách tính dự toán trọn gói tại: [Dự toán Chi phí](/du-toan-chi-phi)
   - Hoặc xem danh mục thực đơn tại: [Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)
   - Nhà hàng không áp dụng mâm thử món.

4. ĐỒ UỐNG & PHÍ MANG VÀO:
   - Đồ uống tính theo số lượng sử dụng thực tế.
   - Khách được mang đồ uống/rượu từ ngoài vào (có phí dịch vụ).
   - Chi tiết: [Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)

5. QUY TRÌNH ĐẶT TIỆC CƯỚI (3 GIAI ĐOẠN):
   - Giai đoạn 1 (3 tháng trước): Khảo sát sảnh + Đặt cọc giữ ngày đẹp.
   - Giai đoạn 2 (1 tháng trước): Ký hợp đồng + Chốt menu & dịch vụ + Đặt cọc 50%.
   - Giai đoạn 3 (1 ngày trước): Bàn giao thông tin gia đình, video/ảnh cưới, rượu mang vào.

6. DỊCH VỤ BỔ SUNG:
   - MC chuyên nghiệp, nhóm nhạc Acoustic / Liveband, Photo Booth, Cổng hoa tươi, Xe rước dâu, Quay phim - chụp hình...
   - Khách được mang đơn vị trang trí (decor) từ bên ngoài vào (có phí mặt bằng & điện nước). Liên hệ Hotline để tư vấn.

7. TIỆN ÍCH WEB:
   - [Dự toán Chi phí Tiệc cưới](/du-toan-chi-phi): Tính chi phí trọn gói tự động.
   - [Cá nhân hóa Tiệc cưới](/ca-nhan-hoa): Thiệp cưới online, Phông LED, Kịch bản nhạc.
   - [Xem Không gian sảnh tiệc](/khong-gian/tang-2): Ảnh HD các hội trường.
`.trim();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let config = await prisma.aiSystemConfig.findFirst();
    if (!config) {
      config = await prisma.aiSystemConfig.create({
        data: {
          systemPrompt: DEFAULT_SYSTEM_PROMPT
        }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching AI system config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { systemPrompt } = body;

    if (!systemPrompt) {
      return NextResponse.json({ error: 'System prompt là bắt buộc' }, { status: 400 });
    }

    let config = await prisma.aiSystemConfig.findFirst();

    if (config) {
      config = await prisma.aiSystemConfig.update({
        where: { id: config.id },
        data: { systemPrompt: systemPrompt.trim() }
      });
    } else {
      config = await prisma.aiSystemConfig.create({
        data: { systemPrompt: systemPrompt.trim() }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating AI system config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
