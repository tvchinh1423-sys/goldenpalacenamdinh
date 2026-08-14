import { NextResponse } from 'next/server';

// Golden Palace Knowledge Base
const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.
Thông tin chính thức về Golden Palace:
1. Địa chỉ: 98 Đông A, KĐT Hòa Vượng, TP Nam Định.
2. Hotline liên hệ / Zalo: 0228 659 5959
3. Email: cungdienvang98donga@gmail.com
4. Facebook Fanpage: https://www.facebook.com/goldenpalaceweddingnamdinh (Messenger: m.me/goldenpalaceweddingnamdinh)
5. Mức giá mâm cỗ: Từ 3.500.000 VNĐ / mâm đến 5.000.000+ VNĐ / mâm (mâm 10 người).
6. Quy mô sảnh tiệc: Phù hợp từ 100 khách đến 800 khách. Hệ thống hội trường sang trọng, không cột chắn tầm nhìn, trang bị màn hình LED 30m2 tiêu chuẩn, âm thanh ánh sáng hiện đại.
7. Các dịch vụ chính: Tiệc cưới trọn gói, Sự kiện doanh nghiệp, Tiệc sinh nhật, Kỷ niệm, Thượng thọ, Tất niên...
8. Giá trị cốt lõi:
   - Sự An Tâm: Kiểm soát rủi ro vận hành bằng 0.
   - Sự Chỉn Chu & Thể Diện: Tiêu chuẩn ẩm thực truyền thống cao cấp, tôn vinh vị thế gia chủ.
   - Minh Bạch Giá Trị Thực: Tuyệt đối không ép sale, không chi phí ẩn.
9. Công cụ Dự toán Chi phí: Khách hàng có thể tự do chọn sảnh, chọn gói dịch vụ, tính ngân sách tức thì tại đường dẫn: /du-toan-chi-phi

Phong cách trả lời: Lịch sự, ân cần, xưng "Em", gọi "Quý khách", dùng Tiếng Việt chuẩn. Trả lời súc tích, rõ ràng, luôn kèm lời mời trải nghiệm công cụ Dự toán hoặc gọi Hotline 0228 659 5959.
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

// Smart Intent & Response Generator
function generateSmartResponse(msg) {
  if (msg.includes('mâm') || msg.includes('giá') || msg.includes('chi phí') || msg.includes('bao nhiêu')) {
    return {
      reply: 'Dạ, mức giá mâm cỗ tiệc cưới tại **Golden Palace Nam Định** hiện khởi điểm từ **3.500.000 VNĐ / mâm 10 khách**.\n\n✨ Mức giá này đã bao gồm thực đơn cao cấp, hội trường trang trọng và đội ngũ phục vụ chuyên nghiệp.\n\nQuý khách có thể tự phối hợp ngân sách và xem dự toán chi tiết tức thì tại công cụ **[Dự toán chi phí sự kiện](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "📝 Tính dự toán chi phí ngay",
        "🏛️ Khám phá không gian sảnh tiệc",
        "🎁 Các chương trình ưu đãi hiện có"
      ]
    };
  }

  if (msg.includes('sảnh') || msg.includes('khách') || msg.includes('chứa') || msg.includes('quy mô') || msg.includes('rộng')) {
    return {
      reply: 'Dạ, Golden Palace sở hữu hệ thống sảnh tiệc linh hoạt phù hợp cho các quy mô tiệc từ **100 đến 800 khách**:\n\n🏛️ **Đặc điểm nổi bật:**\n- Hội trường thiết kế hoàng gia, tầm nhìn thoáng không cột chắn.\n- Trang bị **màn hình LED 30m²** tiêu chuẩn sắc nét.\n- Hệ thống âm thanh, ánh sáng biểu diễn chuyên nghiệp.\n\nQuý khách có thể tham khảo chi tiết hình ảnh sảnh tiệc tại mục **[Hệ thống sảnh](/he-thong)** hoặc tính dự toán ngay ạ!',
      suggestions: [
        "🏛️ Xem chi tiết sảnh tiệc",
        "📝 Lập dự toán theo số lượng khách",
        "📍 Địa chỉ chỉ đường"
      ]
    };
  }

  if (msg.includes('ưu đãi') || msg.includes('khuyến mãi') || msg.includes('quà') || msg.includes('giảm giá')) {
    return {
      reply: 'Dạ, Golden Palace liên tục áp dụng các **chương trình ưu đãi hấp dẫn** dành riêng cho mùa cưới và sự kiện:\n\n🎁 **Ưu đãi đặc quyền bao gồm:**\n- Tặng gói trang trí sân khấu & cổng đón khách sang trọng.\n- Miễn phí hoặc hỗ trợ chi phí màn hình LED & hệ thống ánh sáng.\n- Ưu đãi đồ uống & tặng kèm mâm thử món.\n\nQuý khách vui lòng liên hệ Hotline **0228 659 5959** hoặc chọn **[Ưu đãi](/khuyen-mai)** để nhận báo giá ưu đãi nhất ạ!',
      suggestions: [
        "🎁 Xem chi tiết gói ưu đãi",
        "📞 Gọi Hotline 0228 659 5959",
        "📝 Tính dự toán ngân sách"
      ]
    };
  }

  if (msg.includes('dự toán') || msg.includes('tính') || msg.includes('lập') || msg.includes('báo giá')) {
    return {
      reply: 'Dạ, Golden Palace có sẵn công cụ **Dự toán chi phí trực tuyến 3 phút** vô cùng tiện lợi:\n\n1. Chọn số lượng khách & mâm dự phòng.\n2. Chọn sảnh tiệc mong muốn.\n3. Lựa chọn các gói dịch vụ & Combo thực đơn.\n\n👉 Quý khách hãy trải nghiệm ngay tại **[Công cụ Dự toán chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "📝 Thử tính dự toán ngay",
        "📞 Tư vấn qua Hotline 0228 659 5959"
      ]
    };
  }

  if (msg.includes('địa chỉ') || msg.includes('ở đâu') || msg.includes('vị trí') || msg.includes('hotline') || msg.includes('số điện thoại') || msg.includes('liên hệ')) {
    return {
      reply: 'Dạ, thông tin liên hệ chính thức của **Golden Palace**:\n\n📍 **Địa chỉ:** 98 Đông A, KĐT Hòa Vượng, TP Nam Định.\n📞 **Hotline tư vấn:** **0228 659 5959**\n✉️ **Email:** cungdienvang98donga@gmail.com\n⚡ **Facebook:** [Fanpage Golden Palace](https://www.facebook.com/goldenpalaceweddingnamdinh)\n\nGolden Palace rất hân hạnh được đón tiếp Quý khách ghé thăm và trải nghiệm trực tiếp ạ!',
      suggestions: [
        "📍 Chỉ đường Google Maps",
        "📞 Gọi Hotline 0228 659 5959",
        "📝 Dự toán chi phí tiệc"
      ]
    };
  }

  return {
    reply: 'Dạ, Golden Palace rất vui được hỗ trợ Quý khách! Quý khách có thể lựa chọn các chủ đề tư vấn dưới đây hoặc đặt câu hỏi cụ thể cho em nhé:\n\n- **Giá mâm cỗ cưới** từ 3.500.000đ/mâm.\n- **Sảnh tiệc** từ 100 - 800 khách.\n- **Dự toán chi phí** sự kiện trong 3 phút.\n- **Chương trình ưu đãi** đặt cọc sớm.\n\nHotline tư vấn nhanh: **0228 659 5959** ạ!',
    suggestions: generateSuggestions(msg)
  };
}

function generateSuggestions(msg) {
  return [
    "💡 Giá 1 mâm cỗ cưới bao nhiêu?",
    "🏛️ Sảnh tiệc chứa tối đa bao nhiêu khách?",
    "🎁 Ưu đãi tiệc cưới hiện tại",
    "📝 Lập dự toán chi phí ngay",
    "📍 Địa chỉ & Hotline liên hệ"
  ];
}
