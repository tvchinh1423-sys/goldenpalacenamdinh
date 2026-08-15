import { NextResponse } from 'next/server';

// Golden Palace Real Knowledge Base - Polite & Professional Wording
const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.
Thông tin chính thức về Golden Palace:
1. Địa chỉ: 98 Đông A, KĐT Hòa Vượng, TP Nam Định.
2. Hotline liên hệ / Zalo: 0228 659 5959
3. Email: cungdienvang98donga@gmail.com
4. Facebook Fanpage: https://www.facebook.com/goldenpalaceweddingnamdinh (Messenger: m.me/goldenpalaceweddingnamdinh)

5. THÔNG TIN SẢNH VÀ PHÍ DỊCH VỤ HỘI TRƯỜNG:
   - Hội trường Tầng 2: Sức chứa 350 - 750 khách (Tối ưu cho tiệc từ 300 - 350 khách trở lên).
     * Phí dịch vụ: 10.000.000 VNĐ (Tiệc trên 350 khách) | 12.000.000 VNĐ (Tiệc từ 250 - 350 khách).
     * Đã bao gồm: Màn hình LED 30m², giàn đèn bướm nghệ thuật, phông 2 bên sân khấu (6tr), phông chụp ảnh (1tr), hoa lụa & đèn 2 bên đường dẫn, cổng hoa (3tr), bàn trang trí & hộp tiền mừng (3tr), bánh cưới, rượu champagne, đá khói, pháo điện, chữ lồng tên.

   - Hội trường Tầng 3: Sức chứa 300 - 650 khách (Tối ưu cho tiệc từ 300 khách trở lên).
     * Phí dịch vụ: 10.000.000 VNĐ (Tiệc trên 300 khách) | 12.000.000 VNĐ (Tiệc từ 250 - 300 khách).
     * Đã bao gồm: Màn hình LED 30m², giàn đèn bướm, hoa lụa & đèn 2 bên đường dẫn, phông 2 bên sân khấu, phông chụp ảnh lưu niệm.

   - Hội trường Tầng 4: Sức chứa 100 - 300 khách (Lựa chọn hoàn hảo cho tiệc ấm cúng dưới 300 khách).
     * Phí dịch vụ: 2.000.000 VNĐ (Giá niêm yết 14.700.000 VNĐ - Ưu đãi giảm 85%).
     * Đã bao gồm: Màn hình LED 10m² (4tr), âm thanh ánh sáng (4tr), cổng chào (2tr), bàn trang trí (2tr), hoa lụa sân khấu (2tr), bánh cưới & rượu champagne, pháo điện.

   - Quầy Bar Tầng 1: 50 - 100 khách (Không gian sang trọng hiện đại cho tiệc sinh nhật, tiệc thân mật).
   - Phòng VIP: 10 - 50 khách (Không gian riêng tư cao cấp gia đình & đối tác).

   * NGUYÊN TẮC TƯ VẤN QUY MÔ KHÁCH: Nếu khách hàng hỏi đặt tiệc dưới 250 khách, nhẹ nhàng giới thiệu Hội trường Tầng 4, Quầy Bar Tầng 1 hoặc Phòng VIP là sự lựa chọn phù hợp và tối ưu nhất về không gian lẫn chi phí. Tuyệt đối không dùng từ "từ chối".

6. DỊCH VỤ NÂNG CAO:
   - Nhạc công Keyboard / Ca sĩ (3 bài) / MC dẫn chương trình: 800.000 VNĐ / người.
   - Cặp Thiên thần: 1.000.000 VNĐ / cặp.
   - Ban nhạc Saxophone: 5.000.000 VNĐ | Ban nhạc Tứ tấu: 14.000.000 VNĐ.
   - Vòng ánh sáng laser trao nhẫn: 700.000 VNĐ (Tặng miễn phí cho tiệc > 400 khách).
   - Bóng bay kích nổ (4 quả): 900.000 VNĐ.
   - Flycam trao nhẫn cưới: 1.000.000 VNĐ.
   - Bướm dẫn đường cô dâu: 3.000.000 VNĐ.

7. BÁO GIÁ PHOTOBOOTH (MÁY CHỤP ẢNH LẤY NGAY):
   - Gói 1 (1.5 giờ, 200 ảnh nhỏ/100 ảnh to, 3 layout): 3.400.000 VNĐ.
   - Gói 2 (2 giờ, Không giới hạn ảnh, 5 layout): 4.000.000 VNĐ.
   - Gói 3 (3 giờ, Không giới hạn ảnh, 5 layout): 5.000.000 VNĐ.
   - Đã bao gồm: 1 nhân viên hỗ trợ, lấy file mềm ngay, phụ kiện check-in, sổ lưu giữ ảnh.

8. Công cụ Dự toán Chi phí: Khách hàng có thể tự chọn hội trường và tính ngân sách tức thì tại: /du-toan-chi-phi

Phong cách tư vấn: Ân cần, lịch thiệp, xưng "Em", gọi "Quý khách", tinh tế, không dùng thuật ngữ tiêu cực.
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
  if (msg.includes('dưới 250') || msg.includes('dưới 200') || msg.includes('dưới 150') || msg.includes('100 khách') || msg.includes('150 khách') || msg.includes('200 khách')) {
    return {
      reply: 'Dạ, với quy mô tiệc ấm cúng dưới 250 khách, **Golden Palace Nam Định** trân trọng giới thiệu các không gian hoàn hảo nhất:\n\n🏛️ **Hội trường Tầng 4 (100 - 300 khách):** Không gian vừa vặn, thiết kế tinh tế với **màn hình LED 10m²**, âm thanh ánh sáng hiện đại. *Phí dịch vụ trọn gói ưu đãi giảm 85% chỉ còn **2.000.000 VNĐ***.\n🍷 **Quầy Bar Tầng 1 (50 - 100 khách):** Phong cách sang trọng, hiện đại cho tiệc báo hỷ, sinh nhật.\n👑 **Phòng VIP (10 - 50 khách):** Ấm cúng, riêng tư cho tiệc gia đình.\n\nQuý khách có thể thử chọn sảnh và tính chi phí tại công cụ **[Dự toán chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "🏛️ Khám phá Hội trường Tầng 4",
        "📝 Lập dự toán tiệc dưới 250 khách",
        "📞 Gọi Hotline tư vấn 0228 659 5959"
      ]
    };
  }

  if (msg.includes('sảnh') || msg.includes('hội trường') || msg.includes('tầng') || msg.includes('khách') || msg.includes('chứa')) {
    return {
      reply: 'Dạ, Golden Palace sở hữu hệ thống các tầng hội trường đa dạng phù hợp cho từng quy mô tiệc:\n\n🏛️ **Hội trường Tầng 2:** 350 – 750 khách (Phí dịch vụ 10tr khi >350 khách | 12tr khi 250-350 khách).\n🏛️ **Hội trường Tầng 3:** 300 – 650 khách (Phí dịch vụ 10tr khi >300 khách | 12tr khi 250-300 khách).\n🏛️ **Hội trường Tầng 4:** 100 – 300 khách (Phí dịch vụ ưu đãi chỉ **2.000.000 VNĐ**).\n🍷 **Quầy Bar Tầng 1:** 50 – 100 khách.\n👑 **Phòng VIP:** 10 – 50 khách.\n\nQuý khách dự định mời khoảng bao nhiêu lượng khách để em hỗ trợ tư vấn sảnh phù hợp nhất ạ?',
      suggestions: [
        "🏛️ Chi tiết Hội trường Tầng 2",
        "🏛️ Chi tiết Hội trường Tầng 3",
        "🏛️ Chi tiết Hội trường Tầng 4",
        "📝 Lập dự toán chi phí"
      ]
    };
  }

  if (msg.includes('nâng cao') || msg.includes('dịch vụ') || msg.includes('photobooth') || msg.includes('mc') || msg.includes('ca sĩ') || msg.includes('ban nhạc') || msg.includes('flycam')) {
    return {
      reply: 'Dạ, Golden Palace cung cấp đầy đủ các **Dịch vụ Nâng cao & Phụ kiện Đẳng cấp**:\n\n🎭 **Giải trí & Biểu diễn:**\n- MC dẫn chương trình / Nhạc công / Ca sĩ: **800.000 VNĐ / người**\n- Cặp Thiên thần: **1.000.000 VNĐ / cặp**\n- Ban nhạc Saxophone: **5.000.000 VNĐ** | Ban nhạc Tứ tấu: **14.000.000 VNĐ**\n\n✨ **Phụ kiện độc đáo:**\n- Vòng laser trao nhẫn: **700k** *(Tặng miễn phí cho tiệc >400 khách)*\n- Flycam trao nhẫn: **1.000.000 VNĐ**\n- Bướm dẫn đường cô dâu: **3.000.000 VNĐ**\n- Bóng bay kích nổ: **900.000 VNĐ / quả**\n- **Photobooth chụp ảnh:** Từ **3.400.000 VNĐ / máy** (Lấy ảnh ngay, không giới hạn).',
      suggestions: [
        "📸 Báo giá Photobooth chi tiết",
        "🎁 Ưu đãi tặng vòng laser trao nhẫn",
        "📝 Lập dự toán trọn gói"
      ]
    };
  }

  return {
    reply: 'Dạ, Trợ lý AI Golden Palace rất hân hạnh được tư vấn cho Quý khách! Quý khách muốn tìm hiểu thêm về hạng mục nào ạ?\n\n- **Sức chứa các Hội trường** (Tầng 2, Tầng 3, Tầng 4, Bar, VIP)\n- **Phí dịch vụ trọn gói theo tầng** (Chỉ từ 2tr - 10tr)\n- **Danh mục Dịch vụ Nâng cao** (MC, Ca sĩ, Saxophone, Laser, Flycam...)\n- **Báo giá máy chụp ảnh Photobooth** lấy ngay\n\nHotline hỗ trợ trực tiếp: **0228 659 5959**',
    suggestions: generateSuggestions(msg)
  };
}

function generateSuggestions(msg) {
  return [
    "🏛️ Sức chứa & Phí hội trường các tầng",
    "✨ Danh mục Dịch vụ Nâng cao",
    "📸 Báo giá Photobooth lấy ngay",
    "📝 Lập dự toán chi phí sự kiện",
    "📍 Địa chỉ & Hotline liên hệ"
  ];
}
