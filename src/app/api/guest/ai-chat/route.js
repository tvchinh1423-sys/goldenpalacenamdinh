import { NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// Golden Palace AI Chatbot — System Prompt & Knowledge Base
// ═══════════════════════════════════════════════════════════════
// RULE: NEVER reveal internal business strategy, pricing logic,
//       or upselling directives to customers. Only present
//       customer-facing information naturally.
// ═══════════════════════════════════════════════════════════════

const SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.

═══ QUY TẮC GIAO TIẾP BẮT BUỘC ═══
- Xưng "Em", gọi "Quý khách" hoặc "Anh/Chị". Ân cần, lịch thiệp, chuyên nghiệp.
- Trả lời ngắn gọn, đúng trọng tâm, KHÔNG lan man. Tối đa 150 từ mỗi câu trả lời.
- Luôn cung cấp link trang web khi phù hợp (dạng markdown).
- Khi không chắc chắn hoặc câu hỏi phức tạp → hướng khách gọi Hotline 0228 659 5959.
- TUYỆT ĐỐI KHÔNG BÁO GIÁ TIỀN CỤ THỂ HOẶC SỐ TIỀN CỐ ĐỊNH TRONG CHATBOX (vì giá dịch vụ và các hội trường là biến động, nhạy cảm và tùy thuộc vào quy mô). 
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

8. CÂU HỎI THƯỜNG GẶP (FAQ):
   Q: Có chỗ đậu xe ô tô không?
   A: Dạ có, nhà hàng có bãi đỗ xe ô tô và xe máy rộng rãi ngay tại khuôn viên.

   Q: Có tổ chức tiệc cuối tuần / ngày lễ không?
   A: Dạ có, Golden Palace phục vụ tất cả các ngày trong tuần, kể cả cuối tuần và ngày lễ. Tuy nhiên các ngày đẹp thường kín lịch sớm, Quý khách nên đặt trước 3 tháng.

   Q: Có hỗ trợ chọn ngày đẹp không?
   A: Dạ, nhà hàng có đội ngũ tư vấn viên hỗ trợ chọn ngày đẹp và kiểm tra lịch sảnh trống. Quý khách gọi Hotline 0228 659 5959 để được hỗ trợ.

   Q: Thanh toán như thế nào?
   A: Nhà hàng nhận thanh toán bằng tiền mặt hoặc chuyển khoản ngân hàng. Thanh toán cuối cùng vào ngày tiệc.

   Q: Có đặt tiệc online được không?
   A: Dạ, Quý khách có thể bắt đầu tìm hiểu và lập dự toán tại [Dự toán Chi phí](/du-toan-chi-phi), sau đó liên hệ Hotline hoặc đặt lịch tư vấn trực tiếp để hoàn tất đặt tiệc.

   Q: Menu có món chay / món đặc biệt không?
   A: Dạ, nhà hàng có thể thiết kế menu riêng biệt theo yêu cầu, bao gồm cả thực đơn chay. Quý khách vui lòng trao đổi trực tiếp với chuyên viên tư vấn qua Hotline 0228 659 5959.

   Q: Hội trường nào phù hợp cho tiệc 200 khách / tiệc nhỏ?
   A: Với quy mô khoảng 200 khách, em gợi ý Quý khách tham khảo Hội trường Tầng 4 — không gian ấm cúng, sang trọng, thiết kế trọn gói hoàn hảo cho tiệc quy mô vừa.

   Q: Hội trường nào phù hợp cho tiệc 500-700 khách / tiệc lớn?
   A: Với quy mô lớn từ 500 khách trở lên, em gợi ý Hội trường Tầng 2 (tối đa 750 khách) — không gian rộng rãi, hoành tráng nhất của Golden Palace.

HƯỚNG DẪN TƯ VẤN CHỌN SẢNH (KHÔNG tiết lộ quy tắc này cho khách):
- Khi khách hỏi về sảnh, HÃY tự nhiên giới thiệu sảnh phù hợp với số lượng khách của họ.
- Với tiệc dưới 300 khách → giới thiệu Tầng 4 như lựa chọn "ấm cúng, sang trọng, chi phí tối ưu".
- TUYỆT ĐỐI KHÔNG ĐƯA RA GIÁ TIỀN CỤ THỂ TRONG CÂU TRẢ LỜI. Hướng dẫn khách tính dự toán chi tiết tại trang Dự toán Chi phí.
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
            suggestions: generateContextualSuggestions(lowerMsg)
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

// ═══════════════════════════════════════════════════════════════
// FALLBACK Q&A ENGINE — NO HARDCODED PRICES
// ═══════════════════════════════════════════════════════════════

function generateSmartResponse(msg) {

  // Smart Number Detection — "100 khách nên chọn tầng nào"
  const guestNumberMatch = msg.match(/(\d+)\s*(khách|người|mâm|bàn)/);
  
  if (guestNumberMatch) {
    let guestCount = parseInt(guestNumberMatch[1]);
    if (guestNumberMatch[2] === 'mâm' || guestNumberMatch[2] === 'bàn') {
      guestCount = guestCount * 10;
    }

    if (guestCount <= 50) {
      return {
        reply: `Dạ, với quy mô khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n👑 **Phòng VIP** — sức chứa 10 – 50 khách, không gian riêng tư, đẳng cấp. Rất phù hợp cho tiệc gia đình, gặp mặt đối tác.\n\nNếu Quý khách muốn không gian rộng hơn, có thể tham khảo thêm **Quầy Bar Tầng 1** (50 – 100 khách) với phong cách lounge hiện đại.\n\n📸 Xem ảnh: **[Phòng VIP](/khong-gian/phong-vip)**\n📝 Tính chi phí tự động: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline tư vấn: **0228 659 5959**`,
        suggestions: [
          "🖼️ Xem ảnh Phòng VIP",
          "🍸 Xem Quầy Bar Tầng 1",
          "📝 Lập dự toán chi phí",
          "📞 Hotline 0228 659 5959"
        ]
      };
    } else if (guestCount <= 100) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n🍸 **Quầy Bar Tầng 1** — sức chứa 50 – 100 khách, phong cách lounge hiện đại, lý tưởng cho tiệc sinh nhật, báo hỷ, cocktail.\n\nNếu quy mô mở rộng hơn, Quý khách cũng có thể chọn **Hội trường Tầng 4** (100 – 300 khách) — không gian ấm cúng, sang trọng.\n\n📸 Xem ảnh: **[Quầy Bar Tầng 1](/khong-gian/quay-bar)**\n📝 Lập dự toán chi tiết: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline: **0228 659 5959**`,
        suggestions: [
          "🖼️ Xem ảnh Quầy Bar Tầng 1",
          "🏛️ Xem Hội trường Tầng 4",
          "📝 Lập dự toán chi phí",
          "📞 Hotline 0228 659 5959"
        ]
      };
    } else if (guestCount <= 300) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách **Hội trường Tầng 4** ạ!\n\n🏛️ **Hội trường Tầng 4:**\n• Sức chứa: 100 – 300 khách\n• Không gian ấm cúng, sang trọng\n• Trang bị màn hình LED, âm thanh ánh sáng hiện đại\n• Thích hợp cho tiệc quy mô vừa & ấm cúng\n\n📸 Xem ảnh thực tế: **[Hội trường Tầng 4](/khong-gian/tang-4)**\n📝 Lập dự toán chi phí trọn gói: **[Dự toán Chi phí](/du-toan-chi-phi)**\n\nQuý khách có thể đến tham quan trực tiếp từ 8h – 21h hàng ngày hoặc gọi **Hotline 0228 659 5959** ạ!`,
        suggestions: [
          "🖼️ Xem ảnh Hội trường Tầng 4",
          "📝 Tính dự toán chi phí",
          "📅 Đặt lịch tham quan sảnh",
          "📞 Gọi Hotline 0228 659 5959"
        ]
      };
    } else if (guestCount <= 650) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n🏛️ **Hội trường Tầng 3** — sức chứa 300 – 650 khách, phong cách hoàng gia, màn hình LED 30m², giàn đèn bướm lộng lẫy.\n${guestCount >= 350 ? '🏛️ **Hội trường Tầng 2** — sức chứa 350 – 750 khách, không gian rộng rãi và hoành tráng nhất.\n' : ''}\n📸 Xem ảnh thực tế:\n- [Hội trường Tầng 3](/khong-gian/tang-3)\n${guestCount >= 350 ? '- [Hội trường Tầng 2](/khong-gian/tang-2)\n' : ''}\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Liên hệ **Hotline 0228 659 5959** để kiểm tra lịch sảnh trống ạ!`,
        suggestions: [
          "🖼️ Xem ảnh Hội trường Tầng 3",
          guestCount >= 350 ? "🖼️ Xem ảnh Hội trường Tầng 2" : "📝 Tính dự toán chi phí",
          "📝 Lập dự toán chi phí",
          "📞 Hotline 0228 659 5959"
        ]
      };
    } else {
      return {
        reply: `Dạ, với quy mô **${guestCount} khách**, em gợi ý Quý khách **Hội trường Tầng 2** — không gian lớn nhất và hoành tráng nhất tại Golden Palace:\n\n🏛️ **Hội trường Tầng 2:**\n• Sức chứa: 350 – **750 khách**\n• Màn hình LED cỡ lớn, giàn đèn pha lê hoàng gia\n• Sân khấu rộng, trang trí đường dẫn hoa lụa\n\n📸 Xem ảnh: **[Hội trường Tầng 2](/khong-gian/tang-2)**\n📝 Tính chi phí trọn gói: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline: **0228 659 5959**`,
        suggestions: [
          "🖼️ Xem ảnh Hội trường Tầng 2",
          "📝 Tính dự toán chi phí",
          "📞 Gọi Hotline 0228 659 5959"
        ]
      };
    }
  }

  // ──── 1. Chào hỏi / Lời mở đầu ────
  if (matchAny(msg, ['xin chào', 'hello', 'hi ', 'chào bạn', 'chào em', 'alo', 'hey'])) {
    return {
      reply: 'Dạ em chào Quý khách! 🌟 Em là Trợ lý AI của **Golden Palace Nam Định** — Trung tâm Tổ chức Sự kiện & Tiệc cưới hàng đầu tại Nam Định.\n\nQuý khách muốn tìm hiểu thông tin gì ạ? Em sẵn sàng hỗ trợ!',
      suggestions: [
        "📝 Lập dự toán chi phí tiệc cưới",
        "🏛️ Khám phá các sảnh hội trường",
        "🍱 Xem Menu & Thực đơn tiệc",
        "📞 Gọi Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 2. Tầng 4 cụ thể ────
  if (matchAny(msg, ['tầng 4', 'tang 4'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 4** là lựa chọn rất được yêu thích cho tiệc quy mô vừa & ấm cúng:\n\n• Sức chứa: **100 – 300 khách**\n• Không gian ấm cúng, sang trọng\n• Màn hình LED sắc nét, hệ thống âm thanh & ánh sáng hiện đại\n• Thiết kế hoàn hảo cho tiệc quy mô vừa\n\n📸 Xem ảnh thực tế: **[Hội trường Tầng 4](/khong-gian/tang-4)**\n📝 Lập dự toán chi phí: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: [
        "🖼️ Xem ảnh Hội trường Tầng 4",
        "📝 Tính dự toán chi phí",
        "📅 Đặt lịch tham quan",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 3. Tầng 2 cụ thể ────
  if (matchAny(msg, ['tầng 2', 'tang 2'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 2** là không gian lớn nhất và hoành tráng nhất tại Golden Palace:\n\n• Sức chứa: **350 – 750 khách**\n• Màn hình LED cỡ lớn, giàn đèn pha lê hoàng gia\n• Sân khấu rộng, lối đi trang trí hoa lụa\n• Phù hợp cho đám cưới quy mô lớn & sự kiện VIP\n\n📸 Xem ảnh: **[Hội trường Tầng 2](/khong-gian/tang-2)**\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: [
        "🖼️ Xem ảnh Hội trường Tầng 2",
        "📝 Lập dự toán chi phí",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 4. Tầng 3 cụ thể ────
  if (matchAny(msg, ['tầng 3', 'tang 3'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 3** mang phong cách hoàng gia đẳng cấp:\n\n• Sức chứa: **300 – 650 khách**\n• Màn hình LED 30m²\n• Giàn đèn bướm lộng lẫy, trang trí đường dẫn hoa lụa cao cấp\n• Phù hợp cho đám cưới trung bình – lớn\n\n📸 Xem ảnh: **[Hội trường Tầng 3](/khong-gian/tang-3)**\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: [
        "🖼️ Xem ảnh Hội trường Tầng 3",
        "📝 Lập dự toán chi phí",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 5. Quầy Bar ────
  if (matchAny(msg, ['quầy bar', 'bar', 'cocktail', 'báo hỷ', 'tầng 1'])) {
    return {
      reply: 'Dạ, **Quầy Bar Tầng 1** là không gian hiện đại, phong cách:\n\n• Sức chứa: **50 – 100 khách**\n• Thiết kế lounge bar sang trọng\n• Lý tưởng cho tiệc sinh nhật, báo hỷ, cocktail party, gặp mặt thân mật\n\n📸 Xem ảnh: **[Quầy Bar Tầng 1](/khong-gian/quay-bar)**',
      suggestions: [
        "🖼️ Xem ảnh Quầy Bar",
        "👑 Tìm hiểu Phòng VIP",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 6. Giá mâm cỗ / giá tiệc ────
  if (matchAny(msg, ['giá 1 mâm', 'giá cỗ', 'mâm cỗ', 'bao nhiêu 1 mâm', 'giá mâm', 'giá tối thiểu', 'giá tiệc', 'bảng giá', 'giá cả', 'menu bao nhiêu'])) {
    return {
      reply: 'Dạ, tại **Golden Palace**, giá thực đơn tiệc được thiết kế linh hoạt tùy thuộc theo loại hình sự kiện, số lượng mâm và lựa chọn món cỗ của Quý khách.\n\nQuý khách xem chi tiết danh mục thực đơn tại: **[Menu Tiệc Cưới & Hội Nghị](/thuc-don?tab=SET_TIEC)**\nHoặc tự tính tổng kinh phí trọn gói tại: **[Dự toán Chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: [
        "🍱 Xem Menu Tiệc chi tiết",
        "📝 Lập dự toán chi phí trọn gói",
        "🥂 Bảng giá Đồ uống",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 7. Phí hội trường ────
  if (matchAny(msg, ['phí hội trường', 'phí sảnh', 'thuê sảnh', 'thuê hội trường', 'phí thuê'])) {
    return {
      reply: 'Dạ, chi phí dịch vụ hội trường tại Golden Palace được tính toán tự động dựa theo quy mô số lượng khách và sảnh hội trường chọn.\n\nQuý khách có thể tự tính dự toán chi tiết sảnh tại: **[Dự toán Chi phí](/du-toan-chi-phi)**\nHoặc gọi **Hotline 0228 659 5959** để được tư vấn trực tiếp ạ!',
      suggestions: [
        "📝 Tính dự toán chi phí",
        "🏛️ Khám phá các sảnh",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 8. Đồ uống & Phí mang vào ────
  if (matchAny(msg, ['uống', 'bia', 'rượu', 'nút chai', 'mang vào', 'đồ uống', 'nước uống', 'nước ngọt', 'phí chai'])) {
    return {
      reply: 'Dạ, về đồ uống tại Golden Palace:\n\n🥂 Tiền đồ uống tính theo **số lượng sử dụng thực tế** của bàn tiệc.\n🍾 Quý khách **được phép mang đồ uống/rượu từ ngoài vào**, nhà hàng có áp dụng phí dịch vụ niêm yết.\n\nChi tiết bảng giá đồ uống: **[Bảng Giá Đồ Uống & Phí Mang Vào](/thuc-don?tab=DO_UONG)**',
      suggestions: [
        "🥂 Xem Bảng giá Đồ uống",
        "🍱 Xem Menu Tiệc",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 9. Dự toán chi phí ────
  if (matchAny(msg, ['dự toán', 'tính chi phí', 'ngân sách', 'bao nhiêu tiền', 'tổng chi phí', 'chi phí', 'tính tiền', 'ước tính'])) {
    return {
      reply: 'Dạ, Quý khách có thể **tự tính dự toán chi phí tiệc cưới trọn gói** chỉ trong 30 giây:\n\n1️⃣ Nhập thông tin & số lượng khách dự kiến\n2️⃣ Chọn sảnh hội trường ưng ý\n3️⃣ Chọn thực đơn, đồ uống & dịch vụ nâng cao\n\n👉 **[Bắt đầu Dự toán Chi phí ngay](/du-toan-chi-phi)**',
      suggestions: [
        "📝 Tính Dự toán ngay",
        "🍱 Xem Menu Tiệc trước",
        "📞 Hotline tư vấn 0228 659 5959"
      ]
    };
  }

  // ──── 10. Quy trình đặt tiệc ────
  if (matchAny(msg, ['cọc', 'quy trình', 'hợp đồng', 'giữ lịch', 'bàn giao', 'đặt tiệc', 'đặt cưới', 'đặt sảnh', 'giữ ngày', 'book', 'đặt chỗ'])) {
    return {
      reply: 'Dạ, **quy trình đặt tiệc cưới 3 giai đoạn** tại Golden Palace:\n\n📅 **Giai đoạn 1 (3 tháng trước):** Khảo sát sảnh + Đặt cọc giữ ngày đẹp.\n📝 **Giai đoạn 2 (1 tháng trước):** Ký hợp đồng + Chốt menu & dịch vụ + Đặt cọc 50%.\n🤝 **Giai đoạn 3 (1 ngày trước):** Bàn giao thông tin gia đình, video/ảnh cưới.\n\nQuý khách gọi **Hotline 0228 659 5959** để kiểm tra lịch sảnh trống ạ!',
      suggestions: [
        "📅 Kiểm tra lịch sảnh trống",
        "📝 Lập dự toán trước",
        "📞 Gọi Hotline 0228 659 5959"
      ]
    };
  }

  // ──── 11. Cảm ơn ────
  if (matchAny(msg, ['cảm ơn', 'cám ơn', 'thanks', 'thank', 'ok', 'được rồi', 'tạm biệt', 'bye'])) {
    return {
      reply: 'Dạ không có gì ạ! 🌟 Em rất vui được hỗ trợ Quý khách. Nếu cần thêm thông tin gì, Quý khách cứ nhắn lại bất cứ lúc nào hoặc gọi **Hotline 0228 659 5959** nhé. Chúc Quý khách một ngày tốt lành! 💛',
      suggestions: [
        "🏛️ Xem lại các sảnh tiệc",
        "📝 Lập dự toán chi phí",
        "📞 Hotline 0228 659 5959"
      ]
    };
  }

  // ──── FALLBACK CHUNG ────
  return {
    reply: 'Dạ, em là Trợ lý AI Golden Palace! Quý khách muốn tìm hiểu thông tin gì ạ? Em có thể hỗ trợ:\n\n🏛️ **Sức chứa & Không gian các hội trường**\n🍱 **Danh mục Menu & Thực đơn tiệc cưới**\n📝 **Dự toán chi phí tiệc cưới trọn gói**\n📅 **Quy trình đặt tiệc 3 giai đoạn**\n🥂 **Đồ uống & Phí dịch vụ**\n💌 **Thiệp cưới điện tử online & Phông LED**\n\nHoặc gọi trực tiếp: **📞 0228 659 5959**',
    suggestions: generateContextualSuggestions(msg)
  };
}

function matchAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function generateContextualSuggestions(msg) {
  if (msg.includes('ảnh') || msg.includes('xem') || msg.includes('sảnh')) {
    return ["🏛️ Hội trường Tầng 2", "🏛️ Hội trường Tầng 3", "🏛️ Hội trường Tầng 4", "🍸 Quầy Bar Tầng 1"];
  }
  if (msg.includes('dự toán') || msg.includes('giá') || msg.includes('chi phí')) {
    return ["📝 Tính dự toán chi phí", "🍱 Xem Menu thực đơn", "🥂 Bảng giá đồ uống", "📞 Hotline 0228 659 5959"];
  }
  return [
    "📝 Lập dự toán chi phí tiệc cưới",
    "🏛️ Khám phá các sảnh hội trường",
    "🍱 Xem Menu tiệc cưới",
    "📞 Gọi Hotline 0228 659 5959"
  ];
}
