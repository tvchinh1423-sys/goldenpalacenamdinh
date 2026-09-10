import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Smart rule-based classifier fallback for Vietnamese wedding dishes
function smartClassifyMenuText(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !/^[-=_*#]+$/.test(l));

  const khaiVi = [];
  const monChinh = [];
  const trangMieng = [];
  const doUong = [];

  let currentCategory = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[\d\s.•\-\*]+/, '').trim();
    const lower = line.toLowerCase();

    // Check header keywords
    if (/khai\s*vị|món\s*mở\s*đầu|appetizer/i.test(lower)) {
      currentCategory = 'khaiVi';
      continue;
    }
    if (/món\s*chính|món\nchính|main\s*course/i.test(lower)) {
      currentCategory = 'monChinh';
      continue;
    }
    if (/tráng\s*miệng|món\s*tráng|dessert/i.test(lower)) {
      currentCategory = 'trangMieng';
      continue;
    }
    if (/đồ\s*uống|nước\s*uống|beverage|rượu|bia/i.test(lower)) {
      currentCategory = 'doUong';
      continue;
    }
    if (/chúc\s*quý\s*khách|wedding\s*menu|lễ\s*thành\s*hôn|golden\s*palace/i.test(lower)) {
      continue;
    }

    if (!line) continue;

    // Categorize by current header context or keyword fallback
    if (currentCategory === 'khaiVi') {
      khaiVi.push(line);
    } else if (currentCategory === 'monChinh') {
      monChinh.push(line);
    } else if (currentCategory === 'trangMieng') {
      trangMieng.push(line);
    } else if (currentCategory === 'doUong') {
      doUong.push(line);
    } else {
      // Keyword heuristics
      if (/súp|soup|salad|gỏi|nộm|chả\s*giò|nem|khai\s*vị/i.test(lower)) {
        khaiVi.push(line);
      } else if (/sữa\s*chua|trái\s*cây|hoa\s*quả|chè|bánh|kem|xôi\s*xoài/i.test(lower)) {
        trangMieng.push(line);
      } else if (/rượu|bia|nước\s*ngọt|nước\s*lọc|cocacola|pepsi|tiger|hanoibeer|nước\s*suối/i.test(lower)) {
        doUong.push(line);
      } else {
        monChinh.push(line);
      }
    }
  }

  return { khaiVi, monChinh, trangMieng, doUong };
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

    // Option A: Raw text provided -> parse text
    if (rawText && !imageBase64) {
      const parsed = smartClassifyMenuText(rawText);
      return NextResponse.json({ success: true, ...parsed, source: 'rule-parser' });
    }

    // Option B: Image provided + Gemini API Key available
    if (imageBase64 && geminiApiKey) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const promptText = `
Bạn là chuyên gia nhận diện hình ảnh và phân loại thực đơn tiệc cưới tại Việt Nam.
Hãy đọc toàn bộ chữ có trên hình ảnh thực đơn tiệc cưới này, trích xuất danh sách các món ăn và tự động phân loại chính xác thành 4 nhóm:
1. khaiVi (Các món Khai vị như súp, salad, gỏi, nộm, chả giò...)
2. monChinh (Các món chính như cá, tôm, bò, gà, canh, cơm, xôi, lẩu...)
3. trangMieng (Các món tráng miệng như sữa chua, chè, bánh, trái cây...)
4. doUong (Các đồ uống như rượu, bia, nước ngọt, nước lọc...)

Trả về ĐÚNG 1 ĐỊNH DẠNG JSON duy nhất như sau (không kèm markdown code block):
{
  "khaiVi": ["Món 1", "Món 2"],
  "monChinh": ["Món 1", "Món 2", ...],
  "trangMieng": ["Món 1"],
  "doUong": ["Rượu ta + Bia + Nước ngọt"]
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
            khaiVi: parsed.khaiVi || [],
            monChinh: parsed.monChinh || [],
            trangMieng: parsed.trangMieng || [],
            doUong: parsed.doUong || [],
            source: 'gemini-vision'
          });
        }
      } catch (err) {
        console.error('Gemini vision API error:', err);
      }
    }

    // Option C: Image provided but no Gemini API key or error -> Fallback message + guide
    if (imageBase64 && !geminiApiKey) {
      // If we don't have Gemini API key set in env, return fallback message asking user or giving sample
      return NextResponse.json({
        success: false,
        error: 'Chưa cấu hình GEMINI_API_KEY để đọc ảnh tự động. Quý khách vui lòng nhập danh sách món ăn hoặc dán văn bản thực đơn để hệ thống tự phân loại.',
        isApiKeyMissing: true
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Không nhận được dữ liệu ảnh hoặc chữ' }, { status: 400 });

  } catch (error) {
    console.error('Error in parse-ai route:', error);
    return NextResponse.json({ error: 'Lỗi phân tích thực đơn' }, { status: 500 });
  }
}
