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
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const promptText = `
Bạn là trợ lý AI chuyên nghiệp quản lý đặt tiệc tại Nhà hàng Golden Palace Nam Định.
Hãy đọc toàn bộ hình ảnh này. Đây có thể là Phiếu BEO (Banquet Event Order), hợp đồng tiệc cưới, phiếu đặt cọc tay, hoặc tin nhắn Zalo của nhà hàng Golden Palace.

Hãy phân tích kỹ và bóc tách chính xác các trường thông tin sau:
1. beoCode: Mã BEO nếu có (VD: "BEO-072")
2. partyTitle: Tiêu đề sự kiện (VD: "Lễ thành hôn Đức Anh & Thùy Dung")
3. groomName: Tên Chú Rể (VD: "Đức Anh")
4. brideName: Tên Cô Dâu (VD: "Thùy Dung")
5. brideGroomNames: Tên ghép Chú rể & Cô dâu (VD: "Đức Anh & Thùy Dung")
6. name: Tên Khách hàng Bên A (VD: "Cô Ngọc")
7. phone: Số điện thoại liên hệ Bên A (10 chữ số, VD: "0912162426")
8. saleStaff: Tên nhân viên sale Bên B và SĐT (VD: "Đỗ Thị Thu Trang - 0906195168")
9. eventType: Loại tiệc (TIEC_CUOI, HOI_NGHI, SINH_NHAT, KHAC)
10. eventDate: Ngày tổ chức dạng YYYY-MM-DD (VD: "2026-09-12" nếu trên ảnh ghi 12/09/2026)
11. venue: Tên sảnh hoặc tầng (VD: "Tầng 2", "Tầng 3", "Sảnh Diamond"...)
12. mainTables: Số mâm / số bàn chính (VD: Nếu ghi "Đảm bảo 450 khách" hoặc viết tay "450" ➔ số mâm chính là 45. Nếu ghi số mâm 30 ➔ 30).
13. reserveTables: Số mâm dự phòng (VD: 40 khách ➔ 4 mâm).
14. budgetPerTable: Giá mâm dự kiến VND (VD: 380.000đ/khách ➔ 3.800.000đ/mâm).
15. totalAmount: Tổng tạm tính VND (VD: 166400000)
16. depositAmount: Số tiền cọc đã nhận VND (VD: "Đã cọc 5.000.000đ" ➔ 5000000).
17. menuDishes: Toàn bộ danh sách các món ăn thực đơn mâm
18. khaiVi: Danh sách các món khai vị (súp, salad, gỏi, nộm, chả giò...) dạng mảng
19. monChinh: Danh sách các món chính (gà, cá, tôm, dê, hải sản, bò, canh, xôi, cơm...) dạng mảng
20. trangMieng: Danh sách món tráng miệng (caramen, chè, bánh, trái cây...) dạng mảng
21. doUong: CHỈ LIỆT KÊ TÊN ĐỒ UỐNG (tuyệt đối KHÔNG kèm số lượng, đơn vị tính hay số chai/lon. VD: ["Nước suối", "Bia sài gòn", "Coca", "Rượu ta", "Nước cam"]) dạng mảng
22. notes: Ghi chú dịch vụ yêu cầu (MC, Pháo điện, Màn hình LED 30m2, Bong bóng...)

Trả về ĐÚNG 1 ĐỊNH DẠNG JSON duy nhất (không chứa markdown code block, không thêm văn bản khác):
{
  "beoCode": "BEO-072",
  "partyTitle": "Lễ thành hôn Đức Anh & Thùy Dung",
  "groomName": "Đức Anh",
  "brideName": "Thùy Dung",
  "brideGroomNames": "Đức Anh & Thùy Dung",
  "name": "Cô Ngọc",
  "phone": "0912162426",
  "saleStaff": "Đỗ Thị Thu Trang",
  "eventType": "TIEC_CUOI",
  "eventDate": "2026-09-12",
  "venue": "Tầng 2",
  "mainTables": 45,
  "reserveTables": 4,
  "budgetPerTable": 3800000,
  "totalAmount": 166400000,
  "depositAmount": 5000000,
  "khaiVi": ["Súp gà ngô nấm", "Salad trứng cá hồi"],
  "monChinh": ["Gà rút xương sốt sâm nấm", "Cá lăng hấp xì dầu", "Dê chiên riềng", "Tôm ủ mây", "Hải sản xào sốt XO ( không mực)", "Rau xào theo mùa", "Canh mọc bò viên", "Cơm tám", "Xôi hoàng phố ruốc bông"],
  "trangMieng": ["Tráng miệng : Caramen"],
  "doUong": ["Nước suối", "Bia sài gòn", "Coca", "Rượu ta", "Nước cam"],
  "menuDishes": [
    "Súp gà ngô nấm",
    "Salad trứng cá hồi",
    "Gà rút xương sốt sâm nấm",
    "Cá lăng hấp xì dầu",
    "Dê chiên riềng",
    "Tôm ủ mây",
    "Hải sản xào sốt XO ( không mực)",
    "Rau xào theo mùa",
    "Canh mọc bò viên",
    "Cơm tám",
    "Xôi hoàng phố ruốc bông",
    "Tráng miệng : Caramen"
  ],
  "notes": "Trang trí & Kỹ thuật: Cổng hoa, Pháo điện 6 quả, LED 30m2, LED 10m2, MC 800k..."
}
`;

      // Models to try in order of preference
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

      for (const modelName of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
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

          if (!response.ok) {
            console.warn(`Gemini model ${modelName} returned status ${response.status}`);
            continue;
          }

          const data = await response.json();
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (jsonText) {
            const cleanJsonText = jsonText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJsonText);
            return NextResponse.json({
              success: true,
              data: {
                beoCode: parsed.beoCode || '',
                partyTitle: parsed.partyTitle || '',
                groomName: parsed.groomName || '',
                brideName: parsed.brideName || '',
                name: parsed.name || '',
                phone: parsed.phone || '',
                brideGroomNames: parsed.brideGroomNames || (parsed.groomName && parsed.brideName ? `${parsed.groomName} & ${parsed.brideName}` : ''),
                saleStaff: parsed.saleStaff || '',
                eventType: parsed.eventType || 'TIEC_CUOI',
                eventDate: parsed.eventDate || '',
                venue: parsed.venue || '',
                mainTables: Number(parsed.mainTables) || 0,
                reserveTables: Number(parsed.reserveTables) || 0,
                guestCount: (Number(parsed.mainTables) || 0) * 10,
                budgetPerTable: Number(parsed.budgetPerTable) || 0,
                totalAmount: Number(parsed.totalAmount) || 0,
                depositAmount: Number(parsed.depositAmount) || 0,
                menuDishes: Array.isArray(parsed.menuDishes) ? parsed.menuDishes : [],
                khaiVi: Array.isArray(parsed.khaiVi) ? parsed.khaiVi : [],
                monChinh: Array.isArray(parsed.monChinh) ? parsed.monChinh : [],
                trangMieng: Array.isArray(parsed.trangMieng) ? parsed.trangMieng : [],
                doUong: Array.isArray(parsed.doUong)
                  ? parsed.doUong
                      .map(s => String(s).replace(/\s*\(\s*\d+.*?\)/g, '').replace(/\s*\d+\s*(chai|lon|lít|lit|chai\/lon|chai\/bàn|hộp).*/gi, '').trim())
                      .filter(Boolean)
                  : [],
                notes: parsed.notes || ''
              },
              source: `gemini-vision (${modelName})`
            });
          }
        } catch (err) {
          console.error(`Gemini Vision Error with model ${modelName}:`, err);
        }
      }
    }

    // Fallback if image provided but OCR failed or Gemini API key missing
    if (imageBase64 && !geminiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Chưa cấu hình GEMINI_API_KEY trên Vercel. Vui lòng vào Vercel Dashboard > Settings > Environment Variables thêm GEMINI_API_KEY để AI đọc ảnh tự động.',
        isApiKeyMissing: true
      }, { status: 400 });
    }

    if (rawText) {
      const parsed = smartParseBookingText(rawText);
      return NextResponse.json({ success: true, data: parsed, source: 'rule-parser-fallback' });
    }

    return NextResponse.json(
      { error: 'Không nhận diện được nội dung từ hình ảnh. Vui lòng thử lại với ảnh rõ nét hơn hoặc dán tin nhắn Zalo.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error in parse-booking:', error);
    return NextResponse.json({ error: 'Không thể phân tích dữ liệu' }, { status: 500 });
  }
}
