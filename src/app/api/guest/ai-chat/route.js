import { NextResponse } from 'next/server';

// Golden Palace Real Knowledge Base - Standardized Rules from Management
const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.
Thông tin chính thức & Quy tắc tư vấn chính xác:

1. ĐỊA CHỈ & GIỜ MỜ CỬA:
   - Địa chỉ: 98 Đông A, KĐT Hòa Vượng, TP Nam Định.
   - Giờ đón khách tham quan trực tiếp sảnh: 8h00 - 21h00 tất cả các ngày trong tuần.
   - Hotline liên hệ / Zalo: 0228 659 5959
   - Fanpage: https://www.facebook.com/goldenpalaceweddingnamdinh

2. GIÁ MÂM CỖ TIỆC:
   - Mức giá mâm tiệc tối thiểu: 3.200.000 VNĐ / mâm 10 khách.
   - Khách hàng tham khảo danh sách 18 Set Menu tại: [Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)
   - Lưu ý: Nhà hàng không áp dụng mâm thử món.

3. ĐỒ UỐNG & PHÍ MANG ĐỒ UỐNG VÀO:
   - Tiền đồ uống tính theo số lượng sử dụng thực tế của bàn tiệc.
   - Chi tiết giá đồ uống niêm yết và phí mang đồ uống/rượu từ ngoài vào tham khảo tại: [Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)

4. HỘI TRƯỜNG & NGUYÊN TẮC ĐIỀU HƯỚNG SẢNH:
   - NGUYÊN TẮC QUAN TRỌNG: Mọi tiệc có quy mô DƯỚI 400 KHÁCH (hoặc tiệc nhỏ/vừa), AI luôn cố gắng điều hướng, ưu tiên giới thiệu Hội trường Tầng 4 là lựa chọn tối ưu, ấm cúng và sang trọng nhất.
   - Phí dịch vụ Hội trường Tầng 4: 2.000.000 VNĐ (áp dụng chung trọn gói, không yêu cầu điều kiện ràng buộc số mâm).
   - Phí dịch vụ Hội trường Tầng 2 & Tầng 3: Đã được tính toán theo quy mô. Khách hàng tự tính toán ngân sách tại: [Công cụ Dự toán Chi phí](/du-toan-chi-phi)

5. QUY TRÌNH ĐẶT TIỆC & ĐẶT CỌC GIỮ SẢNH:
   - Trước 03 tháng (Giữ lịch ngày đẹp): Khảo sát quy mô sảnh, đặt cọc giữ sảnh cưới 5.000.000 VNĐ.
   - Trước 01 tháng (Ký hợp đồng): Chốt số lượng khách, thiết kế menu healthy riêng biệt, chốt gói dịch vụ, đặt cọc 50% giá trị hợp đồng.
   - Trước 01 ngày (Bàn giao): Bàn giao thông tin gia đình, gửi video/ảnh cưới, bàn giao rượu mang vào.

6. DỊCH VỤ TRANG TRÍ (DECOR) BÊN NGOÀI:
   - Khách hàng ĐƯỢC PHÉP mang đơn vị trang trí (decor) từ bên ngoài vào, tuy nhiên nhà hàng có tính phí dịch vụ/mặt bằng. Vui lòng liên hệ Hotline 0228 659 5959 để nhận báo giá chi tiết.

7. TƯ VẤN THÊM & ƯU ĐÃI RIÊNG:
   - Mọi thắc mắc cần tư vấn thêm hoặc ưu đãi riêng, vui lòng liên hệ Hotline / Zalo: 0228 659 5959.

Phong cách tư vấn: Xưng "Em", gọi "Quý khách", ân cần, lịch thiệp, cung cấp link rõ ràng, đúng trọng tâm, không lan man.
`;

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const lastUserMsg = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : '';

    const lowerMsg = lastUserMsg.toLowerCase();

    // 1. If Gemini API Key exists, use Google Gemini AI API
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: SYSTEM_KNOWLEDGE },
                    ...messages.map(m => ({
                      text: `${m.role === 'user' ? 'Khách hàng' : 'Trợ lý AI'}: ${m.content}`
                    }))
                  ]
                }
              ]
            })
          }
        );

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
          return NextResponse.json({
            reply: aiText,
            suggestions: generateSuggestions(lowerMsg)
          });
        }
      } catch (err) {
        console.error('Gemini API call error, using fallback:', err);
      }
    }

    // 2. Intelligent Knowledge Retrieval Fallback Engine
    const { reply, suggestions } = generateSmartResponse(lowerMsg);

    return NextResponse.json({ reply, suggestions });

  } catch (error) {
    console.error('AI Chat Route Error:', error);
    return NextResponse.json(
      {
        reply: 'Dạ em chào Quý khách! Hiện tại hệ thống đang cập nhật. Quý khách vui lòng gọi Hotline **0228 659 5959** hoặc thử công cụ **[Dự toán chi phí](/du-toan-chi-phi)** ạ!',
        suggestions: ["📞 Gọi Hotline 0228 659 5959", "📝 Tính dự toán ngay"]
      },
      { status: 500 }
    );
  }
}

function generateSmartResponse(msg) {
  // 1. Mâm cỗ & Giá tiệc
  if (msg.includes('mâm') || msg.includes('giá cỗ') || msg.includes('tối thiểu') || msg.includes('mức giá') || msg.includes('bao nhiêu')) {
    return {
      reply: 'Dạ, tại **Golden Palace Nam Định**, mức giá mâm tiệc cưới & sự kiện niêm yết tối thiểu là **3.200.000 VNĐ / mâm 10 khách**.\n\nQuý khách có thể xem danh sách chi tiết các bộ thực đơn chuẩn mâm 10 món tại: **[Xem Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)** ạ!',
      suggestions: [
        "🍱 Xem Menu Tiệc 3.200.000 VNĐ",
        "📝 Lập dự toán chi phí trọn gói",
        "📞 Hotline tư vấn 0228 659 5959"
      ]
    };
  }

  // 2. Đồ uống & Phí mang vào
  if (msg.includes('uống') || msg.includes('bia') || msg.includes('rượu') || msg.includes('nút chai') || msg.includes('mang vào')) {
    return {
      reply: 'Dạ, tiền đồ uống tại tiệc sẽ được tính theo **số lượng sử dụng thực tế** của bàn tiệc. Đối với trường hợp Quý khách tự mang đồ uống/rượu từ ngoài vào, nhà hàng có niêm yết phí dịch vụ chi tiết.\n\nQuý khách tham khảo tại: **[Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)** ạ!',
      suggestions: [
        "🥂 Xem Bảng giá Đồ uống & Phí mang vào",
        "📞 Gọi Hotline hỗ trợ 0228 659 5959"
      ]
    };
  }

  // 3 & 4. Hội trường, Phí 2tr Tầng 4 & Điều hướng dưới 400 khách
  if (msg.includes('sảnh') || msg.includes('hội trường') || msg.includes('tầng') || msg.includes('400') || msg.includes('khách') || msg.includes('phí 2tr')) {
    return {
      reply: 'Dạ, với các tiệc có quy mô **dưới 400 khách**, Golden Palace trân trọng điều hướng & khuyến nghị Quý khách lựa chọn **Hội trường Tầng 4** – Không gian vô cùng ấm cúng, tinh tế và sang trọng.\n\n✨ **Chính sách Phí Hội trường:**\n- **Hội trường Tầng 4:** Phí dịch vụ trọn gói **2.000.000 VNĐ** *(Áp dụng chung, không ràng buộc điều kiện mâm)*.\n- **Hội trường Tầng 2 & Tầng 3:** Phí dịch vụ đã được thảo luận & tối ưu theo từng quy mô.\n\nQuý khách có thể tự chọn hội trường và tính phí tức thì tại: **[Công cụ Dự toán Chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "🏛️ Khám phá Hội trường Tầng 4",
        "📝 Lập dự toán tiệc dưới 400 khách",
        "📞 Gọi Hotline 0228 659 5959"
      ]
    };
  }

  // 7. Quy trình đặt tiệc & Đặt cọc
  if (msg.includes('cọc') || msg.includes('quy trình') || msg.includes('hợp đồng') || msg.includes('giữ lịch') || msg.includes('bàn giao')) {
    return {
      reply: 'Dạ, **Quy trình Đặt tiệc cưới chuẩn 3 bước** tại Golden Palace như sau:\n\n1️⃣ **Trước 03 tháng (Giữ lịch ngày đẹp):** Khảo sát quy mô sảnh và đặt cọc giữ sảnh cưới **5.000.000 VNĐ**.\n2️⃣ **Trước 01 tháng (Ký hợp đồng):** Chốt số lượng khách, thiết kế menu healthy riêng biệt, chốt gói dịch vụ và **đặt cọc 50% giá trị hợp đồng**.\n3️⃣ **Trước 01 ngày (Bàn giao):** Bàn giao thông tin gia đình, gửi video/ảnh cưới và bàn giao rượu mang vào.\n\nHotline hỗ trợ làm thủ tục cọc: **0228 659 5959** ạ!',
      suggestions: [
        "📅 Đặt lịch khảo sát sảnh",
        "📞 Hotline hỗ trợ cọc 0228 659 5959"
      ]
    };
  }

  // 8. Decor ngoài
  if (msg.includes('decor') || msg.includes('trang trí') || msg.includes('mang ngoài') || msg.includes('bên ngoài')) {
    return {
      reply: 'Dạ, Quý khách **hoàn toàn có thể mang đơn vị trang trí (decor) từ bên ngoài vào**. Tuy nhiên nhà hàng sẽ áp dụng khoản phí dịch vụ/mặt bằng điện nước hỗ trợ thi công.\n\nĐể nhận báo giá cụ thể theo từng phương án decor, Quý khách vui lòng liên hệ trực tiếp **[Hotline / Zalo: 0228 659 5959](tel:02286595959)** ạ!',
      suggestions: [
        "📞 Liên hệ Hotline tư vấn Decor",
        "📝 Lập dự toán dịch vụ"
      ]
    };
  }

  // 10. Giờ mở cửa & Tham quan
  if (msg.includes('giờ') || msg.includes('mở cửa') || msg.includes('địa chỉ') || msg.includes('mấy giờ') || msg.includes('tham quan') || msg.includes('xem sảnh')) {
    return {
      reply: 'Dạ, Golden Palace mở cửa đón Quý khách đến tham quan trực tiếp các tầng hội trường từ **8h00 – 21h00 tất cả các ngày trong tuần**.\n\n📍 Địa chỉ: **98 Đông A, KĐT Hòa Vượng, TP Nam Định**\n📞 Hotline hỗ trợ đón tiếp: **0228 659 5959** ạ!',
      suggestions: [
        "📍 Xem vị trí Google Maps",
        "📞 Gọi Hotline 0228 659 5959"
      ]
    };
  }

  // Fallback chung
  return {
    reply: 'Dạ, Trợ lý AI Golden Palace hân hạnh được hỗ trợ Quý khách! Mọi thông tin tư vấn thêm hoặc ưu đãi riêng, Quý khách vui lòng liên hệ **Hotline / Zalo: 0228 659 5959**.\n\nQuý khách có thể chọn nhanh các chủ đề tư vấn bên dưới ạ:',
    suggestions: generateSuggestions(msg)
  };
}

function generateSuggestions(msg) {
  return [
    "🍱 Mức giá mâm tiệc tối thiểu 3.200k",
    "🏛️ Phí Hội trường Tầng 4 (Chỉ 2tr)",
    "🥂 Bảng giá Đồ uống & Phí mang vào",
    "📅 Quy trình Đặt cọc giữ sảnh cưới",
    "📞 Hotline hỗ trợ 0228 659 5959"
  ];
}
