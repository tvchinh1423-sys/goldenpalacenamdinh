import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Smart rule-based parser for Vietnamese booking notes & Zalo text
function smartParseBookingText(text) {
  if (!text) return {};

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Extract Phone Number (10-11 digits starting with 0 or +84)
  const phoneMatch = cleanText.match(/(?:\+84|0)[3|5|7|8|9][0-9]{8}\b/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 2. Extract Event Date (DD/MM/YYYY or DD-MM-YYYY or DD/MM)
  let eventDate = '';
  const dateMatch = cleanText.match(/\b([0-3]?\d)[\/\.\-]([0-1]?\d)(?:[\/\.\-](20\d{2}|\d{2}))?\b/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3] ? (dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3]) : new Date().getFullYear();
    eventDate = `${year}-${month}-${day}`;
  }

  // 3. Extract Tables (Số mâm / Số bàn / Bàn / Mâm)
  let mainTables = 0;
  const tableMatch = cleanText.match(/(\d+)\s*(?:mâm|bàn|măm)/i) || cleanText.match(/(?:quy mô|khoảng|tầm)\s*(\d+)\s*(?:mâm|bàn)/i);
  if (tableMatch) {
    mainTables = parseInt(tableMatch[1], 10);
  }

  // 4. Extract Deposit (Cọc / Tiền cọc / Chuyển khoản)
  let depositAmount = 0;
  const depositMatch = cleanText.match(/(?:cọc|tiền cọc|đã cọc|đặt cọc)\s*(?:là|:)?\s*(\d+(?:[.,]\d+)?)\s*(tr|triệu|k|trẻo|trđ|triệu đồng|đ|vnd)?/i);
  if (depositMatch) {
    let num = parseFloat(depositMatch[1].replace(',', '.'));
    const unit = (depositMatch[2] || '').toLowerCase();
    if (unit.includes('tr') || unit.includes('triệu')) {
      depositAmount = num * 1000000;
    } else if (unit.includes('k')) {
      depositAmount = num * 1000;
    } else if (num < 1000) {
      // If someone writes cọc 10 -> assume 10 million
      depositAmount = num * 1000000;
    } else {
      depositAmount = num;
    }
  }

  // 5. Extract Budget per table (VD: 4.5tr/mâm, 4500k, 3tr5)
  let budgetPerTable = 0;
  const budgetMatch = cleanText.match(/(\d+(?:[.,]\d+)?)\s*(tr|triệu|k)?\s*(?:\/|trên|một)?\s*(?:mâm|bàn)/i);
  if (budgetMatch) {
    let num = parseFloat(budgetMatch[1].replace(',', '.'));
    const unit = (budgetMatch[2] || '').toLowerCase();
    if (unit.includes('tr') || unit.includes('triệu') || num < 100) {
      budgetPerTable = num * 1000000;
    } else if (unit.includes('k')) {
      budgetPerTable = num * 1000;
    } else {
      budgetPerTable = num;
    }
  }

  // 6. Extract Venue (Sảnh)
  let venue = '';
  const venueMatch = cleanText.match(/(?:sảnh|tầng)\s*([a-zA-Z0-9\s]+?)(?=\s*(?:ngày|sđt|cọc|mâm|bàn|$|,|\.))/i);
  if (venueMatch) {
    venue = `Sảnh ${venueMatch[1].trim()}`;
  }

  // 7. Extract Name / Bride & Groom
  let name = '';
  let brideGroomNames = '';

  const nameMatch = cleanText.match(/(?:anh|chị|chú|bác|khách|ông|bà)\s+([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸa-zA-Z\s]{2,25})/i);
  if (nameMatch) {
    name = nameMatch[0].trim();
  }

  const bgMatch = cleanText.match(/(?:cưới|tiệc cưới|chú rể|cô dâu)\s+([^\.\,\n]+)/i);
  if (bgMatch) {
    brideGroomNames = bgMatch[1].trim();
  }

  // 8. Event Type
  let eventType = 'TIEC_CUOI';
  if (lower.includes('sinh nhật') || lower.includes('thượng thọ')) eventType = 'SINH_NHAT';
  else if (lower.includes('hội nghị') || lower.includes('công ty') || lower.includes('tổng kết')) eventType = 'HOI_NGHI';
  else if (lower.includes('tiệc cưới') || lower.includes('lễ cưới') || lower.includes('thành hôn')) eventType = 'TIEC_CUOI';

  return {
    name: name || (brideGroomNames ? `Khách đặt tiệc (${brideGroomNames})` : 'Khách Đặt Tiệc'),
    phone,
    brideGroomNames,
    eventType,
    eventDate,
    venue,
    mainTables: mainTables || 0,
    guestCount: mainTables ? mainTables * 10 : 0,
    budgetPerTable,
    depositAmount,
    notes: cleanText
  };
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, rawText } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    // Direct rawText parse if no image provided or fallback
    if (rawText && !imageBase64) {
      const parsed = smartParseBookingText(rawText);
      return NextResponse.json({ success: true, data: parsed, source: 'rule-parser' });
    }

    // Image provided + Gemini API Key available
    if (imageBase64 && geminiApiKey) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const promptText = `
Bạn là trợ lý AI chuyên nghiệp quản lý đặt tiệc tại Nhà hàng Golden Palace Nam Định.
Hãy đọc toàn bộ hình ảnh này (có thể là hợp đồng tiệc, phiếu đặt cọc tay, hoặc tin nhắn Zalo của khách hàng).
Hãy bóc tách chính xác các trường thông tin sau:
1. name: Tên khách hàng (VD: "Anh Chinh", "Chị Mai"...)
2. phone: Số điện thoại (10 chữ số)
3. brideGroomNames: Tên chú rể & cô dâu (nếu là tiệc cưới)
4. eventType: Loại tiệc (TIEC_CUOI, HOI_NGHI, SINH_NHAT, KHAC)
5. eventDate: Ngày tổ chức dạng YYYY-MM-DD (nếu có)
6. venue: Tên sảnh (VD: "Sảnh Diamond", "Sảnh Ruby"...)
7. mainTables: Số mâm / số bàn chính (dạng số)
8. budgetPerTable: Giá mâm dự kiến VND (dạng số)
9. depositAmount: Số tiền cọc đã nhận VND (dạng số)
10. notes: Ghi chú quan trọng trích xuất từ ảnh

Trả về ĐÚNG 1 ĐỊNH DẠNG JSON duy nhất (không có markdown code block, không thêm văn bản khác):
{
  "name": "...",
  "phone": "...",
  "brideGroomNames": "...",
  "eventType": "TIEC_CUOI",
  "eventDate": "2026-10-20",
  "venue": "...",
  "mainTables": 30,
  "budgetPerTable": 4500000,
  "depositAmount": 10000000,
  "notes": "..."
}
`;

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
                    { text: promptText },
                    {
                      inlineData: {
                        mimeType: 'image/jpeg',
                        data: cleanBase64
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return NextResponse.json({
            success: true,
            data: {
              name: parsed.name || '',
              phone: parsed.phone || '',
              brideGroomNames: parsed.brideGroomNames || '',
              eventType: parsed.eventType || 'TIEC_CUOI',
              eventDate: parsed.eventDate || '',
              venue: parsed.venue || '',
              mainTables: Number(parsed.mainTables) || 0,
              guestCount: (Number(parsed.mainTables) || 0) * 10,
              budgetPerTable: Number(parsed.budgetPerTable) || 0,
              depositAmount: Number(parsed.depositAmount) || 0,
              notes: parsed.notes || ''
            },
            source: 'gemini-vision'
          });
        }
      } catch (err) {
        console.error('Gemini Vision Parse Error:', err);
      }
    }

    // Fallback if image provided but OCR failed or Gemini API key missing
    if (imageBase64 || rawText) {
      const parsed = smartParseBookingText(rawText || '');
      return NextResponse.json({ success: true, data: parsed, source: 'rule-parser-fallback' });
    }

    return NextResponse.json(
      { error: 'Vui lòng cung cấp văn bản hoặc hình ảnh hợp lệ để AI xử lý.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error in parse-booking:', error);
    return NextResponse.json({ error: 'Không thể phân tích dữ liệu' }, { status: 500 });
  }
}
