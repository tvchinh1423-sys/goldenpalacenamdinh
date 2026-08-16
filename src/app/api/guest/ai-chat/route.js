import { NextResponse } from 'next/server';

// Golden Palace Real Knowledge Base - Standardized Rules from Management
const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.
Thông tin chính thức & Quy tắc tư vấn chính xác:

1. ĐỊA CHỈ & GIỜ MỞ CỬA:
   - Địa chỉ: 98 Đông A, KĐT Hòa Vượng, TP Nam Định.
   - Giờ đón khách tham quan trực tiếp sảnh: 8h00 - 21h00 tất cả các ngày trong tuần.
   - Hotline liên hệ / Zalo: 0228 659 5959
   - Fanpage: https://www.facebook.com/goldenpalaceweddingnamdinh

2. SỨC CHỨA CÁC HỘI TRƯỜNG:
   - Hội trường Tầng 2: Sức chứa 350 - 750 khách (Hội trường lớn nhất sang trọng).
   - Hội trường Tầng 3: Sức chứa 300 - 650 khách.
   - Hội trường Tầng 4: Sức chứa 100 - 300 khách (Ấm cúng, ưu tiên tư vấn & điều hướng cho tiệc dưới 400 khách, phí hội trường 2.000.000 VNĐ).
   - Quầy Bar Tầng 1: Sức chứa 50 - 100 khách (Tiệc báo hỷ, sinh nhật, thân mật).
   - Phòng VIP: Sức chứa 10 - 50 khách (Tiệc gia đình, đối tác).

3. GIÁ MÂM CỖ TIỆC:
   - Mức giá mâm tiệc tối thiểu: 3.200.000 VNĐ / mâm 10 khách.
   - Khách hàng tham khảo danh sách 18 Set Menu tại: [Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)
   - Lưu ý: Nhà hàng không áp dụng mâm thử món.

4. ĐỒ UỐNG & PHÍ MANG ĐỒ UỐNG VÀO:
   - Tiền đồ uống tính theo số lượng sử dụng thực tế của bàn tiệc.
   - Chi tiết giá đồ uống niêm yết và phí mang đồ uống/rượu từ ngoài vào tham khảo tại: [Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)

5. PHÍ HỘI TRƯỜNG & ĐIỀU HƯỚNG SẢNH:
   - NGUYÊN TẮC QUAN TRỌNG: Mọi tiệc có quy mô DƯỚI 400 KHÁCH (hoặc tiệc nhỏ/vừa), AI luôn cố gắng điều hướng, ưu tiên giới thiệu Hội trường Tầng 4 là lựa chọn tối ưu, ấm cúng và sang trọng nhất.
   - Phí dịch vụ Hội trường Tầng 4: 2.000.000 VNĐ (áp dụng chung trọn gói, không yêu cầu điều kiện ràng buộc số mâm).
   - Phí dịch vụ Hội trường Tầng 2 & Tầng 3: Đã được tính toán theo quy mô. Khách hàng tự tính toán ngân sách tại: [Công cụ Dự toán Chi phí](/du-toan-chi-phi)

6. QUY TRÌNH ĐẶT TIỆC & ĐẶT CỌC GIỮ SẢNH:
   - Trước 03 tháng (Giữ lịch ngày đẹp): Khảo sát quy mô sảnh, đặt cọc giữ sảnh cưới 5.000.000 VNĐ.
   - Trước 01 tháng (Ký hợp đồng): Chốt số lượng khách, thiết kế menu healthy riêng biệt, chốt gói dịch vụ, đặt cọc 50% giá trị hợp đồng.
   - Trước 01 ngày (Bàn giao): Bàn giao thông tin gia đình, gửi video/ảnh cưới, bàn giao rượu mang vào.

7. DỊCH VỤ TRANG TRÍ (DECOR) BÊN NGOÀI:
   - Khách hàng ĐƯỢC PHÉP mang đơn vị trang trí (decor) từ bên ngoài vào, tuy nhiên nhà hàng có tính phí dịch vụ/mặt bằng. Vui lòng liên hệ Hotline 0228 659 5959 để nhận báo giá chi tiết.

8. TƯ VẤN THÊM & ƯU ĐÃI RIÊNG:
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
  // PRIORITY 1: Sức chứa sảnh tiệc / số lượng khách
  if (msg.includes('sức chứa') || msg.includes('chứa được') || msg.includes('bao nhiêu khách') || msg.includes('tối đa bao nhiêu') || msg.includes('sảnh chứa') || msg.includes('quy mô')) {
    return {
      reply: 'Dạ, **Golden Palace Nam Định** sở hữu hệ thống các hội trường đa dạng sức chứa đáp ứng hoàn hảo cho từng quy mô tiệc:\n\n🏛️ **Hội trường Tầng 2:** Sức chứa **350 – 750 khách** *(Không gian sang trọng lớn nhất)*.\n🏛️ **Hội trường Tầng 3:** Sức chứa **300 – 650 khách**.\n🏛️ **Hội trường Tầng 4:** Sức chứa **100 – 300 khách** *(Nhà hàng ưu tiên tư vấn & điều hướng cho tiệc dưới 400 khách để đảm bảo ấm cúng, sang trọng với phí hội trường trọn gói chỉ **2.000.000 VNĐ***).\n🍸 **Quầy Bar Tầng 1:** Sức chứa **50 – 100 khách** *(Tiệc sinh nhật, báo hỷ, thân mật)*.\n👑 **Phòng VIP:** Sức chứa **10 – 50 khách** *(Tiệc gia đình, đối tác)*.\n\nQuý khách có thể tự chọn sảnh theo lượng khách và xem dự toán chi tiết tại: **[Công cụ Dự toán Chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "🏛️ Khám phá Hội trường Tầng 4 (Chỉ 2tr)",
        "📝 Lập dự toán theo số lượng khách",
        "📞 Gọi Hotline tư vấn 0228 659 5959"
      ]
    };
  }

  // PRIORITY 2: Giá 1 mâm cỗ cưới / giá tiệc
  if (msg.includes('giá 1 mâm') || msg.includes('giá cỗ') || msg.includes('mâm cỗ cưới') || msg.includes('bao nhiêu 1 mâm') || msg.includes('giá mâm') || msg.includes('mức giá tối thiểu') || msg.includes('3.200')) {
    return {
      reply: 'Dạ, tại **Golden Palace Nam Định**, mức giá mâm tiệc cưới & sự kiện niêm yết tối thiểu là **3.200.000 VNĐ / mâm 10 khách**.\n\nQuý khách có thể xem danh sách chi tiết các bộ thực đơn chuẩn mâm 10 món tại: **[Xem Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)** ạ!',
      suggestions: [
        "🍱 Xem Menu Tiệc 3.200.000 VNĐ",
        "📝 Lập dự toán chi phí trọn gói",
        "📞 Hotline tư vấn 0228 659 5959"
      ]
    };
  }

  // PRIORITY 3: Đồ uống & Phí mang vào
  if (msg.includes('uống') || msg.includes('bia') || msg.includes('rượu') || msg.includes('nút chai') || msg.includes('mang vào')) {
    return {
      reply: 'Dạ, tiền đồ uống tại tiệc sẽ được tính theo **số lượng sử dụng thực tế** của bàn tiệc. Đối với trường hợp Quý khách tự mang đồ uống/rượu từ ngoài vào, nhà hàng có niêm yết phí dịch vụ chi tiết.\n\nQuý khách tham khảo tại: **[Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)** ạ!',
      suggestions: [
        "🥂 Xem Bảng giá Đồ uống & Phí mang vào",
        "📞 Gọi Hotline hỗ trợ 0228 659 5959"
      ]
    };
  }

  // PRIORITY 4: Dự toán chi phí
  if (msg.includes('dự toán') || msg.includes('lập dự toán') || msg.includes('tính chi phí') || msg.includes('ngân sách')) {
    return {
      reply: 'Dạ, Quý khách có thể tự tính toán dự trù kinh phí tiệc cưới trọn gói chỉ trong 30 giây bằng công cụ tự động của nhà hàng:\n\n1️⃣ Chọn số lượng khách & số mâm dự kiến.\n2️⃣ Chọn Hội trường phù hợp (Tầng 2, Tầng 3, Tầng 4, Bar, VIP).\n3️⃣ Chọn thực đơn & dịch vụ đi kèm.\n\nHệ thống sẽ tự động xuất bảng chi phí minh bạch tại: **[Công cụ Dự toán Chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "📝 Tính Dự toán Chi phí ngay",
        "📞 Hotline hỗ trợ 0228 659 5959"
      ]
    };
  }

  // PRIORITY 5: Ưu đãi & Khuyến mãi
  if (msg.includes('ưu đãi') || msg.includes('khuyến mãi') || msg.includes('quà') || msg.includes('mới không')) {
    return {
      reply: 'Dạ, Golden Palace liên tục áp dụng các chương trình ưu đãi đặc biệt cho từng quy mô tiệc (như ưu đãi giảm 85% phí Hội trường Tầng 4 chỉ còn **2.000.000 VNĐ**, ưu đãi gói dịch vụ...).\n\nMọi thông tin chi tiết về gói quà tặng và ưu đãi mới nhất, Quý khách vui lòng liên hệ trực tiếp **[Hotline / Zalo: 0228 659 5959](tel:02286595959)** để chuyên viên tư vấn hỗ trợ riêng ạ!',
      suggestions: [
        "📞 Liên hệ Hotline nhận ưu đãi 0228 659 5959",
        "🏛️ Phí Hội trường Tầng 4 (Chỉ 2tr)"
      ]
    };
  }

  // PRIORITY 6: Quy trình đặt tiệc & Đặt cọc
  if (msg.includes('cọc') || msg.includes('quy trình') || msg.includes('hợp đồng') || msg.includes('giữ lịch') || msg.includes('bàn giao')) {
    return {
      reply: 'Dạ, **Quy trình Đặt tiệc cưới chuẩn 3 bước** tại Golden Palace như sau:\n\n1️⃣ **Trước 03 tháng (Giữ lịch ngày đẹp):** Khảo sát quy mô sảnh và đặt cọc giữ sảnh cưới **5.000.000 VNĐ**.\n2️⃣ **Trước 01 tháng (Ký hợp đồng):** Chốt số lượng khách, thiết kế menu healthy riêng biệt, chốt gói dịch vụ và **đặt cọc 50% giá trị hợp đồng**.\n3️⃣ **Trước 01 ngày (Bàn giao):** Bàn giao thông tin gia đình, gửi video/ảnh cưới và bàn giao rượu mang vào.\n\nHotline hỗ trợ làm thủ tục cọc: **0228 659 5959** ạ!',
      suggestions: [
        "📅 Đặt lịch khảo sát sảnh",
        "📞 Hotline hỗ trợ cọc 0228 659 5959"
      ]
    };
  }

  // PRIORITY 7: Decor ngoài
  if (msg.includes('decor') || msg.includes('trang trí') || msg.includes('mang ngoài') || msg.includes('bên ngoài')) {
    return {
      reply: 'Dạ, Quý khách **hoàn toàn có thể mang đơn vị trang trí (decor) từ bên ngoài vào**. Tuy nhiên nhà hàng sẽ áp dụng khoản phí dịch vụ/mặt bằng điện nước hỗ trợ thi công.\n\nĐể nhận báo giá cụ thể theo từng phương án decor, Quý khách vui lòng liên hệ trực tiếp **[Hotline / Zalo: 0228 659 5959](tel:02286595959)** ạ!',
      suggestions: [
        "📞 Liên hệ Hotline tư vấn Decor",
        "📝 Lập dự toán dịch vụ"
      ]
    };
  }

  // PRIORITY 8: Giờ mở cửa, Địa chỉ & Hotline
  if (msg.includes('giờ') || msg.includes('mở cửa') || msg.includes('địa chỉ') || msg.includes('mấy giờ') || msg.includes('tham quan') || msg.includes('xem sảnh') || msg.includes('hotline') || msg.includes('ở đâu')) {
    return {
      reply: 'Dạ, thông tin liên hệ & đón tiếp chính thức của Golden Palace Nam Định:\n\n📍 **Địa chỉ:** 98 Đông A, KĐT Hòa Vượng, TP Nam Định *(Giờ đón khách tham quan trực tiếp sảnh: **8h00 – 21h00** hàng ngày)*.\n📞 **Hotline / Zalo:** **0228 659 5959**\n✉️ **Email:** cungdienvang98donga@gmail.com\n🌐 **Fanpage:** https://www.facebook.com/goldenpalaceweddingnamdinh',
      suggestions: [
        "📍 Xem vị trí Google Maps",
        "📞 Gọi Hotline 0228 659 5959"
      ]
    };
  }

  // Fallback chung
  return {
    reply: 'Dạ, Trợ lý AI Golden Palace hân hạnh được hỗ trợ Quý khách! Quý khách muốn tìm hiểu thông tin cụ thể về hạng mục nào ạ?\n\n- **Sức chứa các sảnh tiệc** (Tầng 2, Tầng 3, Tầng 4, Bar, VIP)\n- **Mức giá mâm tiệc tối thiểu** (Từ 3.200.000 VNĐ / mâm 10 khách)\n- **Bảng giá Đồ uống & Phí mang vào**\n- **Quy trình Đặt cọc & Giữ sảnh cưới**\n\nHotline hỗ trợ trực tiếp: **0228 659 5959**',
    suggestions: generateSuggestions(msg)
  };
}

function generateSuggestions(msg) {
  return [
    "🏛️ Sảnh tiệc chứa được tối đa bao nhiêu khách?",
    "🍱 Mức giá mâm tiệc tối thiểu 3.200k",
    "🥂 Bảng giá Đồ uống & Phí mang vào",
    "📅 Quy trình Đặt cọc giữ sảnh cưới",
    "📞 Hotline hỗ trợ 0228 659 5959"
  ];
}
