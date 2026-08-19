import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ═══════════════════════════════════════════════════════════════
// Golden Palace AI Chatbot — Dynamic Knowledge & Rule Matching
// ═══════════════════════════════════════════════════════════════

const DEFAULT_SYSTEM_KNOWLEDGE = `
Bạn là Trợ lý AI Tư vấn Tiệc cưới & Sự kiện của Nhà hàng Golden Palace Nam Định.

═══ QUY TẮC GIAO TIẾP BẮT BUỘC ═══
- Xưng "Em", gọi "Quý khách" hoặc "Anh/Chị". Ân cần, lịch thiệp, chuyên nghiệp.
- Trả lời ngắn gọn, đúng trọng tâm, KHÔNG lan man. Tối đa 150 từ mỗi câu trả lời.
- Luôn cung cấp link trang web khi phù hợp (dạng markdown).
- Khi không chắc chắn hoặc câu hỏi phức tạp → hướng khách gọi Hotline 0228 659 5959.
- TUYỆT ĐỐI KHÔNG BÁO GIÁ TIỀN CỤ THỂ HOẶC SỐ TIỀN CỐ ĐỊNH TRONG CHATBOX. 
- Khi khách hỏi giá tiền / sảnh / chi phí tiệc: Giải thích nhẹ nhàng rằng chi phí được tính toán tự động và chính xác tùy theo quy mô & sảnh chọn tại trang [Dự toán Chi phí](/du-toan-chi-phi) hoặc hướng dẫn khách gọi Hotline 0228 659 5959.

═══ THÔNG TIN CHÍNH THỨC ═══
1. ĐỊA CHỈ & GIỜ MỞ CỬA: 98 Đông A, KĐT Hòa Vượng, TP Nam Định. Giờ đón khách: 8h00 – 21h00. Hotline/Zalo: 0228 659 5959
2. HỘI TRƯỜNG: Tầng 2 (350–750 khách), Tầng 3 (300–650 khách), Tầng 4 (100–300 khách), Quầy Bar Tầng 1 (50–100 khách), Phòng VIP (10–50 khách).
3. GIÁ TIỆC: Biến động theo thời điểm & quy mô. Hướng dẫn tính dự toán trọn gói tại [Dự toán Chi phí](/du-toan-chi-phi).
4. ĐỒ UỐNG: Tính theo số lượng sử dụng thực tế. Khách được mang đồ uống vào (có phí dịch vụ).
5. DỊCH VỤ BỔ SUNG: MC, Ban nhạc Liveband, Photobooth, Cổng hoa tươi, Xe cưới...
`;

async function logUnansweredQuestion(question) {
  if (!question || question.length < 3) return;
  try {
    const qTrim = question.trim().toLowerCase();
    const existing = await prisma.aiUnansweredQuestion.findFirst({
      where: {
        question: {
          contains: qTrim.substring(0, 30)
        },
        isResolved: false
      }
    });

    if (existing) {
      await prisma.aiUnansweredQuestion.update({
        where: { id: existing.id },
        data: {
          askCount: existing.askCount + 1,
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.aiUnansweredQuestion.create({
        data: {
          question: question.trim()
        }
      });
    }
  } catch (err) {
    console.error('Error logging unanswered question:', err);
  }
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const lastUserMsg = messages && messages.length > 0 
      ? messages[messages.length - 1].content 
      : '';

    const lowerMsg = lastUserMsg.toLowerCase().trim();

    // STEP 1: MATCH ADMIN CUSTOM Q&A RULES FROM DATABASE FIRST!
    try {
      const activeRules = await prisma.aiRule.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      });

      for (const rule of activeRules) {
        const keywordList = rule.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        const isMatched = keywordList.some(kw => lowerMsg.includes(kw));

        if (isMatched) {
          return NextResponse.json({
            reply: rule.answer,
            suggestions: generateContextualSuggestions(lowerMsg)
          });
        }
      }
    } catch (dbErr) {
      console.error('DB Rule search error:', dbErr);
    }

    // STEP 2: USE GEMINI API WITH LATEST ADMIN SYSTEM CONFIG
    let activeSystemPrompt = DEFAULT_SYSTEM_KNOWLEDGE;
    try {
      const dbConfig = await prisma.aiSystemConfig.findFirst();
      if (dbConfig?.systemPrompt) {
        activeSystemPrompt = dbConfig.systemPrompt;
      }
    } catch (e) {}

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
                    { text: activeSystemPrompt },
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

    // STEP 3: FALLBACK Q&A ENGINE
    const { reply, suggestions, isFallback } = generateSmartResponse(lowerMsg);

    // If fallback triggered, log unanswered question for Admin review!
    if (isFallback) {
      await logUnansweredQuestion(lastUserMsg);
    }

    return NextResponse.json({ reply, suggestions });

  } catch (error) {
    console.error('AI Chat Route Error:', error);
    return NextResponse.json(
      {
        reply: 'Dạ em chào Quý khách! Hiện tại hệ thống đang bận. Quý khách vui lòng gọi Hotline **0228 659 5959** hoặc thử công cụ **[Dự toán chi phí](/du-toan-chi-phi)** ạ!',
        suggestions: ["📞 Gọi Hotline 0228 659 5959", "📝 Tính dự toán ngay"]
      },
      { status: 500 }
    );
  }
}

function generateSmartResponse(msg) {
  const guestNumberMatch = msg.match(/(\d+)\s*(khách|người|mâm|bàn)/);
  
  if (guestNumberMatch) {
    let guestCount = parseInt(guestNumberMatch[1]);
    if (guestNumberMatch[2] === 'mâm' || guestNumberMatch[2] === 'bàn') {
      guestCount = guestCount * 10;
    }

    if (guestCount <= 50) {
      return {
        reply: `Dạ, với quy mô khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n👑 **Phòng VIP** — sức chứa 10 – 50 khách, không gian riêng tư, đẳng cấp. Rất phù hợp cho tiệc gia đình, gặp mặt đối tác.\n\nNếu Quý khách muốn không gian rộng hơn, có thể tham khảo thêm **Quầy Bar Tầng 1** (50 – 100 khách) với phong cách lounge hiện đại.\n\n📸 Xem ảnh: **[Phòng VIP](/khong-gian/phong-vip)**\n📝 Tính chi phí tự động: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline tư vấn: **0228 659 5959**`,
        suggestions: ["🖼️ Xem ảnh Phòng VIP", "🍸 Xem Quầy Bar Tầng 1", "📝 Lập dự toán chi phí", "📞 Hotline 0228 659 5959"],
        isFallback: false
      };
    } else if (guestCount <= 100) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n🍸 **Quầy Bar Tầng 1** — sức chứa 50 – 100 khách, phong cách lounge hiện đại, lý tưởng cho tiệc sinh nhật, báo hỷ, cocktail.\n\nNếu quy mô mở rộng hơn, Quý khách cũng có thể chọn **Hội trường Tầng 4** (100 – 300 khách) — không gian ấm cúng, sang trọng.\n\n📸 Xem ảnh: **[Quầy Bar Tầng 1](/khong-gian/quay-bar)**\n📝 Lập dự toán chi tiết: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline: **0228 659 5959**`,
        suggestions: ["🖼️ Xem ảnh Quầy Bar Tầng 1", "🏛️ Xem Hội trường Tầng 4", "📝 Lập dự toán chi phí", "📞 Hotline 0228 659 5959"],
        isFallback: false
      };
    } else if (guestCount <= 300) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách **Hội trường Tầng 4** ạ!\n\n🏛️ **Hội trường Tầng 4:**\n• Sức chứa: 100 – 300 khách\n• Không gian ấm cúng, sang trọng\n• Trang bị màn hình LED, âm thanh ánh sáng hiện đại\n• Thích hợp cho tiệc quy mô vừa & ấm cúng\n\n📸 Xem ảnh thực tế: **[Hội trường Tầng 4](/khong-gian/tang-4)**\n📝 Lập dự toán chi phí trọn gói: **[Dự toán Chi phí](/du-toan-chi-phi)**\n\nQuý khách có thể đến tham quan trực tiếp từ 8h – 21h hàng ngày hoặc gọi **Hotline 0228 659 5959** ạ!`,
        suggestions: ["🖼️ Xem ảnh Hội trường Tầng 4", "📝 Tính dự toán chi phí", "📅 Đặt lịch tham quan sảnh", "📞 Gọi Hotline 0228 659 5959"],
        isFallback: false
      };
    } else if (guestCount <= 650) {
      return {
        reply: `Dạ, với khoảng **${guestCount} khách**, em gợi ý Quý khách tham khảo:\n\n🏛️ **Hội trường Tầng 3** — sức chứa 300 – 650 khách, phong cách hoàng gia, màn hình LED 30m², giàn đèn bướm lộng lẫy.\n${guestCount >= 350 ? '🏛️ **Hội trường Tầng 2** — sức chứa 350 – 750 khách, không gian rộng rãi và hoành tráng nhất.\n' : ''}\n📸 Xem ảnh thực tế:\n- [Hội trường Tầng 3](/khong-gian/tang-3)\n${guestCount >= 350 ? '- [Hội trường Tầng 2](/khong-gian/tang-2)\n' : ''}\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Liên hệ **Hotline 0228 659 5959** để kiểm tra lịch sảnh trống ạ!`,
        suggestions: ["🖼️ Xem ảnh Hội trường Tầng 3", "📝 Lập dự toán chi phí", "📞 Hotline 0228 659 5959"],
        isFallback: false
      };
    } else {
      return {
        reply: `Dạ, với quy mô **${guestCount} khách**, em gợi ý Quý khách **Hội trường Tầng 2** — không gian lớn nhất và hoành tráng nhất tại Golden Palace:\n\n🏛️ **Hội trường Tầng 2:**\n• Sức chứa: 350 – **750 khách**\n• Màn hình LED cỡ lớn, giàn đèn pha lê hoàng gia\n• Sân khấu rộng, trang trí đường dẫn hoa lụa\n\n📸 Xem ảnh: **[Hội trường Tầng 2](/khong-gian/tang-2)**\n📝 Tính chi phí trọn gói: **[Dự toán Chi phí](/du-toan-chi-phi)**\n📞 Hotline: **0228 659 5959**`,
        suggestions: ["🖼️ Xem ảnh Hội trường Tầng 2", "📝 Tính dự toán chi phí", "📞 Gọi Hotline 0228 659 5959"],
        isFallback: false
      };
    }
  }

  if (matchAny(msg, ['xin chào', 'hello', 'hi ', 'chào bạn', 'chào em', 'alo', 'hey'])) {
    return {
      reply: 'Dạ em chào Quý khách! 🌟 Em là Trợ lý AI của **Golden Palace Nam Định** — Trung tâm Tổ chức Sự kiện & Tiệc cưới hàng đầu tại Nam Định.\n\nQuý khách muốn tìm hiểu thông tin gì ạ? Em sẵn sàng hỗ trợ!',
      suggestions: ["📝 Lập dự toán chi phí tiệc cưới", "🏛️ Khám phá các sảnh hội trường", "🍱 Xem Menu & Thực đơn tiệc", "📞 Gọi Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['tầng 4', 'tang 4'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 4** là lựa chọn rất được yêu thích cho tiệc quy mô vừa & ấm cúng:\n\n• Sức chứa: **100 – 300 khách**\n• Không gian ấm cúng, sang trọng\n• Màn hình LED sắc nét, hệ thống âm thanh & ánh sáng hiện đại\n\n📸 Xem ảnh thực tế: **[Hội trường Tầng 4](/khong-gian/tang-4)**\n📝 Lập dự toán chi phí: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: ["🖼️ Xem ảnh Hội trường Tầng 4", "📝 Tính dự toán chi phí", "📞 Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['tầng 2', 'tang 2'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 2** là không gian lớn nhất và hoành tráng nhất tại Golden Palace:\n\n• Sức chứa: **350 – 750 khách**\n• Màn hình LED cỡ lớn, giàn đèn pha lê hoàng gia\n\n📸 Xem ảnh: **[Hội trường Tầng 2](/khong-gian/tang-2)**\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: ["🖼️ Xem ảnh Hội trường Tầng 2", "📝 Lập dự toán chi phí", "📞 Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['tầng 3', 'tang 3'])) {
    return {
      reply: 'Dạ, **Hội trường Tầng 3** mang phong cách hoàng gia đẳng cấp:\n\n• Sức chứa: **300 – 650 khách**\n• Màn hình LED 30m², giàn đèn bướm lộng lẫy\n\n📸 Xem ảnh: **[Hội trường Tầng 3](/khong-gian/tang-3)**\n📝 Tính dự toán: **[Dự toán Chi phí](/du-toan-chi-phi)**',
      suggestions: ["🖼️ Xem ảnh Hội trường Tầng 3", "📝 Lập dự toán chi phí", "📞 Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['quầy bar', 'bar', 'cocktail', 'báo hỷ', 'tầng 1'])) {
    return {
      reply: 'Dạ, **Quầy Bar Tầng 1** là không gian hiện đại, phong cách:\n\n• Sức chứa: **50 – 100 khách**\n• Lý tưởng cho tiệc sinh nhật, báo hỷ, cocktail party\n\n📸 Xem ảnh: **[Quầy Bar Tầng 1](/khong-gian/quay-bar)**',
      suggestions: ["🖼️ Xem ảnh Quầy Bar", "📞 Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['giá 1 mâm', 'giá cỗ', 'mâm cỗ', 'bao nhiêu 1 mâm', 'giá mâm', 'giá tiệc', 'bảng giá'])) {
    return {
      reply: 'Dạ, tại **Golden Palace**, giá thực đơn tiệc được thiết kế linh hoạt tùy thuộc theo quy mô và số lượng mâm cỗ.\n\nQuý khách xem danh mục thực đơn tại: **[Menu Tiệc Cưới](/thuc-don?tab=SET_TIEC)**\nHoặc tự tính tổng kinh phí trọn gói tại: **[Dự toán Chi phí](/du-toan-chi-phi)** ạ!',
      suggestions: ["🍱 Xem Menu Tiệc chi tiết", "📝 Lập dự toán chi phí trọn gói", "📞 Hotline 0228 659 5959"],
      isFallback: false
    };
  }

  if (matchAny(msg, ['dự toán', 'tính chi phí', 'ngân sách', 'bao nhiêu tiền', 'chi phí'])) {
    return {
      reply: 'Dạ, Quý khách có thể **tự tính dự toán chi phí tiệc cưới trọn gói** chỉ trong 30 giây:\n\n👉 **[Bắt đầu Dự toán Chi phí ngay](/du-toan-chi-phi)**',
      suggestions: ["📝 Tính Dự toán ngay", "📞 Hotline tư vấn 0228 659 5959"],
      isFallback: false
    };
  }

  // FALLBACK UNANSWERED — LOG QUESTION TO DB!
  return {
    reply: 'Dạ, em là Trợ lý AI Golden Palace! Em đã ghi nhận câu hỏi của Quý khách. Em có thể hỗ trợ ngay:\n\n🏛️ **Sức chứa & Không gian các hội trường**\n🍱 **Danh mục Menu & Thực đơn tiệc cưới**\n📝 **Dự toán chi phí tiệc cưới trọn gói**\n📅 **Quy trình đặt tiệc 3 giai đoạn**\n\nHoặc gọi trực tiếp chuyên viên: **📞 0228 659 5959**',
    suggestions: generateContextualSuggestions(msg),
    isFallback: true
  };
}

function matchAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function generateContextualSuggestions(msg) {
  return [
    "📝 Lập dự toán chi phí tiệc cưới",
    "🏛️ Khám phá các sảnh hội trường",
    "🍱 Xem Menu tiệc cưới",
    "📞 Gọi Hotline 0228 659 5959"
  ];
}
